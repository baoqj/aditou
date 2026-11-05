import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import ts from "typescript";
const fr = JSON.parse(
  readFileSync(new URL("../src/locales/fr.json", import.meta.url), "utf8"),
);
const en = JSON.parse(
  readFileSync(new URL("../src/locales/en.json", import.meta.url), "utf8"),
);
test("All four UI languages contain every key, plural and interpolation parameter", () => {
  const params = (v) =>
    [...v.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();
  for (const lang of ["en", "es", "zh"]) {
    const resources = JSON.parse(
      readFileSync(
        new URL("../src/locales/" + lang + ".json", import.meta.url),
        "utf8",
      ),
    );
    assert.deepEqual(Object.keys(resources).sort(), Object.keys(fr).sort());
    for (const [key, value] of Object.entries(fr)) {
      assert.ok(resources[key]?.trim(), lang + ": " + key);
      assert.deepEqual(
        params(resources[key]),
        params(value),
        lang + ": " + key,
      );
    }
  }
});
test("Every hardcoded UI text and accessible label is translated, except names and symbols", () => {
  const files = [
    "main.tsx",
    ...readdirSync(new URL("../src/components", import.meta.url))
      .filter((f) => f.endsWith(".tsx"))
      .map((f) => "components/" + f),
  ];
  const code = files
    .map((file) =>
      readFileSync(new URL("../src/" + file, import.meta.url), "utf8"),
    )
    .join("\n");
  const source = ts.createSourceFile(
    "main.tsx",
    code,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const allowed = new Set([
    "Français",
    "English",
    "Español",
    "简体中文",
    "中文",
    "FR",
    "EN",
    "ES",
    "Atelier",
    "Bilingue",
    "Aa",
    "123",
    "1 2 3",
    "· v",
    // Fixed unit, file format and brand.
    "km",
    "CSV",
    "Aditou ·",
  ]);
  const failures = [];
  function walk(node) {
    if (ts.isJsxText(node)) {
      const value = node.text.replace(/\s+/g, " ").trim();
      if (value && /[A-Za-zÀ-ÿ]/.test(value) && !allowed.has(value))
        failures.push(value);
    }
    if (
      ts.isJsxAttribute(node) &&
      node.initializer &&
      ts.isStringLiteral(node.initializer) &&
      [
        "title",
        "aria-label",
        "placeholder",
        "alt",
        "label",
        "subtitle",
        "eyebrow",
      ].includes(node.name.getText(source)) &&
      /[A-Za-zÀ-ÿ]/.test(node.initializer.text) &&
      !(node.name.getText(source) === "placeholder" &&
        ["H2X 1Y4", "https://"].includes(node.initializer.text))
    )
      failures.push(node.initializer.text);
    if (
      ts.isCallExpression(node) &&
      node.expression.getText(source) === "t" &&
      node.arguments[0] &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const key = node.arguments[0].text;
      if (!Object.hasOwn(fr, key) && !Object.hasOwn(fr, key + "_one"))
        failures.push("Missing resource: " + key);
    }
    ts.forEachChild(node, walk);
  }
  walk(source);
  assert.deepEqual(failures, []);
});
test("Every API error has translation keys across the interface languages", () => {
  const code = ["index.ts", "assessments.ts"]
    .map((file) =>
      readFileSync(new URL("../worker/" + file, import.meta.url), "utf8"),
    )
    .join("\n");
  const source = ts.createSourceFile(
    "worker.ts",
    code,
    ts.ScriptTarget.Latest,
    true,
  );
  const missing = [];
  function walk(n) {
    if (
      ts.isCallExpression(n) &&
      n.expression.getText(source) === "fail" &&
      n.arguments[0] &&
      ts.isStringLiteral(n.arguments[0])
    ) {
      const key = n.arguments[0].text;
      if (!fr[key] || !en[key]) missing.push(key);
    }
    ts.forEachChild(n, walk);
  }
  walk(source);
  assert.deepEqual(missing, []);
});
