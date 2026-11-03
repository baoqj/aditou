import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
const read = (p) =>
  JSON.parse(readFileSync(new URL("../" + p, import.meta.url), "utf8"));
const skills = read("src/data/skills.json"),
  assignments = read("src/data/question-skills.json");
test("skills have unique stable IDs and short complete bilingual labels without question numbers", () => {
  assert.equal(new Set(skills.map((s) => s.id)).size, skills.length);
  for (const locale of ["en", "fr"]) {
    const resources = read("src/locales/" + locale + ".json");
    assert.equal(new Set(skills.map((s) => s[locale])).size, skills.length);
    for (const s of skills) {
      assert.equal(resources[s.id], s[locale]);
      assert.ok(s[locale].length <= 50);
      assert.doesNotMatch(s[locale], /\d|Q\d/);
    }
    assert.ok(!resources["language.en-CA"].includes("Canada"));
    assert.ok(!resources["language.fr-CA"].includes("Canada"));
  }
});
test("all 200 source tasks and 8 starter tasks have a reviewed language-independent primary skill", () => {
  const valid = new Set(skills.map((s) => s.id));
  assert.equal(Object.keys(assignments).length, 208);
  for (let grade = 1; grade <= 4; grade++)
    for (let n = 1; n <= 50; n++)
      assert.ok(
        valid.has(assignments[`g${grade}-q${String(n).padStart(2, "0")}`]),
      );
  for (let n = 1; n <= 8; n++)
    assert.ok(valid.has(assignments["practice-" + n]));
  for (const key of ["g1-q38", "g2-q06", "g3-q05", "g4-q05"])
    assert.equal(assignments[key], "skill.listening_comprehension");
  for (const key of ["g2-q09", "g3-q09", "g4-q09"])
    assert.equal(assignments[key], "skill.reading_comprehension");
  assert.equal(assignments["g1-q22"], "skill.phonological_awareness");
  assert.equal(assignments["g4-q32"], "skill.money");
  assert.equal(assignments["g4-q45"], "skill.written_expression");
  assert.equal(assignments["g3-q41"], "skill.geometry");
});
test("migration reclassifies both languages and historical versions without changing question content", () => {
  const result = spawnSync(
    "python3",
    [
      "-c",
      `
import sqlite3,json
from pathlib import Path
root=Path('.')
db=sqlite3.connect(':memory:')
for p in sorted((root/'migrations').glob('*.sql')):
 if p.name.startswith('0009'):break
 db.executescript(p.read_text())
before=db.execute('SELECT id,prompt,script,answer,grade,locale,status,version FROM questions ORDER BY id').fetchall()
db.executescript((root/'migrations/0009_canonical_skills.sql').read_text())
assert before==db.execute('SELECT id,prompt,script,answer,grade,locale,status,version FROM questions ORDER BY id').fetchall()
assignments=json.loads((root/'src/data/question-skills.json').read_text())
for logical,skill in assignments.items():
 rows=db.execute('SELECT module FROM questions WHERE logical_id=?',(logical,)).fetchall()
 assert len(rows)>=2,(logical,rows)
 assert all(r[0]==skill for r in rows),(logical,rows)
`,
    ],
    { cwd: new URL("..", import.meta.url), encoding: "utf8" },
  );
  assert.equal(result.status, 0, result.stderr);
});
