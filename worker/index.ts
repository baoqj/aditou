import { supportCheckout } from "./support";
import { adminDirectory } from "./admin-directory";
import { requestEmailLocale } from "./email-locale";
import { emailAuth } from "./email-auth";
import { password } from "./auth-crypto";
import { googleOAuth } from "./google-oauth";
import { canonicalSkill, questionSkill } from "../src/skills";
import { assessments } from "./assessments";
import { gradeAnswer } from "./grading";
export interface Env {
  STUDYAI?: Fetcher;
  RESEND_API_KEY?: string;
  RESEND_TEMPLATE_MODE?: string;
  RESEND_FROM_EMAIL?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  DB: D1Database;
  STORAGE: R2Bucket;
  ASSETS: Fetcher;
  AI?: Ai;
  TTS_GATEWAY_ID?: string;
  TTS_MODEL?: string;
  TTS_VOICE?: string;
}
type Row = Record<string, any>;
const TTS_MODELS = [
  {
    id: "xai/grok-tts",
    label: "Grok TTS",
    voices: ["ara", "eve", "rex", "sal", "leo"],
    defaultVoice: "ara",
  },
  {
    id: "@cf/myshell-ai/melotts",
    label: "MeloTTS",
    voices: ["default"],
    defaultVoice: "default",
  },
];
function ttsSelection(model: unknown, voice: unknown) {
  const selected = TTS_MODELS.find((m) => m.id === model);
  if (!selected) fail("Modèle vocal non autorisé.");
  const choice = String(voice || selected!.defaultVoice);
  if (!selected!.voices.includes(choice))
    fail("Voix non autorisée pour ce modèle.");
  return { model: selected!.id, voice: choice };
}
const enc = new TextEncoder();
const id = () => crypto.randomUUID();
const hex = (a: ArrayBuffer) =>
  Array.from(new Uint8Array(a), (x) => x.toString(16).padStart(2, "0")).join(
    "",
  );
async function digest(s: string) {
  return hex(await crypto.subtle.digest("SHA-256", enc.encode(s)));
}
const json = (v: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(v, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
function fail(message: string, status = 400): never {
  throw { message, status };
}
const safeUser = (u: Row) => ({
  id: u.id,
  name: u.name,
  role: u.role,
  email: u.email,
});
const isStaff = (u: Row) => ["admin", "teacher"].includes(u.role);
const publicTeacher = (u: Row) => u.role === "teacher" && u.self_registered === 1;
async function canReadQuestion(e: Env,u: Row,qid: string) {
  if(!publicTeacher(u)) return;
  const q=await one(e,"SELECT owner_id,status FROM questions WHERE id=?",qid);
  if(!q || !(q.owner_id===u.id || (!q.owner_id && q.status==='published'))) fail("Accès refusé.",403);
}
async function canManageQuestion(e: Env,u: Row,qid: string) {
  if(!publicTeacher(u)) return;
  const q=await one(e,"SELECT owner_id FROM questions WHERE id=?",qid);
  if(!q || q.owner_id!==u.id) fail("Accès refusé.",403);
}

const norm = (s: string) =>
  s.normalize("NFKC").trim().toLocaleLowerCase().replace(/\s+/g, " ");
function studentQuestion(q: Row) {
  return {
    id: q.id,
    logical_id: q.logical_id,
    grade: q.grade,
    locale: q.locale,
    module: questionSkill(q),
    title: q.title,
    prompt: q.prompt,
    response_type: q.response_type,
    options: JSON.parse(q.options),
    text_policy: q.text_policy,
    preparation: q.preparation || "",
    audio_policy: q.audio_policy || "tts",
    status: q.status,
    version: q.version,
  };
}
async function one(e: Env, sql: string, ...a: any[]) {
  return await e.DB.prepare(sql)
    .bind(...a)
    .first<Row>();
}
async function all(e: Env, sql: string, ...a: any[]) {
  return (
    await e.DB.prepare(sql)
      .bind(...a)
      .all<Row>()
  ).results;
}
async function run(e: Env, sql: string, ...a: any[]) {
  return e.DB.prepare(sql)
    .bind(...a)
    .run();
}
async function audit(e: Env, u: Row, action: string, r: string) {
  await run(
    e,
    "INSERT INTO audit_log(id,actor_id,action,resource_id) VALUES(?,?,?,?)",
    id(),
    u.id,
    action,
    r,
  );
}
async function learner(e: Env, u: Row) {
  const l = await one(e, "SELECT * FROM learners WHERE account_id=?", u.id);
  if (!l) fail("Compte élève requis.", 403);
  return l!;
}
async function canClass(e: Env, u: Row, c: string) {
  if (u.role === "admin") return;
  const ok =
    u.role === "teacher"
      ? await one(
          e,
          "SELECT id FROM classes WHERE id=? AND teacher_id=?",
          c,
          u.id,
        )
      : await one(
          e,
          "SELECT en.class_id FROM enrollments en JOIN learners l ON l.id=en.learner_id WHERE en.class_id=? AND l.account_id=?",
          c,
          u.id,
        );
  if (!ok) fail("Accès à cette classe refusé.", 403);
}
async function questionsFor(e: Env, ids: string[]) {
  if (!ids.length) return [];
  return all(
    e,
    `SELECT * FROM questions WHERE id IN (${ids.map(() => "?").join(",")})`,
    ...ids,
  ).then(
    (q) => ids.map((i) => q.find((x) => x.id === i)).filter(Boolean) as Row[],
  );
}
async function contextAccess(
  e: Env,
  u: Row,
  context: string,
  contextId: string | undefined,
) {
  if (context === "private") return null;
  if (!contextId) fail("Contexte requis.");
  const r = await one(
    e,
    `SELECT * FROM ${context === "assignment" ? "assignments" : "classrooms"} WHERE id=?`,
    contextId,
  );
  if (!r) fail("Activité introuvable.", 404);
  await canClass(e, u, r!.class_id);
  return r;
}
async function synthesizeQuestion(
  e: Env,
  u: Row,
  q: Row,
  b: Row,
  runtime = false,
): Promise<Response> {
  if (!e.AI)
    fail("La liaison Cloudflare AI Gateway n’est pas configurée.", 503);
  if (q!.script.length > 5000)
    fail("Découpez le texte en extraits de moins de 5 000 caractères.");
  const saved = await one(
    e,
    "SELECT model,voice FROM question_tts_settings WHERE question_id=?",
    q!.id,
  );
  const { model, voice } = ttsSelection(
    b.model || saved?.model || e.TTS_MODEL || "xai/grok-tts",
    b.voice ||
      (b.model && b.model !== saved?.model ? undefined : saved?.voice) ||
      undefined,
  );
  const language = q!.locale === "en-CA" ? "en" : "fr";
  if (
    b.regenerate &&
    (typeof b.request_id !== "string" || !/^[0-9a-f-]{36}$/i.test(b.request_id))
  )
    fail("Identifiant de régénération requis.");
  if (!runtime)
    await run(
      e,
      "INSERT INTO question_tts_settings(question_id,model,voice) VALUES(?,?,?) ON CONFLICT(question_id) DO UPDATE SET model=excluded.model,voice=excluded.voice,updated_at=CURRENT_TIMESTAMP",
      q!.id,
      model,
      voice,
    );
  const hash = await digest(
    JSON.stringify({
      question: q!.id,
      version: q!.version,
      script: q!.script,
      model,
      voice,
      language,
      format: model === "xai/grok-tts" ? "mp3-24000-64000" : "mp3-native",
      generation: b.regenerate ? b.request_id : null,
      delivery: runtime ? "learner" : "studio",
    }),
  );
  const key = "tts/cloudflare/" + hash + ".mp3";
  const cached = await one(
    e,
    "SELECT id,status FROM audio_assets WHERE r2_key=?",
    key,
  );
  if (cached && runtime && cached.status !== "published")
    fail("Audio indisponible.", 404);
  if (cached)
    return json({ id: cached.id, cached: true, status: cached.status });
  const lock = await run(
    e,
    "INSERT INTO tts_locks(cache_key,expires_at) VALUES(?,?) ON CONFLICT(cache_key) DO UPDATE SET expires_at=excluded.expires_at WHERE expires_at<?",
    hash,
    Date.now() + 120000,
    Date.now(),
  );
  if (!lock.meta.changes)
    fail(
      "Une synthèse est déjà en cours pour cet exercice. Réessayez dans un instant.",
      409,
    );
  try {
    const raw = (await e.AI!.run(
      model,
      model === "@cf/myshell-ai/melotts"
        ? { prompt: q!.script, lang: language }
        : {
            text: q!.script,
            language,
            voice_id: voice,
            output_format: {
              codec: "mp3",
              sample_rate: 24000,
              bit_rate: 64000,
            },
          },
      {
        gateway: {
          id: e.TTS_GATEWAY_ID || "default",
          collectLog: false,
          skipCache: !!b.regenerate,
          metadata: { app: "entryexam", locale: q!.locale },
          requestTimeoutMs: 90000,
        },
      },
    )) as Row;
    let bytes: ArrayBuffer;
    if (raw instanceof Uint8Array) bytes = new Uint8Array(raw).buffer;
    else if (raw instanceof ArrayBuffer) bytes = raw;
    else if (raw instanceof Response) bytes = await raw.arrayBuffer();
    else if (raw instanceof ReadableStream)
      bytes = await new Response(raw).arrayBuffer();
    else {
      const audio = raw.result?.audio || raw.audio || raw.result?.result?.audio;
      if (typeof audio !== "string") {
        console.error("TTS response state", raw.state);
        fail("Cloudflare AI Gateway n’a pas renvoyé d’audio. Réessayez.", 502);
      }
      if (model === "@cf/myshell-ai/melotts" && !audio.startsWith("https://")) {
        const binary = atob(audio.replace(/^data:audio\/[^;]+;base64,/, ""));
        bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0)).buffer;
      } else {
        const parsed = new URL(audio);
        if (
          parsed.protocol !== "https:" ||
          !parsed.hostname.endsWith(".r2.cloudflarestorage.com")
        )
          fail("La synthèse a renvoyé une ressource non autorisée.", 502);
        const response = await fetch(audio, {
          signal: AbortSignal.timeout(30000),
        });
        if (!response.ok) fail("Le téléchargement de l’audio a échoué.", 502);
        bytes = await response.arrayBuffer();
      }
    }
    if (bytes.byteLength < 100 || bytes.byteLength > 20 * 1024 * 1024)
      fail("La taille de l’audio généré est invalide.", 502);
    const checksum = hex(await crypto.subtle.digest("SHA-256", bytes));
    await e.STORAGE.put(key, bytes, {
      httpMetadata: { contentType: "audio/mpeg" },
      customMetadata: {
        provider: "cloudflare-ai-gateway",
        model,
        voice,
        locale: q!.locale,
        checksum,
      },
    });
    const aid = id();
    await run(
      e,
      "INSERT INTO audio_assets(id,question_id,owner_id,kind,mime,r2_key,provider,model,voice,locale,checksum,status) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
      aid,
      q!.id,
      u!.id,
      "tts",
      "audio/mpeg",
      key,
      "cloudflare-ai-gateway",
      model,
      voice,
      q!.locale,
      checksum,
      runtime ? "published" : "draft",
    );
    await audit(e, u!, "tts.generated", aid);
    return json({
      id: aid,
      cached: false,
      status: runtime ? "published" : "draft",
      provider: "Cloudflare AI Gateway",
      model,
    });
  } catch (err: any) {
    if (err.status) throw err;
    console.error("Cloudflare TTS failed", err.message);
    fail(
      "La synthèse Cloudflare AI Gateway a échoué. Réessayez ou vérifiez les crédits du compte.",
      502,
    );
  } finally {
    await run(e, "DELETE FROM tts_locks WHERE cache_key=?", hash);
  }
}
async function handle(req: Request, e: Env, ctx: ExecutionContext): Promise<Response> {
  const url = new URL(req.url),
    p = url.pathname,
    method = req.method;
  if (url.hostname === "aditou.studyai.now" && url.protocol !== "https:") { url.protocol = "https:"; return Response.redirect(url.toString(), 308); }
  if ((p === "/api/auth/google/start" || p === "/api/auth/google/callback") && method === "GET") return googleOAuth(req, e, ctx);
  if (!p.startsWith("/api/")) return e.ASSETS.fetch(req);
  if (
    method !== "GET" &&
    req.headers.get("Origin") &&
    req.headers.get("Origin") !== url.origin
  )
    fail("Origine refusée.", 403);
  if (Number(req.headers.get("Content-Length") || 0) > 22 * 1024 * 1024)
    fail("Fichier trop volumineux.", 413);
  if (p === "/api/health") return json({ ok: true, service: "entryexam" });
  if (p === "/api/support/checkout") return supportCheckout(req,e.STUDYAI);
  if (["/api/auth/register","/api/auth/resend-verification","/api/auth/verify-email","/api/auth/forgot-password","/api/auth/reset-password"].includes(p)) return emailAuth(req,e,ctx);
  if (p === "/api/auth/login") {
    if (method !== "POST") fail("Méthode refusée.", 405);
    const b = (await req.json()) as Row;
    const email = String(b.email || "")
      .trim()
      .toLowerCase();
    const pw = String(b.password || "");
    const key = await digest(
      (req.headers.get("CF-Connecting-IP") || "local") + email,
    );
    const now = Date.now();
    const lim = await one(e, "SELECT * FROM login_limits WHERE key=?", key);
    if (lim && lim.reset_at > now && lim.attempts >= 10)
      fail("Trop de tentatives. Réessayez dans 15 minutes.", 429);
    await run(
      e,
      "INSERT INTO login_limits(key,attempts,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN reset_at<? THEN 1 ELSE attempts+1 END,reset_at=CASE WHEN reset_at<? THEN excluded.reset_at ELSE reset_at END",
      key,
      now + 900000,
      now,
      now,
    );
    const u = await one(e, "SELECT * FROM accounts WHERE email=?", email);
    if (!u && pw.length <= 128) {
      const pending = await one(e, "SELECT password_hash,salt FROM email_registrations WHERE email=? AND expires_at>?", email, now);
      if (pending && await password(pw, pending.salt) === pending.password_hash) fail("email.verifyRequired", 403);
    }
    if (!u || pw.length > 128 || (await password(pw, u.salt)) !== u.password_hash)
      fail("Identifiants incorrects.", 401);
    if(u.disabled) fail("admin.disabledError",403);
    await run(e, "UPDATE accounts SET preferred_locale=? WHERE id=?", requestEmailLocale(req,b.locale,u.preferred_locale),u.id);
    await run(e, "DELETE FROM login_limits WHERE key=?", key);
    const token = id() + id();
    await run(
      e,
      "INSERT INTO auth_sessions(token_hash,account_id,expires_at) VALUES(?,?,?)",
      await digest(token),
      u!.id,
      now + 7 * 86400000,
    );
    return json({ user: safeUser(u!) }, 200, {
      "Set-Cookie": `entryexam_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`,
    });
  }
  const token = req.headers
    .get("Cookie")
    ?.match(/entryexam_session=([^;]+)/)?.[1];
  const u = token
    ? await one(
        e,
        "SELECT a.* FROM accounts a JOIN auth_sessions s ON s.account_id=a.id WHERE s.token_hash=? AND s.expires_at>?",
        await digest(token),
        Date.now(),
      )
    : null;
  if(p === "/api/auth/language" && method === "POST") {
    if(u) await run(e,"UPDATE accounts SET preferred_locale=? WHERE id=?",requestEmailLocale(req,undefined,u.preferred_locale),u.id);
    return new Response(null,{status:204,headers:{"Cache-Control":"no-store"}});
  }
  if (!u) fail("Connectez-vous pour continuer.", 401);
  if (u!.disabled) fail("admin.disabledError",403);
  if (p.startsWith("/api/admin/")) return adminDirectory(req,e,u!,p);
  if (p === "/api/runs" || p.startsWith("/api/runs/"))
    return assessments(req, e, u!, p);
  if (p === "/api/auth/me") return json({ user: safeUser(u!) });
  if (p === "/api/auth/logout") {
    await run(
      e,
      "DELETE FROM auth_sessions WHERE token_hash=?",
      await digest(token!),
    );
    return json({ ok: true }, 200, {
      "Set-Cookie":
        "entryexam_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
    });
  }
  if (p === "/api/auth/password" && method === "POST") {
    const b = (await req.json()) as Row;
    if ((await password(String(b.current || ""), u!.salt)) !== u!.password_hash)
      fail("Mot de passe actuel incorrect.");
    if (String(b.password || "").length < 10 || String(b.password).length > 128)
      fail("10 à 128 caractères requis.");
    const salt = id();
    await run(
      e,
      "UPDATE accounts SET password_hash=?,salt=? WHERE id=?",
      await password(b.password, salt),
      salt,
      u!.id,
    );
    await run(e, "DELETE FROM auth_sessions WHERE account_id=?", u!.id);
    return json({ ok: true });
  }
  if (p === "/api/organization") {
    if(u!.role !== "teacher") fail("Accès refusé.",403);
    if(method === "GET") return json({organization:await one(e,"SELECT id,name,created_at FROM organizations WHERE owner_id=?",u!.id)});
    if(method !== "POST") fail("Méthode refusée.",405);
    const b=await req.json() as Row;
    const name=String(b.name || '').trim();
    if(!name || name.length>120) fail("org.invalid");
    await run(e,"INSERT OR IGNORE INTO organizations(id,name,owner_id) VALUES(?,?,?)",id(),name,u!.id);
    return json({organization:await one(e,"SELECT id,name,created_at FROM organizations WHERE owner_id=?",u!.id)});
  }
  if (p === "/api/bootstrap") {
    const staff = isStaff(u!);
    const l = u!.role === "student" ? await learner(e, u!) : null;
    const classes =
      u!.role === "admin"
        ? await all(
            e,
            "SELECT c.*,a.name teacher_name FROM classes c JOIN accounts a ON a.id=c.teacher_id",
          )
        : u!.role === "teacher"
          ? await all(e, "SELECT * FROM classes WHERE teacher_id=?", u!.id)
          : l
            ? await all(
                e,
                "SELECT c.* FROM classes c JOIN enrollments en ON en.class_id=c.id WHERE en.learner_id=?",
                l.id,
              )
            : [];
    const cid = classes.map((x) => x.id);
    const filter = cid.length
      ? `class_id IN (${cid.map(() => "?").join(",")})`
      : "0";
    const assignments = await all(
      e,
      `SELECT * FROM assignments WHERE ${filter}`,
      ...cid,
    );
    const classrooms = await all(
      e,
      `SELECT * FROM classrooms WHERE ${filter}`,
      ...cid,
    );
    const children =
      u!.role === "parent"
        ? await all(
            e,
            "SELECT l.id,l.alias,l.grade FROM learners l JOIN guardianships g ON g.learner_id=l.id WHERE g.parent_id=?",
            u!.id,
          )
        : [];
    return json({
      user: safeUser(u!),
      learner: l,
      classes,
      assignments: assignments.map((x) => ({
        ...x,
        question_ids: JSON.parse(x.question_ids),
      })),
      classrooms: classrooms.map((x) => ({
        ...x,
        question_ids: JSON.parse(x.question_ids),
      })),
      children,
      ttsConfigured: !!e.AI,
      ttsProvider: "Cloudflare AI Gateway",
      ttsModel: e.TTS_MODEL || "xai/grok-tts",
      staff,
    });
  }
  if (p === "/api/questions" && method === "GET") {
    const staff = isStaff(u!);
    let qs = await all(
      e,
      `SELECT * FROM questions ${staff ? "" : "WHERE status='published' OR id IN (SELECT j.value FROM assignments a JOIN enrollments en ON en.class_id=a.class_id JOIN learners l ON l.id=en.learner_id, json_each(a.question_ids) j WHERE l.account_id=?) OR id IN (SELECT j.value FROM classrooms c JOIN enrollments en ON en.class_id=c.class_id JOIN learners l ON l.id=en.learner_id, json_each(c.question_ids) j WHERE l.account_id=?)"} ORDER BY grade,logical_id,locale`,
      ...(staff ? [] : [u!.id, u!.id]),
    );
    if(publicTeacher(u!)) qs=qs.filter(q=>q.owner_id===u!.id || (!q.owner_id && q.status==='published'));
    return json({
      questions: qs.map((q) =>
        staff
          ? { ...q, module: questionSkill(q), options: JSON.parse(q.options) }
          : studentQuestion(q),
      ),
    });
  }
  if (p === "/api/questions" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    if (!b.title || !b.prompt || !b.script)
      fail("Titre, contenu élève et texte à lire requis.");
    if (
      ![
        "numeric",
        "qcm",
        "text",
        "drawing",
        "order",
        "multiple",
        "matching",
        "observation",
        "oral",
      ].includes(b.response_type)
    )
      fail("Type de réponse invalide.");
    if (
      !["fr-CA", "en-CA"].includes(b.locale) ||
      ![1, 2, 3, 4].includes(Number(b.grade))
    )
      fail("Langue ou année invalide.");
    if (
      b.status === "published" &&
      ["numeric", "qcm", "multiple", "order", "matching"].includes(
        b.response_type,
      ) &&
      !b.answer
    )
      fail("Réponse de référence requise.");
    if (
      ["multiple", "order", "matching"].includes(b.response_type) &&
      b.status === "published"
    ) {
      try {
        const parsed = JSON.parse(b.answer);
        if (
          b.response_type === "matching"
            ? typeof parsed !== "object" || Array.isArray(parsed) || !parsed
            : !Array.isArray(parsed)
        )
          fail("Réponse JSON invalide.");
      } catch {
        fail("La réponse doit être un tableau ou un objet JSON valide.");
      }
    }
    const old = b.id
      ? await one(e, "SELECT * FROM questions WHERE id=?", b.id)
      : null;
    if (b.id) await canManageQuestion(e,u!,b.id);
    const qid = id();
    await run(
      e,
      "INSERT INTO questions(id,logical_id,grade,locale,module,title,prompt,script,teacher_notes,response_type,options,answer,explanation,status,text_policy,version,source,preparation,audio_policy,owner_id) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      qid,
      old?.logical_id || qid,
      Number(b.grade),
      b.locale,
      canonicalSkill(b.module),
      String(b.title).slice(0, 200),
      String(b.prompt).slice(0, 10000),
      String(b.script).slice(0, 10000),
      String(b.teacher_notes || ""),
      b.response_type,
      JSON.stringify(b.options || []),
      String(b.answer || ""),
      String(b.explanation || ""),
      b.status === "published" ? "published" : "draft",
      b.text_policy === "answer_area_only" ? "answer_area_only" : "full",
      (old?.version || 0) + 1,
      "Établissement",
      String(b.preparation ?? old?.preparation ?? "").slice(0, 4000),
      (b.audio_policy ?? old?.audio_policy) === "teacher_only"
        ? "teacher_only"
        : "tts",
      u!.id,
    );
    if (old)
      await run(e, "UPDATE questions SET status='retired' WHERE id=?", old.id);
    await audit(e, u!, "question.version", qid);
    return json({ id: qid });
  }
  if (p.match(/^\/api\/questions\/[^/]+\/retire$/) && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const qid = p.split("/")[3];
    await canManageQuestion(e,u!,qid);
    await run(e, "UPDATE questions SET status='retired' WHERE id=?", qid);
    await audit(e, u!, "question.retire", qid);
    return json({ ok: true });
  }
  if (p === "/api/roster") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    if (method === "GET")
      return json({
        students: await all(
          e,
          `SELECT l.id,l.alias,l.grade,a.email,group_concat(c.name, ', ') classes FROM learners l JOIN accounts a ON a.id=l.account_id LEFT JOIN enrollments en ON en.learner_id=l.id LEFT JOIN classes c ON c.id=en.class_id ${u!.role === "admin" ? "" : "WHERE c.teacher_id=?"} GROUP BY l.id`,
          ...(u!.role === "admin" ? [] : [u!.id]),
        ),
        teachers:
          u!.role === "admin"
            ? await all(
                e,
                "SELECT id,name,email FROM accounts WHERE role IN ('admin','teacher')",
              )
            : [],
      });
    if (method === "POST") {
      const b = (await req.json()) as Row;
      if (b.role === "teacher" && u!.role !== "admin")
        fail("Accès refusé.", 403);
      if (
        !b.email ||
        !b.name ||
        String(b.password || "").length < 10 ||
        String(b.password).length > 128
      )
        fail("Nom, identifiant et mot de passe de 10 à 128 caractères requis.");
      if (b.class_id) await canClass(e, u!, b.class_id);
      if (
        await one(
          e,
          "SELECT id FROM accounts WHERE email=?",
          String(b.email).toLowerCase(),
        )
      )
        fail("Identifiant déjà utilisé.", 409);
      const aid = id(),
        salt = id();
      await run(
        e,
        "INSERT INTO accounts(id,email,name,role,password_hash,salt) VALUES(?,?,?,?,?,?)",
        aid,
        String(b.email).toLowerCase(),
        b.name,
        b.role === "teacher" ? "teacher" : "student",
        await password(b.password, salt),
        salt,
      );
      if (b.role !== "teacher") {
        const lid = id();
        await run(
          e,
          "INSERT INTO learners(id,account_id,alias,grade) VALUES(?,?,?,?)",
          lid,
          aid,
          b.name,
          Math.max(1, Math.min(4, Number(b.grade) || 1)),
        );
        if (b.class_id)
          await run(e, "INSERT INTO enrollments VALUES(?,?)", b.class_id, lid);
      }
      await audit(e, u!, "account.create", aid);
      return json({ ok: true });
    }
  }
  if (p === "/api/enrollments" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    await canClass(e, u!, b.class_id);
    if (method === "POST")
      await run(
        e,
        "INSERT OR IGNORE INTO enrollments VALUES(?,?)",
        b.class_id,
        b.learner_id,
      );
    return json({ ok: true });
  }
  if (p === "/api/classes" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    if (!b.name) fail("Nom requis.");
    const cid = id();
    const teacher = u!.role === "admin" ? b.teacher_id || u!.id : u!.id;
    if (
      !(await one(
        e,
        "SELECT id FROM accounts WHERE id=? AND role IN ('admin','teacher')",
        teacher,
      ))
    )
      fail("Enseignant invalide.");
    await run(
      e,
      "INSERT INTO classes VALUES(?,?,?,?,?)",
      cid,
      b.name,
      Math.max(1, Math.min(4, Number(b.grade) || 1)),
      b.locale === "en-CA" ? "en-CA" : "fr-CA",
      teacher,
    );
    return json({ id: cid });
  }
  if (p === "/api/assignments" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    await canClass(e, u!, b.class_id);
    const qs = await questionsFor(e, b.question_ids || []);
    for (const q of qs) await canReadQuestion(e,u!,q.id);
    if (!qs.length || qs.some((q) => q.status !== "published"))
      fail("Sélectionnez des exercices publiés.");
    if (!b.title || !b.due_at) fail("Titre et date requis.");
    const aid = id();
    await run(
      e,
      "INSERT INTO assignments(id,class_id,teacher_id,title,due_at,question_ids) VALUES(?,?,?,?,?,?)",
      aid,
      b.class_id,
      u!.id,
      b.title,
      b.due_at,
      JSON.stringify(qs.map((q) => q.id)),
    );
    return json({ id: aid });
  }
  if (p === "/api/classrooms" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    await canClass(e, u!, b.class_id);
    const qs = await questionsFor(e, b.question_ids || []);
    for (const q of qs) await canReadQuestion(e,u!,q.id);
    if (!qs.length || qs.some((q) => q.status !== "published"))
      fail("Sélectionnez des exercices publiés.");
    const sid = id(),
      code = id().slice(0, 8).toUpperCase();
    await run(
      e,
      "INSERT INTO classrooms(id,class_id,teacher_id,title,code,question_ids) VALUES(?,?,?,?,?,?)",
      sid,
      b.class_id,
      u!.id,
      b.title || "Classe en direct",
      code,
      JSON.stringify(qs.map((q) => q.id)),
    );
    return json({ id: sid, code });
  }
  if (p === "/api/classrooms/join" && method === "POST") {
    const b = (await req.json()) as Row;
    const c = await one(
      e,
      "SELECT * FROM classrooms WHERE code=?",
      String(b.code).trim().toUpperCase(),
    );
    if (!c) fail("Code introuvable.", 404);
    await canClass(e, u!, c!.class_id);
    return json({ id: c!.id });
  }
  if (p.match(/^\/api\/classrooms\/[^/]+$/)) {
    const c = await one(
      e,
      "SELECT * FROM classrooms WHERE id=?",
      p.split("/")[3],
    );
    if (!c) fail("Classe introuvable.", 404);
    await canClass(e, u!, c!.class_id);
    if (method === "POST") {
      if (!isStaff(u!)) fail("Accès refusé.", 403);
      const b = (await req.json()) as Row;
      const commands: Record<string, string> = {
        open: "phase='open'",
        close: "phase='closed'",
        reveal: "phase='revealed'",
        retry: "round=round+1,phase='reading'",
        next: `current_index=MIN(current_index+1,${JSON.parse(c!.question_ids).length - 1}),round=round+1,phase='reading'`,
        hide: "text_visible=0",
        show: "text_visible=1",
        end: "phase='ended'",
      };
      if (!commands[b.action]) fail("Action invalide.");
      if (c!.phase === "ended") fail("Cette séance est terminée.", 409);
      if (
        b.expected_round != null &&
        (b.expected_round !== c!.round || b.expected_index !== c!.current_index)
      )
        fail("La séance a changé. Actualisez avant de continuer.", 409);
      const update = e.DB.prepare(
        `UPDATE classrooms SET ${commands[b.action]} WHERE id=? AND round=? AND current_index=? AND phase=?`,
      ).bind(c!.id, c!.round, c!.current_index, c!.phase);
      const statements = [update];
      if (b.action === "reveal")
        statements.push(
          e.DB.prepare(
            "UPDATE attempts SET answers_revealed=1 WHERE context='classroom' AND context_id=? AND round=? AND EXISTS(SELECT 1 FROM classrooms WHERE id=? AND phase='revealed' AND round=?)",
          ).bind(c!.id, c!.round, c!.id, c!.round),
        );
      const updated = await e.DB.batch(statements);
      if (!updated[0].meta.changes)
        fail("Une autre commande a changé la séance. Actualisez.", 409);
      await audit(e, u!, "classroom." + b.action, c!.id);
      return json({ ok: true });
    }
    const qs = await questionsFor(e, JSON.parse(c!.question_ids));
    const q = qs[c!.current_index];
    let attempts: Row[] = [];
    if (isStaff(u!))
      attempts = await all(
        e,
        "SELECT at.*,l.alias FROM attempts at JOIN learners l ON l.id=at.learner_id WHERE context='classroom' AND context_id=? AND round=?",
        c!.id,
        c!.round,
      );
    else {
      const l = await learner(e, u!);
      attempts = await all(
        e,
        "SELECT id,answer,status,created_at FROM attempts WHERE learner_id=? AND context='classroom' AND context_id=? AND round=?",
        l.id,
        c!.id,
        c!.round,
      );
      if (c!.phase !== "revealed")
        attempts = attempts.map((a) => ({ ...a, status: "submitted" }));
    }
    return json({
      classroom: { ...c, question_ids: JSON.parse(c!.question_ids) },
      question: q
        ? isStaff(u!)
          ? { ...q, options: JSON.parse(q.options) }
          : {
              ...studentQuestion(q),
              prompt: c!.text_visible ? q.prompt : "Écoute ton enseignant.",
              ...(c!.phase === "revealed"
                ? { answer: q.answer, explanation: q.explanation }
                : {}),
            }
        : null,
      attempts,
    });
  }
  if (p === "/api/attempts" && method === "POST") {
    if (u!.role !== "student") fail("Compte élève requis.", 403);
    const l = await learner(e, u!),
      b = (await req.json()) as Row;
    const context = ["private", "assignment", "classroom"].includes(b.context)
      ? b.context
      : "private";
    const activity = await contextAccess(e, u!, context, b.context_id);
    if (context === "assignment")
      fail("Utilisez la remise complète du devoir.", 409);
    const q = await one(e, "SELECT * FROM questions WHERE id=?", b.question_id);
    if (!q) fail("Exercice indisponible.", 404);
    if (!activity && q!.status !== "published")
      fail("Exercice indisponible.", 404);
    if (activity && !JSON.parse(activity.question_ids).includes(q!.id))
      fail("Exercice hors activité.", 403);
    if (
      context === "classroom" &&
      (activity!.phase !== "open" ||
        JSON.parse(activity!.question_ids)[activity!.current_index] !== q!.id ||
        b.round !== activity!.round)
    )
      fail("Cette ronde est fermée ou a changé.", 409);
    const answer = String(b.answer || "");
    if (
      answer.startsWith("data:") &&
      !/^data:image\/(png|jpeg|webp);base64,/.test(answer)
    )
      fail("Format d’image non pris en charge.");
    if (!answer.trim() || answer.length > 1500000)
      fail("Réponse requise ou trop volumineuse.");
    if (!b.request_id) fail("Identifiant de soumission requis.");
    const existing = await one(
      e,
      "SELECT * FROM attempts WHERE request_id=?",
      b.request_id,
    );
    if (existing) {
      if (existing.learner_id !== l.id) fail("Accès refusé.", 403);
      return json({
        id: existing.id,
        status: context === "classroom" ? "submitted" : existing.status,
      });
    }
    const graded = gradeAnswer(q!, answer);
    const status = graded.status,
      manual = graded.score === null;
    const aid = id();
    try {
      const params = [
        aid,
        String(b.request_id),
        l.id,
        q!.id,
        JSON.stringify(q),
        context,
        activity?.id || null,
        activity?.round || 1,
        answer,
        status,
        manual ? null : status === "correct" ? 2 : 0,
        String(b.audio_source || "none"),
        b.hint_used ? 1 : 0,
      ];
      const result =
        context === "classroom"
          ? await run(
              e,
              `INSERT INTO attempts(id,request_id,learner_id,question_id,question_snapshot,context,context_id,round,answer,status,score,audio_source,hint_used) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM classrooms WHERE id=? AND phase='open' AND round=? AND json_extract(question_ids,'$['||current_index||']')=?)`,
              ...params,
              activity!.id,
              b.round,
              q!.id,
            )
          : await run(
              e,
              "INSERT INTO attempts(id,request_id,learner_id,question_id,question_snapshot,context,context_id,round,answer,status,score,audio_source,hint_used) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)",
              ...params,
            );
      if (!result.meta.changes)
        fail("Cette ronde vient de changer. Actualisez la classe.", 409);
    } catch (err) {
      if (context === "classroom")
        fail("Une réponse a déjà été enregistrée pour cette ronde.", 409);
      throw err;
    }
    return json({
      id: aid,
      status: context === "classroom" ? "submitted" : status,
      ...(context === "classroom"
        ? {}
        : { answer: q!.answer, explanation: q!.explanation }),
    });
  }
  if (p === "/api/attempts" && method === "GET") {
    let rows: Row[];
    if (u!.role === "student") {
      const l = await learner(e, u!);
      rows = await all(
        e,
        "SELECT a.*,q.title,q.module,q.locale FROM attempts a JOIN questions q ON q.id=a.question_id WHERE learner_id=? ORDER BY a.created_at DESC LIMIT 500",
        l.id,
      );
    } else if (u!.role === "parent") {
      const child = url.searchParams.get("learner");
      if (
        !child ||
        !(await one(
          e,
          "SELECT * FROM guardianships WHERE parent_id=? AND learner_id=?",
          u!.id,
          child,
        ))
      )
        fail("Lien parent vérifié requis.", 403);
      rows = await all(
        e,
        "SELECT a.*,q.title,q.module,q.locale FROM attempts a JOIN questions q ON q.id=a.question_id WHERE learner_id=? ORDER BY a.created_at DESC LIMIT 500",
        child,
      );
    } else {
      rows = await all(
        e,
        `SELECT at.*,l.alias,q.title,q.module,q.locale FROM attempts at JOIN learners l ON l.id=at.learner_id JOIN questions q ON q.id=at.question_id LEFT JOIN assignments a ON a.id=at.context_id LEFT JOIN classrooms s ON s.id=at.context_id JOIN classes c ON c.id=COALESCE(a.class_id,s.class_id) WHERE at.context!='private' ${u!.role === "admin" ? "" : "AND c.teacher_id=?"} ORDER BY at.created_at DESC LIMIT 500`,
        ...(u!.role === "admin" ? [] : [u!.id]),
      );
    }
    const result = [];
    for (const r of rows) {
      const snap = JSON.parse(r.question_snapshot);
      delete r.question_snapshot;
      if (r.context === "assignment" && r.run_id && !isStaff(u!)) {
        const assessment = await one(
          e,
          "SELECT status FROM assessment_runs WHERE id=?",
          r.run_id,
        );
        if (assessment?.status !== "graded") {
          r.status = "submitted";
          r.score = null;
          r.feedback = null;
          result.push(r);
          continue;
        }
      }
      if (r.context === "classroom") {
        if (!isStaff(u!) && !r.answers_revealed) {
          r.status = "submitted";
          r.score = null;
          r.feedback = null;
        } else
          r.reference = { answer: snap.answer, explanation: snap.explanation };
      } else
        r.reference = { answer: snap.answer, explanation: snap.explanation };
      result.push(r);
    }
    return json({ attempts: result });
  }
  if (p.match(/^\/api\/attempts\/[^/]+\/grade$/) && method === "POST") {
    if (!isStaff(u!) && u!.role !== "parent") fail("Accès refusé.", 403);
    const a = await one(
      e,
      "SELECT * FROM attempts WHERE id=?",
      p.split("/")[3],
    );
    if (!a) fail("Accès refusé.", 403);
    if (u!.role === "parent") {
      if (
        a!.context !== "private" ||
        !(await one(
          e,
          "SELECT * FROM guardianships WHERE parent_id=? AND learner_id=?",
          u!.id,
          a!.learner_id,
        ))
      )
        fail("Accès refusé.", 403);
    } else {
      if (a!.context === "private") fail("Accès refusé.", 403);
      await contextAccess(e, u!, a!.context, a!.context_id);
    }
    const b = (await req.json()) as Row;
    if (
      !["correct", "partial", "incorrect", "pending_manual"].includes(b.status)
    )
      fail("Note invalide.");
    await run(
      e,
      "UPDATE attempts SET status=?,score=?,feedback=?,reviewer_id=?,reviewer_role=? WHERE id=?",
      b.status,
      b.status === "pending_manual"
        ? null
        : b.status === "correct"
          ? 2
          : b.status === "partial"
            ? 1
            : 0,
      String(b.feedback || "").slice(0, 2000),
      u!.id,
      u!.role,
      a!.id,
    );
    if (a!.run_id)
      await run(
        e,
        "UPDATE assessment_runs SET status=CASE WHEN EXISTS(SELECT 1 FROM attempts WHERE run_id=? AND status='pending_manual') THEN 'submitted' ELSE 'graded' END WHERE id=? AND status!='draft'",
        a!.run_id,
        a!.run_id,
      );
    await audit(e, u!, "attempt.grade", a!.id);
    return json({ ok: true });
  }
  if (p === "/api/invitations" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    const l = await one(e, "SELECT * FROM learners WHERE id=?", b.learner_id);
    if (!l) fail("Élève introuvable.");
    if (
      u!.role === "teacher" &&
      !(await one(
        e,
        "SELECT en.class_id FROM enrollments en JOIN classes c ON c.id=en.class_id WHERE en.learner_id=? AND c.teacher_id=?",
        l!.id,
        u!.id,
      ))
    )
      fail("Accès refusé.", 403);
    const token = id() + id();
    await run(
      e,
      "INSERT INTO invitations VALUES(?,?,?,NULL)",
      await digest(token),
      l!.id,
      Date.now() + 7 * 86400000,
    );
    return json({ token, expiresInDays: 7 });
  }
  if (p === "/api/family/claim" && method === "POST") {
    if (u!.role !== "parent") fail("Compte parent requis.", 403);
    const b = (await req.json()) as Row;
    const hash = await digest(String(b.token || ""));
    const inv = await one(
      e,
      "SELECT * FROM invitations WHERE token_hash=? AND expires_at>? AND used_at IS NULL",
      hash,
      Date.now(),
    );
    if (!inv) fail("Invitation invalide ou expirée.");
    const results = await e.DB.batch([
      e.DB.prepare(
        "INSERT OR IGNORE INTO guardianships(parent_id,learner_id) SELECT ?,learner_id FROM invitations WHERE token_hash=? AND used_at IS NULL",
      ).bind(u!.id, hash),
      e.DB.prepare(
        "UPDATE invitations SET used_at=CURRENT_TIMESTAMP WHERE token_hash=? AND used_at IS NULL",
      ).bind(hash),
    ]);
    await audit(e, u!, "guardian.claim", inv!.learner_id);
    return json({ ok: results.every((r) => r.success) });
  }
  if (p.match(/^\/api\/questions\/[^/]+\/audio$/) && method === "GET") {
    if (u!.role !== "student") fail("Compte élève requis.", 403);
    const q = await one(
      e,
      "SELECT * FROM questions WHERE id=?",
      p.split("/")[3],
    );
    if (!q) fail("Exercice indisponible.", 404);
    const l = await learner(e, u!);
    if (q!.status !== "published") {
      const allowed = await one(
        e,
        `SELECT r.id FROM assessment_runs r,json_each(r.question_ids) j WHERE r.learner_id=? AND j.value=? UNION ALL SELECT a.id FROM assignments a JOIN enrollments en ON en.class_id=a.class_id,json_each(a.question_ids) j WHERE en.learner_id=? AND j.value=? LIMIT 1`,
        l.id,
        q!.id,
        l.id,
        q!.id,
      );
      if (!allowed) fail("Exercice indisponible.", 404);
    }
    const candidates = await all(
      e,
      "SELECT id,kind,r2_key FROM audio_assets WHERE question_id=? AND status='published' ORDER BY CASE kind WHEN 'teacher' THEN 0 ELSE 1 END,created_at DESC,rowid DESC",
      q!.id,
    );
    for (const a of candidates) {
      if (q!.audio_policy === "teacher_only" && a.kind !== "teacher") continue;
      if (await e.STORAGE.head(a.r2_key))
        return json({
          id: a.id,
          kind: a.kind,
          url: "/api/audio/" + a.id + "/file",
        });
    }
    if (q!.audio_policy === "teacher_only")
      fail(
        "Cette activité nécessite la voix d’un adulte ou un enregistrement enseignant.",
        409,
      );
    const generated = await synthesizeQuestion(e, u!, q!, {}, true);
    const data = (await generated.json()) as Row;
    return json({
      id: data.id,
      kind: "tts",
      url: "/api/audio/" + data.id + "/file",
    });
  }
  if (p === "/api/audio" && method === "GET") {
    let sql =
      "SELECT id,question_id,kind,mime,status,owner_id,provider,model,voice,locale FROM audio_assets";
    if(publicTeacher(u!)) sql += " WHERE owner_id=?";
    else if (!isStaff(u!)) sql += " WHERE status='published'";
    return json({ assets: await all(e, sql, ...(publicTeacher(u!) ? [u!.id] : [])) });
  }
  if (p.match(/^\/api\/audio\/[^/]+\/file$/) && method === "GET") {
    const a = await one(
      e,
      "SELECT * FROM audio_assets WHERE id=?",
      p.split("/")[3],
    );
    if (!a || (!isStaff(u!) && a.status !== "published"))
      fail("Audio indisponible.", 404);
    if(publicTeacher(u!) && a!.owner_id!==u!.id && a!.status!=="published") fail("Accès refusé.",403);
    await canReadQuestion(e,u!,a!.question_id);
    const q = await one(
      e,
      "SELECT status FROM questions WHERE id=?",
      a!.question_id,
    );
    if (!isStaff(u!) && q?.status !== "published") {
      const own = await one(
        e,
        `SELECT at.id FROM attempts at JOIN learners l ON l.id=at.learner_id WHERE at.question_id=? AND (l.account_id=? OR l.id IN (SELECT learner_id FROM guardianships WHERE parent_id=?)) LIMIT 1`,
        a!.question_id,
        u!.id,
        u!.id,
      );
      const assigned = await one(
        e,
        `SELECT en.learner_id FROM enrollments en JOIN learners l ON l.id=en.learner_id JOIN assignments ass ON ass.class_id=en.class_id,json_each(ass.question_ids) j WHERE l.account_id=? AND j.value=? LIMIT 1`,
        u!.id,
        a!.question_id,
      );
      const inRun = await one(
        e,
        "SELECT r.id FROM assessment_runs r JOIN learners l ON l.id=r.learner_id,json_each(r.question_ids) j WHERE l.account_id=? AND j.value=? LIMIT 1",
        u!.id,
        a!.question_id,
      );
      if (!own && !assigned && !inRun) fail("Audio indisponible.", 404);
    }
    const obj = await e.STORAGE.get(a!.r2_key);
    if (!obj) fail("Fichier indisponible.", 404);
    return new Response(obj!.body, {
      headers: {
        "Content-Type": a!.mime,
        "Cache-Control": "private, max-age=300",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
  if (p === "/api/audio/upload" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const qid = url.searchParams.get("question");
    if (!qid || !(await one(e, "SELECT id FROM questions WHERE id=?", qid)))
      fail("Exercice requis.");
    await canManageQuestion(e,u!,qid);
    const mime = req.headers.get("Content-Type") || "";
    if (!/^audio\/(webm|mp4|mpeg|ogg|wav)(;.*)?$/.test(mime))
      fail("Format audio non pris en charge.");
    const data = await req.arrayBuffer();
    if (data.byteLength < 100 || data.byteLength > 20 * 1024 * 1024)
      fail("Audio vide ou supérieur à 20 Mo.");
    const bytes = new Uint8Array(data);
    const signature = String.fromCharCode(...bytes.slice(0, 12));
    const valid =
      (signature.startsWith("RIFF") && signature.slice(8, 12) === "WAVE") ||
      signature.startsWith("OggS") ||
      signature.startsWith("ID3") ||
      (bytes[0] === 255 && (bytes[1] & 224) === 224) ||
      signature.slice(4, 8) === "ftyp" ||
      (bytes[0] === 26 &&
        bytes[1] === 69 &&
        bytes[2] === 223 &&
        bytes[3] === 163);
    if (!valid) fail("Le fichier ne contient pas un audio reconnu.");
    const aid = id(),
      key = "teacher/" + aid;
    await e.STORAGE.put(key, data, { httpMetadata: { contentType: mime } });
    await run(
      e,
      "INSERT INTO audio_assets(id,question_id,owner_id,kind,mime,r2_key) VALUES(?,?,?,?,?,?)",
      aid,
      qid,
      u!.id,
      "teacher",
      mime,
      key,
    );
    return json({ id: aid });
  }
  if (p.match(/^\/api\/audio\/[^/]+\/publish$/) && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const a = await one(
      e,
      "SELECT * FROM audio_assets WHERE id=?",
      p.split("/")[3],
    );
    if (!a || (a.owner_id !== u!.id && u!.role !== "admin"))
      fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    await run(
      e,
      "UPDATE audio_assets SET status=? WHERE id=?",
      b.withdraw ? "withdrawn" : "published",
      a!.id,
    );
    await audit(e, u!, "audio.publish", a!.id);
    return json({ ok: true });
  }
  if (p === "/api/audio/settings") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    if (method === "GET")
      return json({
        models: TTS_MODELS,
        settings: await all(
          e,
          publicTeacher(u!) ? "SELECT s.question_id,s.model,s.voice FROM question_tts_settings s JOIN questions q ON q.id=s.question_id WHERE q.owner_id=?" : "SELECT question_id,model,voice FROM question_tts_settings",
          ...(publicTeacher(u!)?[u!.id]:[]),
        ),
      });
    if (method === "POST") {
      const b = (await req.json()) as Row;
      if (!(await one(e, "SELECT id FROM questions WHERE id=?", b.question_id)))
        fail("Exercice requis.");
      await canManageQuestion(e,u!,b.question_id);
      const selected = ttsSelection(b.model, b.voice);
      await run(
        e,
        "INSERT INTO question_tts_settings(question_id,model,voice) VALUES(?,?,?) ON CONFLICT(question_id) DO UPDATE SET model=excluded.model,voice=excluded.voice,updated_at=CURRENT_TIMESTAMP",
        b.question_id,
        selected.model,
        selected.voice,
      );
      return json({ ok: true, ...selected });
    }
  }
  if (p === "/api/audio/tts" && method === "POST") {
    if (!isStaff(u!)) fail("Accès refusé.", 403);
    const b = (await req.json()) as Row;
    const q = await one(e, "SELECT * FROM questions WHERE id=?", b.question_id);
    if (!q || !q.script.trim())
      fail("Un exercice avec un texte à lire est requis.");
    await canManageQuestion(e,u!,q!.id);
    return synthesizeQuestion(e, u!, q!, b);
  }
  fail("Ressource introuvable.", 404);
}
export default {
  async fetch(req: Request, e: Env, ctx: ExecutionContext) {
    try {
      const r = await handle(req, e, ctx);
      const headers = new Headers(r.headers);
      headers.set("X-Content-Type-Options", "nosniff");
      headers.set("Referrer-Policy", "same-origin");
      headers.set("Permissions-Policy", "camera=(), microphone=(self)");
      headers.set("X-Frame-Options", "DENY");
      headers.set(
        "Content-Security-Policy",
        "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; media-src 'self' blob:; connect-src 'self'; font-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
      );
      return new Response(r.body, { status: r.status, headers });
    } catch (err: any) {
      if (!err.status) console.error("API error", err);
      return json(
        {
          error: err.status
            ? err.message
            : "Une erreur est survenue. Réessayez.",
        },
        err.status || 500,
      );
    }
  },
};
