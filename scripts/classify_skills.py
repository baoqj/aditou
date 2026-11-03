"""Generate the reviewed primary-skill metadata migration and audit report."""
from pathlib import Path
import json,collections
from import_exam import records,DOCS
ROOT=Path(__file__).resolve().parents[1]
def main():
 assignments=json.loads((ROOT/'src/data/question-skills.json').read_text())
 skills=json.loads((ROOT/'src/data/skills.json').read_text());valid={s['id'] for s in skills}
 rows,_=records();assert len(rows)==400
 assert all(assignments[r['logical_id']] in valid for r in rows)
 sql=['-- Canonical primary skill IDs shared by English and French, reviewed per logical question.','-- Only classification metadata changes; question content, versions and audio associations stay intact.']
 for logical,skill in assignments.items():sql.append(f"UPDATE questions SET module='{skill}' WHERE logical_id='{logical}';")
 (ROOT/'migrations/0009_canonical_skills.sql').write_text('\n'.join(sql)+'\n')
 report=['# Primary skills by entry grade','', 'Each logical question has one reviewed primary skill shared by both language versions. Labels are phrases without question numbers.','', '| Entry grade | Question | Source task | English skill | French skill |','|---|---|---|---|---|']
 labels={s['id']:s for s in skills}
 # Source teacher task titles provide an auditable link for all 200 decisions.
 import re
 for grade,cn in enumerate('一二三四',1):
  text=(DOCS/f'小学{cn}年级_入学模拟题_英法双语_50题.md').read_text()
  teacher=re.split(r'^## 第二部分',text,flags=re.M)[0]
  for n,title in re.findall(r'^#### Q(\d+)｜([^\n]+)',teacher,re.M):
   s=labels[assignments[f'g{grade}-q{int(n):02}']];report.append(f'| {grade} | Q{int(n):02} | {title} | {s["en"]} | {s["fr"]} |')
 (ROOT/'docs/skill-classification.md').write_text('\n'.join(report)+'\n')
 print(json.dumps({'reviewed_source_questions':200,'reviewed_starter_questions':8,'taxonomy_size':len(skills),'source_language_versions':400,'by_primary_skill':dict(collections.Counter(assignments[r['logical_id']] for r in rows))},indent=2))
if __name__=='__main__':main()
