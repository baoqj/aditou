import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const skills = JSON.parse(
  readFileSync(new URL("../src/data/skills.json", import.meta.url)),
);
const base = process.env.BASE_URL || "http://localhost:8797",
  local = new URL(base).hostname === "localhost";
const browser = await chromium.launch({ headless: true }),
  context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
const r = await context.request.post(
  base + (local ? "/api/auth/register" : "/api/auth/login"),
  {
    data: local
      ? {
          email: `skills-${Date.now()}@example.com`,
          name: "Skills",
          password: "Testing12345",
          grade: 2,
        }
      : {
          email: "student@gmail.com",
          password: process.env.STUDENT_PASSWORD || "Student1234",
        },
  },
);
assert.equal(r.status(), 200);
await context.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
const questions = (
  await (await context.request.get(base + "/api/questions")).json()
).questions;
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base + "/learn/practice");
await page
  .getByRole("combobox", { name: "Grade", exact: true })
  .selectOption("");
const skill = page.getByRole("combobox", { name: "Skill", exact: true }),
  language = page.getByRole("combobox", { name: "Language", exact: true });
await expect(skill).toBeVisible();
async function uniqueLabels() {
  const opts = await skill
    .locator("option")
    .evaluateAll((xs) =>
      xs.map((x) => ({ value: x.value, text: x.textContent })),
    );
  assert.equal(new Set(opts.map((x) => x.value)).size, opts.length);
  assert.equal(new Set(opts.map((x) => x.text)).size, opts.length);
  assert.ok(opts.every((x) => !/[0-9]/.test(x.text)));
  return opts;
}
const options = await uniqueLabels();
assert.equal(options.length, 24); // 23 used skills plus All skills.
assert.deepEqual(await language.locator("option").allTextContents(), [
  "FR & EN",
  "French",
  "English",
]);
for (const option of options.filter((x) => x.value)) {
  await language.selectOption("");
  await skill.selectOption(option.value);
  const count = questions.filter((q) => q.module === option.value).length;
  assert.ok(count > 0);
  await expect(
    page.getByRole("button", { name: `Start exam (${count})`, exact: true }),
  ).toBeVisible();
  const labels = await page
    .locator(".exercise-card .eyebrow")
    .allTextContents();
  assert.ok(labels.length > 0);
  assert.ok(labels.every((x) => x === option.text));
}
await skill.selectOption("skill.reading_comprehension");
await language.selectOption("en-CA");
await expect(
  page.getByRole("button", {
    name: `Start exam (${questions.filter((q) => q.module === "skill.reading_comprehension" && q.locale === "en-CA").length})`,
    exact: true,
  }),
).toBeVisible();
await language.selectOption("fr-CA");
await expect(
  page.getByRole("button", {
    name: `Start exam (${questions.filter((q) => q.module === "skill.reading_comprehension" && q.locale === "fr-CA").length})`,
    exact: true,
  }),
).toBeVisible();
assert.equal(await skill.inputValue(), "skill.reading_comprehension");
await page
  .getByRole("combobox", { name: "Interface language", exact: true })
  .selectOption("fr");
const frenchSkill = page.getByRole("combobox", {
  name: "Compétence",
  exact: true,
});
await expect(frenchSkill.locator("option:checked")).toHaveText(
  "Compréhension écrite",
);
const frOptions = await frenchSkill.locator("option").allTextContents();
assert.equal(new Set(frOptions).size, frOptions.length);
assert.ok(frOptions.every((x) => !/[0-9]/.test(x)));
for (const s of skills.filter((s) => s.id !== "skill.general"))
  assert.ok(frOptions.includes(s.fr), s.fr);
assert.deepEqual(
  await page
    .getByRole("combobox", { name: "Langue", exact: true })
    .locator("option")
    .allTextContents(),
  ["FR & EN", "Français", "Anglais"],
);
for (const width of [320, 390, 820, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: `artifacts/skills-${width}.png`,
    fullPage: true,
  });
}
assert.deepEqual(errors, []);
await context.request.post(base + "/api/auth/logout", { data: {} });
await browser.close();
console.log(
  "Skills passed: every category filters matching questions, unique bilingual labels, stable selection across languages, no Canada suffix, responsive viewports.",
);
