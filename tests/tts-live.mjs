import { writeFileSync } from "node:fs";
import assert from "node:assert/strict";
import { chromium } from "@playwright/test";
const base = process.env.BASE_URL || "https://entryexam.polluxbao.workers.dev";
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
const results = [];
for (const locale of ["fr-CA", "en-CA"]) {
  const question_id = "practice-1-" + locale;
  const response = await fetch(base + "/api/audio/tts", {
    method: "POST",
    headers: { Cookie: cookie, "Content-Type": "application/json" },
    body: JSON.stringify({ question_id }),
    signal: AbortSignal.timeout(120000),
  });
  const result = await response.json();
  assert.equal(response.status, 200, JSON.stringify(result));
  assert.ok(result.id);
  const cached = await (
    await fetch(base + "/api/audio/tts", {
      method: "POST",
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      body: JSON.stringify({ question_id }),
    })
  ).json();
  assert.equal(cached.id, result.id);
  assert.equal(cached.cached, true);
  const file = await fetch(base + "/api/audio/" + result.id + "/file", {
    headers: { Cookie: cookie },
  });
  assert.equal(file.status, 200);
  const bytes = await file.arrayBuffer();
  assert.ok(bytes.byteLength > 1000);
  results.push({
    locale,
    id: result.id,
    bytes: bytes.byteLength,
    status: "draft",
    cached: true,
  });
  console.log(
    `Cloudflare Gateway TTS ${locale}: generated ${bytes.byteLength} bytes, R2 read and cache hit verified.`,
  );
}
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const [name, value] = cookie.split("=");
await context.addCookies([
  { name, value, url: base, secure: true, httpOnly: true, sameSite: "Lax" },
]);
const page = await context.newPage();
await page.goto(base + "/org/main/manage/bank");
await page.getByRole("heading", { name: "Banque d’exercices" }).waitFor();
await page.getByRole("button", { name: "Studio audio", exact: true }).click();
await page.getByRole("heading", { name: "Studio d’enregistrement" }).waitFor();
const decoded = await page.evaluate(
  async (ids) => {
    const context = new AudioContext();
    const results = [];
    for (const id of ids) {
      const r = await fetch("/api/audio/" + id + "/file");
      const b = await context.decodeAudioData(await r.arrayBuffer());
      results.push({
        id,
        duration: b.duration,
        sampleRate: b.sampleRate,
        channels: b.numberOfChannels,
      });
    }
    await context.close();
    return results;
  },
  results.map((r) => r.id),
);
assert.ok(decoded.every((d) => d.duration > 1 && d.duration < 60));
await page.screenshot({
  path: "artifacts/production-tts-studio.png",
  fullPage: true,
});
await browser.close();
await fetch(base + "/api/auth/logout", {
  method: "POST",
  headers: { Cookie: cookie, "Content-Type": "application/json" },
  body: "{}",
});
writeFileSync(
  "artifacts/tts-live.json",
  JSON.stringify(
    {
      provider: "Cloudflare AI Gateway",
      model: "xai/grok-tts",
      voice: "ara",
      gateway: "default",
      testedAt: new Date().toISOString(),
      results,
      decoded,
      review:
        "Drafts retained for teacher listening review; not auto-published.",
    },
    null,
    2,
  ),
);
console.log(
  "FR/EN TTS generated and decoded successfully. Drafts retained for listening review.",
);
