import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "https://aditou.studyai.now";
const browser = await chromium.launch({ headless: true }),
  page = await browser.newPage({ viewport: { width: 1200, height: 960 } }),
  calls = [],
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.route("**/api/**", async (route) => {
  const r = route.request(),
    path = new URL(r.url()).pathname;
  calls.push({
    path,
    locale: r.headers()["x-aditou-ui-language"],
    body: r.postDataJSON(),
  });
  if (path === "/api/auth/me")
    return route.fulfill({
      status: 401,
      contentType: "application/json",
      body: '{"error":"unauthorized"}',
    });
  if (path === "/api/auth/language") return route.fulfill({ status: 204 });
  return route.fulfill({
    status: path === "/api/auth/register" ? 202 : 200,
    contentType: "application/json",
    body: JSON.stringify(
      path === "/api/auth/register"
        ? { verification_required: true }
        : { ok: true, verified: true },
    ),
  });
});
for (const locale of ["es", "zh"]) {
  const t = JSON.parse(readFileSync(`src/locales/${locale}.json`, "utf8"));
  await page.goto(base + "/signup");
  assert.deepEqual(
    await page.locator(".language-picker select option").allTextContents(),
    ["English", "Français", "Español", "中文"],
  );
  await page.locator(".language-picker select").selectOption(locale);
  assert.equal(
    new URL(
      await page.locator(".google-login").getAttribute("href"),
      base,
    ).searchParams.get("locale"),
    locale,
  );
  await page.locator("[name=name]").fill("Camille");
  await page.locator("[name=email]").fill(locale + "@example.com");
  await page.locator("form .btn").click();
  await page
    .getByRole("heading", { name: t["email.checkTitle"], exact: true })
    .waitFor();
  const reg = calls.filter((c) => c.path === "/api/auth/register").at(-1);
  assert.equal(reg.locale, locale);
  assert.equal(reg.body.locale, locale);
  await page.goto(base + "/forgot-password");
  await page.getByRole("textbox").fill(locale + "@example.com");
  await page.locator("form .btn").click();
  await page.getByRole("status").waitFor();
  const reset = calls
    .filter((c) => c.path === "/api/auth/forgot-password")
    .at(-1);
  assert.equal(reset.locale, locale);
  assert.equal(reset.body.locale, locale);
  await page.goto(base + "/verify-email#token=fixture");
  await page.locator("[name=password]").fill("TestingPassword123");
  await page.locator("[name=confirm]").fill("TestingPassword123");
  await page.locator("form .btn").click();
  await page.getByRole("status").waitFor();
  assert.equal(
    calls.filter((c) => c.path === "/api/auth/verify-email").at(-1).locale,
    locale,
  );
  await page.waitForTimeout(150);
  assert.ok(
    calls.some((c) => c.path === "/api/auth/language" && c.locale === locale),
  );
}
for (const width of [320, 390]) {
  await page.setViewportSize({ width, height: 844 });
  await page.goto(base + "/signup?lang=es");
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
  );
  assert.ok(
    (await page.locator(".language-picker select").boundingBox()).width >= 100,
  );
}
const preview = await browser.newPage({
  viewport: { width: 720, height: 960 },
});
for (const locale of ["es", "zh"])
  for (const kind of [
    "verification",
    "welcome",
    "password-reset",
    "progress",
    "notification",
  ]) {
    const html = readFileSync(
      `artifacts/email-templates/aditou-${kind}-${locale}.html`,
      "utf8",
    );
    await preview.setContent(html);
    assert.equal(
      await preview.locator("html").getAttribute("lang"),
      locale === "zh" ? "zh-CN" : locale,
    );
    assert.equal(await preview.locator("h1").count(), 1);
    assert.ok(
      !(await preview.locator("body").innerText()).includes("undefined"),
    );
    for (const href of await preview
      .locator('a:not([href^="mailto:"])')
      .evaluateAll((es) => es.map((e) => e.href)))
      assert.equal(new URL(href).origin, "https://aditou.studyai.now");
    if (kind === "verification")
      await preview.screenshot({
        path: `artifacts/email-templates/verification-${locale}-preview.png`,
        fullPage: true,
      });
  }
assert.deepEqual(errors, []);
await browser.close();
writeFileSync(
  "artifacts/email-languages-browser-validation.json",
  JSON.stringify(
    {
      languages: ["es", "zh"],
      registration: true,
      verification: true,
      passwordReset: true,
      googleLocale: true,
      languageSync: true,
      previews: 10,
      errors,
    },
    null,
    2,
  ),
);
console.log(
  "Spanish/Chinese browser checks passed: registration, verification, reset, Google locale, preference sync and all ten new email previews.",
);
