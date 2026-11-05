import type { Env } from "./index";

const definition = `s.id, s.level, s.grade, s.code, s.label, s.sector, s.network,
  s.exam_language AS examLanguage, s.metric, s.dimension,
  CASE WHEN s.source_id='26-504-r2' THEN '26-504' ELSE s.source_id END AS sourceId, source.url AS sourceUrl,
  source.source_hash AS sourceVersion`;

export async function schoolRankings(url: URL, env: Env) {
  const response = (body: unknown, status = 200) =>
    Response.json(body, {
      status,
      headers: { "Cache-Control": "no-store" },
    });
  const preview = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  if (!preview && env.SCHOOL_RANKINGS_PUBLIC !== "1")
    return response({ error: "ranking.unavailable" }, 404);

  const release = await env.DB.prepare(
    "SELECT id,method FROM school_rank_releases WHERE current=1",
  ).first<{ id: string; method: string }>();
  if (!release) return response({ error: "ranking.unavailable" }, 404);
  const path = url.pathname.slice("/api/school-rankings".length);
  if (!path) {
    const { results } = await env.DB.prepare(
      `
      SELECT ${definition}, b.year, b.provisional, b.ranked_count AS rankedCount, b.comparison
      FROM school_rank_snapshots b JOIN school_rank_series s ON s.id=b.series_id
      JOIN school_rank_sources source ON source.id=s.source_id
      WHERE b.release_id=? ORDER BY s.level, s.grade, s.code, s.network, b.year DESC
    `,
    )
      .bind(release.id)
      .all();
    return response({ release, boards: results });
  }

  const campus = /^\/campus\/([A-Za-z0-9-]+)$/.exec(path);
  if (campus) {
    const { results } = await env.DB.prepare(
      `
      WITH linked_units AS (
        SELECT unit_id FROM school_rank_unit_campuses WHERE campus_id=?
        UNION
        SELECT g.unit_id FROM school_primary_group_schools g JOIN school_campuses campus
          ON g.school_code=json_extract(campus.record,'$.官方学校编号')
          AND g.authority_code=json_extract(campus.record,'$.主管机构编号')
        WHERE campus.id=? AND json_extract(campus.record,'$.小学标记')=1
      )
      SELECT ${definition}, f.year, COALESCE(rev.score,f.score) AS score,rev.source_url AS correctionUrl,f.participants, f.provisional, f.source_page AS sourcePage,
        r.rank, b.ranked_count AS rankedCount, COALESCE(meta.display_scope,u.scope) AS scope,
        meta.reported_label AS reportedLabel, meta.count_text AS countText, meta.small_group AS smallGroup,
        (g.unit_id IS NOT NULL AND meta.display_scope='campus') AS unassignedBuilding,
        previous.rank AS previousRank, b.comparison
      FROM linked_units c
      JOIN school_rank_units u ON u.id=c.unit_id
      JOIN school_rank_scores f ON f.unit_id=c.unit_id
      JOIN school_rank_series s ON s.id=f.series_id
      JOIN school_rank_sources source ON source.id=s.source_id
      LEFT JOIN school_primary_group_schools g ON g.unit_id=f.unit_id
      LEFT JOIN school_primary_result_meta meta ON meta.series_id=f.series_id AND meta.year=f.year AND meta.unit_id=f.unit_id
      LEFT JOIN school_rank_score_overrides o ON o.release_id=? AND o.series_id=f.series_id AND o.year=f.year AND o.unit_id=f.unit_id
      LEFT JOIN school_score_revisions rev ON rev.id=o.revision_id
      LEFT JOIN school_rank_entries r ON r.unit_id=f.unit_id AND r.series_id=f.series_id AND r.year=f.year AND r.release_id=?
      LEFT JOIN school_rank_snapshots b ON b.release_id=r.release_id AND b.series_id=r.series_id AND b.year=r.year
      LEFT JOIN school_rank_entries previous ON b.comparison='available' AND previous.release_id=r.release_id
        AND previous.series_id=r.series_id AND previous.unit_id=r.unit_id
        AND CAST(substr(previous.year,1,4) AS INTEGER)=CAST(substr(r.year,1,4) AS INTEGER)-1
      WHERE s.level='secondary' OR s.source_id=?
      ORDER BY f.year DESC,s.level,s.grade,s.code,r.rank IS NULL
    `,
    )
      .bind(
        campus[1],
        campus[1],
        release.id,
        release.id,
        release.method.endsWith("-v2") ? "26-504-r2" : "26-504",
      )
      .all();
    const { results: reviews } = await env.DB.prepare(
      `
      SELECT DISTINCT p.year,p.grade,p.code
      FROM school_campuses c JOIN school_primary_repairs p
        ON p.school_code=json_extract(c.record,'$.官方学校编号')
        AND p.authority_code=json_extract(c.record,'$.主管机构编号')
      WHERE c.id=? AND json_extract(c.record,'$.小学标记')=1 ORDER BY p.year DESC,p.grade,p.code
    `,
    )
      .bind(campus[1])
      .all();
    return response({ release, results, reviews });
  }

  const board = /^\/([a-z0-9-]+)\/(\d{4}-\d{4})$/.exec(path);
  if (!board) return response({ error: "ranking.unavailable" }, 404);
  const [, series, year] = board;
  const snapshot = await env.DB.prepare(
    `
    SELECT ${definition}, b.year, b.provisional, b.ranked_count AS rankedCount,b.comparison
    FROM school_rank_snapshots b JOIN school_rank_series s ON s.id=b.series_id
    JOIN school_rank_sources source ON source.id=s.source_id
    WHERE b.release_id=? AND b.series_id=? AND b.year=?
  `,
  )
    .bind(release.id, series, year)
    .first();
  if (!snapshot) return response({ error: "ranking.unavailable" }, 404);
  const { results } = await env.DB.prepare(
    `
    SELECT f.unit_id AS schoolId,r.rank,COALESCE(rev.score,f.score) AS score,f.participants,f.source_page AS sourcePage,
      previous.rank AS previousRank, meta.count_text AS countText, meta.small_group AS smallGroup,
      (SELECT json_group_array(c.campus_id) FROM school_rank_unit_campuses c WHERE c.unit_id=f.unit_id) AS campusIds,
      (SELECT json_group_array(json_object('code', detail.code, 'label', detail.label, 'score', COALESCE(other_rev.score,other.score), 'sourcePage', other.source_page))
        FROM school_rank_scores other JOIN school_rank_series detail ON detail.id=other.series_id
        JOIN school_rank_series current ON current.id=f.series_id
        LEFT JOIN school_rank_score_overrides oo ON oo.release_id=? AND oo.series_id=other.series_id AND oo.year=other.year AND oo.unit_id=other.unit_id
        LEFT JOIN school_score_revisions other_rev ON other_rev.id=oo.revision_id
        WHERE other.unit_id=f.unit_id AND other.year=f.year AND detail.grade=current.grade
          AND detail.level=current.level AND detail.source_id=current.source_id AND detail.id<>current.id
          AND detail.dimension=current.dimension
      ) AS subjects
    FROM school_rank_scores f
    JOIN school_rank_units u ON u.id=f.unit_id
    LEFT JOIN school_primary_result_meta meta USING(series_id,year,unit_id)
    LEFT JOIN school_rank_score_overrides o ON o.release_id=? AND o.series_id=f.series_id AND o.year=f.year AND o.unit_id=f.unit_id
    LEFT JOIN school_score_revisions rev ON rev.id=o.revision_id
    LEFT JOIN school_rank_entries r ON r.release_id=? AND r.series_id=f.series_id AND r.year=f.year AND r.unit_id=f.unit_id
    LEFT JOIN school_rank_entries previous ON ?='available' AND previous.release_id=r.release_id
      AND previous.series_id=r.series_id AND previous.unit_id=r.unit_id AND previous.year=?
    WHERE f.series_id=? AND f.year=? AND (r.rank IS NOT NULL OR (?='programme' AND u.scope='school'))
    ORDER BY r.rank,f.unit_id
  `,
  )
    .bind(
      release.id,
      release.id,
      release.id,
      snapshot.comparison,
      year
        .split("-")
        .map((part) => Number(part) - 1)
        .join("-"),
      series,
      year,
      snapshot.dimension,
    )
    .all<{ campusIds: string; subjects: string }>();
  const { results: held } =
    snapshot.level === "primary"
      ? await env.DB.prepare(
          `
    SELECT DISTINCT c.id
    FROM school_primary_repairs p JOIN school_campuses c
      ON p.school_code=json_extract(c.record,'$.官方学校编号')
      AND p.authority_code=json_extract(c.record,'$.主管机构编号')
    WHERE p.year=? AND p.grade=? AND p.code=? AND json_extract(c.record,'$.小学标记')=1
  `,
        )
          .bind(year, snapshot.grade, snapshot.code)
          .all<{ id: string }>()
      : { results: [] };
  return response({
    release,
    board: snapshot,
    heldCampusIds: held.map((row) => row.id),
    rows: results.map((row) => ({
      ...row,
      campusIds: JSON.parse(row.campusIds),
      subjects: JSON.parse(row.subjects),
    })),
  });
}
