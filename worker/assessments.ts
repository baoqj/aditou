import { questionSkill } from "../src/skills";
import type { Env } from "./index";
import { gradeAnswer } from "./grading";
type Row = Record<string, any>;
const id = () => crypto.randomUUID();
const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
function fail(message: string, status = 400): never {
  throw { message, status };
}
const one = (e: Env, sql: string, ...args: any[]) =>
  e.DB.prepare(sql)
    .bind(...args)
    .first<Row>();
const all = async (e: Env, sql: string, ...args: any[]) =>
  (
    await e.DB.prepare(sql)
      .bind(...args)
      .all<Row>()
  ).results;
function question(q: Row) {
  return {
    id: q.id,
    logical_id: q.logical_id,
    grade: q.grade,
    locale: q.locale,
    module: questionSkill(q),
    title: q.title,
    prompt: q.prompt,
    response_type: q.response_type,
    options: typeof q.options === "string" ? JSON.parse(q.options) : q.options,
    text_policy: q.text_policy,
    preparation: q.preparation || "",
    audio_policy: q.audio_policy || "tts",
    version: q.version,
  };
}
function validAnswer(value: unknown) {
  if (typeof value !== "string" || value.length > 1500000)
    fail("Réponse requise ou trop volumineuse.");
  if (
    value.startsWith("data:") &&
    !/^data:image\/(png|jpeg|webp);base64,/.test(value)
  )
    fail("Format d’image non pris en charge.");
  return value;
}
async function dto(e: Env, r: Row) {
  const snapshots: Row[] = JSON.parse(r.snapshots);
  const answers = await all(
    e,
    "SELECT question_id,answer,audio_source FROM assessment_run_answers WHERE run_id=?",
    r.id,
  );
  const reveal =
    r.status !== "draft" && (r.mode === "exam" || r.status === "graded");
  const results = reveal
    ? await all(
        e,
        "SELECT question_id,status,score,feedback,reviewer_role FROM attempts WHERE run_id=?",
        r.id,
      )
    : [];
  return {
    run: {
      id: r.id,
      mode: r.mode,
      assignment_id: r.assignment_id,
      title: r.title,
      status: r.status,
      revision: r.revision,
      created_at: r.created_at,
      submitted_at: r.submitted_at,
    },
    questions: snapshots.map((q) => ({
      ...question(q),
      ...(reveal
        ? { reference: { answer: q.answer, explanation: q.explanation } }
        : {}),
    })),
    answers: Object.fromEntries(
      answers.map((a) => [
        a.question_id,
        { answer: a.answer, audio_source: a.audio_source },
      ]),
    ),
    results,
    summary: reveal
      ? {
          total: snapshots.length,
          correct: results.filter((a) => a.status === "correct").length,
          incorrect: results.filter((a) => a.status === "incorrect").length,
          partial: results.filter((a) => a.status === "partial").length,
          pending: results.filter((a) => a.status === "pending_manual").length,
          score: results.reduce((sum, a) => sum + (a.score || 0), 0),
          max_score: snapshots.length * 2,
        }
      : null,
  };
}
export async function assessments(
  req: Request,
  e: Env,
  u: Row,
  p: string,
): Promise<Response> {
  if (u.role !== "student") fail("Compte élève requis.", 403);
  const l = await one(e, "SELECT * FROM learners WHERE account_id=?", u.id);
  if (!l) fail("Compte élève requis.", 403);
  if (p === "/api/runs" && req.method === "GET")
    return json({
      runs: await all(
        e,
        "SELECT id,mode,assignment_id,title,status,revision,created_at,submitted_at FROM assessment_runs WHERE learner_id=? ORDER BY created_at DESC LIMIT 100",
        l!.id,
      ),
    });
  if (p === "/api/runs" && req.method === "POST") {
    const b = (await req.json()) as Row;
    const mode = b.mode;
    if (!["exam", "homework"].includes(mode)) fail("Mode de réponse invalide.");
    let ids: string[],
      title: string,
      assignment: Row | null = null;
    if (mode === "homework") {
      assignment = await one(
        e,
        "SELECT a.* FROM assignments a JOIN enrollments en ON en.class_id=a.class_id WHERE a.id=? AND en.learner_id=? AND a.status='published'",
        b.assignment_id,
        l!.id,
      );
      if (!assignment) fail("Accès à ce devoir refusé.", 403);
      const existing = await one(
        e,
        "SELECT * FROM assessment_runs WHERE learner_id=? AND assignment_id=?",
        l!.id,
        assignment!.id,
      );
      if (existing) return json(await dto(e, existing));
      ids = JSON.parse(assignment!.question_ids);
      title = assignment!.title;
    } else {
      if (
        !Array.isArray(b.question_ids) ||
        !b.question_ids.length ||
        b.question_ids.some((q: unknown) => typeof q !== "string") ||
        b.question_ids.length > 80 ||
        new Set(b.question_ids).size !== b.question_ids.length
      )
        fail("Sélectionnez de 1 à 80 exercices.");
      ids = b.question_ids;
      title = "Exam";
    }
    const found = await all(
      e,
      `SELECT * FROM questions WHERE id IN (${ids.map(() => "?").join(",")})`,
      ...ids,
    );
    const snapshots = ids.map((qid) => found.find((q) => q.id === qid));
    if (
      snapshots.some((q) => !q || (mode === "exam" && q.status !== "published"))
    )
      fail("Exercice indisponible.", 404);
    if (mode === "exam" && new Set(snapshots.map((q) => q!.locale)).size !== 1)
      fail("Choisissez une seule langue pour l’examen.");
    const rid = id();
    await e.DB.prepare(
      "INSERT OR IGNORE INTO assessment_runs(id,learner_id,mode,assignment_id,title,question_ids,snapshots) VALUES(?,?,?,?,?,?,?)",
    )
      .bind(
        rid,
        l!.id,
        mode,
        assignment?.id || null,
        title,
        JSON.stringify(ids),
        JSON.stringify(snapshots),
      )
      .run();
    return json(
      await dto(
        e,
        ((await one(e, "SELECT * FROM assessment_runs WHERE id=?", rid)) ||
          (await one(
            e,
            "SELECT * FROM assessment_runs WHERE learner_id=? AND assignment_id=?",
            l!.id,
            assignment!.id,
          )))!,
      ),
    );
  }
  const match = p.match(/^\/api\/runs\/([^/]+)(\/submit)?$/);
  if (!match) fail("Ressource introuvable.", 404);
  let r = await one(
    e,
    "SELECT * FROM assessment_runs WHERE id=? AND learner_id=?",
    match![1],
    l!.id,
  );
  if (!r) fail("Accès à cette remise refusé.", 403);
  if (req.method === "GET" && !match![2]) return json(await dto(e, r!));
  if (
    r!.assignment_id &&
    !(await one(
      e,
      "SELECT a.id FROM assignments a JOIN enrollments en ON en.class_id=a.class_id WHERE a.id=? AND en.learner_id=?",
      r!.assignment_id,
      l!.id,
    ))
  )
    fail("Accès à ce devoir refusé.", 403);
  const b = (await req.json()) as Row;
  if (r!.status !== "draft") {
    if (match![2]) return json(await dto(e, r!));
    fail("Cette remise est verrouillée.", 409);
  }
  if (b.revision !== r!.revision)
    fail("Le brouillon a changé. Rechargez la remise.", 409);
  const write = id();
  if (req.method === "PUT" && !match![2]) {
    if (!JSON.parse(r!.question_ids).includes(b.question_id))
      fail("Exercice hors activité.", 403);
    const answer = validAnswer(b.answer);
    const results = await e.DB.batch([
      e.DB.prepare(
        "UPDATE assessment_runs SET revision=revision+1,last_write_id=? WHERE id=? AND learner_id=? AND revision=? AND status='draft'",
      ).bind(write, r!.id, l!.id, b.revision),
      e.DB.prepare(
        "INSERT INTO assessment_run_answers(run_id,question_id,answer,audio_source) SELECT ?,?,?,? WHERE EXISTS(SELECT 1 FROM assessment_runs WHERE id=? AND last_write_id=? AND status='draft') ON CONFLICT(run_id,question_id) DO UPDATE SET answer=excluded.answer,audio_source=excluded.audio_source",
      ).bind(
        r!.id,
        b.question_id,
        answer,
        String(b.audio_source || "none").slice(0, 128),
        r!.id,
        write,
      ),
    ]);
    if (!results[0].meta.changes)
      fail("Le brouillon a changé. Rechargez la remise.", 409);
    return json({ revision: b.revision + 1, saved: true });
  }
  if (req.method === "POST" && match![2]) {
    const answers = await all(
      e,
      "SELECT * FROM assessment_run_answers WHERE run_id=?",
      r!.id,
    );
    const snapshots: Row[] = JSON.parse(r!.snapshots);
    if (
      r!.mode === "homework" &&
      snapshots.some(
        (q) => !answers.find((a) => a.question_id === q.id)?.answer.trim(),
      )
    )
      fail("Répondez à tous les exercices avant de remettre.");
    const grades = snapshots.map((q) =>
      r!.mode === "homework"
        ? { status: "pending_manual", score: null }
        : gradeAnswer(
            q,
            answers.find((a) => a.question_id === q.id)?.answer || "",
          ),
    );
    const state =
      r!.mode === "exam" && grades.every((g) => g.status !== "pending_manual")
        ? "graded"
        : "submitted";
    const statements = [
      e.DB.prepare(
        "UPDATE assessment_runs SET status=?,revision=revision+1,last_write_id=?,submitted_at=CURRENT_TIMESTAMP WHERE id=? AND learner_id=? AND status='draft' AND revision=?",
      ).bind(state, write, r!.id, l!.id, b.revision),
    ];
    snapshots.forEach((q, index) => {
      const a = answers.find((a) => a.question_id === q.id) || {
        answer: "",
        audio_source: "none",
      };
      const g = grades[index];
      statements.push(
        e.DB.prepare(
          "INSERT INTO attempts(id,request_id,learner_id,question_id,question_snapshot,context,context_id,round,answer,status,score,audio_source,hint_used,run_id) SELECT ?,?,?,?,?,?,?,?,?,?,?,?,?,? WHERE EXISTS(SELECT 1 FROM assessment_runs WHERE id=? AND last_write_id=? AND status!='draft')",
        ).bind(
          id(),
          "assessment:" + id(),
          l!.id,
          q.id,
          JSON.stringify(q),
          r!.mode === "homework" ? "assignment" : "private",
          r!.assignment_id || null,
          1,
          a.answer,
          g.status,
          g.score,
          a.audio_source,
          0,
          r!.id,
          r!.id,
          write,
        ),
      );
    });
    const results = await e.DB.batch(statements);
    r = await one(e, "SELECT * FROM assessment_runs WHERE id=?", r!.id);
    if (!results[0].meta.changes && r!.status === "draft")
      fail("Le brouillon a changé. Rechargez la remise.", 409);
    return json(await dto(e, r!));
  }
  fail("Méthode refusée.", 405);
}
