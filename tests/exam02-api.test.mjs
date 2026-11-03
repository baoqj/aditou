import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8798";
function client() {
  let cookie = "";
  return async (path, body) => {
    const r = await fetch(base + "/api" + path, {
      method: body === undefined ? "GET" : "POST",
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    if (r.headers.get("set-cookie"))
      cookie = r.headers.get("set-cookie").split(";")[0];
    const d = await r.json();
    assert.equal(r.status, 200, path + ": " + JSON.stringify(d));
    return d;
  };
}
test("Exam02 source grades/languages, private DTO and all automatic response types work", async () => {
  const admin = client(),
    student = client();
  await admin("/auth/login", {
    email: "admin@gmail.com",
    password: process.env.ADMIN_PASSWORD || "Admin1234",
  });
  await student("/auth/register", {
    email: `exam02-${Date.now()}@example.com`,
    password: "Testing12345",
    name: "Exam02",
  });
  const staff = (await admin("/questions")).questions,
    qs = (await student("/questions")).questions.filter((q) =>
      q.id.startsWith("exam02-"),
    );
  assert.equal(qs.length, 203);
  for (let grade = 1; grade <= 4; grade++) {
    assert.equal(
      qs.filter((q) => q.grade === grade).length,
      grade === 1 ? 50 : 51,
    );
    assert.equal(
      qs.filter((q) => q.grade === grade && q.locale === "en-CA").length,
      6,
    );
  }
  assert.ok(
    qs.every(
      (q) =>
        q.module.startsWith("skill.") &&
        !q.answer &&
        !q.script &&
        !q.teacher_notes,
    ),
  );
  assert.match(
    qs.find((q) => q.id === "exam02-g4-b1-fr-CA").prompt,
    /bibliothèque flottante/,
  );
  assert.ok(
    !qs.find((q) => q.id === "exam02-g2-d1-fr-CA").prompt.includes("école"),
  );
  for (const [question_id, answer] of [
    ["exam02-g1-a1-fr-CA", "🐱"],
    ["exam02-g2-c4-fr-CA", "Le chien dort."],
    ["exam02-g2-b3-fr-CA", '["des escargots","des insectes"]'],
    ["exam02-g3-j6-en-CA", '["She","has","two","brothers"]'],
    ["exam02-g4-g5-fr-CA", '["0,07","0,7","0,75"]'],
    ["exam02-g4-g6-fr-CA", "4,25"],
    ["exam02-g4-f1-fr-CA", "12075"],
  ]) {
    const a = await student("/attempts", {
      question_id,
      answer,
      context: "private",
      request_id: crypto.randomUUID(),
    });
    assert.equal(a.status, "correct", question_id);
  }
  const incorrect = await student("/attempts", {
    question_id: "exam02-g4-f4-fr-CA",
    answer: "3212",
    context: "private",
    request_id: crypto.randomUUID(),
  });
  assert.equal(incorrect.status, "incorrect");
  const writing = await student("/attempts", {
    question_id: "exam02-g4-e1-fr-CA",
    answer: "Un texte personnel.",
    context: "private",
    request_id: crypto.randomUUID(),
  });
  assert.equal(writing.status, "pending_manual");
  assert.ok(
    staff
      .find((q) => q.id === "exam02-g4-e1-fr-CA")
      .teacher_notes.includes("Original maximum points: 5"),
  );
  const run = await student("/runs", {
    mode: "exam",
    question_ids: ["exam02-g2-b3-fr-CA", "exam02-g2-f1-fr-CA"],
  });
  assert.equal(run.questions.length, 2);
  assert.ok(run.questions.every((q) => !q.reference));
});
