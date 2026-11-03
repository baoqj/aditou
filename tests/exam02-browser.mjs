import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8798",
  local = new URL(base).hostname === "localhost";
const browser = await chromium.launch({ headless: true }),
  ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const auth = await ctx.request.post(
  base + "/api/auth/" + (local ? "register" : "login"),
  {
    data: local
      ? {
          email: `exam02-view-${Date.now()}@example.com`,
          password: "Testing12345",
          name: "Exam02",
          grade: 1,
        }
      : {
          email: "student@gmail.com",
          password: process.env.STUDENT_PASSWORD || "Student1234",
        },
  },
);
assert.equal(auth.status(), 200);
await ctx.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
const p = await ctx.newPage(),
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto(base + "/learn/practice");
const search = p.getByRole("textbox", {
  name: "Search exercises",
  exact: true,
});
for (const grade of [1, 2, 3, 4])
  for (const locale of ["fr-CA", "en-CA"]) {
    await p
      .getByRole("combobox", { name: "Grade", exact: true })
      .selectOption(String(grade));
    await p
      .getByRole("combobox", { name: "Language", exact: true })
      .selectOption(locale);
    await search.fill("Exam02");
    const n = locale === "en-CA" ? 6 : grade === 1 ? 44 : 45;
    await expect(
      p.getByRole("button", { name: `Start exam (${n})`, exact: true }),
    ).toBeVisible();
  }
async function open(grade, locale, code) {
  await p.goto(base + "/learn/practice");
  await p
    .getByRole("combobox", { name: "Grade", exact: true })
    .selectOption(String(grade));
  await p
    .getByRole("combobox", { name: "Language", exact: true })
    .selectOption(locale);
  await p
    .getByRole("textbox", { name: "Search exercises", exact: true })
    .fill("Exam02 · " + code + " ·");
  await expect(p.locator(".exercise-card")).toHaveCount(1);
  await p.locator(".exercise-card").click();
  await p.locator(".player-card h1").waitFor();
}
await open(1, "fr-CA", "A1");
await expect(p.getByRole("radio")).toHaveCount(3);
if (local) {
  await p.getByRole("radio", { name: "🐱", exact: true }).check();
  await p.getByRole("button", { name: "Submit my answer" }).click();
  await p.getByRole("heading", { name: "Great job!", exact: true }).waitFor();
}
await open(2, "fr-CA", "B3");
await expect(p.locator(".question-response input[type=checkbox]")).toHaveCount(
  4,
);
await expect(p.locator(".question-prompt")).toContainText("Le hérisson");
for (const [width, height] of [
  [320, 568],
  [390, 844],
  [820, 1180],
  [1440, 900],
]) {
  await p.setViewportSize({ width, height });
  assert.ok(
    await p.evaluate(
      () =>
        document.documentElement.scrollWidth <= innerWidth &&
        document.documentElement.scrollHeight <= innerHeight + 1,
    ),
  );
  await p.screenshot({
    path: `artifacts/exam02-multiple-${width}.png`,
    fullPage: true,
  });
}
await open(4, "fr-CA", "G5");
await expect(p.locator(".order-list>div")).toHaveCount(3);
await open(4, "fr-CA", "E1");
await expect(p.locator(".question-response textarea")).toBeVisible();
await expect(p.locator(".question-prompt")).toContainText("6 à 8 phrases");
await open(2, "fr-CA", "D1");
await expect(p.locator(".question-prompt")).not.toContainText("école");
await open(1, "fr-CA", "A4");
await expect(p.locator("canvas")).toBeVisible();
await p.locator(".question-preparation summary").click();
await expect(p.locator(".question-preparation")).toContainText("cadre");
await open(4, "en-CA", "J1");
await expect(p.getByRole("radio")).toHaveCount(3);
await expect(p.locator(".question-prompt")).not.toContainText("Last weekend");
assert.deepEqual(errors, []);
await ctx.request.post(base + "/api/auth/logout", { data: {} });
await browser.close();
console.log(
  "Exam02 browser passed: source counts by grade and language, choices, multiple selection, order, writing, dictation privacy, drawing preparation and responsive layouts.",
);
