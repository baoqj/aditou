import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8794";
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
});
await context.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
let r = await context.request.post(base + "/api/auth/login", {
  data: {
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  },
});
assert.equal(r.status(), 200);
const p = await context.newPage();
const errors = [];
p.on("pageerror", (e) => errors.push(e.message));
await p.goto(base + "/org/main/manage/bank");
await p.getByRole("heading", { name: "Exercise bank", exact: true }).waitFor();
assert.equal(await p.locator(".topbar .brand").innerText(), "Aditou");
assert.equal(await p.locator(".topbar .brand small").count(), 0);
assert.equal(await p.locator(".topbar .header-right > button").count(), 0);
assert.ok(
  await p
    .locator(".topbar")
    .evaluate((e) => e.getBoundingClientRect().height <= 56),
);
assert.equal(await p.title(), "Aditou");
await p.getByRole("button", { name: "Account menu", exact: true }).click();
await p.getByRole("menuitem", { name: "Settings", exact: true }).waitFor();
await p.getByRole("menuitem", { name: "Logout", exact: true }).waitFor();
await p.keyboard.press("Escape");
assert.equal(await p.getByRole("menu").count(), 0);
await p.getByRole("button", { name: "Account menu", exact: true }).click();
await p.getByRole("heading", { name: "Exercise bank", exact: true }).click();
assert.equal(await p.getByRole("menu").count(), 0);
await p.getByRole("button", { name: "Account menu", exact: true }).focus();
await p.keyboard.press("ArrowDown");
await p.waitForFunction(
  () => document.activeElement?.textContent === "Settings",
);
await p.keyboard.press("ArrowDown");
await p.waitForFunction(() => document.activeElement?.textContent === "Logout");
await p.keyboard.press("Escape");
const before = await p.locator("nav.sidebar").boundingBox();
const first = await p
  .getByRole("heading", { name: "Exercise bank", exact: true })
  .boundingBox();
await p.evaluate(() => scrollTo(0, 600));
const after = await p.locator("nav.sidebar").boundingBox();
const moved = await p
  .getByRole("heading", { name: "Exercise bank", exact: true })
  .boundingBox();
assert.equal(Math.round(before.y), 56);
assert.equal(Math.round(after.y), 56);
assert.equal(Math.round(after.height), 844);
assert.ok(moved.y < first.y - 300);
assert.equal(
  await p.locator(".topbar").evaluate((e) => e.getBoundingClientRect().top),
  0,
);
await p.screenshot({
  path: "artifacts/aditou-dashboard-scroll-desktop.png",
  fullPage: false,
});
await p.getByRole("button", { name: "Account menu", exact: true }).click();
await p.screenshot({
  path: "artifacts/aditou-account-menu-en.png",
  fullPage: false,
});
await p.getByRole("menuitem", { name: "Settings", exact: true }).click();
await p.getByRole("heading", { name: "My account", exact: true }).waitFor();
assert.ok(p.url().endsWith("/org/main/manage/settings"));
await p.locator(".language-picker select").selectOption("fr");
await p.getByRole("button", { name: "Menu du compte", exact: true }).click();
await p.getByRole("menuitem", { name: "Paramètres", exact: true }).waitFor();
await p.getByRole("menuitem", { name: "Déconnexion", exact: true }).waitFor();
await p.keyboard.press("Escape");
await p.locator(".language-picker select").selectOption("en");
for (const [width, height, label] of [
  [820, 1180, "tablet"],
  [390, 844, "mobile"],
  [320, 780, "small-mobile"],
]) {
  await p.setViewportSize({ width, height });
  await p.evaluate(() => scrollTo(0, 0));
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "overflow " + label,
  );
  const h = await p
    .locator(".topbar")
    .evaluate((e) => e.getBoundingClientRect().height);
  assert.equal(h, width <= 600 ? 52 : 56);
  await p.getByRole("button", { name: "Account menu", exact: true }).click();
  assert.ok(
    await p
      .getByRole("menu")
      .evaluate((e) => e.getBoundingClientRect().right <= innerWidth),
  );
  await p.screenshot({
    path: `artifacts/aditou-dashboard-${label}.png`,
    fullPage: false,
  });
  await p.keyboard.press("Escape");
}
await p.getByRole("button", { name: "Account menu", exact: true }).click();
await p.getByRole("menuitem", { name: "Logout", exact: true }).click();
await p.waitForURL("**/login?next=*");
await p.getByRole("heading", { name: "Welcome back", exact: true }).waitFor();
assert.equal((await context.request.get(base + "/api/auth/me")).status(), 401);
await p.goto(base + "/");
await p
  .getByRole("heading", { name: "Listen. Try. Make progress.", exact: true })
  .waitFor();
assert.equal(await p.locator(".public-brand strong").innerText(), "Aditou");
assert.ok(!(await p.locator("body").innerText()).includes("Entry Exam"));
assert.deepEqual(errors, []);
await browser.close();
writeFileSync(
  "artifacts/aditou-shell-" +
    (base.includes("localhost") ? "local" : "production") +
    ".json",
  JSON.stringify(
    {
      base,
      testedAt: new Date().toISOString(),
      brand: "Aditou",
      desktopHeaderHeight: 56,
      mobileHeaderHeight: 52,
      avatarMenu: true,
      keyboardAndOutsideDismiss: true,
      settingsRoute: true,
      logoutSessionRevoked: true,
      sidebarFixedWhileContentScrolls: true,
      bilingual: true,
      viewports: [1440, 820, 390, 320],
      errors,
    },
    null,
    2,
  ),
);
console.log(
  "Aditou branding, compact header, account menu, logout and fixed sidebar checks passed.",
);
