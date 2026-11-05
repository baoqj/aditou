import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync, readdirSync } from "node:fs";
import { build } from "esbuild";
async function moduleAt(file) {
  const b = await build({
    entryPoints: [file],
    bundle: true,
    write: false,
    format: "esm",
    platform: "browser",
  });
  return import(
    "data:text/javascript;base64," +
      Buffer.from(b.outputFiles[0].text).toString("base64")
  );
}
const { analytics } = await moduleAt("worker/analytics.ts");
const { performance, unionActivity, unionMs, midnight, localDay, summarize } =
  await moduleAt("worker/analytics-metrics.ts");
function setup() {
  const db = new DatabaseSync(":memory:");
  for (const f of readdirSync("migrations")
    .filter(
      (f) =>
        f.endsWith(".sql") &&
        ![
          "0002_seed.sql",
          "0008_exam_content.sql",
          "0009_canonical_skills.sql",
          "0010_exam02_questions.sql",
        ].includes(f),
    )
    .sort()) {
    db.exec(readFileSync("migrations/" + f, "utf8"));
  }
  db.exec(
    "ALTER TABLE questions ADD COLUMN preparation TEXT NOT NULL DEFAULT '';ALTER TABLE questions ADD COLUMN audio_policy TEXT NOT NULL DEFAULT 'tts';",
  );
  const wrap = (sql, args = []) => ({
    bind(...a) {
      return wrap(sql, a);
    },
    async first() {
      return db.prepare(sql).get(...args) || null;
    },
    async all() {
      return { results: db.prepare(sql).all(...args) };
    },
    async run() {
      const r = db.prepare(sql).run(...args);
      return { meta: { changes: Number(r.changes) } };
    },
  });
  const env = { DB: { prepare: (sql) => wrap(sql) } };
  for (const [id, role] of [
    ["teacher", "teacher"],
    ["other", "teacher"],
    ["school", "admin"],
    ["school2", "admin"],
    ["student", "student"],
  ])
    db.prepare(
      "INSERT INTO accounts(id,email,name,role,password_hash,salt) VALUES(?,?,?,?,?,?)",
    ).run(id, id + "@example.com", id, role, "fixture", "fixture");
  db.exec(
    "INSERT INTO learners(id,account_id,alias,grade) VALUES('l1','student','Child A',1),('l2',NULL,'Child B',1);INSERT INTO classes VALUES('c1','Authorized',1,'fr-CA','teacher'),('c2','Other',1,'fr-CA','other');INSERT INTO enrollments VALUES('c1','l1'),('c1','l2');INSERT INTO organizations(id,name,owner_id) VALUES('o1','School','school'),('o2','School2','school2');INSERT INTO organization_class_grants(org_id,class_id,granted_by) VALUES('o1','c1','teacher');",
  );
  const q = {
    id: "q1",
    logical_id: "logic1",
    locale: "fr-CA",
    grade: 1,
    module: "skill.counting",
    title: "A question",
    prompt: "prompt",
    response_type: "numeric",
    answer: "42",
    script: "secret spoken text",
    teacher_notes: "private note",
    version: 1,
  };
  db.prepare(
    "INSERT INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,answer,status,source) VALUES(?,?,?,?,?,?,?,?,?,?,'published','test')",
  ).run(
    q.id,
    q.logical_id,
    1,
    q.locale,
    q.module,
    q.title,
    q.prompt,
    q.script,
    q.response_type,
    q.answer,
  );
  db.exec(
    "INSERT INTO assignments(id,class_id,teacher_id,title,due_at,question_ids) VALUES('a1','c1','teacher','Homework','2026-11-03T12:00:00Z','[\"q1\"]');INSERT INTO analytics_cohorts(kind,context_id,provenance) VALUES('assignment','a1','frozen');INSERT INTO analytics_targets VALUES('assignment','a1','l1','frozen'),('assignment','a1','l2','frozen');INSERT INTO assessment_runs(id,learner_id,mode,assignment_id,title,question_ids,snapshots,status,submitted_at) VALUES('r1','l1','homework','a1','Homework','[\"q1\"]','[]','submitted','2026-11-03 10:00:00');",
  );
  const attempt = (
    id,
    {
      context = "private",
      context_id = null,
      run_id = null,
      status = "correct",
      score = 2,
      learner_id = "l1",
      question = q,
      date = "2026-11-03 10:00:00",
    } = {},
  ) =>
    db
      .prepare(
        "INSERT INTO attempts(id,request_id,learner_id,question_id,question_snapshot,context,context_id,answer,status,score,run_id,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .run(
        id,
        id,
        learner_id,
        "q1",
        JSON.stringify(question),
        context,
        context_id,
        "raw answer secret",
        status,
        score,
        run_id,
        date,
      );
  const request = (query = "", body, route = "overview", method) =>
    new Request(
      "https://example.com/api/analytics/" +
        route +
        "?start=2026-11-01&end=2026-11-03&locale=fr-CA&grade=1" +
        query,
      {
        method: method || (body ? "POST" : "GET"),
        body: body ? JSON.stringify(body) : undefined,
      },
    );
  const call = (user, query = "", body, route = "overview", method) =>
    analytics(
      request(query, body, route, method),
      env,
      {
        id: user,
        role: user.startsWith("school")
          ? "admin"
          : user === "student"
            ? "student"
            : "teacher",
      },
      "/api/analytics/" + route,
    );
  return { db, env, q, attempt, call, request };
}
test("weighted objective accuracy, pending and manual scores remain separate; first versus repeat", () => {
  const rows = [
    {
      learner_id: "a",
      response_type: "numeric",
      status: "correct",
      score: 2,
      first: true,
    },
    {
      learner_id: "a",
      response_type: "numeric",
      status: "incorrect",
      score: 0,
      first: true,
    },
    {
      learner_id: "a",
      response_type: "drawing",
      status: "partial",
      score: 1,
      first: true,
    },
    {
      learner_id: "a",
      response_type: "text",
      status: "pending_manual",
      score: null,
      first: true,
    },
    {
      learner_id: "a",
      response_type: "numeric",
      status: "correct",
      score: 2,
      first: false,
    },
  ];
  const p = performance(rows);
  assert.deepEqual(p.accuracy, { numerator: 2, denominator: 3, percent: 66.7 });
  assert.equal(p.first.percent, 50);
  assert.equal(p.repeat.percent, 100);
  assert.equal(p.score.numerator, 5);
  assert.equal(p.score.denominator, 8);
  assert.equal(p.pending, 1);
  assert.equal(p.help_unknown, 5);
  const weighted = performance([
    ...Array.from({ length: 2 }, (_, i) => ({
      response_type: "numeric",
      status: i ? "incorrect" : "correct",
      score: i ? 0 : 2,
    })),
    ...Array.from({ length: 100 }, (_, i) => ({
      response_type: "numeric",
      status: i < 90 ? "correct" : "incorrect",
      score: i < 90 ? 2 : 0,
    })),
  ]);
  assert.equal(weighted.accuracy.numerator, 91);
  assert.equal(weighted.accuracy.denominator, 102);
});
test("cross-device activity union, type priority and cross-midnight split", () => {
  const start = Date.parse("2026-11-02T04:55Z"),
    end = start + 10 * 60000,
    rows = [
      {
        id: "a",
        learner_id: "l1",
        started_at: start,
        ended_at: end,
        kind: "reading",
        context: "private",
      },
      {
        id: "b",
        learner_id: "l1",
        started_at: start,
        ended_at: start + 5 * 60000,
        kind: "listening",
        context: "private",
      },
      {
        id: "c",
        learner_id: "l1",
        started_at: start + 2 * 60000,
        ended_at: start + 4 * 60000,
        kind: "interaction",
        context: "private",
      },
    ];
  const p = unionActivity(rows, start, end, "America/Toronto");
  assert.equal(
    p.reduce((s, r) => s + r.ms, 0),
    10 * 60000,
  );
  assert.equal(
    p.filter((r) => r.kind === "interaction").reduce((s, r) => s + r.ms, 0),
    2 * 60000,
  );
  assert.equal(new Set(p.map((r) => r.day)).size, 2);
  assert.equal(
    p.filter((r) => r.day === "2026-11-01").reduce((s, r) => s + r.ms, 0),
    5 * 60000,
  );
});
test("Toronto summer/winter transitions use actual day length; teaching intervals union correctly", () => {
  assert.equal(
    (midnight("2026-03-09", "America/Toronto") -
      midnight("2026-03-08", "America/Toronto")) /
      3600000,
    23,
  );
  assert.equal(
    (midnight("2026-11-02", "America/Toronto") -
      midnight("2026-11-01", "America/Toronto")) /
      3600000,
    25,
  );
  assert.equal(
    unionMs([
      { started_at: 10, ended_at: 50 },
      { started_at: 30, ended_at: 70 },
    ]),
    60,
  );
  const A = [
      { started_at: 0, ended_at: 45 },
      { started_at: 50, ended_at: 95 },
    ],
    B = [{ started_at: 0, ended_at: 20 }];
  assert.equal(unionMs(A) + unionMs(B), 110);
  assert.equal(unionMs([...A, B[0]]), 90);
});
test("teacher and institution scopes exclude private and other classes; exports omit raw answers and student identifiers", async () => {
  const s = setup();
  s.attempt("private");
  s.attempt("teaching", {
    context: "assignment",
    context_id: "a1",
    run_id: "r1",
  });
  const teacher = await (await s.call("teacher")).json();
  assert.equal(teacher.summary.submissions, 1);
  assert.equal(
    teacher.summary.repeats,
    1,
    "private earlier exposure prevents falsely calling classroom answer new",
  );
  assert.equal(teacher.summary.accuracy.numerator, 1);
  assert.equal(teacher.assignments[0].submitted, 1);
  assert.equal(teacher.assignments[0].waiting, 1);
  assert.equal(teacher.assignments[0].target, 2);
  assert.equal(teacher.assignments[0].not_started, 1);
  assert.equal(teacher.quality.time_status, "partial");
  const other = await (await s.call("other")).json();
  assert.equal(other.summary.submissions, 0);
  const school = await (
    await s.call("school", "&view=organization&org_id=o1")
  ).json();
  assert.equal(school.summary.submissions, 1);
  assert.equal(school.records.length, 0);
  assert.equal(school.assignments[0].learners.length, 0);
  assert.ok(!JSON.stringify(school).includes("Child A"));
  await assert.rejects(
    () => s.call("school2", "&view=organization&org_id=o1"),
    (e) => e.status === 403,
  );
  await assert.rejects(
    () => s.call("teacher", "&class_id=c2"),
    (e) => e.status === 403,
  );
  await assert.rejects(
    () => s.call("teacher", "&context=private"),
    (e) => e.status === 403,
  );
  const exp = await (
    await s.call("school", "&view=organization&org_id=o1", {}, "export")
  ).json();
  const str = JSON.stringify(exp);
  assert.ok(!str.includes("raw answer secret"));
  assert.ok(!str.includes("secret spoken text"));
  assert.ok(!str.includes("Child A"));
  assert.equal(exp.records.length, 0);
  assert.equal(exp.matrix.length, 0);
  s.db.close();
});
test("student analytics honors whole-homework grading release and never exposes answer keys", async () => {
  const s = setup();
  s.attempt("homework", {
    context: "assignment",
    context_id: "a1",
    run_id: "r1",
  });
  let d = await (await s.call("student")).json();
  assert.equal(d.summary.graded, 0);
  assert.equal(d.summary.unreleased, 1);
  assert.equal(d.summary.accuracy.denominator, 0);
  assert.equal(d.records[0].score, null);
  assert.ok(!JSON.stringify(d).includes("secret spoken text"));
  s.db.exec("UPDATE assessment_runs SET status='graded' WHERE id='r1'");
  d = await (await s.call("student")).json();
  assert.equal(d.summary.accuracy.numerator, 1);
  await assert.rejects(
    () => s.call("student", "&learner_id=l2"),
    (e) => e.status === 403,
  );
  s.db.close();
});
test("first submission is historical across versions and time windows, languages remain separate", async () => {
  const s = setup();
  s.attempt("first", {
    date: "2026-10-01 10:00:00",
    status: "incorrect",
    score: 0,
  });
  s.attempt("repeat", { question: { ...s.q, version: 2 } });
  s.attempt("english", { question: { ...s.q, locale: "en-CA" } });
  const d = await (await s.call("student")).json();
  assert.equal(d.summary.submissions, 1);
  assert.equal(d.summary.new_items, 0);
  assert.equal(d.summary.repeat.numerator, 1);
  s.db.close();
});
test("revocation immediately removes institution query/export access and teacher cannot share another teacher class", async () => {
  const s = setup();
  s.attempt("teaching", {
    context: "assignment",
    context_id: "a1",
    run_id: "r1",
  });
  await assert.rejects(
    () =>
      s.call(
        "other",
        "",
        { class_id: "c1", email: "school@example.com" },
        "grants",
      ),
    (e) => e.status === 403,
  );
  await s.call(
    "teacher",
    "",
    { class_id: "c1", email: "school@example.com" },
    "grants",
    "DELETE",
  );
  const d = await (
    await s.call("school", "&view=organization&org_id=o1")
  ).json();
  assert.equal(d.summary.submissions, 0);
  assert.equal(d.scope.classes.length, 0);
  s.db.close();
});
test("telemetry validates duration, ownership and deduplicates a retried interval", async () => {
  const s = setup();
  const end = Date.now(),
    b = {
      id: crypto.randomUUID(),
      question_id: "q1",
      context: "private",
      kind: "interaction",
      start: end - 10000,
      end,
    };
  assert.equal((await s.call("student", "", b, "intervals")).status, 200);
  await s.call("student", "", b, "intervals");
  assert.equal(
    s.db.prepare("SELECT COUNT(*) n FROM learning_intervals").get().n,
    1,
  );
  await assert.rejects(
    () =>
      s.call(
        "student",
        "",
        { ...b, id: crypto.randomUUID(), start: end - 40000 },
        "intervals",
      ),
    (e) => e.status === 400,
  );
  await assert.rejects(
    () => s.call("teacher", "", b, "intervals"),
    (e) => e.status === 403,
  );
  await assert.rejects(
    () =>
      s.call(
        "student",
        "",
        { ...b, context: "assignment", context_id: "other" },
        "intervals",
      ),
    (e) => e.status === 403,
  );
  s.db.close();
});
