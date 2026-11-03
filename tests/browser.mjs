import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const browser = await chromium.launch({ headless: true });
const base = process.env.BASE_URL || "http://localhost:8787";
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base + "/login");
await page
  .getByRole("heading", { name: "Heureux de vous retrouver" })
  .waitFor();
await page.screenshot({ path: "artifacts/login-desktop.png", fullPage: true });
await page.getByLabel("Courriel ou identifiant élève").fill("admin@gmail.com");
await page
  .getByLabel("Mot de passe", { exact: true })
  .fill(process.env.ADMIN_PASSWORD || "Admin1234");
await page.getByRole("button", { name: "Me connecter" }).click();
await page.getByRole("heading", { name: "Banque d’exercices" }).waitFor();
await page.screenshot({ path: "artifacts/admin-desktop.png", fullPage: true });
for (const [w, h, name] of [
  [390, 844, "mobile"],
  [820, 1180, "tablet"],
]) {
  await page.setViewportSize({ width: w, height: h });
  await page.screenshot({
    path: `artifacts/admin-${name}.png`,
    fullPage: true,
  });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Overflow " + name,
  );
}
await page.getByRole("button", { name: "Menu du compte", exact: true }).click();
await page.getByRole("menuitem", { name: "Déconnexion", exact: true }).click();
await page
  .locator(".auth-switch")
  .getByRole("link", { name: "Créer un compte", exact: true })
  .click();
await page.getByLabel("Votre prénom ou alias").fill("Camille");
await page
  .getByLabel("Courriel ou identifiant élève")
  .fill(`browser-${Date.now()}@example.com`);
await page.getByLabel("Mot de passe", { exact: true }).fill("BrowserTest123");
await page.getByRole("button", { name: "Créer mon espace" }).click();
await page.getByRole("heading", { name: /Bonjour, Camille/ }).waitFor();
for (const [w, h, name] of [
  [1440, 1000, "desktop"],
  [820, 1180, "tablet"],
  [390, 844, "mobile"],
]) {
  await page.setViewportSize({ width: w, height: h });
  await page.screenshot({
    path: `artifacts/student-${name}.png`,
    fullPage: true,
  });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Student overflow " + name,
  );
}
await page.getByRole("button", { name: "M’entraîner", exact: true }).click();
await page
  .getByRole("combobox", { name: "Langue", exact: true })
  .selectOption("fr-CA");
await page
  .getByRole("combobox", { name: "Année", exact: true })
  .selectOption("1");
await page.getByRole("button", { name: /Les petits oiseaux/ }).click();
await page.getByLabel("Ta réponse", { exact: true }).fill("7");
await page.getByRole("button", { name: "Valider ma réponse" }).click();
await page.getByRole("heading", { name: "Bravo, bien joué !" }).waitFor();
await page.screenshot({ path: "artifacts/player-mobile.png", fullPage: true });
assert.ok(
  await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
assert.deepEqual(errors, []);
console.log(
  "Browser flows and viewport checks passed; screenshots saved in artifacts/.",
);
await browser.close();
