import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8790";
if (!base.includes("localhost"))
  throw Error("This fixture-writing test is local only");
const browser = await chromium.launch({ headless: true });
const stamp = Date.now();
const admin = await browser.newContext();
let r = await admin.request.post(base + "/api/auth/login", {
  data: { email: "admin@gmail.com", password: "Admin1234" },
});
assert.equal(r.status(), 200);
const teacherEmail = `i18n-teacher-${stamp}@example.com`;
r = await admin.request.post(base + "/api/roster", {
  data: {
    email: teacherEmail,
    name: "Teacher language test",
    password: "TestLanguage1234",
    role: "teacher",
  },
});
assert.equal(r.status(), 200);
const teacher = await browser.newContext();
await teacher.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
r = await teacher.request.post(base + "/api/auth/login", {
  data: { email: teacherEmail, password: "TestLanguage1234" },
});
assert.equal(r.status(), 200);
const me = await (await teacher.request.get(base + "/api/auth/me")).json();
const cls = await (
  await admin.request.post(base + "/api/classes", {
    data: {
      name: "Test classroom content",
      grade: 2,
      locale: "fr-CA",
      teacher_id: me.user.id,
    },
  })
).json();
r = await teacher.request.post(base + "/api/classrooms", {
  data: {
    title: "Classroom language test",
    class_id: cls.id,
    question_ids: ["practice-1-fr-CA"],
  },
});
assert.equal(r.status(), 200);
const page = await teacher.newPage();
await page.goto(base + "/org/main/manage/bank");
await page
  .getByRole("heading", { name: "Exercise bank", exact: true })
  .waitFor();
await page.getByText("Teacher workspace", { exact: true }).waitFor();
await page
  .getByRole("navigation")
  .getByRole("button", { name: "Live classroom", exact: true })
  .click();
await page
  .getByRole("button", { name: "Open classroom console", exact: true })
  .click();
await page
  .getByText("Exercise 1 / 1 · Round 1 · Teacher reading", { exact: true })
  .waitFor();
await page
  .getByRole("button", { name: "Open submissions", exact: true })
  .waitFor();
await page.locator(".language-picker select").selectOption("fr");
await page
  .getByRole("button", { name: "Ouvrir les réponses", exact: true })
  .waitFor();
await page
  .getByText("Exercice 1 / 1 · Ronde 1 · Lecture de l’enseignant", {
    exact: true,
  })
  .waitFor();
await page.locator(".language-picker select").selectOption("en");
await page.getByRole("button", { name: "Projector", exact: true }).click();
await page
  .getByRole("button", { name: "Close projector", exact: true })
  .click();
await page.screenshot({
  path: "artifacts/i18n-teacher-class-en.png",
  fullPage: true,
});
const parent = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
await parent.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
r = await parent.request.post(base + "/api/auth/register", {
  data: {
    email: `i18n-parent-${stamp}@example.com`,
    name: "Parent language test",
    password: "TestLanguage1234",
    role: "parent",
  },
});
assert.equal(r.status(), 200);
const pp = await parent.newPage();
await pp.goto(base + "/family");
await pp.getByRole("heading", { name: "Parent corner", exact: true }).waitFor();
await pp.getByLabel("Parent invitation code", { exact: true }).fill("invalid");
await pp.getByRole("button", { name: "Link account", exact: true }).click();
await pp
  .getByRole("alert")
  .getByText("The invitation is invalid or has expired.", { exact: true })
  .waitFor();
await pp.locator(".language-picker select").selectOption("fr");
await pp
  .getByRole("heading", { name: "Le coin des parents", exact: true })
  .waitFor();
await pp
  .getByRole("alert")
  .getByText("Invitation invalide ou expirée.", { exact: true })
  .waitFor();
await pp.locator(".language-picker select").selectOption("en");
assert.ok(
  await pp.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
);
await pp.screenshot({
  path: "artifacts/i18n-parent-en-mobile.png",
  fullPage: true,
});
await browser.close();
console.log(
  "Teacher classroom phases/projector and parent portal/errors switch between English and French.",
);
