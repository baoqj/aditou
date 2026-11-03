import { test } from "node:test";
import assert from "node:assert/strict";
import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { build } from "esbuild";
const bundle = await build({
  entryPoints: ["worker/index.ts"],
  bundle: true,
  write: false,
  format: "esm",
  platform: "browser",
});
const { default: worker } = await import(
  "data:text/javascript;base64," +
    Buffer.from(bundle.outputFiles[0].text).toString("base64")
);
const hash = async (value) =>
  Buffer.from(
    await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
  ).toString("hex");
async function setup() {
  const db = new DatabaseSync(":memory:");
  for (const f of [
    "0001_schema.sql",
    "0005_gateway_audio.sql",
    "0006_studio_tts_settings.sql",
    "0008_exam_content.sql",
    "0011_google_oauth.sql",
    "0012_email_auth.sql",
    "0013_signup_password_setup.sql",
    "0014_email_languages.sql",
    "0015_admin_directory.sql",
  ])
    db.exec(readFileSync("migrations/" + f, "utf8"));
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
  const env = {
    DB: { prepare: (sql) => wrap(sql) },
    ASSETS: { fetch: () => new Response("asset") },
  };
  for (const [id, role] of [
    ["a", "admin"],
    ["t1", "teacher"],
    ["t2", "teacher"],
    ["s", "student"],
  ]) {
    db.prepare(
      "INSERT INTO accounts(id,email,name,role,password_hash,salt,self_registered) VALUES(?,?,?,?,?,?,1)",
    ).run(id, id + "@example.com", id, role, "not-a-password", "salt");
    db.prepare("INSERT INTO auth_sessions VALUES(?,?,?)").run(
      await hash(id),
      id,
      Date.now() + 999999,
    );
  }
  const call = (id, path, body, locale) =>
    worker.fetch(
      new Request("https://aditou.studyai.now/api" + path, {
        method: body ? "POST" : "GET",
        headers: {
          Cookie: "entryexam_session=" + id,
          "Content-Type": "application/json",
          Origin: "https://aditou.studyai.now",
          ...(locale ? { "X-Aditou-UI-Language": locale } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      }),
      env,
      { waitUntil() {} },
    );
  return { db, call };
}
test("Organization creation is teacher-only, owner-bound and not visible to another teacher", async () => {
  const { call } = await setup();
  assert.equal(
    (await call("s", "/organization", { name: "Wrong" })).status,
    403,
  );
  let r = await call("t1", "/organization", {
    name: "My School",
    owner_id: "t2",
  });
  assert.equal(r.status, 200);
  const org = (await r.json()).organization;
  assert.equal(org.name, "My School");
  assert.equal(
    (await (await call("t2", "/organization")).json()).organization,
    null,
  );
  r = await call("t1", "/organization", { name: "Duplicate" });
  assert.equal((await r.json()).organization.id, org.id);
});
test("Self-registered teachers cannot inspect private drafts or change another teachers/platform questions", async () => {
  const { db, call } = await setup();
  for (const [id, owner, status] of [
    ["platform", null, "published"],
    ["private", "t2", "draft"],
    ["own", "t1", "draft"],
  ])
    db.prepare(
      "INSERT INTO questions(id,logical_id,grade,locale,module,title,prompt,script,response_type,source,status,owner_id) VALUES(?,?,1,?,?,?,?,?,?,?,?,?)",
    ).run(
      id,
      id,
      "fr-CA",
      "counting",
      id,
      "Prompt",
      "Script",
      "numeric",
      "test",
      status,
      owner,
    );
  const r = await call("t1", "/questions");
  assert.equal(r.status, 200);
  assert.deepEqual((await r.json()).questions.map((q) => q.id).sort(), [
    "own",
    "platform",
  ]);
  assert.equal(
    (await call("t1", "/questions/platform/retire", {})).status,
    403,
  );
  assert.equal((await call("t1", "/questions/private/retire", {})).status, 403);
  assert.equal((await call("t1", "/questions/own/retire", {})).status, 200);
  assert.equal((await call("t1", "/audio")).status, 200);
  const created = await call("t1", "/questions", {
    title: "New draft",
    prompt: "Prompt",
    script: "Script",
    response_type: "numeric",
    locale: "fr-CA",
    grade: 1,
    module: "counting",
  });
  assert.equal(created.status, 200);
  const createdId = (await created.json()).id;
  assert.equal(
    db.prepare("SELECT owner_id FROM questions WHERE id=?").get(createdId)
      .owner_id,
    "t1",
  );
});

test("Language preference is scoped to the signed-in account", async () => {
  const { db, call } = await setup();
  for (const locale of ["es", "zh"]) {
    assert.equal((await call("t1", "/auth/language", {}, locale)).status, 204);
    assert.equal(
      db.prepare("SELECT preferred_locale FROM accounts WHERE id=?").get("t1")
        .preferred_locale,
      locale,
    );
    assert.equal(
      db.prepare("SELECT preferred_locale FROM accounts WHERE id=?").get("t2")
        .preferred_locale,
      "fr",
    );
  }
  assert.equal((await call("unknown", "/auth/language", {}, "es")).status, 204);
});

test("Admin directories enforce permissions, filter and paginate, update names and suspend sessions", async () => {
 const {db,call}=await setup();
 for(const actor of ['t1','s']) {assert.equal((await call(actor,'/admin/users')).status,403);assert.equal((await call(actor,'/admin/organizations')).status,403);assert.equal((await call(actor,'/admin/users/t2',{disabled:true})).status,403);}
 db.prepare("INSERT INTO organizations(id,name,owner_id) VALUES('o1','Academy','t1')").run();
 let result=await (await call('a','/admin/users?filter=teacher&q=t2')).json();assert.equal(result.total,1);assert.equal(result.items[0].id,'t2');assert.equal(result.items[0].password_hash,undefined);assert.equal(result.items[0].salt,undefined);
 result=await (await call('a','/admin/organizations?q=Academy&filter=t1')).json();assert.equal(result.total,1);assert.equal(result.items[0].owner_email,'t1@example.com');
 assert.equal((await call('a','/admin/organizations/o1',{name:'New Academy'})).status,200);assert.equal(db.prepare("SELECT name FROM organizations WHERE id='o1'").get().name,'New Academy');
 assert.equal((await call('a','/admin/users/t2',{name:'New name'})).status,200);
 assert.equal((await call('a','/admin/users/a',{disabled:true})).status,400);
 assert.equal((await call('a','/admin/users/missing',{name:'Missing'})).status,404);
 assert.equal((await call('a','/admin/users/t2',{disabled:true})).status,200);
 assert.equal(db.prepare("SELECT COUNT(*) n FROM auth_sessions WHERE account_id='t2'").get().n,0);
 assert.equal((await call('t2','/auth/me')).status,401);
 result=await (await call('a','/admin/users?status=disabled')).json();assert.equal(result.total,1);
 assert.equal((await call('a','/admin/users/t2',{disabled:false})).status,200);
 for(let i=0;i<30;i++)db.prepare("INSERT INTO accounts(id,email,name,role,password_hash,salt) VALUES(?,?,?,'student','','')").run('p'+i,'p'+i+'@example.com','Paged '+i);
 result=await (await call('a','/admin/users?filter=student&page=1')).json();assert.equal(result.total,31);assert.equal(result.items.length,25);
 const page2=await (await call('a','/admin/users?filter=student&page=2')).json();assert.equal(page2.items.length,6);assert.ok(page2.items.every(x=>!result.items.some(y=>x.id===y.id)));
});
