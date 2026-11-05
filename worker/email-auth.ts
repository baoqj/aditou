import { systemSettings } from "./system-settings";
import { requestEmailLocale } from "./email-locale";
import type { Env } from "./index";
import { digest, password, randomToken } from "./auth-crypto";
import {
  APP_ORIGIN,
  sendEmail,
  sendWelcome,
  passwordChangedMessage,
} from "./emails";
const json = (v: unknown, status = 200, headers: Record<string, string> = {}) =>
  Response.json(v, {
    status,
    headers: { "Cache-Control": "no-store", ...headers },
  });
const reject = (key: string, status = 400): never => {
  throw { status, message: key };
};
const normalize = (v: unknown) =>
  String(v || "")
    .trim()
    .toLowerCase();
const validEmail = (v: string) =>
  v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const sessionCookie = (token: string) =>
  `entryexam_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`;
async function limit(env: Env, req: Request, action: string, email: string) {
  for (const [scope, value, max] of [
    ["ip", req.headers.get("CF-Connecting-IP") || "local", 15],
    ["email", email, 4],
  ] as const) {
    const key = await digest(`email-auth:${action}:${scope}:${value}`),
      now = Date.now();
    const row = await env.DB.prepare(
      "INSERT INTO login_limits(key,attempts,reset_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN reset_at<? THEN 1 ELSE attempts+1 END,reset_at=CASE WHEN reset_at<? THEN excluded.reset_at ELSE reset_at END RETURNING attempts",
    )
      .bind(key, now + 900000, now, now)
      .first<{ attempts: number }>();
    if (row && row.attempts > max) reject("email.rateLimit", 429);
  }
}
export async function emailAuth(
  req: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const path = new URL(req.url).pathname;
  if (req.method !== "POST")
    return json({ error: "email.method" }, 405, { Allow: "POST" });
  if (Number(req.headers.get("Content-Length") || 0) > 8192)
    reject("email.invalid");
  const b = (await req.json()) as Record<string, unknown>;
  const email = normalize(b.email),
    locale = requestEmailLocale(req, b.locale);
  if (
    [
      "/api/auth/register",
      "/api/auth/resend-verification",
      "/api/auth/verify-email",
    ].includes(path) &&
    !(await systemSettings(env)).registrationOpen
  )
    reject("system.registrationPaused", 403);
  if (path === "/api/auth/register") {
    const name = String(b.name || "")
      .trim()
      .slice(0, 100);
    if (!validEmail(email) || !name) reject("email.invalid");
    await limit(env, req, "register", email);
    if (!env.RESEND_API_KEY) reject("email.unavailable", 503);
    const existing = await env.DB.prepare(
      "SELECT id FROM accounts WHERE email=?",
    )
      .bind(email)
      .first();
    if (existing) return json({ verification_required: true, email }, 202);
    const role = b.role === "teacher" ? "teacher" : "student",
      grade = Math.max(1, Math.min(4, Math.trunc(Number(b.grade) || 1)));
    const token = randomToken(),
      salt = randomToken(),
      tokenHash = await digest(token),
      now = Date.now();
    await env.DB.prepare("DELETE FROM email_registrations WHERE expires_at < ?")
      .bind(now)
      .run();
    await env.DB.prepare(
      "INSERT INTO email_registrations(email,account_id,name,role,grade,password_hash,salt,locale,token_hash,expires_at,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?) ON CONFLICT(email) DO UPDATE SET name=excluded.name,role=excluded.role,grade=excluded.grade,password_hash=excluded.password_hash,salt=excluded.salt,locale=excluded.locale,token_hash=excluded.token_hash,expires_at=excluded.expires_at",
    )
      .bind(
        email,
        crypto.randomUUID(),
        name,
        role,
        grade,
        "",
        "",
        locale,
        tokenHash,
        now + 86400000,
        now,
      )
      .run();
    await sendEmail(
      env,
      email,
      "verification",
      locale,
      {
        name,
        url: APP_ORIGIN + "/verify-email?lang=" + locale + "#token=" + token,
      },
      `aditou/verify/${tokenHash}`,
    );
    return json({ verification_required: true, email }, 202);
  }
  if (path === "/api/auth/resend-verification") {
    if (!validEmail(email)) reject("email.invalid");
    await limit(env, req, "resend", email);
    const row = await env.DB.prepare(
      "SELECT * FROM email_registrations WHERE email=? AND expires_at>?",
    )
      .bind(email, Date.now())
      .first<any>();
    if (row) {
      const token = randomToken(),
        tokenHash = await digest(token),
        deliveryLocale = requestEmailLocale(req, b.locale, row.locale);
      await env.DB.prepare(
        "UPDATE email_registrations SET token_hash=?,expires_at=?,locale=? WHERE email=?",
      )
        .bind(tokenHash, Date.now() + 86400000, deliveryLocale, email)
        .run();
      await sendEmail(
        env,
        email,
        "verification",
        deliveryLocale,
        {
          name: row.name,
          url:
            APP_ORIGIN +
            "/verify-email?lang=" +
            deliveryLocale +
            "#token=" +
            token,
        },
        `aditou/verify/${tokenHash}`,
      );
    }
    return json({ ok: true });
  }
  if (path === "/api/auth/verify-email") {
    const token = String(b.token || "");
    if (token.length < 32 || token.length > 256) reject("email.linkInvalid");
    const pw = String(b.password || "");
    if (pw.length < 10 || pw.length > 128) reject("email.passwordLength");
    if (pw !== String(b.confirm || "")) reject("email.passwordMismatch");
    const salt = randomToken(),
      pwHash = await password(pw, salt);
    const row = await env.DB.prepare(
      "SELECT * FROM email_registrations WHERE token_hash=? AND expires_at>?",
    )
      .bind(await digest(token), Date.now())
      .first<any>();
    if (!row) reject("email.linkInvalid");
    const verifiedLocale = requestEmailLocale(req, b.locale, row.locale);
    // Account creation and token consumption share one transaction. A concurrent
    // confirmation sees the same account primary key and rolls back completely.
    const stmts = [
      env.DB.prepare(
        "INSERT INTO accounts(id,email,name,role,password_hash,salt,email_verified_at,email_locale,self_registered,preferred_locale) SELECT account_id,email,name,role,?,?,CURRENT_TIMESTAMP,CASE WHEN ?='en' THEN 'en' ELSE 'fr' END,1,? FROM email_registrations WHERE token_hash=? AND expires_at>?",
      ).bind(
        pwHash,
        salt,
        verifiedLocale,
        verifiedLocale,
        row.token_hash,
        Date.now(),
      ),
    ];
    if (row.role === "student")
      stmts.push(
        env.DB.prepare(
          "INSERT INTO learners(id,account_id,alias,grade) VALUES(?,?,?,?)",
        ).bind(crypto.randomUUID(), row.account_id, row.name, row.grade),
      );
    stmts.push(
      env.DB.prepare("DELETE FROM email_registrations WHERE token_hash=?").bind(
        row.token_hash,
      ),
    );
    try {
      const results = await env.DB.batch(stmts);
      if (results[0].meta.changes !== 1) reject("email.linkInvalid");
    } catch {
      reject("email.linkInvalid");
    }
    ctx.waitUntil(
      sendWelcome(env, {
        id: row.account_id,
        email: row.email,
        name: row.name,
        role: row.role,
        preferred_locale: verifiedLocale,
      }).catch(() => console.error("Aditou welcome email failed")),
    );
    // Confirmation verifies ownership only: sign in with the original password.
    // A link sent after someone else submitted a password must not sign them in.
    return json({ ok: true, verified: true });
  }
  if (path === "/api/auth/forgot-password") {
    if (!validEmail(email)) reject("email.invalid");
    await limit(env, req, "reset", email);
    const user = await env.DB.prepare("SELECT * FROM accounts WHERE email=?")
      .bind(email)
      .first<any>();
    if (user) {
      const token = randomToken(),
        tokenHash = await digest(token);
      await env.DB.prepare(
        "DELETE FROM password_reset_tokens WHERE expires_at<?",
      )
        .bind(Date.now())
        .run();
      await env.DB.prepare(
        "INSERT INTO password_reset_tokens(token_hash,account_id,expires_at,locale) VALUES(?,?,?,?)",
      )
        .bind(tokenHash, user.id, Date.now() + 1800000, locale)
        .run();
      try {
        await sendEmail(
          env,
          email,
          "password_reset",
          locale,
          {
            name: user.name,
            url:
              APP_ORIGIN + "/reset-password?lang=" + locale + "#token=" + token,
          },
          `aditou/reset/${tokenHash}`,
          user.id,
        );
      } catch {
        console.error("Aditou password reset delivery failed");
      }
    }
    // Same response for existing, unknown and provider-failure cases.
    return json({ ok: true });
  }
  if (path === "/api/auth/reset-password") {
    const token = String(b.token || ""),
      pw = String(b.password || "");
    if (pw.length < 10 || pw.length > 128) reject("email.passwordLength");
    if (token.length < 32 || token.length > 256) reject("email.linkInvalid");
    const tokenHash = await digest(token),
      salt = randomToken(),
      pwHash = await password(pw, salt);
    const user = await env.DB.prepare(
      "SELECT a.*,t.locale AS reset_locale FROM accounts a JOIN password_reset_tokens t ON t.account_id=a.id WHERE t.token_hash=? AND t.expires_at>?",
    )
      .bind(tokenHash, Date.now())
      .first<any>();
    if (!user) reject("email.linkInvalid");
    const resetLocale = requestEmailLocale(
      req,
      b.locale,
      user.reset_locale || user.preferred_locale || user.email_locale,
    );
    // First statement claims this single-use token. CHECK failure rolls back
    // the whole batch on replay, so concurrent resets cannot both succeed.
    try {
      await env.DB.batch([
        env.DB.prepare(
          "INSERT INTO email_token_claims(token_hash) VALUES(?)",
        ).bind(tokenHash),
        env.DB.prepare(
          "UPDATE accounts SET password_hash=?,salt=?,preferred_locale=?,email_verified_at=COALESCE(email_verified_at,CURRENT_TIMESTAMP) WHERE id=? AND EXISTS(SELECT 1 FROM password_reset_tokens WHERE token_hash=? AND expires_at>?)",
        ).bind(pwHash, salt, resetLocale, user.id, tokenHash, Date.now()),
        env.DB.prepare("DELETE FROM auth_sessions WHERE account_id=?").bind(
          user.id,
        ),
        env.DB.prepare(
          "DELETE FROM password_reset_tokens WHERE account_id=?",
        ).bind(user.id),
      ]);
    } catch {
      reject("email.linkInvalid");
    }
    ctx.waitUntil(
      sendEmail(
        env,
        user.email,
        "notification",
        resetLocale,
        {
          name: user.name,
          message: passwordChangedMessage(resetLocale),
          url: APP_ORIGIN + "/forgot-password?lang=" + resetLocale,
        },
        `aditou/password-changed/${tokenHash}`,
        user.id,
      ).catch(() => console.error("Aditou password change email failed")),
    );
    return json({ ok: true }, 200, {
      "Set-Cookie":
        "entryexam_session=; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=0",
    });
  }
  return json({ error: "email.notFound" }, 404);
}
