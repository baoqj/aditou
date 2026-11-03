import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const en = JSON.parse(
    readFileSync(new URL("../src/locales/en.json", import.meta.url), "utf8"),
  ),
  fr = JSON.parse(
    readFileSync(new URL("../src/locales/fr.json", import.meta.url), "utf8"),
  );
test("All marketing/header interface strings and generated resource keys have English and French translations", () => {
  const missing = [];
  for (const name of [
    "MarketingPage",
    "PublicHeader",
    "LanguageSwitcher",
    "AccountMenu",
  ]) {
    const file = new URL("../src/components/" + name + ".tsx", import.meta.url);
    const code = readFileSync(file, "utf8"),
      source = ts.createSourceFile(
        name + ".tsx",
        code,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
    const allowed = new Set(["Entry Exam", "Français", "English", "Español", "中文"]);
    function visit(n) {
      if (
        ts.isJsxText(n) &&
        /[A-Za-zÀ-ÿ]/.test(n.text) &&
        !allowed.has(n.text.trim())
      )
        missing.push(n.text.trim());
      if (
        ts.isCallExpression(n) &&
        n.expression.getText(source) === "t" &&
        n.arguments[0] &&
        ts.isStringLiteral(n.arguments[0])
      ) {
        const key = n.arguments[0].text;
        if (!fr[key] || !en[key]) missing.push(key);
      }
      ts.forEachChild(n, visit);
    }
    visit(source);
  }
  for (const role of ["school", "teacher", "student", "parent"])
    for (const suffix of [
      "tag",
      "title",
      "description",
      "label1",
      "value1",
      "label2",
      "value2",
      "action",
    ]) {
      const key = "marketing.portal." + role + "." + suffix;
      if (!fr[key] || !en[key]) missing.push(key);
    }
  for (const step of ["class", "home", "progress"])
    for (const suffix of [
      "tag",
      "title",
      "description",
      "point1",
      "point2",
      "point3",
      "foot",
    ]) {
      const key = "marketing.step." + step + "." + suffix;
      if (!fr[key] || !en[key]) missing.push(key);
    }
  assert.deepEqual(missing, []);
});
const code = ts.transpileModule(
  readFileSync(new URL("../src/routing.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { authDestination } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
test("Login chooses role workspace, preserves permitted deep links and rejects external or cross-role redirects", () => {
  const origin = "https://entryexam.polluxbao.workers.dev";
  for (const role of ["admin", "teacher"]) {
    assert.equal(authDestination(role, null, origin), "/org/main/manage/bank");
    assert.equal(
      authDestination(role, "/org/main/manage/studio", origin),
      "/org/main/manage/studio",
    );
    assert.equal(
      authDestination(role, "/learn", origin),
      "/org/main/manage/bank",
    );
  }
  assert.equal(authDestination("student", null, origin), "/learn");
  assert.equal(authDestination("parent", null, origin), "/family");
  assert.equal(
    authDestination("student", "/learn/practice?grade=2#practice", origin),
    "/learn/practice?grade=2#practice",
  );
  for (const next of [
    "https://example.com",
    "//example.com",
    "/\\example.com",
    "/login",
    "/signup",
    "/org/main/manage/studio",
  ])
    assert.equal(authDestination("student", next, origin), "/learn");
  assert.equal(authDestination("parent", "/family", origin), "/family");
});
