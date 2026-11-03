import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import ts from "typescript";
const code = ts.transpileModule(
  readFileSync(new URL("../src/answers.ts", import.meta.url), "utf8"),
  {
    compilerOptions: {
      module: ts.ModuleKind.ES2022,
      target: ts.ScriptTarget.ES2022,
    },
  },
).outputText;
const { hasAnswer } = await import(
  "data:text/javascript;base64," + Buffer.from(code).toString("base64")
);
test("blank warnings distinguish zero answers from empty text or cleared selections", () => {
  for (const [type, value] of [
    ["numeric", ""],
    ["text", "   "],
    ["multiple", "[]"],
    ["multiple", "[ ]"],
    ["matching", "{}"],
    ["matching", '{"left":""}'],
  ])
    assert.equal(hasAnswer({ response_type: type }, value), false);
  for (const [type, value] of [
    ["numeric", "0"],
    ["text", "a response"],
    ["multiple", '["A"]'],
    ["matching", '{"left":"right"}'],
    ["drawing", "data:image/png;base64,abc"],
  ])
    assert.equal(hasAnswer({ response_type: type }, value), true);
});
