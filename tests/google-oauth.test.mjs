import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const transpile = (file) =>
  ts.transpileModule(readFileSync(new URL(file, import.meta.url), "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
const code =
  transpile("../worker/email-locale.ts") +
  "\n" +
  transpile("../worker/google-oauth.ts")
    .replace(/import .*email-locale.*\n/, "")
    .replace(/import .*authDestination.*\n/, "")
    .replace(
      /import .*sendWelcome.*\n/,
      "const sendWelcome = async () => {};\n",
    ) +
  "\n" +
  transpile("../src/routing.ts");
const { googleOAuth } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
const env = () => {
  const calls = [];
  return {
    calls,
    GOOGLE_CLIENT_ID: "test-client",
    GOOGLE_CLIENT_SECRET: "test-secret",
    DB: {
      prepare(sql) {
        return {
          bind(...args) {
            calls.push({ sql, args });
            return this;
          },
          async run() {
            return {};
          },
          async first() {
            return null;
          },
        };
      },
    },
  };
};
test("OAuth start uses canonical HTTPS, PKCE, browser binding and allows only public roles", async () => {
  const e = env();
  const r = await googleOAuth(
    new Request(
      "https://aditou.studyai.now/api/auth/google/start?role=admin&signup=1&grade=99",
    ),
    e,
  );
  assert.equal(r.status, 302);
  const u = new URL(r.headers.get("location"));
  assert.equal(u.origin, "https://accounts.google.com");
  assert.equal(
    u.searchParams.get("redirect_uri"),
    "https://aditou.studyai.now/api/auth/google/callback",
  );
  assert.equal(u.searchParams.get("code_challenge_method"), "S256");
  assert.ok(u.searchParams.get("code_challenge"));
  assert.match(r.headers.get("set-cookie"), /HttpOnly; Secure; SameSite=Lax/);
  const insert = e.calls.find((c) => c.sql.startsWith("INSERT"));
  assert.equal(insert.args[4], "student");
  assert.equal(insert.args[5], 4);
  assert.equal(insert.args[6], 1);
  assert.notEqual(insert.args[0], u.searchParams.get("state"));
});
test("Callback rejects missing or mismatched browser state before contacting Google", async () => {
  for (const cookie of ["", "aditou_oauth=wrong"]) {
    const e = env();
    const r = await googleOAuth(
      new Request(
        "https://aditou.studyai.now/api/auth/google/callback?state=bad&code=bad",
        { headers: { cookie } },
      ),
      e,
    );
    assert.match(r.headers.get("location"), /error=google_failed/);
    if (cookie)
      assert.match(e.calls[0].sql, /DELETE.*binding_hash=.*RETURNING/);
    else assert.equal(e.calls.length, 0);
  }
});
test("HTTP OAuth start upgrades to canonical HTTPS without writing state", async () => {
  const e = env();
  const r = await googleOAuth(
    new Request("http://aditou.studyai.now/api/auth/google/start"),
    e,
  );
  assert.equal(
    r.headers.get("location"),
    "https://aditou.studyai.now/api/auth/google/start",
  );
  assert.equal(e.calls.length, 0);
});
test("Google OAuth keeps the selected UI locale in the server-side state", async () => {
  for (const locale of ["es", "zh"]) {
    const e = env();
    await googleOAuth(
      new Request(
        "https://aditou.studyai.now/api/auth/google/start?locale=" + locale,
      ),
      e,
    );
    assert.equal(
      e.calls.find((c) => c.sql.startsWith("INSERT")).args[8],
      locale,
    );
  }
});
