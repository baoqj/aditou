import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "https://aditou.studyai.now";
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } }),
  errors = [];
page.on("pageerror", (err) => errors.push(err.message));
await page.route("**/api/auth/register", (route) =>
  route.fulfill({
    status: 202,
    contentType: "application/json",
    body: JSON.stringify({
      verification_required: true,
      email: "ui-test@example.com",
    }),
  }),
);
await page.goto(base + "/signup");
await page.locator("[name=name]").fill("UI test");
await page.locator("[name=email]").fill("ui-test@example.com");
assert.equal(await page.locator("[name=password]").count(), 0);
await page.getByRole("radio", { name: "Enseignant", exact: true }).check();
assert.equal(await page.locator('.public-header-actions a[href="/signup"] svg').count(),0);
const google=page.locator('.google-login');
assert.equal(await google.locator('svg').count(),1);
await google.hover();
await expect.poll(()=>google.evaluate(e=>getComputedStyle(e).backgroundColor)).toBe('rgb(232, 241, 255)');
assert.equal(new URL(await google.getAttribute('href'),base).searchParams.get('role'),'teacher');
await page.screenshot({path:'artifacts/signup-teacher-desktop.png',fullPage:true});
await page.setViewportSize({width:390,height:844});
assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
await page.screenshot({path:'artifacts/signup-teacher-mobile.png',fullPage:true});
await page.setViewportSize({width:1440,height:1000});

await page
  .getByRole("button", { name: "Créer mon espace", exact: true })
  .click();
await page
  .getByRole("heading", { name: "Vérifiez votre boîte courriel", exact: true })
  .waitFor();
await page.screenshot({
  path: "artifacts/email-registration-desktop.png",
  fullPage: true,
});
await page.locator(".public-header .language-picker select").selectOption("en");
await page
  .getByRole("heading", { name: "Check your inbox", exact: true })
  .waitFor();
let verifies = 0;
await page.route("**/api/auth/verify-email", (route) => {
  verifies++;
  return route.fulfill({
    status: 200,
    contentType: "application/json",
    body: '{"ok":true,"verified":true}',
  });
});
await page.goto(base + "/verify-email#token=simulated-single-use-token");
await page
  .getByRole("heading", { name: "Set your password", exact: true })
  .waitFor();
assert.equal(verifies, 0);
await page.locator("[name=password]").fill("TestingOnly1234");
await page.locator("[name=confirm]").fill("TestingOnly1234");
await page
  .getByRole("button", { name: "Activate my account", exact: true })
  .click();
await page.getByRole("status").waitFor();
assert.equal(verifies, 1);
await page.goto(base + "/verify-email#token=second-simulated-token");
await page
  .getByRole("button", { name: "Activate my account", exact: true })
  .waitFor();
await page.goto(base + "/reset-password#token=simulated-reset-token");
await page.locator("[name=password]").fill("TestingOnly1234");
await page.locator("[name=confirm]").fill("DifferentPassword1234");
await page
  .getByRole("button", { name: "Save my password", exact: true })
  .click();
await page
  .getByRole("alert")
  .getByText("The passwords do not match.", { exact: true })
  .waitFor();
await page.setViewportSize({ width: 390, height: 844 });
await page.screenshot({
  path: "artifacts/email-reset-mobile.png",
  fullPage: true,
});
assert.equal(
  await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
await page.goto(base + "/reset-password");
await page
  .getByText(
    "This link is invalid, expired, or already used. Request a new email.",
    { exact: true },
  )
  .waitFor();
assert.deepEqual(errors, []);
await browser.close();
console.log(
  "Email browser checks passed: registration transition, localization, explicit confirmation, password mismatch, missing token, mobile layout.",
);
