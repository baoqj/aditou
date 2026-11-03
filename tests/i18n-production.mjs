import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "https://entryexam.polluxbao.workers.dev";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base + "/login");
await page
  .getByRole("heading", { name: "Heureux de vous retrouver", exact: true })
  .waitFor();
await page.locator(".language-picker select").selectOption("en");
await page
  .getByRole("heading", { name: "Welcome back", exact: true })
  .waitFor();
await page.getByLabel("Email or student username").fill("admin@gmail.com");
await page
  .getByLabel("Password", { exact: true })
  .fill(process.env.ADMIN_PASSWORD || "Admin1234");
await page.getByRole("button", { name: "Sign in", exact: true }).click();
await page
  .getByRole("heading", { name: "Exercise bank", exact: true })
  .waitFor();
const pages = [
  ["Students and classes", "Students and classes", "Élèves et classes"],
  ["Live classroom", "Live classroom", "Classe en direct"],
  ["Audio studio", "Recording studio", "Studio d’enregistrement"],
  ["Homework and marking", "Homework and marking", "Devoirs et corrections"],
  ["Reports", "Learning reports", "Rapports d’apprentissage"],
  ["My account", "My account", "Mon compte"],
  ["Exercise bank", "Exercise bank", "Banque d’exercices"],
];
for (const [nav, en, fr] of pages) {
  await page
    .getByRole("navigation")
    .getByRole("button", { name: nav, exact: true })
    .click();
  await page.getByRole("heading", { name: en, exact: true }).waitFor();
  await page.locator(".language-picker select").selectOption("fr");
  await page.getByRole("heading", { name: fr, exact: true }).waitFor();
  await page.locator(".language-picker select").selectOption("en");
  await page.getByRole("heading", { name: en, exact: true }).waitFor();
}
await page.reload();
await page
  .getByRole("heading", { name: "Exercise bank", exact: true })
  .waitFor();
assert.equal(await page.locator("html").getAttribute("lang"), "en-CA");
await page.getByRole("button", { name: "Create", exact: true }).click();
await page
  .getByRole("dialog")
  .getByLabel("Notes privées de l’enseignant et barème")
  .count()
  .then((n) => assert.equal(n, 0));
await page
  .getByRole("dialog")
  .getByLabel("Private teacher notes and marking criteria")
  .waitFor();
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Cancel", exact: true })
  .click();
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
  );
  await page.screenshot({
    path: `artifacts/i18n-production-en-${label}.png`,
    fullPage: true,
  });
}
await page.getByRole("button", { name: "Account menu", exact: true }).click();
await page.getByRole("menuitem", { name: "Logout", exact: true }).click();
await page
  .getByRole("heading", { name: "Welcome back", exact: true })
  .waitFor();
assert.deepEqual(errors, []);
await browser.close();
writeFileSync(
  "artifacts/i18n-production.json",
  JSON.stringify(
    {
      url: base,
      testedAt: new Date().toISOString(),
      pages: pages.map((p) => p[1]),
      bothDirections: true,
      persistsAfterReload: true,
      modalTranslated: true,
      viewports: [1440, 820, 390],
      errors,
      productionDataEdited: false,
    },
    null,
    2,
  ),
);
console.log(
  "Production bilingual UI checks passed for login, seven admin views, modal, persistence and three viewport sizes.",
);
