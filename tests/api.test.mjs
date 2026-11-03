import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8787";
function client() {
  let cookie = "";
  return async (path, body, expected = 200, method) => {
    const r = await fetch(base + "/api" + path, {
      method: method || (body === undefined ? "GET" : "POST"),
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (r.headers.get("set-cookie"))
      cookie = r.headers.get("set-cookie").split(";")[0];
    const b = await r.json();
    assert.equal(r.status, expected, `${path}: ${JSON.stringify(b)}`);
    return b;
  };
}
test("identity, scoped teaching, grading, immutable versions and private history", async () => {
  const admin = client(),
    student = client(),
    outsider = client(),
    teacher = client(),
    parent = client();
  const suffix = Date.now();
  await admin("/auth/login", {
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  });
  const initial = await admin("/questions");
  assert.equal(
    initial.questions.filter((q) => q.id.startsWith("g")).length,
    400,
  );
  await student("/auth/register", {
    email: `student-${suffix}@example.com`,
    password: "Testing12345",
    name: "Élève Test",
    role: "admin",
    grade: 2,
  });
  const sb = await student("/bootstrap");
  assert.equal(sb.user.role, "student");
  assert.ok(sb.learner.id);
  await outsider("/auth/register", {
    email: `outsider-${suffix}@example.com`,
    password: "Testing12345",
    name: "Autre élève",
  });
  await parent("/auth/register", {
    email: `parent-${suffix}@example.com`,
    password: "Testing12345",
    name: "Parent Test",
    role: "parent",
  });
  await student("/roster", undefined, 403);
  await student("/questions", { title: "bad" }, 403);
  const catalog = await student("/questions");
  assert.ok(
    catalog.questions.every(
      (q) =>
        !("answer" in q) &&
        !("script" in q) &&
        !("teacher_notes" in q) &&
        !("explanation" in q),
    ),
  );
  assert.ok(!catalog.questions.some((q) => q.status === "draft"));
  await admin("/roster", {
    email: `teacher-${suffix}@example.com`,
    name: "Prof Test",
    password: "Testing12345",
    role: "teacher",
  });
  await teacher("/auth/login", {
    email: `teacher-${suffix}@example.com`,
    password: "Testing12345",
  });
  const me = await teacher("/auth/me");
  const cls = await admin("/classes", {
    name: "Classe Test " + suffix,
    grade: 2,
    locale: "fr-CA",
    teacher_id: me.user.id,
  });
  await admin("/enrollments", { class_id: cls.id, learner_id: sb.learner.id });
  const qid = (
    await teacher("/questions", {
      ...initial.questions.find((q) => q.id === "practice-3-fr-CA"),
      status: "published",
      id: undefined,
    })
  ).id;
  const assignment = await teacher("/assignments", {
    class_id: cls.id,
    title: "Devoir test",
    due_at: "2026-11-10",
    question_ids: [qid],
  });
  const denied = await outsider(
    "/attempts",
    {
      question_id: qid,
      answer: "7",
      request_id: crypto.randomUUID(),
      context: "assignment",
      context_id: assignment.id,
    },
    403,
  );
  await student(
    "/attempts",
    {
      question_id: qid,
      answer: "7",
      request_id: crypto.randomUUID(),
      context: "assignment",
      context_id: assignment.id,
    },
    409,
  );
  const paper = await student("/runs", {
    mode: "homework",
    assignment_id: assignment.id,
  });
  await student(
    "/runs/" + paper.run.id,
    { revision: 0, question_id: qid, answer: "7" },
    200,
    "PUT",
  );
  await student("/runs/" + paper.run.id + "/submit", { revision: 1 });
  const correct = (await teacher("/attempts")).attempts.find(
    (a) => a.run_id === paper.run.id,
  );
  assert.equal(correct.status, "pending_manual");
  await teacher("/attempts/" + correct.id + "/grade", { status: "correct" });
  await student("/attempts", {
    question_id: qid,
    answer: "0",
    request_id: crypto.randomUUID(),
    context: "private",
  });
  const manual = await student("/attempts", {
    question_id: "practice-7-fr-CA",
    answer: "Triangle réalisé",
    request_id: crypto.randomUUID(),
    context: "private",
  });
  assert.equal(manual.status, "pending_manual");
  const hist = await teacher("/attempts");
  assert.ok(hist.attempts.some((a) => a.id === correct.id));
  assert.ok(hist.attempts.every((a) => a.context !== "private"));
  await teacher(
    "/attempts/" + manual.id + "/grade",
    { status: "correct" },
    403,
  );
  const room = await teacher("/classrooms", {
    class_id: cls.id,
    title: "Séance Test",
    question_ids: [qid],
  });
  await outsider("/classrooms/" + room.id, undefined, 403);
  await student(
    "/attempts",
    {
      question_id: qid,
      answer: "7",
      request_id: crypto.randomUUID(),
      context: "classroom",
      context_id: room.id,
      round: 1,
    },
    409,
  );
  await teacher("/classrooms/" + room.id, { action: "open" });
  const submitted = await student("/attempts", {
    question_id: qid,
    answer: "7",
    request_id: crypto.randomUUID(),
    context: "classroom",
    context_id: room.id,
    round: 1,
  });
  assert.equal(submitted.status, "submitted");
  assert.ok(!submitted.answer);
  const roomStudent = await student("/classrooms/" + room.id);
  assert.ok(!roomStudent.question.answer);
  assert.equal(roomStudent.attempts[0].status, "submitted");
  const hiddenHist = await student("/attempts");
  assert.equal(
    hiddenHist.attempts.find((a) => a.id === submitted.id).status,
    "submitted",
  );
  assert.ok(!hiddenHist.attempts.find((a) => a.id === submitted.id).reference);
  await teacher("/classrooms/" + room.id, { action: "reveal" });
  const reveal = await student("/classrooms/" + room.id);
  assert.equal(reveal.question.answer, "7");
  await teacher("/classrooms/" + room.id, { action: "retry" });
  const retry = await student("/classrooms/" + room.id);
  assert.equal(retry.classroom.round, 2);
  assert.equal(retry.attempts.length, 0);
  const hiddenRoom = await teacher("/classrooms", {
    class_id: cls.id,
    title: "Unreleased reference",
    question_ids: [qid],
  });
  await teacher("/classrooms/" + hiddenRoom.id, { action: "open" });
  const hiddenAttempt = await student("/attempts", {
    question_id: qid,
    answer: "7",
    request_id: crypto.randomUUID(),
    context: "classroom",
    context_id: hiddenRoom.id,
    round: 1,
  });
  await teacher("/classrooms/" + hiddenRoom.id, { action: "retry" });
  let hiddenAfterRetry = await student("/attempts");
  assert.ok(
    !hiddenAfterRetry.attempts.find((a) => a.id === hiddenAttempt.id).reference,
  );
  await teacher("/classrooms/" + hiddenRoom.id, { action: "end" });
  hiddenAfterRetry = await student("/attempts");
  assert.ok(
    !hiddenAfterRetry.attempts.find((a) => a.id === hiddenAttempt.id).reference,
  );
  await teacher("/classrooms/" + hiddenRoom.id, { action: "open" }, 409);
  await parent("/attempts?learner=" + sb.learner.id, undefined, 403);
  const invite = await teacher("/invitations", { learner_id: sb.learner.id });
  await parent("/family/claim", { token: invite.token });
  await parent("/family/claim", { token: invite.token }, 400);
  const family = await parent("/attempts?learner=" + sb.learner.id);
  assert.ok(family.attempts.length >= 3);
  await parent("/attempts/" + manual.id + "/grade", {
    status: "partial",
    feedback: "Observation parentale : deux côtés sont fermés.",
  });
  const parentReviewed = await parent("/attempts?learner=" + sb.learner.id);
  assert.equal(
    parentReviewed.attempts.find((a) => a.id === manual.id).score,
    1,
  );
  assert.equal(
    parentReviewed.attempts.find((a) => a.id === manual.id).reviewer_role,
    "parent",
  );
  await parent(
    "/attempts/" + correct.id + "/grade",
    { status: "correct" },
    403,
  );
  const orig = (await teacher("/questions")).questions.find(
    (q) => q.id === qid,
  );
  const edited = await teacher("/questions", {
    ...orig,
    prompt: "Nouvelle consigne",
    status: "published",
  });
  assert.notEqual(edited.id, qid);
  const accessible = await student("/questions");
  assert.ok(accessible.questions.some((q) => q.id === qid));
  const stale = await student("/runs/" + paper.run.id);
  assert.equal(stale.results[0].status, "correct");
  assert.notEqual(stale.questions[0].prompt, "Nouvelle consigne");
  // Restore initial published starter question so the suite is repeatable.
  // Tests use a dedicated local DB; this statement is intentionally not a public API feature.
  await student("/classrooms/" + room.id, { action: "reveal" }, 403);
  await student("/audio/tts", { question_id: edited.id }, 403);
  await student("/auth/logout", {});
  await student("/auth/me", undefined, 401);
});

test("private R2 audio: upload, review, publish and withdraw", async () => {
  const login = await fetch(base + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@gmail.com",
      password: process.env.ADMIN_PASSWORD || "Admin1234",
    }),
  });
  const adminCookie = login.headers.get("set-cookie").split(";")[0];
  assert.equal(login.status, 200);
  const signup = await fetch(base + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: `audio-${Date.now()}@example.com`,
      password: "Testing12345",
      name: "Audio Test",
    }),
  });
  const studentCookie = signup.headers.get("set-cookie").split(";")[0];
  const data = new Uint8Array(16044);
  const view = new DataView(data.buffer);
  const text = (offset, s) =>
    [...s].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, "RIFF");
  view.setUint32(4, data.length - 8, true);
  text(8, "WAVE");
  text(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  text(36, "data");
  view.setUint32(40, 16000, true);
  for (let i = 0; i < 8000; i++)
    view.setInt16(
      44 + i * 2,
      Math.sin((i * 2 * Math.PI * 440) / 8000) * 1000,
      true,
    );
  const post = async (path, body) =>
    fetch(base + "/api" + path, {
      method: "POST",
      headers: { Cookie: adminCookie, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  const bad = await fetch(
    base + "/api/audio/upload?question=practice-1-fr-CA",
    {
      method: "POST",
      headers: { Cookie: adminCookie, "Content-Type": "audio/wav" },
      body: new Uint8Array(200),
    },
  );
  assert.equal(bad.status, 400);
  const uploaded = await fetch(
    base + "/api/audio/upload?question=practice-1-fr-CA",
    {
      method: "POST",
      headers: { Cookie: adminCookie, "Content-Type": "audio/wav" },
      body: data,
    },
  );
  assert.equal(uploaded.status, 200);
  const asset = await uploaded.json();
  const file = "/api/audio/" + asset.id + "/file";
  assert.equal(
    (await fetch(base + file, { headers: { Cookie: studentCookie } })).status,
    404,
  );
  assert.equal((await post("/audio/" + asset.id + "/publish", {})).status, 200);
  const preferred = await fetch(
    base + "/api/questions/practice-1-fr-CA/audio",
    { headers: { Cookie: studentCookie } },
  );
  assert.equal(preferred.status, 200);
  assert.equal((await preferred.json()).id, asset.id);
  const playable = await fetch(base + file, {
    headers: { Cookie: studentCookie },
  });
  assert.equal(playable.status, 200);
  assert.equal(playable.headers.get("Content-Type"), "audio/wav");
  assert.equal((await playable.arrayBuffer()).byteLength, data.byteLength);
  assert.equal(
    (await post("/audio/" + asset.id + "/publish", { withdraw: true })).status,
    200,
  );
  assert.equal(
    (await fetch(base + file, { headers: { Cookie: studentCookie } })).status,
    404,
  );
});
