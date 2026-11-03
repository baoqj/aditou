import { requestEmailLocale } from "./email-locale";
import { sendWelcome } from "./emails";
import type { Env } from "./index";
import { authDestination } from "../src/routing";
const origin = "https://aditou.studyai.now";
const callback = origin + "/api/auth/google/callback";
const hash = async (s: string) =>
  Array.from(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    ),
    (n) => n.toString(16).padStart(2, "0"),
  ).join("");
const token = () => crypto.randomUUID() + crypto.randomUUID();
const cookie = (v: string, age: number) =>
  `aditou_oauth=${v}; HttpOnly; Secure; SameSite=Lax; Path=/api/auth/google; Max-Age=${age}`;
function redirect(path: string, cookies: string[] = []) {
  const headers = new Headers({ location: path, "Cache-Control": "no-store" });
  cookies.forEach((c) => headers.append("Set-Cookie", c));
  return new Response(null, { status: 302, headers });
}
export async function googleOAuth(
  req: Request,
  env: Env,
  ctx?: ExecutionContext,
): Promise<Response> {
  const url = new URL(req.url);
  if (url.origin !== origin)
    return redirect(origin + url.pathname + url.search);
  const failed = () =>
    redirect(origin + "/login?error=google_failed", [cookie("", 0)]);
  try {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return failed();
    if (url.pathname.endsWith("/start")) {
      const state = token(),
        verifier = token(),
        binding = token();
      const role =
        url.searchParams.get("role") === "teacher" ? "teacher" : "student";
      const grade = Math.max(
        1,
        Math.min(4, Number(url.searchParams.get("grade")) || 1),
      );
      await env.DB.prepare(
        "DELETE FROM google_oauth_states WHERE expires_at < ?",
      )
        .bind(Date.now())
        .run();
      await env.DB.prepare(
        "INSERT INTO google_oauth_states(state_hash,binding_hash,verifier,next_path,role,grade,signup,expires_at,locale) VALUES(?,?,?,?,?,?,?,?,?)",
      )
        .bind(
          await hash(state),
          await hash(binding),
          verifier,
          url.searchParams.get("next"),
          role,
          grade,
          url.searchParams.get("signup") === "1" ? 1 : 0,
          Date.now() + 600000,
          requestEmailLocale(req, url.searchParams.get("locale")),
        )
        .run();
      const challenge = btoa(
        String.fromCharCode(
          ...new Uint8Array(
            await crypto.subtle.digest(
              "SHA-256",
              new TextEncoder().encode(verifier),
            ),
          ),
        ),
      )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
      const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
      auth.search = new URLSearchParams({
        client_id: env.GOOGLE_CLIENT_ID,
        redirect_uri: callback,
        response_type: "code",
        scope: "openid email profile",
        state,
        prompt: "select_account",
        code_challenge: challenge,
        code_challenge_method: "S256",
      }).toString();
      return redirect(auth.toString(), [cookie(binding, 600)]);
    }
    const state = url.searchParams.get("state"),
      code = url.searchParams.get("code");
    const binding = req.headers
      .get("Cookie")
      ?.match(/(?:^|;\s*)aditou_oauth=([^;]+)/)?.[1];
    if (!state || !binding) return failed();
    const record = await env.DB.prepare(
      "DELETE FROM google_oauth_states WHERE state_hash=? AND binding_hash=? AND expires_at>? RETURNING *",
    )
      .bind(await hash(state), await hash(binding), Date.now())
      .first<any>();
    if (!record || !code || url.searchParams.has("error")) return failed();
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callback,
        grant_type: "authorization_code",
        code_verifier: record.verifier,
      }),
    });
    if (!response.ok) return failed();
    const result = (await response.json()) as { access_token: string };
    const info = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      { headers: { Authorization: `Bearer ${result.access_token}` } },
    );
    if (!info.ok) return failed();
    const profile = (await info.json()) as {
      sub: string;
      email: string;
      email_verified: boolean;
      name?: string;
    };
    if (!profile.sub || !profile.email || profile.email_verified !== true)
      return failed();
    const email = profile.email.toLowerCase();
    let user = await env.DB.prepare(
      "SELECT a.* FROM accounts a JOIN google_oauth_accounts g ON g.account_id=a.id WHERE g.subject=?",
    )
      .bind(profile.sub)
      .first<any>();
    if (!user) {
      user = await env.DB.prepare("SELECT * FROM accounts WHERE email=?")
        .bind(email)
        .first<any>();
      if (!user && !record.signup)
        return redirect(origin + "/signup?error=google_signup_required", [
          cookie("", 0),
        ]);
      if (!user) {
        user = {
          id: crypto.randomUUID(),
          email,
          name: (profile.name || email.split("@")[0]).slice(0, 100),
          role: record.role,
        };
        const statements = [
          env.DB.prepare(
            "INSERT INTO accounts(id,email,name,role,password_hash,salt,self_registered) VALUES(?,?,?,?,?,?,1)",
          ).bind(user.id, email, user.name, user.role, "oauth-only", token()),
        ];
        if (user.role === "student")
          statements.push(
            env.DB.prepare(
              "INSERT INTO learners(id,account_id,alias,grade) VALUES(?,?,?,?)",
            ).bind(crypto.randomUUID(), user.id, user.name, record.grade),
          );
        statements.push(
          env.DB.prepare(
            "INSERT INTO google_oauth_accounts(subject,account_id) VALUES(?,?)",
          ).bind(profile.sub, user.id),
        );
        await env.DB.batch(statements);
      } else
        await env.DB.prepare(
          "INSERT INTO google_oauth_accounts(subject,account_id) VALUES(?,?)",
        )
          .bind(profile.sub, user.id)
          .run();
    }
    await env.DB.prepare(
      "UPDATE accounts SET email_verified_at=COALESCE(email_verified_at,CURRENT_TIMESTAMP),preferred_locale=? WHERE id=?",
    )
      .bind(record.locale || "fr", user.id)
      .run();
    if(user.disabled) return Response.redirect(new URL("/login?error=admin.disabledError",req.url).toString(),302);
    user.preferred_locale = record.locale || "fr";
    await env.DB.prepare("DELETE FROM email_registrations WHERE email=?")
      .bind(email)
      .run();
    if (ctx)
      ctx.waitUntil(
        sendWelcome(env, user).catch(() =>
          console.error("Aditou Google welcome failed"),
        ),
      );
    const session = token();
    await env.DB.prepare(
      "INSERT INTO auth_sessions(token_hash,account_id,expires_at) VALUES(?,?,?)",
    )
      .bind(await hash(session), user.id, Date.now() + 604800000)
      .run();
    return redirect(
      origin + authDestination(user.role, record.next_path, origin),
      [
        cookie("", 0),
        `entryexam_session=${session}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=604800`,
      ],
    );
  } catch (error) {
    console.error(
      "Google OAuth failed",
      error instanceof Error ? error.message : "Unknown error",
    );
    return failed();
  }
}
