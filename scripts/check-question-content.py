"""Read-only comparison of production question text against the UI i18n baseline."""
import hashlib
import json
import subprocess
from pathlib import Path

query = 'SELECT id,logical_id,locale,title,prompt,script,options,answer,explanation,preparation,teacher_notes FROM questions ORDER BY id'
result = subprocess.run(['npx', 'wrangler', 'd1', 'execute', 'entryexam-db', '--remote', '--json', '--command', query], capture_output=True, text=True, check=True)
rows = json.loads(result.stdout)[0]['results']
current = {'count': len(rows), 'sha256': hashlib.sha256(json.dumps(rows, ensure_ascii=False, sort_keys=True).encode()).hexdigest()}
baseline = json.loads(Path('artifacts/question-content-before-ui-i18n.json').read_text())
if current != baseline:
    raise SystemExit('Question content differs from the saved UI i18n baseline. Investigate whether later intentional edits changed the source.')
print(f"Question content unchanged: {current['count']} rows; matching SHA-256.")
