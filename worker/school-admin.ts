import {
  evidenceUrl,
  moderateSchoolReviews,
  schoolError,
  schoolInput,
  schoolReply,
  type SchoolActor,
} from "./school-reviews";
import { manageSchoolScores } from "./school-score-admin";

const fields = [
  ["name", "学校正式名称"],
  ["campus", "校区／建筑名"],
  ["address", "校区地址"],
  ["postal", "校区邮编"],
  ["city", "市镇"],
  ["language", "授课语言／模式"],
  ["board", "教育局／私立主办方"],
  ["website", "学校官网"],
  ["boardWebsite", "教育局／主办方官网"],
  ["grades", "确切年级"],
  ["admission", "入学方式"],
  ["openHouse", "开放日／说明会"],
  ["fees", "费用"],
  ["care", "课前课后托管"],
  ["latitude", "纬度"],
  ["longitude", "经度"],
] as const;
const profile = `SELECT c.id,c.record,c.facts,r.version,r.fields,r.source_url AS sourceUrl,r.created_at AS changedAt
  FROM school_campus_profiles c LEFT JOIN school_profile_revisions r
  ON r.campus_id=c.id AND r.version=(SELECT MAX(version) FROM school_profile_revisions WHERE campus_id=c.id)`;
const strings = (input: unknown) =>
  typeof input === "string" ? input.trim() : "";

export async function schoolAdmin(
  req: Request,
  db: D1Database,
  actor: SchoolActor,
  path: string,
) {
  if (actor.role !== "admin" || actor.disabled)
    return schoolError("forbidden", 403);
  const url = new URL(req.url);
  const page = Math.max(
    0,
    Math.min(10000, Math.floor(Number(url.searchParams.get("page")) || 0)),
  );
  if (path === "/api/admin/schools" && req.method === "GET") {
    const query = (url.searchParams.get("q") ?? "").trim().slice(0, 100);
    const queue = url.searchParams.get("queue") ?? "";
    const { results } = await db
      .prepare(
        `SELECT c.id,c.school_key AS schoolKey,
      json_extract(c.record,'$.学校正式名称') AS name,json_extract(c.record,'$."校区／建筑名"') AS campus,
      json_extract(c.record,'$.市镇') AS city,json_extract(c.record,'$.官方学校编号') AS code,
      json_extract(c.record,'$."教育局／私立主办方"') AS board,
      (SELECT COUNT(*) FROM school_reviews WHERE school_key=c.school_key AND status='pending') AS reviews,
      (SELECT COUNT(*) FROM school_suggestions WHERE campus_id=c.id AND status='pending') AS suggestions,
      (SELECT MAX(version) FROM school_profile_revisions WHERE campus_id=c.id) AS version
      FROM school_campus_profiles c
      WHERE (?='' OR instr(lower(c.record),lower(?))>0 OR instr(lower(c.id),lower(?))>0)
        AND (?='' OR ?='reviews' AND EXISTS(SELECT 1 FROM school_reviews WHERE school_key=c.school_key AND status='pending')
          OR ?='suggestions' AND EXISTS(SELECT 1 FROM school_suggestions WHERE campus_id=c.id AND status='pending'))
      ORDER BY name COLLATE NOCASE,c.id LIMIT 31 OFFSET ?`,
      )
      .bind(query, query, query, queue, queue, queue, page * 30)
      .all();
    return schoolReply({
      entries: results.slice(0, 30),
      more: results.length > 30,
    });
  }
  const reviews = /^\/api\/admin\/schools\/reviews(?:\/([a-f0-9-]{36}))?$/.exec(
    path,
  );
  if (reviews) return moderateSchoolReviews(req, db, actor, reviews[1]);
  const match =
    /^\/api\/admin\/schools\/campus\/([a-z0-9-]+)(?:\/(scores|suggestions))?$/i.exec(
      path,
    );
  if (!match) return schoolError("missing", 404);
  const [, campusId, section] = match;
  const campus = await db
    .prepare(profile + " WHERE c.id=?")
    .bind(campusId)
    .first<{
      id: string;
      record: string;
      facts: string;
      version: number | null;
      fields: string | null;
      sourceUrl: string | null;
      changedAt: number | null;
    }>();
  if (!campus) return schoolError("missing", 404);
  if (section === "scores") return manageSchoolScores(req, db, actor, campusId);
  if (section === "suggestions") {
    if (req.method === "GET") {
      const { results } = await db
        .prepare(
          `SELECT id,message,source_url AS sourceUrl,status,created_at AS createdAt,review_note AS reason
        FROM school_suggestions WHERE campus_id=? ORDER BY status,created_at DESC LIMIT 31 OFFSET ?`,
        )
        .bind(campusId, page * 30)
        .all();
      return schoolReply({
        entries: results.slice(0, 30),
        more: results.length > 30,
      });
    }
    if (req.method !== "POST") return schoolError("invalid", 405);
    const input = await schoolInput(req);
    const reason = strings(input?.reason);
    if (
      !input ||
      typeof input.id !== "string" ||
      !reason ||
      reason.length > 1000
    )
      return schoolError("invalid", 400);
    const [write] = await db.batch([
      db
        .prepare(
          `UPDATE school_suggestions SET status='reviewed',reviewed_by=?,reviewed_at=?,review_note=?
        WHERE id=? AND campus_id=? AND status='pending'`,
        )
        .bind(actor.id, Date.now(), reason, input.id, campusId),
      db
        .prepare(
          `INSERT INTO audit_log(id,actor_id,action,resource_id)
        SELECT ?,?,'school.suggestion.review',? WHERE changes()=1`,
        )
        .bind(crypto.randomUUID(), actor.id, input.id),
    ]);
    return write.meta.changes
      ? schoolReply({ ok: true })
      : schoolError("conflict", 409);
  }
  const record = JSON.parse(campus.record) as Record<string, string | number>;
  const version = campus.version ?? 0;
  if (req.method === "GET") {
    const { results: history } = await db
      .prepare(
        `SELECT version,source_url AS sourceUrl,reason,created_at AS createdAt
      FROM school_profile_revisions WHERE campus_id=? ORDER BY version DESC LIMIT 25`,
      )
      .bind(campusId)
      .all();
    return schoolReply({
      id: campusId,
      version,
      sourceUrl: campus.sourceUrl,
      changedAt: campus.changedAt,
      fields: fields.map(([key, field]) => ({
        key,
        value: record[field] ?? "",
      })),
      history,
    });
  }
  if (req.method !== "POST") return schoolError("invalid", 405);
  const input = await schoolInput(req);
  const source = evidenceUrl(input?.sourceUrl);
  const reason = strings(input?.reason);
  if (
    !input ||
    !source ||
    !reason ||
    reason.length > 1000 ||
    !input.fields ||
    typeof input.fields !== "object" ||
    Array.isArray(input.fields)
  )
    return schoolError("invalid", 400);
  if (input.version !== version) return schoolError("conflict", 409);
  const changes = JSON.parse(campus.fields ?? "{}") as Record<
    string,
    string | number
  >;
  const values = input.fields as Record<string, unknown>;
  for (const [key, field] of fields) {
    if (!Object.hasOwn(values, key)) continue;
    const value = values[key];
    if (typeof value !== "string" || value.length > 2500)
      return schoolError("invalid", 400);
    const trimmed = value.trim();
    if (trimmed === String(record[field] ?? "")) continue;
    if (key === "name" && !trimmed) return schoolError("invalid", 400);
    if (
      (key === "website" || key === "boardWebsite") &&
      trimmed &&
      !evidenceUrl(trimmed)
    )
      return schoolError("invalid", 400);
    if (key === "latitude" || key === "longitude") {
      const limit = key === "latitude" ? 90 : 180;
      if (
        trimmed &&
        (!Number.isFinite(Number(trimmed)) || Math.abs(Number(trimmed)) > limit)
      )
        return schoolError("invalid", 400);
      changes[field] = trimmed ? Number(trimmed) : "";
    } else {
      changes[field] = trimmed;
    }
  }
  const [write] = await db.batch([
    db
      .prepare(
        `INSERT INTO school_profile_revisions(campus_id,version,fields,source_url,reason,actor_id,created_at)
      SELECT ?,?,?,?,?,?,? WHERE COALESCE((SELECT MAX(version) FROM school_profile_revisions WHERE campus_id=?),0)=?`,
      )
      .bind(
        campusId,
        version + 1,
        JSON.stringify(changes),
        source,
        reason,
        actor.id,
        Date.now(),
        campusId,
        version,
      ),
    db
      .prepare(
        `INSERT INTO audit_log(id,actor_id,action,resource_id)
      SELECT ?,?,'school.profile.publish',? WHERE changes()=1`,
      )
      .bind(crypto.randomUUID(), actor.id, campusId),
  ]);
  return write.meta.changes
    ? schoolReply({ ok: true })
    : schoolError("conflict", 409);
}
