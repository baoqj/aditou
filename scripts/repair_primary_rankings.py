"""Import the 26-504 workbook and repair overlay as a new local D1 release."""
import csv
import hashlib
import json
import re
import sqlite3
from collections import Counter, defaultdict
from decimal import Decimal
from io import StringIO

from openpyxl import load_workbook

from import_school_rankings import EXAMS, ROOT, SOURCE, csv_rows, payload, publish_rows, score, sql

WORKBOOK = EXAMS / "26-504_Primary_Exam_Results.xlsx"
REPAIR = SOURCE / "ranking" / "Aditou_26-504_Data_Repair.md"
MIGRATIONS = ROOT / "migrations"
COMPETENCIES = {"Lecture": "reading", "Écriture": "writing", "Résoudre": "problem-solving", "Raisonner": "reasoning"}
SUBJECTS = {"Français, langue d'enseignement": ("fr_language_of_instruction", "subject-french"), "Mathématique": ("math", "subject-math")}


def require(condition, message):
    if not condition:
        raise ValueError(message)


def workbook_rows():
    book = load_workbook(WORKBOOK, read_only=True, data_only=True)
    for sheet, dimension in [("按能力", "competence"), ("按科目", "programme")]:
        values = iter(book[sheet].values)
        headers = next(values)
        for cells in values:
            row = dict(zip(headers, cells))
            if not row.get("学年"):
                continue
            yield dimension, row
    book.close()


def main():
    notes = REPAIR.read_text(encoding="utf-8")
    expected_hash = re.search(r"26-504_Primary_Exam_Results.xlsx.\s*\|\s*.([a-f0-9]{64})", notes)[1]
    workbook_hash = hashlib.sha256(WORKBOOK.read_bytes()).hexdigest()
    require(workbook_hash == expected_hash, "Workbook SHA-256 mismatch")
    pdf = next(row for row in csv_rows("source_catalog.csv") if row["source_id"] == "26-504")
    pdf_hash = pdf["source_sha256"]
    require(pdf_hash in notes, "PDF SHA-256 mismatch")
    patch_csv = notes.split("<!-- PATCH_CSV_START -->", 1)[1].split("<!-- PATCH_CSV_END -->", 1)[0]
    patch = list(csv.DictReader(StringIO(patch_csv.strip().split("\n", 1)[1].rsplit("\n", 1)[0])))
    patches = {(int(row["pdf_page"]), int(row["pdf_row"])): row for row in patch}
    require(len(patch) == len(patches) == 225, "Expected 225 unique PDF locators")
    require(Counter(row["detail_visibility"] for row in patch) == {"named_group_only": 141, "internal_review": 84},
            "Unexpected publication policy")
    require(all(row["school_level_value_allowed"] == "0" for row in patch), "School ranking authorization changed")
    held_codes = {(row["authority_code"], row["reported_code"]) for row in patch}

    db = sqlite3.connect(":memory:")
    for name in ("0018_school_directory.sql","0023_school_rankings.sql","0024_school_rankings_data.sql","0025_primary_ranking_repair.sql"):
        db.executescript((MIGRATIONS / name).read_text())
    campuses = defaultdict(list)
    for cid, data in db.execute("SELECT id,record FROM school_campuses"):
        record = json.loads(data)
        if record.get("小学标记") and record.get("性质") == "公立":
            campuses[str(record["主管机构编号"]), str(record["官方学校编号"])].append((cid, record))
    definitions, units, observations = {}, {}, defaultdict(list)
    repaired = []
    matched = set()
    held_candidates = {(row["authority_code"], row["directory_school_code"], row["school_year"],
                        row["grade"], row["source_table"], row["subject"], row["competency"])
                       for row in patch}

    for dimension, row in workbook_rows():
        location = (int(row["PDF 页码"]), int(row["页内记录序号"]))
        correction = patches.get(location)
        school, authority = str(row["学校代码"]), str(row["主管教育机构代码"])
        label, year, grade = row["学校名称"], row["学年"], int(row["年级"])
        subject, subject_code = SUBJECTS[row["科目（法语原文）"]]
        competency = COMPETENCIES.get(row.get("能力（法语原文）"), "")
        code = competency if dimension == "competence" else subject_code
        require(bool(code), f"Unknown competency at {location}")
        value = row["通过率"]
        percent = None if value is None else Decimal(str(value)) * 100
        count = row["有效成绩数"]
        count_text = "" if count is None else str(count)
        sample = row["小样本标记"] or ""
        provisional = int(year == "2024-2025")
        display_scope = "school"
        if correction:
            require(location not in matched, f"Repeated workbook locator: {location}")
            matched.add(location)
            fields = {
                "source_table": dimension, "authority_code": authority, "reported_code": school,
                "reported_label": label, "school_year": year, "grade": str(grade), "subject": subject,
                "competency": competency.replace("-", "_"), "reported_numeric_results": count_text,
                "reported_small_group_mark": sample, "provisional": str(provisional),
                "raw_row_key": f"26-504:{location[0]}:{location[1]}",
            }
            for key, expected in fields.items():
                require(correction[key] == expected, f"{location}: {key} differs from workbook")
            expected = correction["reported_pass_rate_pct"]
            require((Decimal(expected) if expected else None) == percent, f"{location}: pass rate mismatch")
            candidate = correction["directory_school_code"]
            target = campuses.get((authority, candidate), [])
            require(bool(target), f"{location}: missing directory school {candidate}")
            hint = correction["directory_building_hint"]
            if hint:
                target = [(cid, record) for cid, record in target if str(record.get("官方建筑／安装点编号")) == hint]
                require(len(target) == 1, f"{location}: building hint is not unique")
            visibility = correction["detail_visibility"]
            repaired.append((pdf_hash, *location, candidate, authority, year, grade, code, visibility, payload(correction)))
            if visibility == "internal_review":
                continue
            display_scope = "programme" if correction["source_scope"] == "named_programme" else "campus"
            unit = "primary-r2-group-" + correction["reported_unit_key"].replace("_", "-")
        else:
            require((authority, school) not in held_codes, f"{location}: affected source row missing from repair")
            if (authority, school, year, str(grade), dimension, subject, competency.replace("-", "_")) in held_candidates:
                # Keep the directory candidate on hold even if a second source code points at it.
                continue
            target = campuses.get((authority, school), [])
            if not target:
                continue
            unit = f"school-primary-r2-{authority}-{school}"
        networks = {record.get("教育网络") for _, record in target}
        if len(networks) != 1:
            continue
        network = {"法语公立网络":"fr", "英语公立网络":"en"}.get(next(iter(networks)))
        if not network:
            continue
        series = f"primary-{grade}-{code}-public-{network}-r2"
        definitions[series] = (series, "primary", grade, code, code, "public", network,
                               "fr" if subject == "fr_language_of_instruction" else "", "pass", "26-504-r2", dimension)
        existing = units.setdefault(unit, ("school" if display_scope == "school" else "campus", set()))
        existing[1].update(cid for cid, _ in target)
        observations[series, year, unit].append((
            score(percent), count if isinstance(count, int) else None, provisional,
            *location, label, count_text, int(bool(sample)), display_scope,
        ))

    require(matched == patches.keys(), "Some repair rows were not matched")
    scores, meta = [], []
    ranked, references = defaultdict(list), defaultdict(list)
    other_conflicts = 0
    for (series, year, unit), rows in sorted(observations.items()):
        values = [row for row in rows if row[0] is not None]
        if not values:
            continue
        # A duplicate with a different label, count or score is not a school-level observation.
        if len({(r[0],r[5],r[6],r[7],r[8]) for r in values}) != 1:
            other_conflicts += 1
            continue
        value, count, provisional, page, line, label, count_text, small_group, scope = min(values, key=lambda row: row[3:5])
        dimension = definitions[series][-1]
        eligible = int(scope == "school" and dimension == "competence" and definitions[series][2] == 6
                       and count is not None and count >= 15 and not small_group)
        scores.append((series, year, unit, value, count, provisional, page, eligible))
        meta.append((series, year, unit, line, label, count_text, small_group, scope))
        if eligible:
            ranked[series, year].append((unit, value, provisional))
        if dimension == "programme" and scope == "school":
            references[series, year].append(provisional)

    release = "cmm-26-504-r2-" + hashlib.sha256((workbook_hash + patch_csv).encode()).hexdigest()[:12]
    statements = ["-- Generated by scripts/repair_primary_rankings.py. Do not edit by hand."]
    publish_rows("school_primary_repairs", sorted(repaired), statements)
    publish_rows("school_rank_sources", [("26-504-r2", pdf["url"], pdf_hash)], statements)
    used_units = sorted({row[2] for row in scores})
    publish_rows("school_rank_units", ((unit, units[unit][0]) for unit in used_units), statements)
    publish_rows("school_rank_unit_campuses", ((unit, cid) for unit in used_units for cid in sorted(units[unit][1])), statements)
    publish_rows("school_rank_series", (definitions[key] for key in sorted({row[0] for row in scores})), statements)
    publish_rows("school_rank_scores", scores, statements)
    publish_rows("school_primary_result_meta", meta, statements)
    publish_rows("school_rank_releases", [(release, "cmm-competition-rank-v2", 0)], statements)
    snapshots, entries = [], []
    for (series, year), rows in sorted(ranked.items()):
        start, end = map(int, year.split("-"))
        previous = ranked.get((series, f"{start-1}-{end-1}"))
        comparison = "missing" if previous is None else (
            "available" if {row[0] for row in previous} == {row[0] for row in rows} else "unverified"
        )
        snapshots.append((release, series, year, len(rows), max(row[2] for row in rows), comparison))
        last = None
        for position, (unit, value, _) in enumerate(sorted(rows, key=lambda row: (-row[1], row[0])), 1):
            if value != last:
                rank = position
                last = value
            entries.append((release, series, year, unit, rank))
    snapshots.extend((release, series, year, 0, max(flags), "missing")
                     for (series, year), flags in sorted(references.items()))
    publish_rows("school_rank_snapshots", snapshots, statements)
    publish_rows("school_rank_entries", entries, statements)
    active_secondary = """JOIN school_rank_releases active ON active.id=old.release_id AND active.current=1
      JOIN school_rank_series s ON s.id=old.series_id AND s.level='secondary'"""
    statements.extend([
        f"""INSERT INTO school_rank_snapshots
          SELECT {sql(release)},old.series_id,old.year,old.ranked_count,old.provisional,old.comparison
          FROM school_rank_snapshots old {active_secondary};""",
        f"""INSERT INTO school_rank_entries SELECT {sql(release)},old.series_id,old.year,old.unit_id,old.rank
          FROM school_rank_entries old {active_secondary};""",
        "UPDATE school_rank_releases SET current=0 WHERE current=1;",
        f"UPDATE school_rank_releases SET current=1 WHERE id={sql(release)};",
    ])
    data = "\n".join(statements) + "\n"
    db.executescript(data)
    require(not db.execute("PRAGMA foreign_key_check").fetchone(), "Foreign key check failed")
    (MIGRATIONS / "0026_primary_ranking_repair_data.sql").write_text(data)
    print(f"{len(matched)} patched rows, {len(scores)} primary results, {len(ranked)} ranked and {len(references)} subject-reference board-years")
    print(f"{other_conflicts} other ambiguous workbook groups excluded; active release {release}")


if __name__ == "__main__":
    main()
