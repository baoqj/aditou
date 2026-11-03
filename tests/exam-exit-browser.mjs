import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8797";
const browser = await chromium.launch({ headless: true }),
  ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const signup = await ctx.request.post(base + "/api/auth/register", {
  data: {
    email: `exit-${Date.now()}@example.com`,
    password: "Testing12345",
    name: "Exit exam",
    grade: 1,
  },
});
assert.equal(signup.status(), 200);
if (new URL(base).hostname !== "localhost") {
  const { user } = await signup.json();
  const { learner } = await (
    await ctx.request.get(base + "/api/bootstrap")
  ).json();
  for (const value of [user.id, learner.id])
    assert.match(value, /^[0-9a-f-]{36}$/i);
  const sql = [
    `DELETE FROM attempts WHERE learner_id='${learner.id}';`,
    `DELETE FROM assessment_run_answers WHERE run_id IN (SELECT id FROM assessment_runs WHERE learner_id='${learner.id}');`,
    `DELETE FROM assessment_runs WHERE learner_id='${learner.id}';`,
    `DELETE FROM auth_sessions WHERE account_id='${user.id}';`,
    `DELETE FROM learners WHERE id='${learner.id}' AND account_id='${user.id}';`,
    `DELETE FROM accounts WHERE id='${user.id}';`,
  ];
  writeFileSync(
    "artifacts/exam-exit-production-cleanup.sql",
    sql.join("\n") + "\n",
  );
}

await ctx.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
const p = await ctx.newPage(),
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
async function call(path, body) {
  const r = await ctx.request.fetch(base + "/api" + path, {
    method: body ? "POST" : "GET",
    data: body,
  });
  assert.equal(r.status(), 200, await r.text());
  return r.json();
}
const ids = ["practice-1-en-CA", "practice-2-en-CA"];
async function openRun() {
  const d = await call("/runs", { mode: "exam", question_ids: ids });
  await p.goto(base + "/learn/practice");
  await p
    .locator(".assessment-run-card")
    .filter({ has: p.locator("button") })
    .first()
    .waitFor();
  await p.locator(`[data-run-id="${d.run.id}"]`).getByRole("button").click();
  await p.locator(".assessment-question").waitFor();
  return d.run.id;
}
let rid = await openRun();
const answer = p.getByRole("textbox", { name: "Your answer", exact: true }),
  dialog = p.getByRole("dialog");
await answer.fill("7");
await p.getByRole("button", { name: "Exit exam", exact: true }).click();
await expect(dialog).toBeVisible();
await expect(dialog).toContainText("Unanswered questions: 1");
await dialog.getByRole("button", { name: "Keep working", exact: true }).click();
await expect(dialog).not.toBeVisible();
assert.equal((await call("/runs/" + rid)).run.status, "draft");
await expect(answer).toHaveValue("7");
await p.getByRole("button", { name: "Exit exam", exact: true }).click();
await dialog
  .getByRole("button", { name: "Save and exit", exact: true })
  .click();
await p.locator(".assessment-question").waitFor({ state: "detached" });
const saved = await call("/runs/" + rid);
assert.equal(saved.run.status, "draft");
assert.equal(saved.answers[ids[0]].answer, "7");
await p.locator(`[data-run-id="${rid}"]`).getByRole("button").click();
await expect(answer).toHaveValue("7");
await p.getByRole("button", { name: "Next", exact: true }).click();
await expect(
  p.locator(".assessment-question-nav button").nth(1),
).toHaveAttribute("aria-current", "step");
await expect(answer).toBeFocused();
const final = p.getByRole("button", {
  name: "Submit all answers",
  exact: true,
});
await expect(final).toBeEnabled();
await p.keyboard.press("Enter");
await expect(dialog).toBeVisible();
await expect(dialog).toContainText(
  "After submission, you cannot change your answers.",
);
await expect(dialog).toContainText("Unanswered questions: 1");
assert.equal((await call("/runs/" + rid)).run.status, "draft");
await p.keyboard.press("Escape");
await expect(dialog).not.toBeVisible();
assert.equal((await call("/runs/" + rid)).run.status, "draft");
await final.click();
for (const width of [320, 390, 820, 1440]) {
  await p.setViewportSize({ width, height: 1000 });
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
  );
  await p.screenshot({
    path: `artifacts/exam-confirm-${width}.png`,
    fullPage: true,
  });
}
await dialog.getByRole("button", { name: "Keep working", exact: true }).click();
await p
  .getByRole("combobox", { name: "Interface language" })
  .selectOption("fr");
await p
  .getByRole("button", { name: "Remettre toutes les réponses", exact: true })
  .click();
await expect(dialog).toContainText("Questions sans réponse : 1");
await expect(dialog).toContainText(
  "Après la remise, tu ne pourras plus modifier tes réponses.",
);
await dialog.getByRole("button", { name: "Remettre", exact: true }).click();
await p.getByRole("heading", { name: "Résultats", exact: true }).waitFor();
assert.equal((await call("/runs/" + rid)).summary.score, 2);
// A fully answered paper still needs confirmation and has no blank warning.
rid = await openRun();
await answer.fill("7");
await p.getByRole("button", { name: "Next", exact: true }).click();
await expect(answer).toBeFocused();
await answer.fill("3");
await p
  .getByRole("button", { name: "Submit all answers", exact: true })
  .click();
await expect(dialog).toBeVisible();
await expect(dialog.locator(".exam-blank-warning")).toHaveCount(0);
assert.equal((await call("/runs/" + rid)).run.status, "draft");
await dialog.getByRole("button", { name: "Keep working", exact: true }).click();
await p.getByRole("button", { name: "Exit exam", exact: true }).click();
await dialog.getByRole("button", { name: "Submit", exact: true }).click();
await p.getByRole("heading", { name: "Results", exact: true }).waitFor();
assert.equal((await call("/runs/" + rid)).summary.score, 4);
// Submit directly from the early-exit prompt, before visiting the last question.
rid = await openRun();
await answer.fill("7");
await p.getByRole("button", { name: "Exit exam", exact: true }).click();
await expect(dialog).toContainText("Unanswered questions: 1");
await dialog.getByRole("button", { name: "Submit", exact: true }).click();
await p.getByRole("heading", { name: "Results", exact: true }).waitFor();
assert.equal((await call("/runs/" + rid)).summary.incorrect, 1);
// Completely unanswered papers are also submittable, including unvisited answers.
rid = await openRun();
await p.getByRole("button", { name: "Next", exact: true }).click();
await expect(answer).toBeFocused();
await p
  .getByRole("button", { name: "Submit all answers", exact: true })
  .click();
await expect(dialog).toContainText("Unanswered questions: 2");
await dialog.getByRole("button", { name: "Submit", exact: true }).click();
await p.getByRole("heading", { name: "Results", exact: true }).waitFor();
const zero = await call("/runs/" + rid);
assert.equal(zero.summary.score, 0);
assert.equal(zero.summary.incorrect, 2);
assert.equal(
  await p.locator(".assessment-question .question-response").count(),
  0,
);
await expect(p.getByText("No answer", { exact: true })).toBeVisible();
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "Exam exit and confirmation passed: cancel, Escape, save/resume, final and early submission, blank warnings, all-blank scoring, bilingual dialog and responsive viewports.",
);
