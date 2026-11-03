import { readFileSync, writeFileSync } from "node:fs";
// A full-access key is used only by this operator tool, never by the Worker.
const key =
  process.env.RESEND_SETUP_API_KEY ||
  JSON.parse(readFileSync("/tmp/aditou-resend-setup.json", "utf8")).key;
const templates = JSON.parse(
  readFileSync("artifacts/email-templates/resend-templates.json", "utf8"),
);
async function api(path, method = "GET", body) {
  await new Promise((r) => setTimeout(r, 600));
  const r = await fetch("https://api.resend.com" + path, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await r.json();
  if (!r.ok) throw Error(`${method} ${path}: ${JSON.stringify(result)}`);
  return result;
}
const existing = await api("/templates");
const ids = [];
for (const template of templates) {
  const found = existing.data.find((t) => t.alias === template.alias);
  const result = found
    ? await api("/templates/" + found.id, "PATCH", template)
    : await api("/templates", "POST", template);
  await api("/templates/" + result.id + "/publish", "POST");
  ids.push({ alias: template.alias, id: result.id });
  console.log("Published " + template.alias);
}
writeFileSync(
  "artifacts/email-templates/resend-template-ids.json",
  JSON.stringify(ids, null, 2) + "\n",
);
