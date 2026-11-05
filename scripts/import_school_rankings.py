"""Build the first local ranking release and campus supplements from PRD/School."""
import csv
import hashlib
import json
import sqlite3
from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

from openpyxl import load_workbook

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT.parents[1] / "PRD" / "School"
EXAMS = SOURCE / "ranking" / "Aditou_Greater_Montreal_Exam"
OUTPUT = ROOT / "migrations" / "0024_school_rankings_data.sql"


def csv_rows(name):
    with (EXAMS / name).open(encoding="utf-8-sig", newline="") as file:
        return list(csv.DictReader(file))


def rows(book, sheet):
    values = iter(book[sheet].values)
    headers = next(values)
    for row in values:
        if row[0] is not None:
            yield {key: value for key, value in zip(headers, row) if key and value is not None}


def sql(value):
    if value is None:
        return "NULL"
    if isinstance(value, int):
        return str(value)
    return "'" + str(value).replace("'", "''") + "'"


def payload(value):
    return json.dumps(value, ensure_ascii=False, default=str, separators=(",", ":"))


def publish_rows(table, records, statements):
    records = list(records)
    for index in range(0, len(records), 20):
        values = [ "(" + ",".join(map(sql, row)) + ")" for row in records[index:index + 20] ]
        statement = "INSERT INTO " + table + " VALUES\n" + ",\n".join(values) + ";"
        if len(statement.encode()) > 100_000:
            raise ValueError(f"{table}: SQL statement exceeds D1 limit")
        statements.append(statement)


def code(value):
    return str(value or "").strip()


def page_value(value):
    return int(value) if value else None


def score(value):
    if value in ("", None):
        return None
    number = Decimal(str(value))
    if not number.is_finite() or not 0 <= number <= 100:
        return None
    return int((number * 10).quantize(Decimal("1"), rounding=ROUND_HALF_UP))


def agree(values):
    unique = {value for value in values if value is not None}
    return next(iter(unique)) if len(unique) == 1 else None


def main():
    inputs = [SOURCE / f"Aditou_Greater_Montreal_{level}_Raw.xlsx" for level in ("Primary", "Secondary")]
    inventory = csv_rows("file_inventory.csv")
    for item in inventory:
        path = EXAMS / item["file"]
        if hashlib.sha256(path.read_bytes()).hexdigest() != item["sha256"]:
            raise ValueError(f"Checksum mismatch: {path.name}")

    seed = sqlite3.connect(":memory:")
    seed.executescript((ROOT / "migrations" / "0018_school_directory.sql").read_text())
    base = {key: json.loads(record) for key, record in seed.execute("SELECT id,record FROM school_campuses")}
    directory = {row["campus_id"]: row for row in csv_rows("school_directory.csv")}
    sources = {row["source_id"]: row for row in csv_rows("source_catalog.csv")}
    supplements = defaultdict(dict)
    unmatched = set()
    catalogs = {}
    exam_rows = {}
    base_additions = {}
    for level, path in zip(("primary", "secondary"), inputs):
        wb = load_workbook(path, read_only=True, data_only=True)
        boards = {code(row["教育局编号"]): row for row in rows(wb, "教育局与学区入口")}
        associations = defaultdict(list)
        sheet = "小升初关系" if level == "primary" else "中学招生与学区"
        campus_key = "小学校区键" if level == "primary" else "中学校区键"
        for row in rows(wb, sheet):
            associations[row[campus_key]].append(row)
        directory_rows = {row["校区键"]: row for row in rows(wb, "学校名录")}
        exam_rows[level] = list(rows(wb, "省考原始数据"))
        source_urls = {row["来源ID"]: row["来源URL"] for row in rows(wb, "数据来源")}
        catalogs[level] = {}
        for campus_id, row in directory_rows.items():
            official_id = code(row.get("官方学校编号"))
            building_id = code(row.get("官方建筑或安装点编号"))
            if campus_id not in base:
                unmatched.add(campus_id)
                continue
            assert official_id == code(base[campus_id].get("官方学校编号")), campus_id
            assert building_id == code(base[campus_id].get("官方建筑／安装点编号")), campus_id
            if campus_id in directory:
                assert directory[campus_id]["school_code"] == official_id, campus_id
            catalogs[level][campus_id] = row
            authority = code(row.get("教育局编号") or row.get("私立办学机构编号"))
            # Fill missing base fields only. Preserve existing verified descriptions and aliases.
            for target, field in (("学校官网","学校官网"), ("机构电话（如收录）","电话（名录）"),
                                  ("确切年级","该阶段年级（校方）"), ("授课语言／模式","授课语言或模式")):
                if row.get(field) and not base[campus_id].get(target):
                    base_additions.setdefault(campus_id, {})[target] = row[field]
            context = {
                "catchment": row.get("学区查询URL") or boards.get(authority, {}).get("学区入口URL"),
                "admission": row.get("学校招生来源URL") or row.get("教育局招生参考URL"),
                "englishEligibility": row.get("英文资格参考URL"),
                "program": row.get("教学项目补充") or row.get("该小学招生补充"),
                "gender": row.get("男女校代码") if row.get("男女校来源URL") else None,
                "genderNote": row.get("男女校适用说明"),
                "genderYear": row.get("男女校学年"),
                "genderSource": row.get("男女校来源URL"),
                "imse": row.get("IMSE十分位"),
                "imseYear": row.get("IMSE学年") if row.get("IMSE十分位") else None,
                "imseSource": source_urls.get("MEQ-IMSE") if row.get("IMSE十分位") else None,
                "remote": "远程" in str(row.get("位置类型提示", "")),
            }
            policies = []
            for policy in associations[campus_id]:
                policies.append({
                    "year": policy.get("适用学年"),
                    "program": policy.get("项目") or policy.get("标签"),
                    "description": policy.get("详细条件") or policy.get("条件"),
                    "start": policy.get("申请起始日"),
                    "deadline": policy.get("截止或优先节点"),
                    "assessment": policy.get("评估日"),
                    "source": policy.get("官方来源URL"),
                    "checked": policy.get("核实日期"),
                    "target": policy.get("中学或主管机构"),
                    "targetId": policy.get("中学校区键") if policy.get("中学校区键") in base else None,
                })
            context["policies"] = [{key: value for key, value in policy.items() if value} for policy in policies]
            supplements[campus_id][level] = {key: value for key, value in context.items() if value}
        wb.close()

    schools = defaultdict(list)
    buildings = defaultdict(list)
    for level, records in catalogs.items():
        for campus, row in records.items():
            authority = code(row.get("教育局编号") or row.get("私立办学机构编号"))
            schools[level, authority, code(row["官方学校编号"])].append(campus)
            buildings[level, authority, code(row["官方建筑或安装点编号"])].append(campus)

    def match(level, authority, reported, campus_scope):
        matched = schools.get((level, authority, reported), [])
        if matched and not campus_scope:
            return f"school-{level}-{authority}-{reported}", "school", matched
        matched = buildings.get((level, authority, reported), [])
        if len(matched) != 1:
            return None
        return f"campus-{level}-{matched[0]}", "campus", matched

    primary_codes = {"Lecture": "reading", "Écriture": "writing", "Résoudre": "problem-solving", "Raisonner": "reasoning"}
    csv_primary = defaultdict(list)
    for row in csv_rows("primary_ministry_pass_rates.csv"):
        key = (row["authority_code"], row["reported_school_code"], row["school_year"], int(row["grade"]), row["competency_fr"])
        csv_primary[key].append(score(row["value"]))
    csv_secondary = defaultdict(list)
    for row in csv_rows("secondary_ministry_exam_means.csv"):
        key = (row["authority_code"], row["reported_school_code"], row["school_year"], row["exam_code"])
        csv_secondary[key].append(score(row["value"]))

    series = {}
    units = {}
    raw = defaultdict(list)
    for level, records in exam_rows.items():
        is_primary = level == "primary"
        for row in records:
            if is_primary and row["统计层级"] != "能力分项":
                continue
            authority = code(row.get("教育局编号") if is_primary else row.get("主管机构编号"))
            reported = code(row.get("学校统计代码") if is_primary else row.get("考试统计单位代码"))
            campus_scope = not is_primary and row.get("代码关联粒度") == "私立教学点"
            unit = match(level, authority, reported, campus_scope)
            if not unit:
                continue
            unit_id, scope, campuses = unit
            kinds = {(catalogs[level][cid]["性质"], catalogs[level][cid]["教育网络"]) for cid in campuses}
            if len(kinds) != 1:
                continue
            kind, network_name = kinds.pop()
            sector = "public" if kind == "公立" else "private"
            network = {"法语公立网络":"fr", "英语公立网络":"en", "私立":"private"}.get(network_name)
            if not network or (is_primary and sector != "public"):
                continue
            year = row["学年"]
            grade = int(row["年级"] if is_primary else row["中学年级"])
            if is_primary:
                exam = primary_codes.get(row.get("能力"))
                if not exam:
                    continue
                label, language, metric, source = exam, "fr" if exam in ("reading","writing") else "", "pass", "26-504"
                references = csv_primary[authority, reported, year, grade, row.get("能力")]
                value = score(row.get("及格率（0–100）"))
                participants = row.get("有数值的到考结果数")
                if not isinstance(participants, int) or row.get("人数源表标记") == "XX":
                    participants = None
                eligible = grade == 6 and participants is not None and participants >= 15 and not row.get("小样本提示")
                unsafe = row.get("成绩状态") not in ("已公开","暂定","未见及格率")
            else:
                exam = code(row.get("考试代码"))
                label, language, metric, source = row["试卷名称"], row["科目语言"], "mean", "24-643"
                references = csv_secondary[authority, reported, year, exam]
                value = score(row.get("平均分（0–100）"))
                participants = None
                eligible = grade in (4, 5) and row.get("考试代码来源") in ("源表考试代码","原页图像核实")
                unsafe = row.get("成绩状态") not in ("已公开", "未取得数值")
                if row.get("成绩状态") != "已公开":
                    value = None
            series_id = f"{level}-{grade}-{exam}-{sector}-{network}"
            definition = (series_id, level, grade, exam, label, sector, network, language, metric, source)
            if series_id in series and series[series_id] != definition:
                raise ValueError(f"Conflicting definition for {series_id}")
            series[series_id] = definition
            previous = units.setdefault(unit_id, (scope, set()))
            assert previous[0] == scope
            previous[1].update(campuses)
            disagreement = value is not None and any(reference is not None and reference != value for reference in references)
            # Private results are published for installations. Only single-campus schools
            # enter this separate campus-based series. Preserve the original unit scope.
            private_site = False
            if sector == "private" and campus_scope:
                school = code(catalogs[level][campuses[0]]["官方学校编号"])
                private_site = len(schools[level, authority, school]) == 1
            rankable_scope = scope == "school" if sector == "public" else private_site
            raw[series_id, year, unit_id].append((
                value, participants, page_value(row.get("PDF页码")), eligible and rankable_scope,
                unsafe or disagreement, int(row.get("成绩状态") == "暂定"),
            ))

    scores = []
    boards = defaultdict(list)
    excluded = 0
    for (series_id, year, unit), candidates in sorted(raw.items()):
        value = agree(row[0] for row in candidates)
        if value is None or any(row[4] for row in candidates):
            if any(row[0] is not None for row in candidates):
                excluded += 1
            continue
        valid = [row for row in candidates if row[0] is not None]
        participant_counts = {row[1] for row in valid}
        participants = participant_counts.pop() if len(participant_counts) == 1 else None
        eligible = int(all(row[3] for row in valid) and (series[series_id][1] == "secondary" or participants is not None))
        provisional = max(row[5] for row in valid)
        page = min((row[2] for row in valid if row[2]), default=None)
        entry = (series_id, year, unit, value, participants, provisional, page, eligible)
        scores.append(entry)
        if eligible:
            boards[series_id, year].append(entry)

    release = "cmm-" + hashlib.sha256(b"".join(path.read_bytes() for path in inputs) + payload(inventory).encode()).hexdigest()[:16]
    statements = ["-- Generated by scripts/import_school_rankings.py. Do not edit by hand."]
    publish_rows("school_campus_supplements", (
        (campus, payload(record), int(any(level.get("remote", False) for level in record.values())))
        for campus, record in sorted(supplements.items())
    ), statements)
    for campus, additions in sorted(base_additions.items()):
        # Runtime imports may have filled these fields since the original snapshot.
        for field, value in additions.items():
            path = sql("$." + field)
            statements.append(f"UPDATE school_campuses SET record=json_set(record,{path},{sql(value)}) WHERE id={sql(campus)} AND COALESCE(json_extract(record,{path}),'')='';")
    publish_rows("school_rank_sources", (
        (key, sources[key]["url"], sources[key]["source_sha256"]) for key in ("26-504","24-643")
    ), statements)
    used_units = sorted({row[2] for row in scores})
    publish_rows("school_rank_units", ((unit, units[unit][0]) for unit in used_units), statements)
    publish_rows("school_rank_unit_campuses", ((unit, campus) for unit in used_units for campus in sorted(units[unit][1])), statements)
    publish_rows("school_rank_series", (series[key] for key in sorted({row[0] for row in scores})), statements)
    publish_rows("school_rank_scores", scores, statements)
    publish_rows("school_rank_releases", [(release, "cmm-competition-rank-v1", 1)], statements)
    snapshots, entries = [], []
    for (series_id, year), results in sorted(boards.items()):
        start, end = map(int, year.split("-"))
        previous = boards.get((series_id, f"{start-1}-{end-1}"))
        comparison = "missing" if previous is None else (
            "available" if {row[2] for row in previous} == {row[2] for row in results} else "unverified"
        )
        snapshots.append((release, series_id, year, len(results), max(row[5] for row in results), comparison))
        last_score = None
        for position, row in enumerate(sorted(results, key=lambda row: (-row[3], row[2])), 1):
            if row[3] != last_score:
                rank = position
                last_score = row[3]
            entries.append((release, series_id, year, row[2], rank))
    publish_rows("school_rank_snapshots", snapshots, statements)
    publish_rows("school_rank_entries", entries, statements)
    seed.executescript((ROOT / "migrations" / "0023_school_rankings.sql").read_text() + "\n".join(statements))
    assert not seed.execute("PRAGMA foreign_key_check").fetchone()
    OUTPUT.write_text("\n".join(statements) + "\n", encoding="utf-8")
    print(f"{len(supplements)} linked campus supplements, {len(unmatched)} unmatched campus keys")
    if unmatched:
        print("Unmatched:", ", ".join(sorted(unmatched)))
    print(f"{len(scores)} scores, {len(snapshots)} board-years, {len(entries)} ranked entries, {excluded} held for review")


if __name__ == "__main__":
    main()
