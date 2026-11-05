import { digest } from "./auth-crypto";
import { requestEmailLocale, type EmailLocale } from "./email-locale";
import { APP_ORIGIN } from "./emails";
import type { Env } from "./index";

const inbox = "studyainow@mail.com";
const confirmation: Record<EmailLocale, [string, string]> = {
  en: [
    "Thank you for contributing to Aditou",
    "We received your school information. Thank you for your support. An administrator will review your submission.",
  ],
  fr: [
    "Merci de contribuer à Aditou",
    "Nous avons reçu votre complément d’information. Merci de votre soutien. Un administrateur examinera votre envoi.",
  ],
  es: [
    "Gracias por contribuir a Aditou",
    "Recibimos tu información sobre la escuela. Gracias por tu apoyo. Un administrador revisará tu envío.",
  ],
  zh: [
    "感谢您为 Aditou 补充学校信息",
    "我们已收到您提交的学校信息。感谢您的支持，请等待管理员审核。",
  ],
};

type Account = {
  id: string;
  email: string;
  name: string;
  preferred_locale?: string;
  disabled?: number;
};
type Submission = {
  sender: string;
  campus_id: string;
  username: string;
  name: string;
  email: string;
  message: string;
  source_url: string;
  locale: EmailLocale;
  created_at: number;
  confirmation_id: string | null;
  notification_id: string | null;
};

export async function schoolSuggestion(
  req: Request,
  env: Env,
  account: Account | null,
  campusId: string,
) {
  const reply = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  const invalid = () => reply({ error: "school.suggestionInvalid" }, 400);
  if (account?.disabled) return reply({ error: "admin.disabledError" }, 403);
  let input: Record<string, unknown>;
  try {
    const raw = await req.text();
    if (raw.length > 24000) return invalid();
    input = JSON.parse(raw);
    if (!input || typeof input !== "object" || Array.isArray(input))
      return invalid();
  } catch {
    return invalid();
  }

  const field = (key: string) =>
    typeof input[key] === "string" ? input[key].trim() : "";
  const id = field("id");
  const name = account?.name ?? field("name");
  const email = (account?.email ?? field("email")).trim().toLowerCase();
  const message = field("message");
  const source = field("source");
  if (
    !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(id) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    email.length > 254 ||
    name.length > 120 ||
    /[\r\n]/.test(name) ||
    !message ||
    message.length > 10000 ||
    !source ||
    source.length > 2048
  )
    return invalid();
  try {
    const url = new URL(source);
    if (
      !["https:", "http:"].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return invalid();
  } catch {
    return invalid();
  }

  const campus = await env.DB.prepare(
    "SELECT json_extract(record, '$.学校正式名称') AS name FROM school_campus_profiles WHERE id=?",
  )
    .bind(campusId)
    .first<{ name: string }>();
  if (!campus) return reply({ error: "school.missing" }, 404);

  const sender = await digest(
    account?.id ?? req.headers.get("CF-Connecting-IP") ?? "local",
  );
  const now = Date.now();
  const locale = requestEmailLocale(req, undefined, account?.preferred_locale);
  await env.DB.prepare(
    `
    INSERT INTO school_suggestions(id,campus_id,sender,account_id,username,name,email,message,source_url,locale,created_at)
    SELECT ?,?,?,?,?,?,?,?,?,?,?
    WHERE (SELECT COUNT(*) FROM school_suggestions WHERE sender=? AND created_at>?) < 5
      AND (SELECT COUNT(*) FROM school_suggestions WHERE email=? AND created_at>?) < 5
    ON CONFLICT(id) DO NOTHING
  `,
  )
    .bind(
      id,
      campusId,
      sender,
      account?.id ?? null,
      account?.email ?? "",
      name,
      email,
      message,
      source,
      locale,
      now,
      sender,
      now - 3600000,
      email,
      now - 3600000,
    )
    .run();
  const row = await env.DB.prepare(
    "SELECT * FROM school_suggestions WHERE id=?",
  )
    .bind(id)
    .first<Submission>();
  if (!row) return reply({ error: "school.suggestionLimited" }, 429);
  if (
    row.sender !== sender ||
    row.campus_id !== campusId ||
    row.email !== email ||
    row.message !== message ||
    row.source_url !== source ||
    row.name !== name
  )
    return invalid();

  const url = APP_ORIGIN + "/school/" + encodeURIComponent(campusId);
  const [subject, thanks] = confirmation[row.locale];
  const delivery = async (
    column: "confirmation_id" | "notification_id",
    to: string,
    subject: string,
    text: string,
    replyTo: string,
  ) => {
    if (row[column]) return;
    if (!env.RESEND_API_KEY) throw new Error("mail unavailable");
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `aditou-school-${id}-${column}`,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || "Aditou <aditou@studyai.now>",
        to: [to],
        subject,
        text,
        reply_to: replyTo,
      }),
      signal: AbortSignal.timeout(12000),
    });
    const sent = (await response.json()) as { id?: string };
    if (!response.ok || !sent.id) throw new Error("mail unavailable");
    await env.DB.prepare(`UPDATE school_suggestions SET ${column}=? WHERE id=?`)
      .bind(sent.id, id)
      .run();
  };
  const deliveries = await Promise.allSettled([
    delivery(
      "confirmation_id",
      row.email,
      subject,
      `${thanks}\n\n${campus.name}\n${url}`,
      inbox,
    ),
    delivery(
      "notification_id",
      inbox,
      `School information update ${campus.name.replace(/[\r\n]/g, " ")}`,
      `School: ${campus.name}\nSchool Map: ${url}\nSubmitted (UTC): ${new Date(row.created_at).toISOString()}\nUsername: ${row.username || "—"}\nName: ${row.name || "—"}\nEmail: ${row.email}\nSource URL: ${row.source_url}\n\nSubmission:\n${row.message}`,
      row.email,
    ),
  ]);
  if (deliveries.some((result) => result.status === "rejected")) {
    return reply({ error: "school.suggestionSavedMailPending" }, 503);
  }
  return reply({ ok: true });
}
