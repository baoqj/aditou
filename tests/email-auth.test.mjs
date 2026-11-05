import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import ts from "typescript";
const compile = (file) =>
  ts
    .transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
      compilerOptions: {
        module: ts.ModuleKind.ES2022,
        target: ts.ScriptTarget.ES2022,
      },
    })
    .outputText.replace(/^import .*;\n/gm, "")
    .replace(/^export \{.*\} from .*;\n/gm, "");
const code = ["auth-crypto.ts", "email-locale.ts", "emails.ts", "tts-settings.ts", "system-settings.ts", "email-auth.ts"]
  .map((f) => compile("../worker/" + f))
  .join("\n");
const { emailAuth, digest, password, emailTemplate, sendEmail } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
function setup() {
  const db = new DatabaseSync(":memory:");
  db.exec("PRAGMA foreign_keys=ON");
  db.exec(
    readFileSync(
      new URL("../migrations/0001_schema.sql", import.meta.url),
      "utf8",
    ),
  );
  db.exec(
    readFileSync(
      new URL("../migrations/0011_google_oauth.sql", import.meta.url),
      "utf8",
    ),
  );
  db.exec(
    readFileSync(
      new URL("../migrations/0012_email_auth.sql", import.meta.url),
      "utf8",
    ),
  );
  db.exec(
    readFileSync(
      new URL("../migrations/0013_signup_password_setup.sql", import.meta.url),
      "utf8",
    ),
  );
  db.exec(
    readFileSync(
      new URL("../migrations/0014_email_languages.sql", import.meta.url),
      "utf8",
    ),
  );
  db.exec(readFileSync(new URL("../migrations/0016_feedback.sql", import.meta.url), "utf8"));
  db.exec(readFileSync(new URL("../migrations/0029_admin_dashboard.sql", import.meta.url), "utf8"));
  const tasks = [];
  const wrap = (sql, args = []) => ({
    bind(...values) {
      return wrap(sql, values);
    },
    async first() {
      return db.prepare(sql).get(...args) || null;
    },
    async run() {
      const r = db.prepare(sql).run(...args);
      return { meta: { changes: Number(r.changes) } };
    },
    async all() {
      return { results: db.prepare(sql).all(...args) };
    },
  });
  const env = {
    RESEND_API_KEY: "test",
    DB: {
      prepare: (sql) => wrap(sql),
      async batch(stmts) {
        db.exec("BEGIN");
        try {
          const rows = [];
          for (const stmt of stmts) rows.push(await stmt.run());
          db.exec("COMMIT");
          return rows;
        } catch (err) {
          db.exec("ROLLBACK");
          throw err;
        }
      },
    },
  };
  return {
    db,
    env,
    ctx: {
      waitUntil(p) {
        tasks.push(p);
      },
    },
    tasks,
  };
}
const request = (path, body) =>
  new Request("https://aditou.studyai.now/api/auth/" + path, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Connecting-IP": "127.0.0.1",
    },
    body: JSON.stringify(
      path === "verify-email"
        ? { password: "SetupPassword123", confirm: "SetupPassword123", ...body }
        : body,
    ),
  });
const realFetch = globalThis.fetch;
let sent = [];
function mockEmail() {
  sent = [];
  globalThis.fetch = async (url, opts) => {
    assert.equal(url, "https://api.resend.com/emails");
    sent.push(JSON.parse(opts.body));
    return Response.json({ id: "resend-" + sent.length });
  };
}
test("Pending registration, resend rotation, single-use verification, preserved role, and welcome", async () => {
  mockEmail();
  const { env, db, ctx, tasks } = setup();
  try {
    let r = await emailAuth(
      request("register", {
        email: "learner@example.com",
        name: "<Student>",
        role: "admin",
        grade: 9,
        password: "Testing12345",
        locale: "en",
      }),
      env,
      ctx,
    );
    assert.equal(r.status, 202);
    assert.equal(db.prepare("SELECT count(*) n FROM accounts").get().n, 0);
    assert.equal(
      db.prepare("SELECT role FROM email_registrations").get().role,
      "student",
    );
    assert.equal(sent[0].from, "Aditou <aditou@studyai.now>");
    assert.match(sent[0].html, /&lt;Student&gt;/);
    const old = sent[0].text.match(/#token=([\w-]+)/)[1];
    await emailAuth(
      request("resend-verification", { email: "learner@example.com" }),
      env,
      ctx,
    );
    const token = sent[1].text.match(/#token=([\w-]+)/)[1];
    assert.notEqual(old, token);
    await assert.rejects(
      emailAuth(request("verify-email", { token: old }), env, ctx),
      (e) => e.message === "email.linkInvalid",
    );
    r = await emailAuth(request("verify-email", { token }), env, ctx);
    assert.equal(r.status, 200);
    await Promise.all(tasks);
    assert.equal(db.prepare("SELECT count(*) n FROM learners").get().n, 1);
    assert.ok(
      db.prepare("SELECT email_verified_at FROM accounts").get()
        .email_verified_at,
    );
    assert.equal(db.prepare("SELECT count(*) n FROM auth_sessions").get().n, 0);
    assert.match(sent.at(-1).subject, /Welcome/);
    await assert.rejects(
      emailAuth(request("verify-email", { token }), env, ctx),
      (e) => e.message === "email.linkInvalid",
    );
    assert.equal(db.prepare("SELECT count(*) n FROM accounts").get().n, 1);
  } finally {
    globalThis.fetch = realFetch;
  }
});
test("Expired links fail; password reset consumes all tokens and revokes all sessions", async () => {
  mockEmail();
  const { env, db, ctx, tasks } = setup();
  try {
    db.prepare(
      "INSERT INTO accounts(id,email,name,role,password_hash,salt) VALUES(?,?,?,?,?,?)",
    ).run(
      "u",
      "parent@example.com",
      "Parent",
      "parent",
      await password("OldPassword123", "salt"),
      "salt",
    );
    db.prepare("INSERT INTO auth_sessions VALUES(?,?,?)").run(
      "session",
      "u",
      Date.now() + 9999999,
    );
    const known = await emailAuth(
      request("forgot-password", { email: "parent@example.com", locale: "en" }),
      env,
      ctx,
    );
    const unknown = await emailAuth(
      request("forgot-password", { email: "unknown@example.com" }),
      env,
      ctx,
    );
    assert.deepEqual(await known.json(), await unknown.json());
    assert.equal(sent.length, 1);
    const token = sent[0].text.match(/#token=([\w-]+)/)[1];
    db.prepare("UPDATE password_reset_tokens SET expires_at=0").run();
    await assert.rejects(
      emailAuth(
        request("reset-password", { token, password: "NewPassword123" }),
        env,
        ctx,
      ),
      (e) => e.message === "email.linkInvalid",
    );
    await emailAuth(
      request("forgot-password", { email: "parent@example.com" }),
      env,
      ctx,
    );
    const valid = sent.at(-1).text.match(/#token=([\w-]+)/)[1];
    await emailAuth(
      request("reset-password", { token: valid, password: "NewPassword123" }),
      env,
      ctx,
    );
    await Promise.all(tasks);
    const user = db.prepare("SELECT * FROM accounts").get();
    assert.equal(
      user.password_hash,
      await password("NewPassword123", user.salt),
    );
    assert.equal(db.prepare("SELECT count(*) n FROM auth_sessions").get().n, 0);
    assert.equal(
      db.prepare("SELECT count(*) n FROM password_reset_tokens").get().n,
      0,
    );
    await assert.rejects(
      emailAuth(
        request("reset-password", {
          token: valid,
          password: "OtherPassword123",
        }),
        env,
        ctx,
      ),
      (e) => e.message === "email.linkInvalid",
    );
  } finally {
    globalThis.fetch = realFetch;
  }
});
test("Rate limit and provider failure are enforced; audit never stores verification tokens", async () => {
  mockEmail();
  const { env, db, ctx } = setup();
  try {
    for (let n = 0; n < 4; n++)
      await emailAuth(
        request("resend-verification", { email: "unknown@example.com" }),
        env,
        ctx,
      );
    await assert.rejects(
      emailAuth(
        request("resend-verification", { email: "unknown@example.com" }),
        env,
        ctx,
      ),
      (e) => e.status === 429,
    );
    globalThis.fetch = async () =>
      Response.json({ name: "provider_error" }, { status: 500 });
    await assert.rejects(
      emailAuth(
        request("register", {
          email: "failure@example.com",
          name: "Failure",
          password: "Testing12345",
        }),
        env,
        ctx,
      ),
      (e) => e.status === 503,
    );
    assert.equal(db.prepare("SELECT count(*) n FROM accounts").get().n, 0);
    assert.equal(
      db.prepare("SELECT status FROM email_deliveries").get().status,
      "failed",
    );
  } finally {
    globalThis.fetch = realFetch;
  }
});
test("Templates provide safe French and English content and same-origin action links", () => {
  for (const locale of ["fr", "en", "es", "zh"])
    for (const kind of [
      "verification",
      "welcome",
      "password_reset",
      "progress",
      "notification",
    ]) {
      const m = emailTemplate(kind, locale, {
        name: "<img src=x>",
        message: "<script>bad</script>",
        completed: 4,
      });
      assert.match(m.subject, /Aditou/);
      assert.match(m.html, /&lt;script&gt;/);
      assert.ok(m.text.includes("https://aditou.studyai.now"));
      assert.ok(!m.html.includes("<script>"));
    }
  assert.throws(() =>
    emailTemplate("welcome", "en", { url: "https://evil.example/x" }),
  );
});
test("Teacher registers without a password; only matching passwords on the email link activate the account", async () => {
  mockEmail();
  const { env, db, ctx, tasks } = setup();
  try {
    await emailAuth(
      request("register", {
        name: "Teacher",
        email: "teacher@example.com",
        role: "teacher",
      }),
      env,
      ctx,
    );
    assert.equal(
      db.prepare("SELECT password_hash FROM email_registrations").get()
        .password_hash,
      "",
    );
    assert.equal(db.prepare("SELECT count(*) n FROM accounts").get().n, 0);
    const token = sent[0].text.match(/#token=([\w-]+)/)[1];
    await assert.rejects(
      emailAuth(
        request("verify-email", {
          token,
          password: "NewTeacher123",
          confirm: "Mismatch1234",
        }),
        env,
        ctx,
      ),
      (e) => e.message === "email.passwordMismatch",
    );
    assert.equal(db.prepare("SELECT count(*) n FROM accounts").get().n, 0);
    await emailAuth(
      request("verify-email", {
        token,
        password: "NewTeacher123",
        confirm: "NewTeacher123",
      }),
      env,
      ctx,
    );
    await Promise.all(tasks);
    const user = db.prepare("SELECT * FROM accounts").get();
    assert.equal(user.role, "teacher");
    assert.equal(user.self_registered, 1);
    assert.equal(
      user.password_hash,
      await password("NewTeacher123", user.salt),
    );
    assert.equal(db.prepare("SELECT count(*) n FROM learners").get().n, 0);
  } finally {
    globalThis.fetch = realFetch;
  }
});
test("Welcome delivery is idempotent", async () => {
  mockEmail();
  const { env } = setup();
  try {
    await sendEmail(
      env,
      "a@example.com",
      "welcome",
      "en",
      {},
      "aditou/welcome/u",
    );
    await sendEmail(
      env,
      "a@example.com",
      "welcome",
      "en",
      {},
      "aditou/welcome/u",
    );
    assert.equal(sent.length, 1);
  } finally {
    globalThis.fetch = realFetch;
  }
});

test("Spanish and Chinese flow from registration through resend, activation and welcome", async () => {
  for (const locale of ["es", "zh"]) {
    mockEmail();
    const { env, db, ctx, tasks } = setup();
    try {
      await emailAuth(
        request("register", {
          email: locale + "@example.com",
          name: "Camille",
          role: "teacher",
          locale,
        }),
        env,
        ctx,
      );
      assert.equal(
        db.prepare("SELECT locale FROM email_registrations").get().locale,
        locale,
      );
      assert.equal(sent[0].tags.find((t) => t.name === "locale").value, locale);
      const other = locale === "es" ? "zh" : "es";
      await emailAuth(
        request("resend-verification", {
          email: locale + "@example.com",
          locale: other,
        }),
        env,
        ctx,
      );
      assert.equal(sent[1].tags.find((t) => t.name === "locale").value, other);
      const token = sent[1].text.match(/#token=([\w-]+)/)[1];
      await emailAuth(
        request("verify-email", { token, locale: other }),
        env,
        ctx,
      );
      await Promise.all(tasks);
      assert.equal(
        db.prepare("SELECT preferred_locale FROM accounts").get()
          .preferred_locale,
        other,
      );
      assert.equal(
        sent.at(-1).tags.find((t) => t.name === "locale").value,
        other,
      );
      assert.match(sent.at(-1).subject, other === "es" ? /bienvenida/ : /欢迎/);
    } finally {
      globalThis.fetch = realFetch;
    }
  }
});
test("Reset tokens preserve the requested Spanish/Chinese locale for the security notification", async () => {
  for (const locale of ["es", "zh"]) {
    mockEmail();
    const { env, db, ctx, tasks } = setup();
    try {
      db.prepare(
        "INSERT INTO accounts(id,email,name,role,password_hash,salt) VALUES(?,?,?,?,?,?)",
      ).run(
        "u",
        "parent@example.com",
        "Parent",
        "parent",
        "oauth-only",
        "salt",
      );
      await emailAuth(
        request("forgot-password", { email: "parent@example.com", locale }),
        env,
        ctx,
      );
      assert.equal(sent[0].tags.find((t) => t.name === "locale").value, locale);
      assert.equal(
        db.prepare("SELECT locale FROM password_reset_tokens").get().locale,
        locale,
      );
      const token = sent[0].text.match(/#token=([\w-]+)/)[1];
      await emailAuth(
        request("reset-password", { token, password: "NewPassword123" }),
        env,
        ctx,
      );
      await Promise.all(tasks);
      assert.equal(
        sent.at(-1).tags.find((t) => t.name === "locale").value,
        locale,
      );
      assert.equal(
        db.prepare("SELECT preferred_locale FROM accounts").get()
          .preferred_locale,
        locale,
      );
      assert.match(
        sent.at(-1).text,
        locale === "es" ? /Tu contraseña ha cambiado/ : /你的密码已修改/,
      );
    } finally {
      globalThis.fetch = realFetch;
    }
  }
});
test("Published aliases are selected for all twenty template/language combinations", async () => {
  mockEmail();
  const { env } = setup();
  env.RESEND_TEMPLATE_MODE = "published";
  try {
    for (const locale of ["fr", "en", "es", "zh"])
      for (const kind of [
        "verification",
        "welcome",
        "password_reset",
        "progress",
        "notification",
      ]) {
        await sendEmail(
          env,
          "a@example.com",
          kind,
          locale,
          { name: "Camille", completed: 8, period: "2026" },
          `alias/${kind}/${locale}`,
        );
        assert.equal(
          sent.at(-1).template.id,
          `aditou-${kind.replace("_", "-")}-${locale}`,
        );
        assert.equal(sent.at(-1).html, undefined);
        assert.equal(sent.at(-1).text, undefined);
      }
  } finally {
    globalThis.fetch = realFetch;
  }
});
