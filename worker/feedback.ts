import { requestEmailLocale } from "./email-locale";
import type { Env } from "./index";
export async function feedback(
  req: Request,
  env: Env,
  user: Record<string, any> | null,
): Promise<Response> {
  const reply = (data: unknown, status = 200) =>
    Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
  if (req.method !== "POST") return reply({ error: "feedback.invalid" }, 405);
  if (user?.disabled) return reply({ error: "admin.disabledError" }, 403);
  const raw = await req.text();
  if (raw.length > 24000) return reply({ error: "feedback.invalid" }, 413);
  let b: any;
  try {
    b = JSON.parse(raw);
  } catch {
    return reply({ error: "feedback.invalid" }, 400);
  }
  const email = String(user?.email || b?.email || "")
    .trim()
    .toLowerCase();
  const name = String(user?.name || b?.name || "").trim();
  const phone = String(b?.phone || "").trim();
  const message = String(b?.message || "").trim();
  const key = String(b?.id || "");
  const category = b?.category ?? "contact";
  if (!["contact", "issue"].includes(category))
    return reply({ error: "feedback.invalid" }, 400);
  const submittedPath =
    typeof b?.path === "string" && b.path.startsWith("/")
      ? b.path.split(/[?#]/)[0].slice(0, 512)
      : null;
  const locale = requestEmailLocale(req, b?.locale, user?.preferred_locale);
  if (
    !/^[0-9a-f-]{36}$/i.test(key) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    name.length > 120 ||
    /[\r\n]/.test(name) ||
    phone.length > 40 ||
    /[\r\n]/.test(phone) ||
    !message ||
    message.length > 10000
  )
    return reply({ error: "feedback.invalid" }, 400);
  if (!env.RESEND_API_KEY) return reply({ error: "feedback.unavailable" }, 503);
  const identity = user?.id || req.headers.get("CF-Connecting-IP") || "local";
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(identity),
  );
  const sender = Array.from(new Uint8Array(bytes), (v) =>
    v.toString(16).padStart(2, "0"),
  ).join("");
  const existing = await env.DB.prepare(
    "SELECT * FROM feedback_messages WHERE id=?",
  )
    .bind(key)
    .first<any>();
  if (existing && existing.sender !== sender)
    return reply({ error: "feedback.invalid" }, 400);
  if (existing?.status === "accepted") return reply({ ok: true });
  if (
    existing &&
    (existing.email !== email ||
      existing.message !== message ||
      existing.phone !== phone ||
      existing.name !== (name || "Visitor") ||
      existing.category !== category)
  )
    return reply({ error: "feedback.invalid" }, 400);
  if (!existing) {
    const count = await env.DB.prepare(
      "SELECT COUNT(*) AS n FROM feedback_messages WHERE sender=? AND created_at>?",
    )
      .bind(sender, Date.now() - 3600000)
      .first<any>();
    if (count.n >= 5) return reply({ error: "feedback.limited" }, 429);
    await env.DB.prepare(
      "INSERT INTO feedback_messages(id,sender,account_id,name,email,phone,message,status,created_at,category,submitted_path,locale) VALUES(?,?,?,?,?,?,?,'pending',?,?,?,?)",
    )
      .bind(
        key,
        sender,
        user?.id || null,
        name || "Visitor",
        email,
        phone,
        message,
        Date.now(),
        category,
        submittedPath,
        locale,
      )
      .run();
  }
  const row =
    existing ||
    (await env.DB.prepare("SELECT * FROM feedback_messages WHERE id=?")
      .bind(key)
      .first<any>());
  try {
    const sent = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `aditou-feedback-${key}`,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || "Aditou <aditou@studyai.now>",
        to: ["studyainow@mail.com"],
        reply_to: email,
        subject: `Aditou feed back ${row.name}`,
        text: `Date/time (UTC): ${new Date(row.created_at).toISOString()}\nUsername: ${row.name}\nEmail: ${email}\nPhone: ${phone || "—"}\n\nFeedback:\n${message}`,
      }),
      signal: AbortSignal.timeout(12000),
    });
    const data = (await sent.json()) as { id?: string };
    if (!sent.ok || !data.id) throw new Error("delivery");
    await env.DB.prepare(
      "UPDATE feedback_messages SET status='accepted',provider_id=? WHERE id=?",
    )
      .bind(data.id, key)
      .run();
    return reply({ ok: true });
  } catch {
    return reply({ error: "feedback.unavailable" }, 503);
  }
}
