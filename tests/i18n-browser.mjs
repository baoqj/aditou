import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8790";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
async function heading(text) {
  await page.getByRole("heading", { name: text, exact: true }).waitFor();
}
async function language(value) {
  await page.locator(".language-picker select").selectOption(value);
  await page.waitForFunction(
    (v) => document.documentElement.lang === v,
    value === "en" ? "en-CA" : "fr-CA",
  );
}
await page.goto(base + "/login");
await heading("Heureux de vous retrouver");
await language("en");
await heading("Welcome back");
await page.getByLabel("Email or student username").fill("admin@gmail.com");
await page.getByLabel("Password", { exact: true }).fill("invalid-password");
await page.getByRole("button", { name: "Sign in", exact: true }).click();
await page
  .getByRole("alert")
  .getByText("Incorrect sign-in details.", { exact: true })
  .waitFor();
await language("fr");
await page
  .getByRole("alert")
  .getByText("Identifiants incorrects.", { exact: true })
  .waitFor();
await language("en");
await page
  .getByLabel("Password", { exact: true })
  .fill(process.env.ADMIN_PASSWORD || "Admin1234");
await page.getByRole("button", { name: "Sign in", exact: true }).click();
await heading("Exercise bank");
const routes = [
  ["Students and classes", "Students and classes"],
  ["Live classroom", "Live classroom"],
  ["Audio studio", "Recording studio"],
  ["Homework and marking", "Homework and marking"],
  ["Reports", "Learning reports"],
  ["My account", "My account"],
  ["Exercise bank", "Exercise bank"],
];
for (const [nav, title] of routes) {
  await page
    .getByRole("navigation")
    .getByRole("button", { name: nav, exact: true })
    .click();
  await heading(title);
  assert.ok(
    !(await page
      .getByRole("navigation")
      .innerText()
      .then((s) =>
        /Banque d’exercices|Élèves et classes|Mes devoirs|Mon compte/.test(s),
      )),
    title,
  );
}
await page.getByRole("button", { name: "Create", exact: true }).click();
const dialog = page.getByRole("dialog");
await dialog.getByLabel("Title", { exact: true }).fill("An unsaved title");
await dialog.getByLabel("Answer type").selectOption("multiple");
assert.equal(await dialog.getByLabel("Answer type").inputValue(), "multiple");
await dialog.getByRole("button", { name: "Cancel", exact: true }).click();
await page
  .getByRole("navigation")
  .getByRole("button", { name: "Homework and marking", exact: true })
  .click();
await page.getByRole("button", { name: "New homework", exact: true }).click();
await page.getByRole("dialog").getByLabel("Suggested due date").waitFor();
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Cancel", exact: true })
  .click();
await language("fr");
await heading("Devoirs et corrections");
await language("en");
await heading("Homework and marking");
await page.reload();
await heading("Homework and marking");
assert.equal(await page.locator("html").getAttribute("lang"), "en-CA");
for (const [width, height, label] of [
  [1440, 1000, "desktop"],
  [820, 1180, "tablet"],
  [390, 844, "mobile"],
]) {
  await page.setViewportSize({ width, height });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "overflow " + label,
  );
  await page.screenshot({
    path: `artifacts/i18n-admin-en-${label}.png`,
    fullPage: true,
  });
}
await page.getByRole("button", { name: "Account menu", exact: true }).click();
await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
await heading("Welcome back");
await page
  .locator(".auth-switch")
  .getByRole("link", { name: "Create an account", exact: true })
  .click();
await heading("Welcome to your workspace");
await page
  .getByLabel("Your first name or learning alias")
  .fill("Language Test");
await page
  .getByLabel("Email or student username")
  .fill("i18n-" + Date.now() + "@example.com");
await page.getByLabel("Password", { exact: true }).fill("TestLanguage1234");
await page
  .getByRole("button", { name: "Create my workspace", exact: true })
  .click();
await page.getByRole("heading", { name: /Hello, Language/ }).waitFor();
await page
  .getByRole("navigation")
  .getByRole("button", { name: "Practice", exact: true })
  .click();
await heading("A world to explore");
await page
  .getByRole("combobox", { name: "Language", exact: true })
  .selectOption("fr-CA");
await page
  .getByRole("combobox", { name: "Grade", exact: true })
  .selectOption("1");
await page.getByRole("button", { name: /Les petits oiseaux/ }).click();
await page.getByLabel("Your answer", { exact: true }).fill("7");
const content = await page.locator(".question-prompt").innerText();
await language("fr");
await page.getByLabel("Ta réponse", { exact: true }).waitFor();
assert.equal(
  await page.getByLabel("Ta réponse", { exact: true }).inputValue(),
  "7",
);
assert.equal(await page.locator(".question-prompt").innerText(), content);
await language("en");
await page
  .getByRole("button", { name: "Submit my answer", exact: true })
  .click();
await heading("Great job!");
await page.screenshot({
  path: "artifacts/i18n-student-answer-en-mobile.png",
  fullPage: true,
});
assert.deepEqual(errors, []);
writeFileSync(
  "artifacts/i18n-browser.json",
  JSON.stringify(
    {
      base,
      testedAt: new Date().toISOString(),
      adminPages: routes.map((x) => x[1]),
      loginAndRegistration: true,
      apiErrorsSwitchInPlace: true,
      persistedAfterReload: true,
      unsavedAnswerPreserved: true,
      exerciseContentPreserved: true,
      viewports: [1440, 820, 390],
      errors,
    },
    null,
    2,
  ),
);
console.log(
  "i18n browser checks passed: auth, all admin pages, forms, errors, persistence, responsive views and student answer preservation.",
);
await browser.close();
