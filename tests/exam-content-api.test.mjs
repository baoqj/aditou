import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8787";
function client() {
  let cookie = "";
  return {
    async call(path, body, status = 200, method) {
      const r = await fetch(base + "/api" + path, {
        method: method || (body === undefined ? "GET" : "POST"),
        headers: { Cookie: cookie, "Content-Type": "application/json" },
        body: body === undefined ? undefined : JSON.stringify(body),
      });
      if (r.headers.get("set-cookie"))
        cookie = r.headers.get("set-cookie").split(";")[0];
      const d = await r.json();
      assert.equal(r.status, status, JSON.stringify(d));
      return d;
    },
    async upload(qid, body) {
      const r = await fetch(base + "/api/audio/upload?question=" + qid, {
        method: "POST",
        headers: { Cookie: cookie, "Content-Type": "audio/wav" },
        body,
      });
      assert.equal(r.status, 200);
      return r.json();
    },
  };
}
test("imported curriculum is published at the correct entry grade, preserves context and enforces human phoneme audio", async () => {
  const admin = client(),
    student = client();
  await admin.call("/auth/login", {
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  });
  await student.call("/auth/register", {
    email: `curriculum-${Date.now()}@example.com`,
    password: "Testing12345",
    name: "Curriculum",
    grade: 4,
  });
  const staff = (await admin.call("/questions")).questions,
    qs = (await student.call("/questions")).questions;
  for (let grade = 1; grade <= 4; grade++)
    for (const locale of ["en-CA", "fr-CA"]) {
      const imported = qs.filter(
        (q) =>
          q.id.startsWith("exam-") && q.grade === grade && q.locale === locale,
      );
      assert.equal(imported.length, 50);
      assert.equal(new Set(imported.map((q) => q.logical_id)).size, 50);
      assert.ok(
        imported.every(
          (q) =>
            q.status === "published" &&
            !q.answer &&
            !q.script &&
            !q.teacher_notes,
        ),
      );
    }
  const reading = qs.find((q) => q.id === "exam-g4-q09-en-CA-v2");
  assert.match(reading.prompt, /Inès counts/);
  assert.ok(!reading.reference);
  const listening = staff.find((q) => q.id === "exam-g4-q05-en-CA-v2");
  assert.match(listening.script, /On Monday/);
  assert.ok(
    !qs.find((q) => q.id === listening.id).prompt.includes("On Monday"),
  );
  const number = "exam-g4-q24-en-CA-v2",
    paper = await student.call("/runs", {
      mode: "exam",
      question_ids: [number],
    });
  assert.ok(!paper.questions[0].reference);
  await student.call(
    "/runs/" + paper.run.id,
    { revision: 0, question_id: number, answer: "4113" },
    200,
    "PUT",
  );
  const result = await student.call("/runs/" + paper.run.id + "/submit", {
    revision: 1,
  });
  assert.equal(result.summary.correct, 1);
  assert.equal(result.summary.score, 2);
  const phoneme = staff.find((q) => q.id === "exam-g1-q22-fr-CA-v2");
  const clone = await admin.call("/questions", {
    ...phoneme,
    id: undefined,
    title: "Phoneme QA",
    status: "published",
  });
  const original = (await admin.call("/questions")).questions.find(
    (q) => q.id === clone.id,
  );
  const { preparation, audio_policy, ...editable } = original;
  const edited = await admin.call("/questions", {
    ...editable,
    title: "Phoneme edited",
    status: "published",
  });
  const updated = (await admin.call("/questions")).questions.find(
    (q) => q.id === edited.id,
  );
  assert.equal(updated.preparation, preparation);
  assert.equal(updated.audio_policy, "teacher_only");
  await student.call("/questions/" + edited.id + "/audio", undefined, 409);
  const wav = new Uint8Array(16044),
    view = new DataView(wav.buffer),
    str = (at, s) => [...s].forEach((c, i) => (wav[at + i] = c.charCodeAt(0)));
  str(0, "RIFF");
  view.setUint32(4, 16036, true);
  str(8, "WAVEfmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, 8000, true);
  view.setUint32(28, 16000, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  str(36, "data");
  view.setUint32(40, 16000, true);
  const uploaded = await admin.upload(edited.id, wav);
  await admin.call("/audio/" + uploaded.id + "/publish", {});
  assert.equal(
    (await student.call("/questions/" + edited.id + "/audio")).id,
    uploaded.id,
  );
});
