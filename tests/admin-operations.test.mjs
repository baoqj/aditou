import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { build } from "esbuild";
const bundled = await build({
  stdin: {
    contents:
      'export * from "./worker/system-settings";export * from "./worker/visitors";export * from "./worker/admin-feedback";',
    resolveDir: process.cwd(),
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
});
const {
  systemAdmin,
  systemSettings,
  trackVisit,
  visitorAdmin,
  visitorDay,
  adminFeedback,
} = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundled.outputFiles[0].text).toString("base64")
);
function setup() {
  const db = new DatabaseSync(":memory:");
  db.exec(`PRAGMA foreign_keys=ON;CREATE TABLE accounts(id TEXT PRIMARY KEY,name TEXT,email TEXT,self_registered INTEGER DEFAULT 0);
  CREATE TABLE audit_log(id TEXT PRIMARY KEY,actor_id TEXT,action TEXT,resource_id TEXT);
  CREATE TABLE school_suggestions(id TEXT PRIMARY KEY);CREATE TABLE school_reviews(id TEXT PRIMARY KEY);
  INSERT INTO accounts(id,name,email) VALUES('admin','Administrator','admin@example.invalid'),('user','Example user','user@example.invalid');`);
  db.exec(readFileSync("migrations/0016_feedback.sql", "utf8"));
  db.exec(readFileSync("migrations/0029_admin_dashboard.sql", "utf8"));
  const wrap = (sql, values = []) => ({
    bind(...args) {
      return wrap(sql, args);
    },
    async first(column) {
      const row = db.prepare(sql).get(...values);
      return column ? (row?.[column] ?? null) : (row ?? null);
    },
    async all() {
      return { results: db.prepare(sql).all(...values) };
    },
    async run() {
      return {
        meta: { changes: Number(db.prepare(sql).run(...values).changes) },
      };
    },
  });
  const env = {
    DB: {
      prepare: wrap,
      async batch(statements) {
        db.exec("BEGIN");
        try {
          const results = [];
          for (const statement of statements) {
            const result = await statement.all();
            results.push({
              ...result,
              meta: {
                changes: Number(db.prepare("SELECT changes() AS n").get().n),
              },
            });
          }
          db.exec("COMMIT");
          return results;
        } catch (error) {
          db.exec("ROLLBACK");
          throw error;
        }
      },
    },
  };
  return { db, env };
}
const req = (path, body) =>
  new Request("https://aditou.studyai.now" + path, {
    method: body === undefined ? "GET" : "POST",
    headers: {
      "content-type": "application/json",
      "CF-Connecting-IP": "192.0.2.12",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
test("system defaults, role enforcement, version conflicts and the atomic public registration gate", async () => {
  const { db, env } = setup();
  assert.equal((await systemSettings(env)).registrationOpen, true);
  assert.equal(
    (
      await systemAdmin(req("/api/admin/system"), env, {
        id: "user",
        role: "teacher",
      })
    ).status,
    403,
  );
  const body = {
    version: 0,
    registrationOpen: false,
    ttsModel: "@cf/myshell-ai/melotts",
    ttsVoice: "default",
  };
  assert.equal(
    (
      await systemAdmin(req("/api/admin/system", body), env, {
        id: "admin",
        role: "admin",
      })
    ).status,
    200,
  );
  assert.equal((await systemSettings(env)).ttsModel, "@cf/myshell-ai/melotts");
  assert.throws(
    () =>
      db.exec("INSERT INTO accounts(id,self_registered) VALUES('blocked',1)"),
    /registration_paused/,
  );
  db.exec("INSERT INTO accounts(id,self_registered) VALUES('managed',0)");
  assert.equal(
    (
      await systemAdmin(req("/api/admin/system", body), env, {
        id: "admin",
        role: "admin",
      })
    ).status,
    409,
  );
  assert.equal(db.prepare("SELECT COUNT(*) AS n FROM audit_log").get().n, 1);
  await systemAdmin(
    req("/api/admin/system", { ...body, version: 1, registrationOpen: true }),
    env,
    { id: "admin", role: "admin" },
  );
  db.exec("INSERT INTO accounts(id,self_registered) VALUES('new',1)");
  assert.equal((await systemSettings(env)).registrationOpen, true);
});
test("visits trust the server identity, reject cross-visit updates and keep foreground duration monotone", async () => {
  const { db, env } = setup();
  const visit = {
    id: crypto.randomUUID(),
    secret: crypto.randomUUID(),
    visitor: crypto.randomUUID(),
    path: "/school/ranking",
    durationMs: 0,
    account_id: "admin",
  };
  assert.equal(
    (await trackVisit(req("/api/visits", visit), env, null)).status,
    204,
  );
  assert.equal(
    db.prepare("SELECT account_id FROM visitor_pages").get().account_id,
    null,
  );
  db.prepare("UPDATE visitor_pages SET started_at=? WHERE id=?").run(
    Date.now() - 10000,
    visit.id,
  );
  assert.equal(
    (
      await trackVisit(
        req("/api/visits", { ...visit, durationMs: 5000 }),
        env,
        null,
      )
    ).status,
    204,
  );
  assert.equal(
    (
      await trackVisit(
        req("/api/visits", { ...visit, durationMs: 1 }),
        env,
        null,
      )
    ).status,
    204,
  );
  assert.equal(
    (
      await trackVisit(
        req("/api/visits", {
          ...visit,
          secret: crypto.randomUUID(),
          durationMs: 9999,
        }),
        env,
        null,
      )
    ).status,
    409,
  );
  const row = db.prepare("SELECT * FROM visitor_pages").get();
  assert.equal(row.duration_ms, 5000);
  assert.equal(row.ip, "192.0.2.12");
  assert.equal(
    (
      await trackVisit(
        req("/api/visits", { ...visit, path: "/login?token=private" }),
        env,
        null,
      )
    ).status,
    400,
  );
  assert.equal(
    (await visitorAdmin(req("/api/admin/visitors"), env, { role: "teacher" }))
      .status,
    403,
  );
  const result = await (
    await visitorAdmin(req("/api/admin/visitors"), env, { role: "admin" })
  ).json();
  assert.equal(result.entries.length, 1);
  assert.equal(result.entries[0].username, null);
  assert.equal(result.entries[0].path, "/school/ranking");
});
test("visitor charts use Toronto calendar days with complete day, week and month buckets", async () => {
  const { env } = setup();
  assert.equal(visitorDay(Date.UTC(2026, 10, 1, 3)), "2026-10-31");
  assert.equal(visitorDay(Date.UTC(2026, 10, 1, 7)), "2026-11-01");
  for (const [period, length] of [
    ["day", 30],
    ["week", 12],
    ["month", 12],
  ]) {
    const result = await (
      await visitorAdmin(
        req("/api/admin/visitors?view=chart&period=" + period),
        env,
        { role: "admin" },
      )
    ).json();
    assert.equal(result.points.length, length);
    assert.ok(result.points.every((point) => point.visits === 0));
    assert.equal(result.timezone, "America/Toronto");
  }
});
test("feedback categories retain original submissions and remain restricted to administrators", async () => {
  const { env, db } = setup();
  db.prepare(
    "INSERT INTO feedback_messages(id,sender,name,email,phone,message,status,created_at,category) VALUES(?,?,?,?,?,?,'accepted',?,?)",
  ).run(
    "contact",
    "fixture",
    "Guest",
    "guest@example.invalid",
    "",
    "Original contact",
    Date.now(),
    "contact",
  );
  db.prepare(
    "INSERT INTO feedback_messages(id,sender,name,email,phone,message,status,created_at,category) VALUES(?,?,?,?,?,?,'accepted',?,?)",
  ).run(
    "issue",
    "fixture",
    "Guest",
    "guest@example.invalid",
    "",
    "Original issue",
    Date.now(),
    "issue",
  );
  assert.equal(
    (await adminFeedback(req("/api/admin/feedback"), env, { role: "student" }))
      .status,
    403,
  );
  const contact = await (
    await adminFeedback(req("/api/admin/feedback?category=contact"), env, {
      role: "admin",
    })
  ).json();
  assert.equal(contact.counts.contact, 1);
  assert.equal(contact.counts.issue, 1);
  assert.equal(contact.entries[0].message, "Original contact");
  const issues = await (
    await adminFeedback(req("/api/admin/feedback?category=issue"), env, {
      role: "admin",
    })
  ).json();
  assert.equal(issues.entries[0].message, "Original issue");
});
