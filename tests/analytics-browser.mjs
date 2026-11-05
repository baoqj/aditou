// End-to-end local test. Creates submissions and teaching records in the isolated analytics D1 only.
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8807";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname))
  throw Error("Local fixtures only");
const browser = await chromium.launch();
const dir = "artifacts/analytics";
mkdirSync(dir, { recursive: true });
async function client(email, password) {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 960 },
    acceptDownloads: true,
  });
  await c.addInitScript(() =>
    localStorage.setItem("entryexam.ui-language", "en"),
  );
  const request = async (path, body, method) => {
    const r = await c.request.fetch(base + "/api" + path, {
      method: method || (body ? "POST" : "GET"),
      data: body,
    });
    const d = await r.json();
    assert.ok(r.ok(), path + " " + r.status() + " " + JSON.stringify(d));
    return d;
  };
  await request("/auth/login", { email, password });
  const page = await c.newPage();
  page.setDefaultTimeout(12000);
  page.on("pageerror", (e) => console.error("page error", e));
  return { page, request, c };
}
async function show(page, path, title) {
  await page.goto(base + path);
  await page.getByRole("heading", { name: title, exact: true }).waitFor();
  await page.locator(".analytics-asof").waitFor();
}
async function clickTab(page, name) {
  await page
    .locator(".analytics-tabs")
    .getByRole("button", { name, exact: true })
    .click();
}
async function fit(page, width) {
  await page.setViewportSize({ width, height: 850 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    `horizontal overflow at ${width}`,
  );
}
try {
  const [teacher, student, school] = await Promise.all([
    client("teacher@gmail.com", "Teacher1234"),
    client("student@gmail.com", "Student1234"),
    client("school@gmail.com", "School1234"),
  ]);
  const q = (await teacher.request("/questions")).questions.find(
    (q) =>
      q.status === "published" &&
      q.grade === 1 &&
      q.locale === "fr-CA" &&
      q.response_type === "numeric",
  );
  assert.ok(q);
  const assignment = await teacher.request("/assignments", {
    class_id: "analytics-class",
    title: "Analytics homework",
    due_at: new Date().toISOString(),
    question_ids: [q.id],
  });
  const session = await teacher.request("/classrooms", {
    class_id: "analytics-class",
    title: "Analytics classroom",
    question_ids: [q.id],
  });
  await teacher.request("/classrooms/" + session.id, { action: "open" });
  const sessionData = await teacher.request("/classrooms/" + session.id);
  assert.equal(sessionData.targets.length, 1);
  const homework = await student.request("/runs", {
    mode: "homework",
    assignment_id: assignment.id,
  });
  await student.request(
    "/runs/" + homework.run.id,
    { question_id: q.id, answer: q.answer, revision: 0 },
    "PUT",
  );
  await student.request("/runs/" + homework.run.id + "/submit", {
    revision: 1,
  });
  const record = await student.request("/attempts", {
    question_id: q.id,
    answer: q.answer,
    context: "private",
    request_id: crypto.randomUUID(),
  });
  assert.ok(record);
  const time = Date.now();
  await student.request("/analytics/intervals", {
    id: crypto.randomUUID(),
    question_id: q.id,
    context: "private",
    kind: "interaction",
    start: time - 20000,
    end: time,
  });
  await student.request("/attempts", {
    question_id: q.id,
    answer: q.answer,
    context: "classroom",
    context_id: session.id,
    round: 1,
    request_id: crypto.randomUUID(),
  });
  await teacher.request("/classrooms/" + session.id, { action: "close" });
  await teacher.request("/analytics/teaching", {
    session_id: session.id,
    start: time - 45 * 60000,
    end: time,
    reason: "Confirmed lesson fixture",
  });
  const studentReport = await student.request("/analytics/overview");
  assert.ok(studentReport.summary.submissions >= 3);
  assert.ok(studentReport.summary.unreleased >= 2);
  assert.ok(studentReport.summary.minutes > 0);
  const teacherReport = await teacher.request("/analytics/overview");
  assert.equal(
    teacherReport.records.some((r) => r.context === "private"),
    false,
  );
  assert.equal(
    teacherReport.assignments.find((a) => a.id === assignment.id).target,
    1,
  );
  assert.equal(
    teacherReport.assignments.find((a) => a.id === assignment.id).waiting,
    1,
  );
  assert.ok(teacherReport.teaching_minutes >= 45);
  const orgReport = await school.request(
    "/analytics/overview?view=organization&org_id=analytics-org",
  );
  assert.equal(
    orgReport.summary.submissions,
    teacherReport.summary.submissions,
  );
  assert.ok(orgReport.roster_count === 1);
  await show(student.page, "/learn/progress", "My progress");
  await student.page.screenshot({
    path: dir + "/student-desktop.png",
    fullPage: true,
  });
  await fit(student.page, 390);
  await student.page.screenshot({
    path: dir + "/student-mobile.png",
    fullPage: true,
  });
  await fit(student.page, 820);
  await clickTab(student.page, "Skills");
  await student.page.locator(".analytics-skill-bars button").first().click();
  await student.page.locator("dialog[open] tbody tr").first().waitFor();
  await student.page.keyboard.press("Escape");
  assert.equal(await student.page.locator("dialog[open]").count(), 0);
  await student.page
    .getByLabel("Learning language", { exact: true })
    .selectOption("en-CA");
  await student.page.locator(".analytics-asof").waitFor();
  assert.equal(
    await student.page.locator(".analytics-skill-bars button").count(),
    0,
  );
  await student.page.goto(base + "/learn/progress?lang=fr");
  await student.page
    .getByRole("heading", { name: "Mes progrès", exact: true })
    .waitFor();
  await show(teacher.page, "/org/main/manage/reports", "My teaching reports");
  await clickTab(teacher.page, "Homework");
  await teacher.page
    .getByRole("heading", { name: "Submission and grading · separate tracks" })
    .waitFor();
  await teacher.page.screenshot({
    path: dir + "/teacher-homework.png",
    fullPage: true,
  });
  await clickTab(teacher.page, "Teaching");
  await teacher.page
    .getByRole("heading", { name: "Teaching workload" })
    .waitFor();
  await show(school.page, "/org/main/manage/reports", "Institution overview");
  await school.page.screenshot({
    path: dir + "/institution-desktop.png",
    fullPage: true,
  });
  await fit(school.page, 390);
  await fit(school.page, 820);
  await clickTab(school.page, "Data & access");
  await school.page
    .getByRole("heading", { name: "Data quality and metric definitions" })
    .waitFor();
  const download = school.page.waitForEvent("download");
  await school.page.getByRole("button", { name: "Export summary" }).click();
  assert.match((await download).suggestedFilename(), /^aditou-report-/);
  console.log(
    "PASS: local Worker/D1 submissions, frozen roster, releases, role scopes, EN/FR, desktop/tablet/mobile, chart drill and export",
  );
} finally {
  await browser.close();
}
