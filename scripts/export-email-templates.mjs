import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { build } from "esbuild";
const bundled = await build({
  entryPoints: ["worker/emails.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
});
const { emailTemplate, EMAIL_TEMPLATES } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundled.outputFiles[0].text).toString("base64")
);
const entries = [];
mkdirSync("artifacts/email-templates", { recursive: true });
for (const locale of ["fr", "en", "es", "zh"])
  for (const kind of EMAIL_TEMPLATES) {
    const alias = `aditou-${kind.replace("_", "-")}-${locale}`;
    const preview = emailTemplate(kind, locale, {
      name: "Camille",
      completed: 8,
      period: {
        fr: "Cette semaine",
        en: "This week",
        es: "Esta semana",
        zh: "本周",
      }[locale],
    });
    writeFileSync(`artifacts/email-templates/${alias}.html`, preview.html);
    const source = emailTemplate(kind, locale, {
      name: "ADITOU_USER_NAME",
      message: "ADITOU_MESSAGE",
      url: "https://aditou.studyai.now/ADITOU_ACTION_URL",
    });
    const replace = (s) =>
      s
        .replaceAll("ADITOU_USER_NAME", "{{{USER_NAME}}}")
        .replaceAll("ADITOU_MESSAGE", "{{{MESSAGE}}}")
        .replaceAll(
          "https://aditou.studyai.now/ADITOU_ACTION_URL",
          "{{{ACTION_URL}}}",
        );
    entries.push({
      alias,
      name: `Aditou · ${kind} · ${locale.toUpperCase()}`,
      from: "Aditou <aditou@studyai.now>",
      reply_to: ["studyainow@mail.com"],
      subject: source.subject,
      html: replace(source.html),
      text: replace(source.text),
      variables: [
        { key: "USER_NAME", type: "string", fallback_value: "" },
        { key: "MESSAGE", type: "string", fallback_value: "" },
        { key: "ACTION_URL", type: "string" },
      ],
    });
  }
writeFileSync(
  "artifacts/email-templates/resend-templates.json",
  JSON.stringify(entries, null, 2) + "\n",
);
console.log(`Exported ${entries.length} localized templates`);
