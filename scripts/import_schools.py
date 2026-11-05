"""Generate the school directory migration from the supplied workbooks (openpyxl)."""
import json
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parents[1] / "PRD" / "School"


def rows(book, sheet):
    values = iter(book[sheet].values)
    headers = next(values)
    for row in values:
        if row[0] is not None:
            yield {key: value for key, value in zip(headers, row) if key and value is not None}


def sql(value):
    return "'" + str(value).replace("'", "''") + "'"


directory = load_workbook(SOURCE / "Aditou_Greater_Montreal_Schools.xlsx", read_only=True, data_only=True)
history = load_workbook(SOURCE / "Schools-chart.xlsx", read_only=True, data_only=True)
facts = {}
for fact in rows(directory, "核实明细"):
    facts.setdefault(fact["校区键"], []).append(fact)

statements = [
    "CREATE TABLE school_campuses (id TEXT PRIMARY KEY, record TEXT NOT NULL, facts TEXT NOT NULL);",
    "CREATE TABLE school_legacy_records (id INTEGER PRIMARY KEY, record TEXT NOT NULL);",
]
for campus in rows(directory, "学校名录"):
    key = campus["校区键"]
    values = [key, json.dumps(campus, ensure_ascii=False, default=str),
              json.dumps(facts.pop(key, []), ensure_ascii=False, default=str)]
    statements.append("INSERT INTO school_campuses VALUES (" + ", ".join(map(sql, values)) + ");")

if facts:
    raise ValueError(f"Unmatched verified campus keys: {list(facts)}")

for record in rows(history, "Sheet1"):
    if str(record["Schools/Topics"]).startswith("*"):  # Workbook footnote.
        continue
    statements.append("INSERT INTO school_legacy_records (record) VALUES (" +
                      sql(json.dumps(record, ensure_ascii=False, default=str)) + ");")

(ROOT / "migrations" / "0018_school_directory.sql").write_text("\n".join(statements) + "\n", encoding="utf-8")
