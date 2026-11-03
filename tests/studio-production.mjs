import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "https://entryexam.polluxbao.workers.dev";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
await context.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
const res = await context.request.post(base + "/api/auth/login", {
  data: {
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  },
});
assert.equal(res.status(), 200);
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base + "/org/main/manage/studio");
await page
  .getByRole("heading", { name: "Recording studio", exact: true })
  .waitFor();
const library = page.getByRole("complementary", {
  name: "Exercise library",
  exact: true,
});
await page
  .getByRole("combobox", { name: "Speech model", exact: true })
  .waitFor();
assert.equal(await library.getByRole("listitem").count(), 416);
assert.equal(await page.getByLabel("Exercise and version").count(), 0);
const modelIds = await page
  .getByRole("combobox", { name: "Speech model", exact: true })
  .locator("option")
  .evaluateAll((options) => options.map((o) => o.value));
assert.deepEqual(modelIds, ["xai/grok-tts", "@cf/myshell-ai/melotts"]);
await library.getByRole("textbox").fill("practice-1-fr-CA");
assert.equal(await library.getByRole("listitem").count(), 1);
await library.getByRole("listitem").getByRole("button").click();
await page.getByLabel("Title", { exact: true }).waitFor();
assert.equal(
  await page
    .getByLabel("Reading text / TTS script", { exact: true })
    .inputValue(),
  "Il y a 4 oiseaux. 3 autres arrivent. Combien y en a-t-il en tout ?",
);
for (const [width, height, label] of [
  [1440, 1100, "desktop"],
  [820, 1180, "tablet"],
  [390, 844, "mobile"],
]) {
  await page.setViewportSize({ width, height });
  await page.evaluate(() => scrollTo(0, 0));
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  );
  await page.screenshot({
    path: `artifacts/studio-production-${label}.png`,
    fullPage: true,
  });
}
await page.locator(".language-picker select").selectOption("fr");
await page
  .getByRole("combobox", { name: "Modèle vocal", exact: true })
  .waitFor();
await page
  .getByRole("button", { name: "Régénérer l’audio TTS", exact: true })
  .waitFor();
await page
  .getByRole("button", { name: "Enregistrer ma voix", exact: true })
  .waitFor();
await page.getByLabel("Choisir un fichier audio", { exact: true }).waitFor();
assert.deepEqual(errors, []);
await context.request.post(base + "/api/auth/logout", { data: {} });
await browser.close();
writeFileSync(
  "artifacts/studio-production.json",
  JSON.stringify(
    {
      base,
      testedAt: new Date().toISOString(),
      exerciseListCount: 416,
      questionDropdownRemoved: true,
      modelIds,
      bilingual: true,
      viewports: [1440, 820, 390],
      errors,
      businessContentEdited: false,
    },
    null,
    2,
  ),
);
console.log(
  "Production Studio list, search, editor, model choices, bilingual UI and responsive checks passed.",
);
