import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8793";
const local = base.includes("localhost");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const apiRequests = [];
page.on("request", (r) => {
  if (new URL(r.url()).pathname.startsWith("/api/")) apiRequests.push(r.url());
});
await page.goto(base + "/");
await page
  .getByRole("heading", { name: "Écouter. Essayer. Progresser.", exact: true })
  .waitFor();
assert.ok(apiRequests.every((url) => new URL(url).pathname === "/api/auth/me"));
await page.locator(".public-header .language-picker select").selectOption("en");
await page
  .getByRole("heading", { name: "Listen. Try. Make progress.", exact: true })
  .waitFor();
await page.getByLabel("Your answer", { exact: true }).fill("7");
await page.getByRole("button", { name: "Check answer", exact: true }).click();
await page
  .getByRole("status")
  .getByText("Well done! 4 + 3 = 7.", { exact: true })
  .waitFor();
assert.ok(apiRequests.every((url) => new URL(url).pathname === "/api/auth/me"));
await page.locator(".public-header .language-picker select").selectOption("fr");
await page
  .getByRole("status")
  .getByText("Bien joué ! 4 + 3 = 7.", { exact: true })
  .waitFor();
assert.equal(
  await page.getByLabel("Votre réponse", { exact: true }).inputValue(),
  "7",
);
await page.locator(".public-header .language-picker select").selectOption("en");
assert.match(await page.title(), /Primary school preparation/);
for (const [width, height, label] of [
  [1440, 1100, "desktop"],
  [820, 1180, "tablet"],
  [390, 844, "mobile"],
  [320, 780, "small-mobile"],
]) {
  await page.setViewportSize({ width, height });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Marketing overflow " + label,
  );
  await page.screenshot({
    path: `artifacts/marketing-en-${label}.png`,
    fullPage: true,
  });
}
await page.locator(".public-header .language-picker select").selectOption("fr");
for (const width of [1440, 820, 390, 320]) {
  await page.setViewportSize({ width, height: 844 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "French overflow " + width,
  );
}
await page.screenshot({
  path: "artifacts/marketing-fr-small-mobile.png",
  fullPage: true,
});
await page.locator(".public-header .language-picker select").selectOption("en");
await page
  .locator(".public-header")
  .getByRole("link", { name: "Login", exact: true })
  .click();
await page.waitForURL("**/login");
await page
  .getByRole("heading", { name: "Welcome back", exact: true })
  .waitFor();
assert.equal(await page.locator("html").getAttribute("lang"), "en-CA");
await page.getByLabel("Email or student username").fill("preserve@example.com");
await page.locator(".public-header .language-picker select").selectOption("fr");
await page
  .getByRole("heading", { name: "Heureux de vous retrouver", exact: true })
  .waitFor();
assert.equal(
  await page.getByLabel("Courriel ou identifiant élève").inputValue(),
  "preserve@example.com",
);
await page.locator(".public-header .language-picker select").selectOption("en");
await page.screenshot({
  path: "artifacts/public-login-en-mobile.png",
  fullPage: true,
});
await page
  .locator(".public-header")
  .getByRole("link", { name: "Sign Up", exact: true })
  .click();
await page.waitForURL("**/signup");
await page
  .getByRole("heading", { name: "Welcome to your workspace", exact: true })
  .waitFor();
await page.reload();
await page
  .getByRole("heading", { name: "Welcome to your workspace", exact: true })
  .waitFor();
assert.equal(await page.locator("html").getAttribute("lang"), "en-CA");
await page.goBack();
await page
  .getByRole("heading", { name: "Welcome back", exact: true })
  .waitFor();
await page.goForward();
await page
  .getByRole("heading", { name: "Welcome to your workspace", exact: true })
  .waitFor();
await page.screenshot({
  path: "artifacts/public-signup-en-mobile.png",
  fullPage: true,
});
await page.goto(base + "/org/main/manage/studio");
await page.waitForURL("**/login?next=*");
assert.equal(
  new URL(page.url()).searchParams.get("next"),
  "/org/main/manage/studio",
);
await page.getByLabel("Email or student username").fill("admin@gmail.com");
await page
  .getByLabel("Password", { exact: true })
  .fill(process.env.ADMIN_PASSWORD || "Admin1234");
await page.getByRole("button", { name: "Sign in", exact: true }).click();
await page.waitForURL("**/org/main/manage/studio");
await page
  .getByRole("heading", { name: "Recording studio", exact: true })
  .waitFor();
await page.locator("header.topbar a.brand").click();
await page
  .getByRole("heading", { name: "Listen. Try. Make progress.", exact: true })
  .waitFor();
// Role-specific success routes and sign-up are exercised only against disposable local data.
if (local) {
  for (const role of ["student", "parent"]) {
    const c = await browser.newContext();
    await c.addInitScript(() =>
      localStorage.setItem("entryexam.ui-language", "en"),
    );
    const p = await c.newPage();
    await p.goto(base + "/signup?role=" + role);
    await p
      .getByRole("heading", { name: "Welcome to your workspace", exact: true })
      .waitFor();
    await p
      .getByLabel("Your first name or learning alias")
      .fill("Marketing " + role);
    await p
      .getByLabel("Email or student username")
      .fill("marketing-" + role + "-" + Date.now() + "@example.com");
    await p.getByLabel("Password", { exact: true }).fill("MarketingTest123");
    assert.equal(
      await p.getByLabel("Your workspace", { exact: true }).inputValue(),
      role,
    );
    await p
      .getByRole("button", { name: "Create my workspace", exact: true })
      .click();
    await p.waitForURL("**/" + (role === "student" ? "learn" : "family"));
    await p.getByRole("navigation").waitFor();
    await c.close();
  }
}
assert.deepEqual(errors, []);
await context.request.post(base + "/api/auth/logout", { data: {} });
await browser.close();
writeFileSync(
  "artifacts/marketing-" + (local ? "local" : "production") + ".json",
  JSON.stringify(
    {
      base,
      testedAt: new Date().toISOString(),
      marketingAtRoot: true,
      publicNoPrivateApiRequests: true,
      localDemo: true,
      languageSwitch: true,
      languagePersistsBetweenRoutes: true,
      authRoutes: ["/login", "/signup"],
      browserBackForward: true,
      protectedDeepLink: true,
      rootStaysPublicWhenSignedIn: true,
      roleSignupVerified: local,
      viewports: [1440, 820, 390, 320],
      errors,
    },
    null,
    2,
  ),
);
console.log(
  "Marketing, separate auth routes, bilingual UI, history, deep-link login and responsive checks passed.",
);
