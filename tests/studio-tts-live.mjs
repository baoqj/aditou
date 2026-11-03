import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8792";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
let r = await context.request.post(base + "/api/auth/login", {
  data: {
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  },
});
assert.equal(r.status(), 200);
const rows = [];
for (const [model, voice, locale] of [
  ["xai/grok-tts", "ara", "fr-CA"],
  ["@cf/myshell-ai/melotts", "default", "fr-CA"],
  ["@cf/myshell-ai/melotts", "default", "en-CA"],
]) {
  const body = {
    question_id: "practice-1-" + locale,
    model,
    voice,
    regenerate: true,
    request_id: crypto.randomUUID(),
  };
  r = await context.request.post(base + "/api/audio/tts", {
    data: body,
    timeout: 120000,
  });
  const result = await r.json();
  assert.equal(r.status(), 200, JSON.stringify(result));
  const repeat = await (
    await context.request.post(base + "/api/audio/tts", { data: body })
  ).json();
  assert.equal(repeat.id, result.id);
  assert.equal(repeat.cached, true);
  rows.push({ model, locale, id: result.id });
  console.log("Generated and deduplicated:", model, locale);
}
const regenerated = await context.request.post(base + "/api/audio/tts", {
  data: {
    question_id: "practice-1-fr-CA",
    model: "xai/grok-tts",
    voice: "ara",
    regenerate: true,
    request_id: crypto.randomUUID(),
  },
  timeout: 120000,
});
assert.equal(regenerated.status(), 200, await regenerated.text());
const re = await regenerated.json();
assert.notEqual(re.id, rows[0].id);
const assets = (await (await context.request.get(base + "/api/audio")).json())
  .assets;
assert.ok(
  assets.some((a) => a.id === rows[0].id) && assets.some((a) => a.id === re.id),
);
const page = await context.newPage();
await page.goto(base + "/org/main/manage/studio");
await page
  .getByRole("heading", { name: "Studio d’enregistrement", exact: true })
  .waitFor();
const decoded = await page.evaluate(
  async (ids) => {
    const ctx = new AudioContext();
    const result = [];
    for (const id of ids) {
      const res = await fetch("/api/audio/" + id + "/file");
      const b = await ctx.decodeAudioData(await res.arrayBuffer());
      result.push({ id, duration: b.duration, channels: b.numberOfChannels });
    }
    await ctx.close();
    return result;
  },
  [...rows.map((a) => a.id), re.id],
);
assert.ok(decoded.every((a) => a.duration > 1 && a.duration < 90));
await browser.close();
writeFileSync(
  "artifacts/studio-tts-live.json",
  JSON.stringify(
    {
      testedAt: new Date().toISOString(),
      base,
      rows,
      regenerated: re.id,
      decoded,
      oldAudioRetained: true,
      retryDeduplicated: true,
    },
    null,
    2,
  ),
);
console.log(
  "Both speech models generated playable FR/EN audio; regeneration preserves old audio and retries deduplicate.",
);
