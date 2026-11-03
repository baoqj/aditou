import { normalizeEmailLocale, type EmailLocale } from "./email-locale";
import type { Env } from "./index";
export const APP_ORIGIN = "https://aditou.studyai.now";
export const EMAIL_TEMPLATES = [
  "verification",
  "welcome",
  "password_reset",
  "progress",
  "notification",
] as const;
export type EmailKind = (typeof EMAIL_TEMPLATES)[number];
export type { EmailLocale } from "./email-locale";
export type TemplateParams = {
  name?: string;
  url?: string;
  message?: string;
  completed?: number;
  period?: string;
};
const esc = (s: unknown) =>
  String(s ?? "").replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export function emailTemplate(
  kind: EmailKind,
  locale: EmailLocale = "fr",
  p: TemplateParams = {},
) {
  locale = normalizeEmailLocale(locale);
  const en = locale === "en";
  const original = {
    verification: en
      ? [
          "Verify your email address",
          "Confirm your Aditou account",
          "Confirm your email address to activate your account and open your learning space.",
          "Verify my email",
          "This single-use link expires in 24 hours. If you did not create this account, ignore this email.",
        ]
      : [
          "Vérifiez votre adresse courriel",
          "Confirmez votre compte Aditou",
          "Confirmez votre adresse courriel pour activer votre compte et ouvrir votre espace.",
          "Vérifier mon courriel",
          "Ce lien à usage unique expire dans 24 heures. Si vous n’avez pas créé ce compte, ignorez ce courriel.",
        ],
    welcome: en
      ? [
          "Welcome to Aditou",
          "A little practice, at your own pace",
          "Your account is ready. Discover your space and take the next step at a comfortable pace.",
          "Open my space",
          "Parents can link a child only using the private invitation provided by their institution.",
        ]
      : [
          "Bienvenue sur Aditou",
          "Un petit pas, à votre rythme",
          "Votre compte est prêt. Découvrez votre espace et avancez à votre rythme, sans pression.",
          "Ouvrir mon espace",
          "Les parents peuvent relier un enfant uniquement avec l’invitation privée remise par leur établissement.",
        ],
    password_reset: en
      ? [
          "Reset your Aditou password",
          "Choose a new password",
          "We received a request to reset your password. Open this link and choose a new password.",
          "Reset my password",
          "This single-use link expires in 30 minutes. If you did not request it, ignore this email. Your current password is unchanged.",
        ]
      : [
          "Réinitialisez votre mot de passe Aditou",
          "Choisissez un nouveau mot de passe",
          "Nous avons reçu une demande de réinitialisation. Ouvrez ce lien pour choisir un nouveau mot de passe.",
          "Réinitialiser mon mot de passe",
          "Ce lien à usage unique expire dans 30 minutes. Si vous n’êtes pas à l’origine de la demande, ignorez ce courriel. Votre mot de passe reste inchangé.",
        ],
    progress: en
      ? [
          "Your Aditou learning update",
          "Every small step counts",
          "Take a moment to review the practice recorded in your space. Continue at your own pace.",
          "View my progress",
          "Practice history is a learning record, not an admission prediction.",
        ]
      : [
          "Votre point d’étape Aditou",
          "Chaque petit pas compte",
          "Prenez un moment pour revoir les activités enregistrées dans votre espace. Continuez à votre rythme.",
          "Voir mes progrès",
          "L’historique décrit les activités réalisées et ne prédit pas une admission.",
        ],
    notification: en
      ? [
          "A notification from Aditou",
          "News in your space",
          "A new update is available in your Aditou space.",
          "Open Aditou",
          "For your privacy, detailed learning records are available only after signing in.",
        ]
      : [
          "Une notification Aditou",
          "Du nouveau dans votre espace",
          "Une nouvelle information est disponible dans votre espace Aditou.",
          "Ouvrir Aditou",
          "Pour votre confidentialité, les détails des apprentissages sont accessibles uniquement après connexion.",
        ],
  }[kind];
  const additional = {
    es: {
      verification: [
        "Verifica tu correo electrónico",
        "Activa tu cuenta Aditou",
        "Abre el enlace para confirmar tu correo, elegir tu contraseña y activar tu cuenta.",
        "Establecer mi contraseña",
        "Este enlace de un solo uso caduca en 24 horas. Si no solicitaste esta cuenta, ignora este correo.",
      ],
      welcome: [
        "Te damos la bienvenida a Aditou",
        "Un pequeño paso, a tu ritmo",
        "Tu cuenta está lista. Descubre tu espacio y da el siguiente paso a tu ritmo, sin presión.",
        "Abrir mi espacio",
        "Los docentes pueden crear su organización en los ajustes de la cuenta. La vinculación familiar requiere una invitación privada del centro.",
      ],
      password_reset: [
        "Restablece tu contraseña de Aditou",
        "Elige una nueva contraseña",
        "Recibimos una solicitud para restablecer tu contraseña. Abre el enlace y elige una nueva.",
        "Restablecer mi contraseña",
        "Este enlace de un solo uso caduca en 30 minutos. Si no lo solicitaste, ignora este correo. Tu contraseña actual no cambia.",
      ],
      progress: [
        "Tu resumen de aprendizaje en Aditou",
        "Cada pequeño paso cuenta",
        "Dedica un momento a revisar la práctica guardada en tu espacio. Continúa a tu ritmo.",
        "Ver mi progreso",
        "El historial describe el aprendizaje realizado y no predice la admisión a un centro.",
      ],
      notification: [
        "Una notificación de Aditou",
        "Novedades en tu espacio",
        "Hay una nueva actualización disponible en tu espacio Aditou.",
        "Abrir Aditou",
        "Por tu privacidad, los detalles del aprendizaje solo están disponibles después de iniciar sesión.",
      ],
    },
    zh: {
      verification: [
        "验证你的邮箱",
        "激活 Aditou 账号",
        "请打开链接，确认邮箱并设置密码，以激活你的账号。",
        "设置密码",
        "此链接仅可使用一次，有效期为 24 小时。如果你未申请此账号，请忽略本邮件。",
      ],
      welcome: [
        "欢迎使用 Aditou",
        "按自己的节奏，迈出一小步",
        "你的账号已就绪。进入学习空间，轻松探索，按自己的节奏继续前进。",
        "进入我的空间",
        "教师可在账号设置中创建机构。关联孩子账号需要使用学校提供的私密邀请。",
      ],
      password_reset: [
        "重置 Aditou 密码",
        "设置新密码",
        "我们收到了重置密码的请求。请打开链接，设置你的新密码。",
        "重置密码",
        "此链接仅可使用一次，有效期为 30 分钟。如果这不是你的操作，请忽略本邮件，原密码不会改变。",
      ],
      progress: [
        "你的 Aditou 学习进度",
        "每一小步都有意义",
        "花一点时间回顾空间中记录的练习，按自己的节奏继续学习。",
        "查看我的进度",
        "练习记录仅用于了解学习过程，不预测学校录取结果。",
      ],
      notification: [
        "Aditou 消息通知",
        "你的空间有新消息",
        "你的 Aditou 空间中有一条新的更新。",
        "打开 Aditou",
        "为保护隐私，详细学习记录仅在登录后显示。",
      ],
    },
  };
  const copy =
    locale === "es" || locale === "zh" ? additional[locale][kind] : original;
  let url = p.url || APP_ORIGIN + "/login";
  if (
    new URL(url, APP_ORIGIN).origin !== APP_ORIGIN ||
    !url.startsWith(APP_ORIGIN + "/")
  )
    throw new Error("Invalid email action URL");
  const greeting =
    locale === "zh"
      ? p.name
        ? `你好，${p.name}：`
        : "你好："
      : `${{ fr: "Bonjour", en: "Hello", es: "Hola", zh: "" }[locale]}${p.name ? " " + p.name : ""},`;
  const detail =
    p.message ||
    (kind === "progress" && p.completed !== undefined
      ? progressDetail(locale, p.completed, p.period)
      : "");
  const footer = {
    fr: "Pratique indépendante en français et en anglais. Aucune affiliation à une école.",
    en: "Independent practice in French and English. No school affiliation.",
    es: "Práctica independiente en francés e inglés. Sin afiliación a ningún centro educativo.",
    zh: "提供法语和英语独立练习，不隶属于任何学校。",
  }[locale];
  const fallbackLink = {
    fr: "Si le bouton ne fonctionne pas, copiez ce lien :",
    en: "If the button does not work, copy this link:",
    es: "Si el botón no funciona, copia este enlace:",
    zh: "如果按钮无法打开，请复制以下链接：",
  }[locale];
  const html = `<!doctype html><html lang="${locale === "zh" ? "zh-CN" : locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0;background:#f3f6fc;color:#17213b;font-family:Arial,sans-serif"><div style="display:none;max-height:0;overflow:hidden">${esc(copy[1])}</div><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:32px 12px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:auto;background:#fff;border-radius:18px"><tr><td style="padding:28px;background:#2140b0;border-radius:18px 18px 0 0;color:#fff;font-size:25px;font-weight:bold">Aditou</td></tr><tr><td style="padding:28px"><p>${esc(greeting)}</p><h1 style="font-size:25px;line-height:1.3">${esc(copy[1])}</h1><p style="line-height:1.7">${esc(copy[2])}</p>${detail ? `<p style="line-height:1.7">${esc(detail)}</p>` : ""}<p style="margin:28px 0"><a href="${esc(url)}" style="display:inline-block;padding:15px 22px;background:#2140b0;color:white;border-radius:8px;text-decoration:none;font-weight:bold">${esc(copy[3])}</a></p><p style="font-size:13px;line-height:1.6;color:#5e6b85">${esc(copy[4])}</p><p style="font-size:12px;word-break:break-all">${fallbackLink}<br>${esc(url)}</p></td></tr><tr><td style="padding:22px 28px;border-top:1px solid #e6eaf2;color:#5e6b85;font-size:12px;line-height:1.7">${esc(footer)}<br><a href="mailto:studyainow@mail.com">studyainow@mail.com</a><br>© ${new Date().getUTCFullYear()} Aditou</td></tr></table></td></tr></table></body></html>`;
  return {
    subject: `Aditou · ${copy[0]}`,
    html,
    text: [
      greeting,
      copy[1],
      copy[2],
      detail,
      copy[3] + ": " + url,
      copy[4],
      footer,
      "studyainow@mail.com",
    ]
      .filter(Boolean)
      .join("\n\n"),
  };
}
export async function sendEmail(
  env: Env,
  to: string,
  kind: EmailKind,
  locale: EmailLocale,
  params: TemplateParams,
  key: string,
  accountId?: string,
) {
  if (!env.RESEND_API_KEY) throw { status: 503, message: "email.unavailable" };
  const template = emailTemplate(kind, locale, params),
    now = Date.now();
  locale = normalizeEmailLocale(locale);
  const detail =
    params.message ||
    (kind === "progress" && params.completed !== undefined
      ? progressDetail(locale, params.completed, params.period)
      : "");
  const content =
    env.RESEND_TEMPLATE_MODE === "published"
      ? {
          subject: template.subject,
          template: {
            id: `aditou-${kind.replace("_", "-")}-${locale}`,
            variables: {
              USER_NAME: params.name || "",
              MESSAGE: detail,
              ACTION_URL: params.url || APP_ORIGIN + "/login",
            },
          },
        }
      : template;
  const existing = await env.DB.prepare(
    "SELECT * FROM email_deliveries WHERE idempotency_key=?",
  )
    .bind(key)
    .first<any>();
  if (existing?.status === "accepted") return existing.resend_id;
  await env.DB.prepare(
    "INSERT INTO email_deliveries(id,account_id,recipient,template,locale,subject,idempotency_key,status,created_at,updated_at) VALUES(?,?,?,?,?,?,?,'sending',?,?) ON CONFLICT(idempotency_key) DO UPDATE SET status='sending',updated_at=excluded.updated_at",
  )
    .bind(
      crypto.randomUUID(),
      accountId || null,
      to,
      kind,
      locale,
      template.subject,
      key,
      now,
      now,
    )
    .run();
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "Idempotency-Key": key,
      },
      body: JSON.stringify({
        from: env.RESEND_FROM_EMAIL || "Aditou <aditou@studyai.now>",
        reply_to: "studyainow@mail.com",
        to: [to],
        ...content,
        tags: [
          { name: "app", value: "aditou" },
          { name: "template", value: kind },
          { name: "locale", value: locale },
        ],
      }),
      signal: AbortSignal.timeout(12000),
    });
    const body = (await response.json()) as { id?: string; name?: string };
    if (!response.ok || !body.id)
      throw new Error(body.name || `resend_${response.status}`);
    await env.DB.prepare(
      "UPDATE email_deliveries SET status='accepted',resend_id=?,error_code=NULL,updated_at=? WHERE idempotency_key=?",
    )
      .bind(body.id, Date.now(), key)
      .run();
    return body.id;
  } catch (error) {
    await env.DB.prepare(
      "UPDATE email_deliveries SET status='failed',error_code=?,updated_at=? WHERE idempotency_key=?",
    )
      .bind(
        error instanceof Error
          ? error.message.slice(0, 100)
          : "delivery_failed",
        Date.now(),
        key,
      )
      .run();
    throw { status: 503, message: "email.unavailable" };
  }
}
export async function sendWelcome(
  env: Env,
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
    email_locale?: string;
    preferred_locale?: string;
  },
) {
  const path =
    user.role === "parent"
      ? "/family"
      : user.role === "student"
        ? "/learn"
        : "/org/main/manage/bank";
  return sendEmail(
    env,
    user.email,
    "welcome",
    normalizeEmailLocale(user.preferred_locale || user.email_locale),
    { name: user.name, url: APP_ORIGIN + path + "?lang=" + normalizeEmailLocale(user.preferred_locale || user.email_locale) },
    `aditou/welcome/${user.id}`,
    user.id,
  );
}

export function progressDetail(
  locale: EmailLocale,
  completed: number,
  period?: string,
) {
  const suffix = period ? " · " + period : "";
  return {
    fr: `${completed} activités enregistrées${suffix}.`,
    en: `${completed} practice activities recorded${suffix}.`,
    es: `${completed} actividades de práctica registradas${suffix}.`,
    zh: `已记录 ${completed} 项练习${suffix}。`,
  }[locale];
}
export function passwordChangedMessage(locale: EmailLocale) {
  return {
    fr: "Votre mot de passe a été modifié et les sessions précédentes ont été fermées. Si vous n’êtes pas à l’origine de ce changement, réinitialisez votre mot de passe immédiatement.",
    en: "Your password has been changed and all previous sessions have been signed out. If this was not you, reset your password immediately.",
    es: "Tu contraseña ha cambiado y se han cerrado todas las sesiones anteriores. Si no hiciste este cambio, restablece tu contraseña de inmediato.",
    zh: "你的密码已修改，所有原有登录会话均已退出。如果这不是你的操作，请立即重置密码。",
  }[locale];
}
