import {
  evidenceUrl,
  schoolError,
  schoolInput,
  schoolReply,
  type SchoolActor,
} from "./school-reviews";

type ScoreKey = { series: string; year: string; unit: string };
type Revision = {
  id: string;
  base_release: string;
  series_id: string;
  year: string;
  unit_id: string;
  score: number;
  published_release: string | null;
};

const releaseQuery =
  "SELECT id,method FROM school_rank_releases WHERE current=1";
const publishedScoreJoin = `LEFT JOIN school_rank_score_overrides o ON o.release_id=? AND o.series_id=f.series_id AND o.year=f.year AND o.unit_id=f.unit_id
  LEFT JOIN school_score_revisions rev ON rev.id=o.revision_id`;

function reranked(db: D1Database, base: string, key: ScoreKey, score: number) {
  return db
    .prepare(
      `SELECT f.unit_id AS unit,r.rank AS oldRank,
    RANK() OVER(ORDER BY CASE WHEN f.unit_id=? THEN ? ELSE COALESCE(rev.score,f.score) END DESC) AS rank
    FROM school_rank_entries r JOIN school_rank_scores f USING(series_id,year,unit_id)
    ${publishedScoreJoin}
    WHERE r.release_id=? AND r.series_id=? AND r.year=?`,
    )
    .bind(key.unit, score, base, base, key.series, key.year);
}

export async function schoolScoreList(db: D1Database, campusId: string) {
  const release = await db
    .prepare(releaseQuery)
    .first<{ id: string; method: string }>();
  if (!release) return schoolError("missing", 404);
  const [facts, revisions, held, releases] = await db.batch([
    db
      .prepare(
        `WITH linked AS (
      SELECT unit_id FROM school_rank_unit_campuses WHERE campus_id=?
      UNION
      SELECT g.unit_id FROM school_primary_group_schools g JOIN school_campuses c
        ON g.school_code=json_extract(c.record,'$.官方学校编号') AND g.authority_code=json_extract(c.record,'$.主管机构编号')
        WHERE c.id=? AND json_extract(c.record,'$.小学标记')=1
    )
    SELECT f.series_id AS series,f.year,f.unit_id AS unit,f.score AS original,
      COALESCE(rev.score,f.score) AS score,rev.source_url AS correctionUrl,
      f.participants,f.source_page AS sourcePage,f.provisional,m.reported_label AS reportedLabel,
      m.count_text AS countText,m.small_group AS smallGroup,
      COALESCE(m.display_scope,u.scope) AS scope,s.level,s.grade,s.code,s.label,s.dimension,s.metric,
      source.url AS sourceUrl,r.rank
    FROM linked JOIN school_rank_units u ON u.id=linked.unit_id
    JOIN school_rank_scores f ON f.unit_id=u.id JOIN school_rank_series s ON s.id=f.series_id
    JOIN school_rank_sources source ON source.id=s.source_id
    LEFT JOIN school_primary_result_meta m USING(series_id,year,unit_id)
    ${publishedScoreJoin}
    LEFT JOIN school_rank_entries r ON r.release_id=? AND r.series_id=f.series_id AND r.year=f.year AND r.unit_id=f.unit_id
    WHERE s.level='secondary' OR s.source_id=?
    ORDER BY f.year DESC,s.level,s.grade,s.code,scope`,
      )
      .bind(
        campusId,
        campusId,
        release.id,
        release.id,
        release.method.endsWith("-v2") ? "26-504-r2" : "26-504",
      ),
    db
      .prepare(
        `SELECT v.id,v.base_release AS baseRelease,v.series_id AS series,v.year,v.unit_id AS unit,
      v.score,v.source_url AS sourceUrl,v.reason,v.published_release AS publishedRelease,v.created_at AS createdAt
      FROM school_score_revisions v JOIN school_rank_unit_campuses c ON c.unit_id=v.unit_id
      WHERE c.campus_id=? ORDER BY v.created_at DESC LIMIT 50`,
      )
      .bind(campusId),
    db
      .prepare(
        `SELECT p.year,p.grade,p.code,p.visibility,p.pdf_page AS sourcePage,p.pdf_row AS sourceRow,p.data
      FROM school_primary_repairs p JOIN school_campuses c
        ON p.school_code=json_extract(c.record,'$.官方学校编号') AND p.authority_code=json_extract(c.record,'$.主管机构编号')
      WHERE c.id=? AND json_extract(c.record,'$.小学标记')=1 ORDER BY p.year DESC,p.pdf_page,p.pdf_row`,
      )
      .bind(campusId),
    db
      .prepare(
        `SELECT r.id,r.current,v.created_at AS createdAt,v.reason FROM school_rank_releases r
      LEFT JOIN school_score_revisions v ON v.published_release=r.id WHERE r.method=?
      ORDER BY r.current DESC,v.created_at DESC,r.id LIMIT 50`,
      )
      .bind(release.method),
  ]);
  return schoolReply({
    release: release.id,
    facts: facts.results,
    revisions: revisions.results,
    held: held.results,
    releases: releases.results,
  });
}

export async function manageSchoolScores(
  req: Request,
  db: D1Database,
  actor: SchoolActor,
  campusId: string,
) {
  if (req.method === "GET") return schoolScoreList(db, campusId);
  if (req.method !== "POST") return schoolError("invalid", 405);
  const input = await schoolInput(req);
  const current = await db
    .prepare(releaseQuery)
    .first<{ id: string; method: string }>();
  if (!input || !current) return schoolError("invalid", 400);
  const action = input.action;
  const reason = typeof input.reason === "string" ? input.reason.trim() : "";
  if (action === "restore") {
    if (
      !reason ||
      reason.length > 1000 ||
      typeof input.release !== "string" ||
      input.release === current.id
    )
      return schoolError("invalid", 400);
    if (input.baseRelease !== current.id) return schoolError("conflict", 409);
    const [write] = await db.batch([
      db
        .prepare(
          `UPDATE school_rank_releases SET current=0 WHERE id=? AND current=1 AND EXISTS(
        SELECT 1 FROM school_rank_releases WHERE id=? AND method=?)`,
        )
        .bind(current.id, input.release, current.method),
      db
        .prepare(
          "UPDATE school_rank_releases SET current=1 WHERE id=? AND changes()=1",
        )
        .bind(input.release),
      db
        .prepare(
          `INSERT INTO school_rank_release_restores(id,from_release,to_release,actor_id,reason,created_at)
        SELECT ?,?,?,?,?,? WHERE changes()=1`,
        )
        .bind(
          crypto.randomUUID(),
          current.id,
          input.release,
          actor.id,
          reason,
          Date.now(),
        ),
      db
        .prepare(
          `INSERT INTO audit_log(id,actor_id,action,resource_id)
        SELECT ?,?,'school.score.restore',? WHERE changes()=1`,
        )
        .bind(crypto.randomUUID(), actor.id, input.release),
    ]);
    return write.meta.changes
      ? schoolReply({ ok: true })
      : schoolError("conflict", 409);
  }
  if (action === "publish" || action === "preview") {
    if (typeof input.id !== "string") return schoolError("invalid", 400);
    const draft = await db
      .prepare(
        `SELECT v.* FROM school_score_revisions v JOIN school_rank_unit_campuses c
      ON c.unit_id=v.unit_id WHERE v.id=? AND c.campus_id=?`,
      )
      .bind(input.id, campusId)
      .first<Revision>();
    if (!draft) return schoolError("missing", 404);
    if (action === "publish" && draft.published_release)
      return schoolReply({ ok: true, release: draft.published_release });
    if (draft.base_release !== current.id || draft.published_release)
      return schoolError("conflict", 409);
    const key = {
      series: draft.series_id,
      year: draft.year,
      unit: draft.unit_id,
    };
    if (action === "preview") {
      const { results } = await reranked(db, current.id, key, draft.score).all<{
        unit: string;
        oldRank: number;
        rank: number;
      }>();
      const target = results.find((entry) => entry.unit === key.unit);
      return schoolReply({
        score: draft.score,
        oldRank: target?.oldRank ?? null,
        newRank: target?.rank ?? null,
        affected: results.filter((entry) => entry.rank !== entry.oldRank)
          .length,
        ranked: results.length,
      });
    }
    const id = "revision-" + crypto.randomUUID();
    const [write] = await db.batch([
      db
        .prepare(
          `INSERT INTO school_rank_releases(id,method,current) SELECT ?,method,0
        FROM school_rank_releases WHERE current=1 AND id=?`,
        )
        .bind(id, current.id),
      db
        .prepare(
          `INSERT INTO school_rank_snapshots SELECT ?,series_id,year,ranked_count,provisional,comparison
        FROM school_rank_snapshots WHERE release_id=? AND EXISTS(SELECT 1 FROM school_rank_releases WHERE id=?)`,
        )
        .bind(id, current.id, id),
      db
        .prepare(
          `INSERT INTO school_rank_score_overrides SELECT ?,series_id,year,unit_id,revision_id
        FROM school_rank_score_overrides WHERE release_id=? AND NOT (series_id=? AND year=? AND unit_id=?)
          AND EXISTS(SELECT 1 FROM school_rank_releases WHERE id=?)`,
        )
        .bind(id, current.id, key.series, key.year, key.unit, id),
      db
        .prepare(
          `INSERT INTO school_rank_score_overrides SELECT ?,?,?,?,?
        WHERE EXISTS(SELECT 1 FROM school_rank_releases WHERE id=?)`,
        )
        .bind(id, key.series, key.year, key.unit, draft.id, id),
      db
        .prepare(
          `INSERT INTO school_rank_entries SELECT ?,series_id,year,unit_id,rank
        FROM school_rank_entries WHERE release_id=? AND NOT (series_id=? AND year=?)
          AND EXISTS(SELECT 1 FROM school_rank_releases WHERE id=?)`,
        )
        .bind(id, current.id, key.series, key.year, id),
      db
        .prepare(
          `INSERT INTO school_rank_entries
        SELECT ?,f.series_id,f.year,f.unit_id,RANK() OVER (ORDER BY COALESCE(rev.score,f.score) DESC)
        FROM school_rank_entries r JOIN school_rank_scores f USING(series_id,year,unit_id)
        ${publishedScoreJoin}
        WHERE r.release_id=? AND r.series_id=? AND r.year=? AND EXISTS(SELECT 1 FROM school_rank_releases WHERE id=?)`,
        )
        .bind(id, id, current.id, key.series, key.year, id),
      db
        .prepare(
          `UPDATE school_rank_releases SET current=0 WHERE id=? AND current=1
        AND EXISTS(SELECT 1 FROM school_rank_releases WHERE id=?)`,
        )
        .bind(current.id, id),
      db
        .prepare(
          "UPDATE school_rank_releases SET current=1 WHERE id=? AND changes()=1",
        )
        .bind(id),
      db
        .prepare(
          "UPDATE school_score_revisions SET published_release=? WHERE id=? AND changes()=1",
        )
        .bind(id, draft.id),
      db
        .prepare(
          `INSERT INTO audit_log(id,actor_id,action,resource_id)
        SELECT ?,?,'school.score.publish',? WHERE changes()=1`,
        )
        .bind(crypto.randomUUID(), actor.id, id),
    ]);
    return write.meta.changes
      ? schoolReply({ ok: true, release: id })
      : schoolError("conflict", 409);
  }
  const source = evidenceUrl(input.sourceUrl);
  const { series, year, unit, score } = input;
  if (
    action !== "draft" ||
    !source ||
    !reason ||
    reason.length > 1000 ||
    typeof score !== "number" ||
    !Number.isInteger(score) ||
    score < 0 ||
    score > 1000 ||
    typeof series !== "string" ||
    typeof year !== "string" ||
    typeof unit !== "string"
  )
    return schoolError("invalid", 400);
  if (input.baseRelease !== current.id) return schoolError("conflict", 409);
  const id = crypto.randomUUID();
  // Corrections apply only to existing, published school-scope facts. Scope and sample changes remain source repairs.
  const [write] = await db.batch([
    db
      .prepare(
        `INSERT INTO school_score_revisions(id,base_release,series_id,year,unit_id,score,source_url,reason,actor_id,created_at)
      SELECT ?,?,f.series_id,f.year,f.unit_id,?,?,?,?,?
      FROM school_rank_scores f JOIN school_rank_units u ON u.id=f.unit_id
      JOIN school_rank_unit_campuses c ON c.unit_id=f.unit_id JOIN school_rank_series s ON s.id=f.series_id
      LEFT JOIN school_primary_result_meta m USING(series_id,year,unit_id)
      WHERE f.series_id=? AND f.year=? AND f.unit_id=? AND c.campus_id=? AND COALESCE(m.display_scope,u.scope)='school'
        AND (s.level='secondary' OR s.source_id=?) AND EXISTS(SELECT 1 FROM school_rank_releases WHERE id=? AND current=1)`,
      )
      .bind(
        id,
        current.id,
        score,
        source,
        reason,
        actor.id,
        Date.now(),
        series,
        year,
        unit,
        campusId,
        current.method.endsWith("-v2") ? "26-504-r2" : "26-504",
        current.id,
      ),
    db
      .prepare(
        `INSERT INTO audit_log(id,actor_id,action,resource_id)
      SELECT ?,?,'school.score.draft',? WHERE changes()=1`,
      )
      .bind(crypto.randomUUID(), actor.id, id),
  ]);
  return write.meta.changes
    ? schoolReply({ id }, 201)
    : schoolError("conflict", 409);
}
