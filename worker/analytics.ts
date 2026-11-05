import type { Env } from "./index";
import { questionSkill } from "../src/skills";
import {
  addDays,
  localDay,
  midnight,
  parseTime,
  performance,
  summarize,
  unionMs,
  METRIC_VERSION,
  type Fact,
} from "./analytics-metrics";
const reply = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
function fail(key = "analytics.invalid", status = 400): never {
  throw { message: key, status };
}
const one = (e: Env, sql: string, ...a: any[]) =>
  e.DB.prepare(sql)
    .bind(...a)
    .first<Fact>();
const all = async (e: Env, sql: string, ...a: any[]) =>
  (
    await e.DB.prepare(sql)
      .bind(...a)
      .all<Fact>()
  ).results;
const audit = (e: Env, u: Fact, action: string, id: string) =>
  e.DB.prepare(
    "INSERT INTO audit_log(id,actor_id,action,resource_id) VALUES(?,?,?,?)",
  )
    .bind(crypto.randomUUID(), u.id, action, id)
    .run();
async function teachingClass(e: Env, u: Fact, id: string) {
  const c = await one(
    e,
    "SELECT * FROM classes WHERE id=? AND teacher_id=?",
    id,
    u.id,
  );
  if (!c) fail("analytics.forbidden", 403);
  return c!;
}
export async function analytics(req: Request, e: Env, u: Fact, path: string) {
  const url = new URL(req.url),
    p = url.searchParams,
    staff = ["teacher", "admin"].includes(u.role);
  if (path === "/api/analytics/intervals") {
    if (req.method !== "POST" || u.role !== "student")
      fail("analytics.forbidden", 403);
    const l = await one(e, "SELECT id FROM learners WHERE account_id=?", u.id);
    if (!l) fail("analytics.forbidden", 403);
    const b = (await req.json()) as Fact,
      now = Date.now();
    if (
      !/^[0-9a-f-]{36}$/i.test(b.id) ||
      !["private", "assignment", "classroom"].includes(b.context) ||
      !["interaction", "listening", "reading"].includes(b.kind) ||
      !Number.isSafeInteger(b.start) ||
      !Number.isSafeInteger(b.end) ||
      b.end <= b.start ||
      b.end - b.start > 35000 ||
      b.start < now - 120000 ||
      b.end > now + 5000
    )
      fail();
    const q = await one(
      e,
      "SELECT id,status FROM questions WHERE id=?",
      b.question_id,
    );
    if (!q) fail();
    if (b.context === "private") {
      if (q!.status !== "published") fail("analytics.forbidden", 403);
      b.context_id = "";
    } else {
      const table = b.context === "assignment" ? "assignments" : "classrooms";
      const c = await one(
        e,
        `SELECT c.id FROM ${table} c JOIN analytics_targets t ON t.context_id=c.id AND t.kind=? WHERE c.id=? AND t.learner_id=? AND EXISTS(SELECT 1 FROM json_each(c.question_ids) WHERE value=?)`,
        b.context,
        b.context_id,
        l!.id,
        q!.id,
      );
      if (!c) fail("analytics.forbidden", 403);
    }
    await e.DB.prepare(
      "INSERT OR IGNORE INTO learning_intervals(id,learner_id,question_id,context,context_id,kind,started_at,ended_at) VALUES(?,?,?,?,?,?,?,?)",
    )
      .bind(b.id, l!.id, q!.id, b.context, b.context_id, b.kind, b.start, b.end)
      .run();
    return reply({ ok: true, rule_version: "activity-v1" });
  }
  if (path === "/api/analytics/grants") {
    if (!staff) fail("analytics.forbidden", 403);
    if (!["POST", "DELETE"].includes(req.method)) fail();
    const b = (await req.json()) as Fact;
    await teachingClass(e, u, b.class_id);
    const org = await one(
      e,
      "SELECT o.id FROM organizations o JOIN accounts a ON a.id=o.owner_id WHERE lower(a.email)=lower(?)",
      String(b.email || "").trim(),
    );
    if (!org) fail("analytics.orgNotFound", 404);
    if (req.method === "POST")
      await e.DB.prepare(
        "INSERT OR IGNORE INTO organization_class_grants(org_id,class_id,granted_by) VALUES(?,?,?)",
      )
        .bind(org!.id, b.class_id, u.id)
        .run();
    else
      await e.DB.prepare(
        "DELETE FROM organization_class_grants WHERE org_id=? AND class_id=?",
      )
        .bind(org!.id, b.class_id)
        .run();
    await audit(
      e,
      u,
      "analytics.grant." + req.method,
      org!.id + ":" + b.class_id,
    );
    return reply({ ok: true });
  }
  if (path === "/api/analytics/organization") {
    if (!staff || req.method !== "POST") fail("analytics.forbidden", 403);
    const b = (await req.json()) as Fact,
      name = String(b.name || "").trim();
    if (!name || name.length > 120) fail();
    await e.DB.prepare(
      "INSERT OR IGNORE INTO organizations(id,name,owner_id) VALUES(?,?,?)",
    )
      .bind(crypto.randomUUID(), name, u.id)
      .run();
    const org = await one(
      e,
      "SELECT id FROM organizations WHERE owner_id=?",
      u.id,
    );
    await e.DB.prepare(
      "INSERT OR IGNORE INTO organization_class_grants SELECT ?,id,?,CURRENT_TIMESTAMP FROM classes WHERE teacher_id=?",
    )
      .bind(org!.id, u.id, u.id)
      .run();
    return reply({ ok: true });
  }
  if (path === "/api/analytics/teaching") {
    if (!staff || req.method !== "POST") fail("analytics.forbidden", 403);
    const b = (await req.json()) as Fact,
      c = await one(
        e,
        "SELECT class_id FROM classrooms WHERE id=?",
        b.session_id,
      );
    if (!c) fail();
    await teachingClass(e, u, c!.class_id);
    if (
      !Number.isSafeInteger(b.start) ||
      !Number.isSafeInteger(b.end) ||
      b.end <= b.start ||
      b.end - b.start > 12 * 3600000 ||
      b.end > Date.now() + 5000 ||
      b.start < Date.now() - 366 * 86400000 ||
      !String(b.reason || "").trim() ||
      String(b.reason).length > 1000
    )
      fail();
    const id = b.id || crypto.randomUUID(),
      existing = await one(
        e,
        "SELECT * FROM teaching_intervals WHERE id=?",
        id,
      );
    if (
      existing &&
      (existing.teacher_id !== u.id || existing.classroom_id !== b.session_id)
    )
      fail("analytics.forbidden", 403);
    await e.DB.prepare(
      "INSERT INTO teaching_intervals(id,classroom_id,teacher_id,started_at,ended_at,reason) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET started_at=excluded.started_at,ended_at=excluded.ended_at,reason=excluded.reason,updated_at=CURRENT_TIMESTAMP",
    )
      .bind(id, b.session_id, u.id, b.start, b.end, String(b.reason).trim())
      .run();
    await audit(e, u, "analytics.teaching.confirm", id);
    return reply({ ok: true });
  }
  if (path === "/api/analytics/scope") {
    const classes = staff
      ? await all(
          e,
          "SELECT id,name,grade,locale FROM classes WHERE teacher_id=? ORDER BY name",
          u.id,
        )
      : [];
    const organizations = staff
      ? await all(e, "SELECT id,name FROM organizations WHERE owner_id=?", u.id)
      : [];
    const grants = staff
      ? await all(
          e,
          "SELECT g.class_id,o.name,a.email FROM organization_class_grants g JOIN classes c ON c.id=g.class_id JOIN organizations o ON o.id=g.org_id JOIN accounts a ON a.id=o.owner_id WHERE c.teacher_id=?",
          u.id,
        )
      : [];
    const l =
      u.role === "student"
        ? await one(e, "SELECT grade FROM learners WHERE account_id=?", u.id)
        : null;
    return reply({
      classes,
      organizations,
      grants,
      grade: l?.grade || classes[0]?.grade || 1,
    });
  }
  const exporting = path === "/api/analytics/export";
  if (path !== "/api/analytics/overview" && !exporting)
    fail("analytics.notFound", 404);
  if (req.method !== (exporting ? "POST" : "GET")) fail();
  const timezone = p.get("timezone") || "America/Toronto";
  try {
    new Intl.DateTimeFormat("en", { timeZone: timezone }).format();
  } catch {
    fail();
  }
  const today = localDay(Date.now(), timezone),
    end = p.get("end") || today,
    start = p.get("start") || addDays(today, -6),
    locale = p.get("locale") || "fr-CA",
    grade = Number(p.get("grade") || 1),
    context = p.get("context") || "",
    contextId = p.get("context_id") || "",
    classId = p.get("class_id") || "",
    skill = p.get("skill") || "",
    type = p.get("type") || "",
    orgId = p.get("org_id") || "",
    mode = p.get("view") === "organization" ? "organization" : "personal";
  if (
    !Number.isFinite(Date.parse(start + "T00:00:00Z")) ||
    !Number.isFinite(Date.parse(end + "T00:00:00Z")) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(start) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(end) ||
    addDays(start, 0) !== start ||
    addDays(end, 0) !== end ||
    end < start ||
    Date.parse(end) - Date.parse(start) > 92 * 86400000 ||
    end > today ||
    !["fr-CA", "en-CA"].includes(locale) ||
    ![1, 2, 3, 4].includes(grade) ||
    !["", "private", "assignment", "classroom"].includes(context)
  )
    fail();
  if (staff && context === "private") fail("analytics.forbidden", 403);
  if (p.has("learner_id") || p.has("teacher_id"))
    fail("analytics.forbidden", 403);
  let classes: Fact[] = [],
    availableClasses: Fact[] = [],
    learnerId = "",
    scopeSQL = "",
    scopeArgs: any[] = [];
  if (staff) {
    classes =
      mode === "organization"
        ? await all(
            e,
            "SELECT c.*,a.name teacher_name FROM classes c JOIN accounts a ON a.id=c.teacher_id JOIN organization_class_grants g ON g.class_id=c.id JOIN organizations o ON o.id=g.org_id WHERE o.id=? AND o.owner_id=? ORDER BY c.name",
            orgId,
            u.id,
          )
        : await all(
            e,
            "SELECT c.*,a.name teacher_name FROM classes c JOIN accounts a ON a.id=c.teacher_id WHERE c.teacher_id=? ORDER BY c.name",
            u.id,
          );
    if (
      mode === "organization" &&
      !(await one(
        e,
        "SELECT id FROM organizations WHERE id=? AND owner_id=?",
        orgId,
        u.id,
      ))
    )
      fail("analytics.forbidden", 403);
    availableClasses = classes;
    if (classId && !classes.some((c) => c.id === classId))
      fail("analytics.forbidden", 403);
    if (classId) classes = classes.filter((c) => c.id === classId);
    const ids = classes.map((c) => c.id);
    if (ids.length > 85) fail("analytics.tooLarge", 413);
    scopeSQL = `at.context!='private' AND cc.id IN (${ids.map(() => "?").join(",") || "NULL"})`;
    scopeArgs = ids;
  } else if (u.role === "student") {
    const l = await one(e, "SELECT id FROM learners WHERE account_id=?", u.id);
    if (!l) fail("analytics.forbidden", 403);
    learnerId = l!.id;
    scopeSQL = "at.learner_id=?";
    scopeArgs = [learnerId];
  } else fail("analytics.forbidden", 403);
  const begin = midnight(start, timezone),
    finish = midnight(addDays(end, 1), timezone),
    sqlStart = new Date(begin).toISOString().slice(0, 19).replace("T", " "),
    sqlEnd = new Date(finish).toISOString().slice(0, 19).replace("T", " ");
  // Firstness is computed before the reporting window, using logical item lineage, not cosmetic version IDs.
  const raw = await all(
    e,
    `SELECT at.id,at.learner_id,at.question_id,at.question_snapshot,at.context,at.context_id,at.round,at.status,at.score,at.hint_used,at.created_at,at.answers_revealed,at.run_id,at.reviewer_role,l.alias,ar.status run_status,cc.id class_id,
 NOT EXISTS(SELECT 1 FROM attempts prior WHERE prior.learner_id=at.learner_id AND trim(prior.answer) NOT IN ('','[]','{}') AND COALESCE(json_extract(prior.question_snapshot,'$.logical_id'),prior.question_id)=COALESCE(json_extract(at.question_snapshot,'$.logical_id'),at.question_id) AND json_extract(prior.question_snapshot,'$.locale')=json_extract(at.question_snapshot,'$.locale') AND (prior.created_at<at.created_at OR (prior.created_at=at.created_at AND prior.rowid<at.rowid))) first
 FROM attempts at JOIN learners l ON l.id=at.learner_id LEFT JOIN assignments a ON at.context='assignment' AND a.id=at.context_id LEFT JOIN classrooms cs ON at.context='classroom' AND cs.id=at.context_id LEFT JOIN classes cc ON cc.id=COALESCE(a.class_id,cs.class_id) LEFT JOIN assessment_runs ar ON ar.id=at.run_id WHERE ${scopeSQL} AND (ar.mode IS NULL OR ar.mode!='exam' OR trim(at.answer) NOT IN ('','[]','{}')) AND at.created_at>=? AND at.created_at<? ORDER BY at.created_at,at.rowid LIMIT 50001`,
    ...scopeArgs,
    sqlStart,
    sqlEnd,
  );
  if (raw.length > 50000) fail("analytics.tooLarge", 413);
  let rows: Fact[] = raw
    .map<Fact>((r) => {
      const q = JSON.parse(r.question_snapshot);
      const hidden =
        !staff &&
        ((r.context === "assignment" &&
          r.run_id &&
          r.run_status !== "graded") ||
          (r.context === "classroom" && !r.answers_revealed));
      return {
        ...r,
        question_snapshot: undefined,
        locale: q.locale,
        grade: Number(q.grade),
        title: q.title,
        skill: questionSkill(q),
        response_type: q.response_type,
        possible: 2,
        first: !!r.first,
        status: hidden ? "submitted" : r.status,
        score: hidden ? null : r.score,
      };
    })
    .filter(
      (r) =>
        r.locale === locale &&
        r.grade === grade &&
        (!context || r.context === context) &&
        (!contextId || r.context_id === contextId) &&
        (!skill || r.skill === skill) &&
        (!type || r.response_type === type),
    );
  const intervalScope = staff
    ? `i.context!='private' AND cc.id IN (${classes.map(() => "?").join(",") || "NULL"})`
    : "i.learner_id=?";
  const intervals = (
    await all(
      e,
      `SELECT i.*,q.locale,q.grade,q.module,q.logical_id,q.response_type FROM learning_intervals i JOIN questions q ON q.id=i.question_id LEFT JOIN assignments a ON i.context='assignment' AND a.id=i.context_id LEFT JOIN classrooms cs ON i.context='classroom' AND cs.id=i.context_id LEFT JOIN classes cc ON cc.id=COALESCE(a.class_id,cs.class_id) WHERE ${intervalScope} AND i.ended_at>? AND i.started_at<? LIMIT 50001`,
      ...(staff ? classes.map((c) => c.id) : [learnerId]),
      begin,
      finish,
    )
  ).filter(
    (r) =>
      r.locale === locale &&
      Number(r.grade) === grade &&
      (!context || r.context === context) &&
      (!contextId || r.context_id === contextId) &&
      (!skill || questionSkill(r) === skill) &&
      (!type || r.response_type === type),
  );
  if (intervals.length > 50000) fail("analytics.tooLarge", 413);
  const data = summarize(rows, intervals, start, end, timezone),
    tracking = await one(
      e,
      "SELECT value FROM analytics_metadata WHERE key='tracking_since'",
    );
  const pendingAge = [
    { key: "0-1", min: 0, max: 2 },
    { key: "2-3", min: 2, max: 4 },
    { key: "4+", min: 4, max: Infinity },
  ].map((b) => ({
    key: b.key,
    count: rows.filter(
      (r) =>
        r.status === "pending_manual" &&
        (Date.now() - parseTime(r.created_at)) / 86400000 >= b.min &&
        (Date.now() - parseTime(r.created_at)) / 86400000 < b.max,
    ).length,
  }));
  let assignments: Fact[] = [],
    sessions: Fact[] = [],
    teaching: Fact[] = [],
    roster: Fact[] = [],
    content: Fact[] = [],
    teachers: Fact[] = [];
  if (staff) {
    const ids = classes.map((c) => c.id),
      placeholders = ids.map(() => "?").join(",") || "NULL";
    roster = await all(
      e,
      `SELECT DISTINCT l.id,l.alias FROM learners l JOIN enrollments en ON en.learner_id=l.id JOIN classes c ON c.id=en.class_id WHERE c.id IN (${placeholders}) AND c.grade=? AND c.locale=? ORDER BY l.alias`,
      ...ids,
      grade,
      locale,
    );
    const assignmentFacts = await all(
      e,
      `SELECT a.*,co.provenance FROM assignments a JOIN classes c ON c.id=a.class_id LEFT JOIN analytics_cohorts co ON co.kind='assignment' AND co.context_id=a.id WHERE a.class_id IN (${placeholders}) AND c.grade=? AND c.locale=? AND julianday(a.due_at)>=julianday(?) AND julianday(a.due_at)<julianday(?) ORDER BY a.due_at`,
      ...ids,
      grade,
      locale,
      new Date(begin).toISOString(),
      new Date(finish).toISOString(),
    );
    const assignmentTargets =
      !context || context === "assignment"
        ? await all(
            e,
            "SELECT t.context_id,t.learner_id,l.alias,r.status,r.submitted_at FROM analytics_targets t JOIN learners l ON l.id=t.learner_id LEFT JOIN assessment_runs r ON r.assignment_id=t.context_id AND r.learner_id=t.learner_id WHERE t.kind='assignment' AND t.context_id IN (SELECT value FROM json_each(?)) ORDER BY l.alias",
            JSON.stringify(assignmentFacts.map((a) => a.id)),
          )
        : [];
    for (const a of assignmentFacts) {
      if (context && context !== "assignment") continue;
      const targets = assignmentTargets.filter((t) => t.context_id === a.id);
      const complete = targets.filter((t) => t.status && t.status !== "draft"),
        draft = targets.filter((t) => t.status === "draft");
      assignments.push({
        id: a.id,
        title: a.title,
        class_id: a.class_id,
        due_at: a.due_at,
        provenance: a.provenance || "unknown",
        target: targets.length,
        started: draft.length,
        submitted: complete.length,
        not_started: targets.length - complete.length - draft.length,
        waiting: complete.filter((t) => t.status === "submitted").length,
        graded: complete.filter((t) => t.status === "graded").length,
        on_time: complete.filter(
          (t) => parseTime(t.submitted_at) <= parseTime(a.due_at),
        ).length,
        late: complete.filter(
          (t) => parseTime(t.submitted_at) > parseTime(a.due_at),
        ).length,
        learners: targets.map((t) => ({
          id: t.learner_id,
          alias: t.alias,
          status: t.status || "not_started",
        })),
      });
    }
    sessions = await all(
      e,
      `SELECT s.id,s.title,s.class_id,s.phase,s.round,s.current_index,s.question_ids,co.provenance FROM classrooms s JOIN classes c ON c.id=s.class_id LEFT JOIN analytics_cohorts co ON co.kind='classroom' AND co.context_id=s.id WHERE s.class_id IN (${placeholders}) AND c.grade=? AND c.locale=? AND (s.created_at>=? AND s.created_at<? OR EXISTS(SELECT 1 FROM teaching_intervals ti WHERE ti.classroom_id=s.id AND ti.ended_at>? AND ti.started_at<?)) ORDER BY s.created_at DESC`,
      ...ids,
      grade,
      locale,
      sqlStart,
      sqlEnd,
      begin,
      finish,
    );
    if (context && context !== "classroom") sessions = [];
    const sessionIds = JSON.stringify(sessions.map((s) => s.id));
    const sessionTargets = await all(
      e,
      "SELECT context_id,COUNT(*) n FROM analytics_targets WHERE kind='classroom' AND context_id IN (SELECT value FROM json_each(?)) GROUP BY context_id",
      sessionIds,
    );
    const sessionAnswers = await all(
      e,
      "SELECT at.context_id,at.status,at.learner_id,at.round FROM attempts at JOIN analytics_targets t ON t.kind='classroom' AND t.context_id=at.context_id AND t.learner_id=at.learner_id WHERE at.context='classroom' AND at.context_id IN (SELECT value FROM json_each(?))",
      sessionIds,
    );
    for (const s of sessions) {
      const allAnswers = sessionAnswers.filter((a) => a.context_id === s.id);
      s.target = sessionTargets.find((t) => t.context_id === s.id)?.n || 0;
      s.current_submitted = new Set(
        allAnswers.filter((a) => a.round === s.round).map((a) => a.learner_id),
      ).size;
      s.rounds = [...new Set(allAnswers.map((a) => a.round))].map((round) => ({
        round,
        submitted: allAnswers.filter((a) => a.round === round).length,
        correct: allAnswers.filter(
          (a) => a.round === round && a.status === "correct",
        ).length,
        pending: allAnswers.filter(
          (a) => a.round === round && a.status === "pending_manual",
        ).length,
      }));
      s.question_count = JSON.parse(s.question_ids).length;
      delete s.question_ids;
    }
    teaching = await all(
      e,
      `SELECT t.*,s.title,s.class_id,a.name teacher_name FROM teaching_intervals t JOIN classrooms s ON s.id=t.classroom_id JOIN classes c ON c.id=s.class_id JOIN accounts a ON a.id=t.teacher_id WHERE s.class_id IN (${placeholders}) AND c.grade=? AND c.locale=? AND t.ended_at>? AND t.started_at<? ORDER BY t.started_at`,
      ...ids,
      grade,
      locale,
      begin,
      finish,
    );
    teaching = teaching.map((t) => ({
      ...t,
      started_at: Math.max(begin, t.started_at),
      ended_at: Math.min(finish, t.ended_at),
    }));
    content = await all(
      e,
      `SELECT q.module,q.logical_id,q.response_type,q.id,EXISTS(SELECT 1 FROM audio_assets a WHERE a.question_id=q.id AND a.kind='teacher' AND a.status='published') recorded FROM questions q WHERE q.status='published' AND q.grade=? AND q.locale=? AND (q.owner_id IS NULL OR q.owner_id=?)`,
      grade,
      locale,
      u.id,
    );
    content = content.filter(
      (q) =>
        (!skill || questionSkill(q) === skill) &&
        (!type || q.response_type === type),
    );
    teachers = [
      ...new Set(
        classes
          .filter((c) => Number(c.grade) === grade && c.locale === locale)
          .map((c) => c.teacher_id),
      ),
    ]
      .map((id) => ({
        id,
        name: classes.find((c) => c.teacher_id === id)!.teacher_name,
        classes: classes.filter(
          (c) =>
            c.teacher_id === id &&
            Number(c.grade) === grade &&
            c.locale === locale,
        ).length,
        minutes: unionMs(teaching.filter((t) => t.teacher_id === id)) / 60000,
        submissions: rows.filter(
          (r) => classes.find((c) => c.id === r.class_id)?.teacher_id === id,
        ).length,
        pending: rows.filter(
          (r) =>
            r.status === "pending_manual" &&
            classes.find((c) => c.id === r.class_id)?.teacher_id === id,
        ).length,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
  for (const row of rows) {
    if (staff && !roster.some((l) => l.id === row.learner_id))
      roster.push({ id: row.learner_id, alias: row.alias });
  }
  roster.sort((a, b) => a.alias.localeCompare(b.alias));
  const detailRows = rows.map((r) => ({
    id: r.id,
    learner_id: staff ? r.learner_id : undefined,
    alias: staff ? r.alias : undefined,
    question_id: r.question_id,
    title: r.title,
    skill: r.skill,
    context: r.context,
    context_id: r.context_id,
    class_id: r.class_id,
    round: r.round,
    created_at: r.created_at,
    status: r.status,
    score: r.score,
    possible: r.possible,
    first: r.first,
    hint_used: r.hint_used,
    response_type: r.response_type,
  }));
  const offset = Math.max(0, Math.min(50000, Number(p.get("offset")) || 0));
  const organization = staff && mode === "organization";
  const matrix = organization
    ? classes.map((c) => ({
        id: c.id,
        alias: c.name,
        skills: data.skills.map((s) => ({
          key: s.key,
          ...performance(
            rows.filter((r) => r.class_id === c.id && r.skill === s.key),
          ),
        })),
      }))
    : staff
      ? roster.map((l) => ({
          id: l.id,
          alias: l.alias,
          skills: data.skills.map((s) => ({
            key: s.key,
            ...performance(
              rows.filter((r) => r.learner_id === l.id && r.skill === s.key),
            ),
          })),
        }))
      : [];
  const teachingDaily = data.daily.map(({ day }) => {
    const dayStart = midnight(day, timezone),
      dayEnd = midnight(addDays(day, 1), timezone);
    const intervals = teaching
      .filter((t) => t.started_at < dayEnd && t.ended_at > dayStart)
      .map<Fact>((t) => ({
        ...t,
        started_at: Math.max(t.started_at, dayStart),
        ended_at: Math.min(t.ended_at, dayEnd),
      }));
    const ids = [...new Set(intervals.map((t) => t.classroom_id))];
    const minutes =
      ids.reduce(
        (sum, id) =>
          sum + unionMs(intervals.filter((t) => t.classroom_id === id)),
        0,
      ) / 60000;
    return {
      day,
      minutes,
      submissions: ids.length,
      sources: { private: 0, assignment: 0, classroom: minutes },
    };
  });
  const result = {
    metric_version: METRIC_VERSION,
    as_of: new Date().toISOString(),
    filters: {
      start,
      end,
      timezone,
      locale,
      grade,
      context,
      context_id: contextId,
      class_id: classId,
      skill,
      type,
      view: mode,
      org_id: orgId,
    },
    scope: {
      role: u.role,
      classes: availableClasses.map((c) => ({ id: c.id, name: c.name })),
      private_included: !staff,
    },
    ...data,
    quality: {
      tracking_since: tracking?.value,
      time_status: "partial",
      time_recorded_learners: data.summary.time_learners,
      submission_learners: data.summary.learners,
      independence: "unknown",
      historical_targets:
        assignments.some((a) => a.provenance !== "frozen") ||
        sessions.some((s) => s.provenance !== "frozen"),
      planned_delivery: "unavailable",
      attendance: "unavailable",
      calibrated_comparison: "unavailable",
    },
    pending_age: pendingAge,
    assignments: organization
      ? assignments.map(({ learners, ...a }) => ({ ...a, learners: [] }))
      : assignments,
    sessions,
    teaching: organization ? teaching.map(({ reason, ...r }) => r) : teaching,
    teaching_daily: teachingDaily,
    teachers,
    roster_count: roster.length,
    activity_minutes: data.summary.minutes,
    teaching_minutes: [...new Set(teaching.map((t) => t.classroom_id))].reduce(
      (sum, id) =>
        sum + unionMs(teaching.filter((t) => t.classroom_id === id)) / 60000,
      0,
    ),
    teacher_person_minutes: teachers.reduce((sum, t) => sum + t.minutes, 0),
    confirmed_sessions: new Set(teaching.map((t) => t.classroom_id)).size,
    content: {
      published: content.length,
      recorded: content.filter((q) => q.recorded).length,
      skills: [...new Set(content.map(questionSkill))].map((id) => ({
        key: id,
        count: content.filter((q) => questionSkill(q) === id).length,
        recorded: content.filter((q) => questionSkill(q) === id && q.recorded)
          .length,
      })),
    },
    matrix,
    records: organization ? [] : detailRows.slice(offset, offset + 100),
    record_total: detailRows.length,
    record_offset: offset,
  };
  if (exporting) {
    await audit(e, u, "analytics.export", JSON.stringify(result.filters));
    return reply({
      ...result,
      records: [],
      matrix: [],
      teachers: teachers.map(({ id, name, ...a }) => a),
      teaching: [],
      assignments: assignments.map(({ learners, ...a }) => a),
      export_scope: "aggregate",
      exported_at: new Date().toISOString(),
    });
  }
  return reply(result);
}
