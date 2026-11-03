import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "https://entryexam.polluxbao.workers.dev";
const health = await fetch(base + "/api/health");
assert.equal(health.status, 200);
assert.equal((await health.json()).service, "entryexam");
assert.equal((await fetch(base + "/api/questions")).status, 401);
const login = await fetch(base + "/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  }),
});
assert.equal(login.status, 200);
const cookie = login.headers.get("set-cookie").split(";")[0];
assert.match(login.headers.get("set-cookie"), /HttpOnly/);
assert.match(login.headers.get("set-cookie"), /Secure/);
const q = await (
  await fetch(base + "/api/questions", { headers: { Cookie: cookie } })
).json();
assert.ok(q.questions.length >= 816);
assert.equal(q.questions.filter(x=>x.id.startsWith("exam-")&&x.status==="published").length,400);
assert.ok(q.questions.filter(x=>x.status==="published").length>=416);
const bootstrap = await (
  await fetch(base + "/api/bootstrap", { headers: { Cookie: cookie } })
).json();
assert.equal(bootstrap.user.role, "admin");
const wave = new Uint8Array(2044),
  v = new DataView(wave.buffer);
function str(i, s) {
  [...s].forEach((c, n) => v.setUint8(i + n, c.charCodeAt(0)));
}
str(0, "RIFF");
v.setUint32(4, 2036, true);
str(8, "WAVE");
str(12, "fmt ");
v.setUint32(16, 16, true);
v.setUint16(20, 1, true);
v.setUint16(22, 1, true);
v.setUint32(24, 8000, true);
v.setUint32(28, 16000, true);
v.setUint16(32, 2, true);
v.setUint16(34, 16, true);
str(36, "data");
v.setUint32(40, 2000, true);
let audioId;
try {
  const upload = await fetch(
    base + "/api/audio/upload?question=practice-1-fr-CA",
    {
      method: "POST",
      headers: { Cookie: cookie, "Content-Type": "audio/wav" },
      body: wave,
    },
  );
  assert.equal(upload.status, 200);
  audioId = (await upload.json()).id;
  const file = await fetch(base + "/api/audio/" + audioId + "/file", {
    headers: { Cookie: cookie },
  });
  assert.equal(file.status, 200);
  assert.equal((await file.arrayBuffer()).byteLength, 2044);
  console.log("Production D1 + private R2 upload/read passed.");
} finally {
  if (audioId) {
    assert.match(audioId, /^[0-9a-f-]{36}$/);
    execFileSync(
      "./node_modules/.bin/wrangler",
      [
        "r2",
        "object",
        "delete",
        "entryexam-storage/teacher/" + audioId,
        "--remote",
      ],
      { stdio: "pipe" },
    );
    execFileSync(
      "./node_modules/.bin/wrangler",
      [
        "d1",
        "execute",
        "entryexam-db",
        "--remote",
        "--command",
        `DELETE FROM audio_assets WHERE id='${audioId}'`,
      ],
      { stdio: "pipe" },
    );
    console.log("Temporary production audio and metadata removed.");
  }
}
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const [name, value] = cookie.split("=");
await context.addCookies([
  { name, value, url: base, secure: true, httpOnly: true, sameSite: "Lax" },
]);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
for (const [width, height, label] of [
  [1440, 1000, "desktop"],
  [820, 1180, "tablet"],
  [390, 844, "mobile"],
]) {
  await page.setViewportSize({ width, height });
  await page.goto(base + "/org/main/manage/bank");
  await page.getByRole("heading", { name: "Banque d’exercices" }).waitFor();
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: `artifacts/production-admin-${label}.png`,
    fullPage: true,
  });
}
assert.deepEqual(errors, []);
await browser.close();
await fetch(base + "/api/auth/logout", {
  method: "POST",
  headers: { Cookie: cookie, "Content-Type": "application/json" },
  body: "{}",
});
writeFileSync(
  "artifacts/production-smoke.json",
  JSON.stringify(
    {
      url: base,
      testedAt: new Date().toISOString(),
      health: true,
      login: true,
      draftVersions: q.questions.filter(x=>x.status==="draft").length,
      publishedVersions: q.questions.filter(x=>x.status==="published").length,
      r2UploadAndRead: true,
      testAudioCleanedUp: true,
      viewports: [390, 820, 1440],
      browserErrors: errors,
      ttsConfigured: bootstrap.ttsConfigured,
    },
    null,
    2,
  ),
);
console.log(
  "Production login, catalog, audio storage and responsive browser smoke checks passed.",
);
