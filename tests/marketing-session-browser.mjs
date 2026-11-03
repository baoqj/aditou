import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8795",
  local = new URL(base).hostname === "localhost";
const browser = await chromium.launch({ headless: true }),
  stamp = Date.now();
const setup = await browser.newContext();
async function login(context, email, password) {
  const r = await context.request.post(base + "/api/auth/login", {
    data: { email, password },
  });
  assert.equal(r.status(), 200);
}
await login(
  setup,
  "admin@gmail.com",
  process.env.ADMIN_PASSWORD || "Admin1234",
);
for (const role of local
  ? ["admin", "teacher", "student", "parent"]
  : ["admin", "teacher", "student"]) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await context.addInitScript(() =>
    localStorage.setItem("entryexam.ui-language", "en"),
  );
  if (local && role !== "admin") {
    const email = `public-${role}-${stamp}@example.com`,
      password = "Testing12345";
    if (role === "teacher") {
      const r = await setup.request.post(base + "/api/roster", {
        data: { email, password, name: "Public teacher", role },
      });
      assert.equal(r.status(), 200);
      await login(context, email, password);
    } else {
      const r = await context.request.post(base + "/api/auth/register", {
        data: { email, password, name: "Public " + role, role },
      });
      assert.equal(r.status(), 200);
    }
  } else
    await login(
      context,
      role + "@gmail.com",
      role === "admin"
        ? process.env.ADMIN_PASSWORD || "Admin1234"
        : role === "teacher"
          ? process.env.TEACHER_PASSWORD || "Teacher1234"
          : process.env.STUDENT_PASSWORD || "Student1234",
    );
  const dashboard =
    role === "admin" || role === "teacher"
      ? "/org/main/manage/bank"
      : role === "parent"
        ? "/family"
        : "/learn";
  const settings =
    role === "admin" || role === "teacher"
      ? "/org/main/manage/settings"
      : role === "parent"
        ? "/family/settings"
        : "/learn/settings";
  const page = await context.newPage(),
    errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + dashboard);
  await page.locator(".topbar .brand").click();
  await expect(page).toHaveURL(base + "/");
  const header = page.locator(".public-header");
  await expect(
    header.getByRole("button", { name: "Account menu", exact: true }),
  ).toBeVisible();
  assert.equal(
    await header.locator('a[href="/login"],a[href="/signup"]').count(),
    0,
  );
  await header
    .getByRole("button", { name: "Account menu", exact: true })
    .click();
  assert.deepEqual(await header.getByRole("menuitem").allTextContents(), [
    "Dashboard",
    "Settings",
    "Logout",
  ]);
  for (const width of [320, 390, 820, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    );
    await expect(
      header.getByRole("menuitem", { name: "Dashboard", exact: true }),
    ).toBeVisible();
  }
  await page.screenshot({
    path: `artifacts/marketing-session-${role}.png`,
    fullPage: true,
  });
  await header
    .getByRole("menuitem", { name: "Dashboard", exact: true })
    .click();
  await expect(page).toHaveURL(base + dashboard);
  await page.goto(base + "/");
  await header
    .getByRole("button", { name: "Account menu", exact: true })
    .click();
  await header.getByRole("menuitem", { name: "Settings", exact: true }).click();
  await expect(page).toHaveURL(base + settings);
  await expect(page.locator("main h1")).toBeVisible();
  await page.goto(base + "/");
  await header
    .getByRole("button", { name: "Account menu", exact: true })
    .click();
  await header
    .getByRole("combobox", { name: "Interface language" })
    .selectOption("fr");
  await expect(
    header.getByRole("menuitem", { name: "Tableau de bord", exact: true }),
  ).toBeVisible();
  await header
    .getByRole("menuitem", { name: "Déconnexion", exact: true })
    .click();
  await expect(header.locator('a[href="/login"]')).toBeVisible();
  await expect(header.locator('a[href="/signup"]')).toBeVisible();
  assert.equal(
    (await context.request.get(base + "/api/auth/me")).status(),
    401,
  );
  await page.reload();
  await expect(header.locator('a[href="/login"]')).toBeVisible();
  assert.deepEqual(errors, []);
  await context.close();
  console.log("Marketing session passed: " + role);
}
await setup.close();
await browser.close();
