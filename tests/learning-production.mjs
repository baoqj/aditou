import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "https://entryexam.polluxbao.workers.dev";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
const login = await context.request.post(base + "/api/auth/login", {
  data: {
    email: "student@gmail.com",
    password: process.env.STUDENT_PASSWORD || "Student1234",
  },
});
assert.equal(login.status(), 200);
const qresponse = await context.request.get(base + "/api/questions");
assert.equal(qresponse.status(), 200);
const { questions } = await qresponse.json();
const runs = await context.request.get(base + "/api/runs");
assert.equal(runs.status(), 200);
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
await page.goto(base + "/learn");
await page.locator(".student-header-nav").waitFor();
assert.equal(await page.locator(".student-nav").count(), 0);
for (const width of [320, 390, 820, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  const header = await page.locator(".topbar").boundingBox();
  assert.ok(header.height <= 56);
  await page.screenshot({
    path: `artifacts/production-learn-${width}.png`,
    fullPage: true,
  });
}
await page.getByRole("button", { name: "Practice", exact: true }).click();
const q = questions.find(
  (q) =>
    q.status === "published" &&
    q.response_type === "numeric" &&
    q.locale === "en-CA",
);
assert.ok(q);
await page
  .getByRole("combobox", { name: "Grade", exact: true })
  .selectOption(String(q.grade));
await page
  .getByRole("combobox", { name: "Language", exact: true })
  .selectOption(q.locale);
await page
  .getByRole("textbox", { name: "Search exercises", exact: true })
  .fill(q.title);
await page.locator(".exercise-card").filter({ hasText: q.title }).click();
await expect(
  page.getByRole("textbox", { name: "Your answer", exact: true }),
).toBeFocused();
await page.getByRole("button", { name: "Audio and reading help" }).click();
await page
  .getByText("Read the instructions at your own pace", { exact: true })
  .waitFor();
await page
  .getByRole("combobox", { name: "Interface language", exact: true })
  .selectOption("fr");
await page.getByText("Lis la consigne à ton rythme", { exact: true }).waitFor();
await page
  .getByRole("checkbox", { name: "Lecture automatique", exact: true })
  .waitFor();
await page.setViewportSize({ width: 320, height: 900 });
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
await page.screenshot({
  path: "artifacts/production-practice-320.png",
  fullPage: true,
});
assert.deepEqual(errors, []);
const result = {
  base,
  checkedAt: new Date().toISOString(),
  checks: [
    "student login",
    "single merged header",
    "320/390/820/1440 viewport fit",
    "exam/history API",
    "keyboard autofocus",
    "audio hint",
    "English/French UI",
  ],
  pageErrors: errors,
  mutations: "login only; no answers, exams, homework or audio created",
};
writeFileSync(
  "artifacts/learning-production.json",
  JSON.stringify(result, null, 2) + "\n",
);
console.log(JSON.stringify(result));
await browser.close();
