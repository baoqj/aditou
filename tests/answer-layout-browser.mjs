import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8797";
const browser = await chromium.launch({ headless: true }),
  ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
assert.equal(
  (
    await ctx.request.post(base + "/api/auth/register", {
      data: {
        email: `layout-${Date.now()}@example.com`,
        password: "Testing12345",
        name: "Layout",
        grade: 1,
      },
    })
  ).status(),
  200,
);
if (new URL(base).hostname !== "localhost") {
  const { user, learner } = await (
    await ctx.request.get(base + "/api/bootstrap")
  ).json();
  for (const id of [user.id, learner.id]) assert.match(id, /^[0-9a-f-]{36}$/i);
  writeFileSync(
    "artifacts/answer-layout-production-cleanup.sql",
    [
      `DELETE FROM attempts WHERE learner_id='${learner.id}';`,
      `DELETE FROM assessment_run_answers WHERE run_id IN (SELECT id FROM assessment_runs WHERE learner_id='${learner.id}');`,
      `DELETE FROM assessment_runs WHERE learner_id='${learner.id}';`,
      `DELETE FROM auth_sessions WHERE account_id='${user.id}';`,
      `DELETE FROM learners WHERE id='${learner.id}' AND account_id='${user.id}';`,
      `DELETE FROM accounts WHERE id='${user.id}';`,
    ].join("\n") + "\n",
  );
}
await ctx.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
const qs = (
  await (await ctx.request.get(base + "/api/questions")).json()
).questions.filter((q) => q.locale === "en-CA" && q.status === "published");
const ids = [
  "practice-1-en-CA",
  "exam-g4-q09-en-CA-v2",
  ...qs
    .filter((q) => !["practice-1-en-CA", "exam-g4-q09-en-CA-v2"].includes(q.id))
    .slice(0, 78)
    .map((q) => q.id),
];
const created = await ctx.request.post(base + "/api/runs", {
  data: { mode: "exam", question_ids: ids },
});
assert.equal(created.status(), 200);
const { run } = await created.json();
const p = await ctx.newPage(),
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto(base + "/learn/practice");
await p.locator(`[data-run-id="${run.id}"]`).getByRole("button").click();
await p.locator(".assessment-question").waitFor();
const sizes = [
  [1440, 900],
  [1280, 720],
  [1024, 768],
  [820, 1180],
  [390, 844],
  [320, 568],
  [844, 390],
];
async function fits(selector) {
  const result = await p.evaluate((sel) => {
    const el = document.querySelector(sel),
      box = el.getBoundingClientRect();
    return {
      width: innerWidth,
      height: innerHeight,
      docH: document.documentElement.scrollHeight,
      docW: document.documentElement.scrollWidth,
      top: box.top,
      bottom: box.bottom,
    };
  }, selector);
  assert.ok(result.docW <= result.width + 1, JSON.stringify(result));
  assert.ok(result.docH <= result.height + 1, JSON.stringify(result));
  assert.ok(
    result.top >= 0 && result.bottom <= result.height + 1,
    selector + JSON.stringify(result),
  );
}
for (const [width, height] of sizes) {
  await p.setViewportSize({ width, height });
  await fits(".assessment-actions");
  await fits(".assessment-question .numeric-input");
  const nav = await p.locator(".assessment-nav-panel").boundingBox(),
    card = await p.locator(".assessment-question").boundingBox();
  if (width > height)
    assert.ok(nav.x + nav.width <= card.x, "Landscape two columns");
  else assert.ok(nav.y + nav.height <= card.y, "Portrait stacked");
  const toggle = p.locator(".assessment-nav-toggle");
  if (width <= 600 || height <= 540) {
    await expect(toggle).toBeVisible();
    await expect(p.locator(".assessment-question-nav")).not.toBeVisible();
    await toggle.click();
    await expect(p.locator(".assessment-question-nav")).toBeVisible();
    await fits(".assessment-actions");
    await toggle.click();
  }
  await p.screenshot({
    path: `artifacts/answer-layout-${width}x${height}.png`,
    fullPage: true,
  });
}
await p.setViewportSize({ width: 1440, height: 900 });
const enter = p.getByRole("button", { name: "Enter fullscreen", exact: true });
await enter.click();
await expect(
  p.getByRole("button", { name: "Exit fullscreen", exact: true }),
).toBeVisible();
assert.equal(await p.evaluate(() => !!document.fullscreenElement), true);
const cdp = await ctx.newCDPSession(p);
for (const [width, height] of [
  [820, 1180],
  [1180, 820],
]) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await fits(".assessment-actions");
  await fits(".numeric-input");
  assert.equal(await p.evaluate(() => !!document.fullscreenElement), true);
}
await cdp.send("Emulation.setDeviceMetricsOverride", {
  width: 1440,
  height: 900,
  deviceScaleFactor: 1,
  mobile: false,
});
await p.getByRole("button", { name: "Exit fullscreen", exact: true }).click();
await expect(enter).toBeVisible();
assert.equal(await p.evaluate(() => !!document.fullscreenElement), false);
await cdp.send("Emulation.clearDeviceMetricsOverride");
await cdp.detach();
await p.setViewportSize({ width: 1440, height: 900 });
await enter.click();
await expect(
  p.getByRole("button", { name: "Exit fullscreen", exact: true }),
).toBeVisible();
await p.evaluate(() => document.exitFullscreen());
await expect(enter).toBeVisible();
await p.locator(".assessment-question-nav button").nth(1).click();
await p.locator(".assessment-question textarea").waitFor();
for (const [width, height] of sizes) {
  await p.setViewportSize({ width, height });
  await fits(".assessment-actions");
  await fits(".assessment-question textarea");
  await expect(p.locator(".question-prompt")).toContainText(
    "Reading passage R1",
  );
  await p.screenshot({
    path: `artifacts/answer-reading-${width}x${height}.png`,
    fullPage: true,
  });
}
await p
  .getByRole("combobox", { name: "Interface language" })
  .selectOption("fr");
await expect(
  p.getByRole("button", { name: "Activer le plein écran", exact: true }),
).toBeVisible();
await p.goto(base + "/learn/practice");
await p.getByRole("combobox", { name: "Grade", exact: true }).selectOption("1");
await p
  .getByRole("combobox", { name: "Language", exact: true })
  .selectOption("en-CA");
await p
  .getByRole("textbox", { name: "Search exercises" })
  .fill("Les petits oiseaux");
await p.locator(".exercise-card").click();
await p.locator(".numeric-input").waitFor();
for (const [width, height] of sizes) {
  await p.setViewportSize({ width, height });
  await fits(".submit-bar");
  await fits(".numeric-input");
}
await p.setViewportSize({ width: 390, height: 844 });
await p.locator(".numeric-input").fill("7");
await p.keyboard.press("Enter");
await p.getByRole("button", { name: "Continue", exact: true }).waitFor();
await fits(".feedback-actions");
await fits(".numeric-input");
const draft = await (
  await ctx.request.get(base + "/api/runs/" + run.id)
).json();
const submitted = await ctx.request.post(
  base + "/api/runs/" + run.id + "/submit",
  { data: { revision: draft.run.revision } },
);
assert.equal(submitted.status(), 200);
await p.goto(base + "/learn/practice");
await p.locator(`[data-run-id="${run.id}"]`).getByRole("button").click();
await p.locator(".assessment-summary").waitFor();
for (const [width, height] of sizes) {
  await p.setViewportSize({ width, height });
  await fits(".assessment-actions");
  await fits(".assessment-summary");
  await p.screenshot({
    path: `artifacts/answer-review-${width}x${height}.png`,
    fullPage: true,
  });
}
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "Answer layout passed: 80 questions, landscape/portrait, collapsed navigation, long reading, pinned controls, practice feedback, real fullscreen toggles and external exit.",
);
