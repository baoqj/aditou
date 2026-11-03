import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8787";
function client() {
  let cookie = "";
  return async (path, body, status = 200, method) => {
    const r = await fetch(base + "/api" + path, {
      method: method || (body === undefined ? "GET" : "POST"),
      headers: { "Content-Type": "application/json", Cookie: cookie },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (r.headers.get("set-cookie"))
      cookie = r.headers.get("set-cookie").split(";")[0];
    const d = await r.json();
    assert.equal(r.status, status, path + ": " + JSON.stringify(d));
    return d;
  };
}
test("whole-paper drafts, concurrent revisions, immutable exam results and teacher-only homework release", async () => {
  const student = client(),
    other = client(),
    admin = client(),
    teacher = client(),
    suffix = Date.now();
  await student("/auth/register", {
    email: `paper-${suffix}@example.com`,
    name: "Paper student",
    password: "Testing12345",
    grade: 2,
  });
  await other("/auth/register", {
    email: `other-paper-${suffix}@example.com`,
    name: "Other student",
    password: "Testing12345",
  });
  await admin("/auth/login", {
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  });
  const ids = ["practice-1-en-CA", "practice-2-en-CA"];
  await student(
    "/runs",
    { mode: "exam", question_ids: [...ids, "practice-1-fr-CA"] },
    400,
  );
  const d = await student("/runs", { mode: "exam", question_ids: ids }),
    rid = d.run.id;
  assert.equal(d.summary, null);
  assert.equal(d.results.length, 0);
  assert.ok(
    d.questions.every(
      (q) => !q.answer && !q.script && !q.reference && !q.explanation,
    ),
  );
  await other("/runs/" + rid, undefined, 403);
  await admin("/runs/" + rid, undefined, 403);

  await student(
    "/runs/" + rid,
    { revision: 0, question_id: ids[0], answer: "99" },
    200,
    "PUT",
  );
  await student(
    "/runs/" + rid,
    { revision: 0, question_id: ids[1], answer: "3" },
    409,
    "PUT",
  );
  await student(
    "/runs/" + rid,
    { revision: 1, question_id: ids[1], answer: "3" },
    200,
    "PUT",
  );
  await student(
    "/runs/" + rid,
    { revision: 2, question_id: ids[0], answer: "7" },
    200,
    "PUT",
  );
  let draft = await student("/runs/" + rid);
  assert.equal(draft.answers[ids[0]].answer, "7");
  assert.equal(draft.summary, null);
  await student("/runs/" + rid + "/submit", { revision: 2 }, 409);
  // A client-selected legacy request ID must not suppress a final paper answer.
  await student("/attempts", {
    question_id: ids[0],
    answer: "0",
    context: "private",
    request_id: "run:" + rid + ":" + ids[0],
  });
  const [x, y] = await Promise.all([
    student("/runs/" + rid + "/submit", { revision: 3 }),
    student("/runs/" + rid + "/submit", { revision: 3 }),
  ]);
  assert.equal(x.run.status, "graded");
  assert.equal(y.run.status, "graded");
  assert.deepEqual(x.summary, {
    total: 2,
    correct: 2,
    incorrect: 0,
    partial: 0,
    pending: 0,
    score: 4,
    max_score: 4,
  });
  await student(
    "/runs/" + rid,
    { revision: 4, question_id: ids[0], answer: "1" },
    409,
    "PUT",
  );
  assert.equal(
    (await student("/attempts")).attempts.filter((a) => a.run_id === rid)
      .length,
    2,
  );
  assert.equal(
    (await student("/runs/" + rid)).questions[0].reference.answer,
    "7",
  );
  // Homework deliberately waits for a teacher, including automatically gradable numeric answers.
  await admin("/roster", {
    email: `mark-${suffix}@example.com`,
    name: "Marker",
    password: "Testing12345",
    role: "teacher",
  });
  await teacher("/auth/login", {
    email: `mark-${suffix}@example.com`,
    password: "Testing12345",
  });
  const teacherId = (await teacher("/auth/me")).user.id,
    learner = (await student("/bootstrap")).learner.id;
  const cls = await admin("/classes", {
    name: "Paper marking " + suffix,
    grade: 2,
    locale: "en-CA",
    teacher_id: teacherId,
  });
  await admin("/enrollments", { class_id: cls.id, learner_id: learner });
  const hw = await teacher("/assignments", {
    class_id: cls.id,
    title: "Whole homework",
    question_ids: ids,
    due_at: "2026-12-10",
  });
  await other("/runs", { mode: "homework", assignment_id: hw.id }, 403);
  const h = await student("/runs", { mode: "homework", assignment_id: hw.id }),
    hid = h.run.id;
  assert.equal(
    (await student("/runs", { mode: "homework", assignment_id: hw.id })).run.id,
    hid,
  );
  await student("/runs/" + hid + "/submit", { revision: 0 }, 400);
  for (let i = 0; i < 2; i++)
    await student(
      "/runs/" + hid,
      { revision: i, question_id: ids[i], answer: i === 0 ? "7" : "3" },
      200,
      "PUT",
    );
  const submitted = await student("/runs/" + hid + "/submit", { revision: 2 });
  assert.equal(submitted.run.status, "submitted");
  assert.equal(submitted.summary, null);
  assert.deepEqual(submitted.results, []);
  assert.ok(submitted.questions.every((q) => !q.reference));
  await student(
    "/runs/" + hid,
    { revision: 3, question_id: ids[0], answer: "0" },
    409,
    "PUT",
  );
  const work = (await teacher("/attempts")).attempts.filter(
    (a) => a.run_id === hid,
  );
  assert.equal(work.length, 2);
  assert.ok(
    work.every((a) => a.status === "pending_manual" && a.score === null),
  );
  await student(
    "/attempts/" + work[0].id + "/grade",
    { status: "correct" },
    403,
  );
  await teacher("/attempts/" + work[0].id + "/grade", {
    status: "correct",
    feedback: "Well done",
  });
  assert.equal((await student("/runs/" + hid)).summary, null);
  const hidden = (await student("/attempts")).attempts.filter(
    (a) => a.run_id === hid,
  );
  assert.ok(
    hidden.every(
      (a) =>
        a.score === null &&
        !a.reference &&
        !a.feedback &&
        a.status === "submitted",
    ),
  );
  await teacher("/attempts/" + work[1].id + "/grade", { status: "partial" });
  const marked = await student("/runs/" + hid);
  assert.equal(marked.run.status, "graded");
  assert.equal(marked.summary.score, 3);
  assert.equal(marked.summary.partial, 1);
  assert.ok(marked.questions.every((q) => q.reference));
  // Two draft writers cannot overwrite each other or create duplicate answers.
  const concurrent = await student("/runs", {
    mode: "exam",
    question_ids: ids,
  });
  const calls = await Promise.allSettled([
    student(
      "/runs/" + concurrent.run.id,
      { revision: 0, question_id: ids[0], answer: "7" },
      200,
      "PUT",
    ),
    student(
      "/runs/" + concurrent.run.id,
      { revision: 0, question_id: ids[0], answer: "8" },
      200,
      "PUT",
    ),
  ]);
  assert.equal(calls.filter((x) => x.status === "fulfilled").length, 1);
  assert.equal(calls.filter((x) => x.status === "rejected").length, 1);
  const after = await student("/runs/" + concurrent.run.id);
  assert.equal(after.run.revision, 1);
  assert.equal(Object.keys(after.answers).length, 1);
});

test("exam accepts missing and blank answers, gives blanks zero, and locks every question", async () => {
  const student = client();
  await student("/auth/register", {
    email: `blank-exam-${Date.now()}@example.com`,
    name: "Blank exam",
    password: "Testing12345",
  });
  const ids = ["practice-1-en-CA", "practice-7-en-CA", "practice-8-en-CA"];
  const empty = await student("/runs", { mode: "exam", question_ids: ids });
  const result = await student("/runs/" + empty.run.id + "/submit", {
    revision: 0,
  });
  assert.equal(result.run.status, "graded");
  assert.equal(result.summary.score, 0);
  assert.equal(result.summary.incorrect, 3);
  assert.equal(result.summary.pending, 0);
  assert.equal(result.results.length, 3);
  const attempts = (await student("/attempts")).attempts.filter(
    (a) => a.run_id === empty.run.id,
  );
  assert.ok(attempts.every((a) => a.answer === "" && a.score === 0));
  await student(
    "/runs/" + empty.run.id,
    { revision: 1, question_id: ids[0], answer: "7" },
    409,
    "PUT",
  );
  await student("/runs/" + empty.run.id + "/submit", { revision: 0 });
  assert.equal(
    (await student("/attempts")).attempts.filter(
      (a) => a.run_id === empty.run.id,
    ).length,
    3,
  );
  const partial = await student("/runs", {
    mode: "exam",
    question_ids: ["practice-1-en-CA", "practice-2-en-CA"],
  });
  await student(
    "/runs/" + partial.run.id,
    { revision: 0, question_id: "practice-1-en-CA", answer: "7" },
    200,
    "PUT",
  );
  const marked = await student("/runs/" + partial.run.id + "/submit", {
    revision: 1,
  });
  assert.equal(marked.summary.score, 2);
  assert.equal(marked.summary.correct, 1);
  assert.equal(marked.summary.incorrect, 1);
});
