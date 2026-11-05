import { requestEmailLocale } from "./email-locale";

export type SchoolActor = {
  id: string;
  role: string;
  preferred_locale?: string;
  disabled?: number;
};
export const schoolReply = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });
export const schoolError = (key: string, status: number) =>
  schoolReply({ error: "schoolEval." + key }, status);
export const reviewDimensions = [
  "teaching",
  "environment",
  "support",
  "communication",
] as const;

export async function schoolInput(req: Request) {
  try {
    const body = await req.text();
    const value = body.length <= 30000 ? JSON.parse(body) : null;
    return value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
}

export function evidenceUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    return ["https:", "http:"].includes(url.protocol) &&
      !url.username &&
      !url.password
      ? url.href
      : null;
  } catch {
    return null;
  }
}

const validRating = (rating: unknown) =>
  typeof rating === "number" &&
  Number.isInteger(rating) &&
  rating >= 1 &&
  rating <= 5;
const reviewText = (value: unknown) =>
  typeof value === "string" &&
  value.trim().length >= 20 &&
  value.trim().length <= 2000;
const reviewFields =
  "v.body,v.rating,v.teaching,v.environment,v.support,v.communication,v.relationship,v.experience_year AS experienceYear,v.locale";
const audit = (
  db: D1Database,
  actor: SchoolActor,
  action: string,
  resource: string,
) =>
  db
    .prepare(
      "INSERT INTO audit_log(id,actor_id,action,resource_id) SELECT ?,?,?,? WHERE changes()=1",
    )
    .bind(crypto.randomUUID(), actor.id, action, resource);

export async function schoolReviews(
  req: Request,
  db: D1Database,
  campusId: string,
  actor: SchoolActor | null,
) {
  const campus = await db
    .prepare("SELECT school_key FROM school_campus_profiles WHERE id=?")
    .bind(campusId)
    .first<{ school_key: string }>();
  if (!campus) return schoolError("missing", 404);
  const key = campus.school_key;
  if (req.method === "GET") {
    const url = new URL(req.url);
    const requestedPage = Number(url.searchParams.get("page"));
    const page = Number.isSafeInteger(requestedPage)
      ? Math.max(0, Math.min(10000, requestedPage))
      : 0;
    const statements = [
      db
        .prepare(
          `SELECT r.id,v.body,v.rating,v.relationship,v.experience_year AS experienceYear,r.published_at AS publishedAt
        FROM school_reviews r JOIN school_review_versions v ON v.id=r.public_id
        WHERE r.school_key=? ORDER BY r.published_at DESC,r.id LIMIT 10 OFFSET ?`,
        )
        .bind(key, page * 10),
      db
        .prepare(
          `SELECT COUNT(*) AS total,${["rating", ...reviewDimensions]
            .map(
              (metric) =>
                `COUNT(v.${metric}) AS ${metric}Count,CASE WHEN COUNT(v.${metric})>=5 THEN ROUND(AVG(v.${metric}),1) END AS ${metric}`,
            )
            .join(",")},${[1, 2, 3, 4, 5]
            .map(
              (star) =>
                `CASE WHEN COUNT(*)>=5 THEN SUM(v.rating=${star}) END AS star${star}`,
            )
            .join(",")}
        FROM school_reviews r JOIN school_review_versions v ON v.id=r.public_id WHERE r.school_key=?`,
        )
        .bind(key),
    ];
    if (actor && !actor.disabled)
      statements.push(
        db
          .prepare(
            `SELECT r.id,r.etag,r.status,r.reason,
      r.public_id IS NOT NULL AS hasPublic,${reviewFields} FROM school_reviews r
      JOIN school_review_versions v ON v.id=r.latest_id WHERE r.school_key=? AND r.author_id=?`,
          )
          .bind(key, actor.id),
      );
    const [entries, summary, mine] = await db.batch(statements);
    return schoolReply({
      entries: entries.results,
      summary: summary.results[0],
      mine: mine?.results[0] ?? null,
      signedIn: Boolean(actor && !actor.disabled),
    });
  }
  if (req.method !== "POST") return schoolError("invalid", 405);
  if (!actor) return schoolError("signIn", 401);
  if (actor.disabled) return schoolError("forbidden", 403);
  const input = await schoolInput(req);
  if (!input) return schoolError("invalid", 400);
  const existing = await db
    .prepare(
      "SELECT id,etag,status FROM school_reviews WHERE school_key=? AND author_id=?",
    )
    .bind(key, actor.id)
    .first<{ id: string; etag: string; status: string }>();
  const expected = input.etag ?? null;
  if ((existing?.etag ?? null) !== expected)
    return schoolError("conflict", 409);
  if (existing?.status === "deleted") return schoolError("forbidden", 403);
  const now = Date.now();
  const revision = crypto.randomUUID();
  if (input.action === "withdraw" || input.action === "unpublish") {
    if (!existing) return schoolError("missing", 404);
    const result = await db
      .prepare(
        `UPDATE school_reviews SET public_id=NULL,published_at=NULL,
      status=CASE WHEN ?='withdraw' THEN 'withdrawn' ELSE status END, etag=?,updated_at=?
      WHERE id=? AND etag=? AND status<>'deleted' AND (?='withdraw' OR (status='pending' AND public_id IS NOT NULL))`,
      )
      .bind(
        input.action,
        revision,
        now,
        existing.id,
        existing.etag,
        input.action,
      )
      .run();
    return result.meta.changes
      ? schoolReply({ ok: true })
      : schoolError("conflict", 409);
  }
  const { body, rating, relationship, experienceYear } = input;
  const dimensions = reviewDimensions.map((metric) => input[metric] ?? null);
  if (
    input.action !== "submit" ||
    !reviewText(body) ||
    !validRating(rating) ||
    !dimensions.every((value) => value === null || validRating(value)) ||
    (relationship != null &&
      (typeof relationship !== "string" ||
        !["parent", "student", "alumni", "staff", "other"].includes(
          relationship,
        ))) ||
    (experienceYear != null &&
      (typeof experienceYear !== "string" ||
        !/^20\d\d-20\d\d$/.test(experienceYear) ||
        Number(experienceYear.slice(5)) !==
          Number(experienceYear.slice(0, 4)) + 1))
  )
    return schoolError("invalid", 400);
  const reviewId = existing?.id ?? crypto.randomUUID();
  const rateSql =
    "(SELECT COUNT(*) FROM school_review_versions WHERE actor_id=? AND created_at>?)";
  const [write] = await db.batch([
    db
      .prepare(
        `INSERT INTO school_reviews(id,school_key,campus_id,author_id,latest_id,status,etag,updated_at)
      SELECT ?,?,?,?,?,'pending',?,? WHERE ${rateSql}<10
      ON CONFLICT(school_key,author_id) DO UPDATE SET latest_id=excluded.latest_id,status='pending',
        campus_id=excluded.campus_id,etag=excluded.etag,updated_at=excluded.updated_at,reason=NULL
      WHERE school_reviews.etag IS ? AND school_reviews.status<>'deleted'`,
      )
      .bind(
        reviewId,
        key,
        campusId,
        actor.id,
        revision,
        revision,
        now,
        actor.id,
        now - 3600000,
        expected,
      ),
    db
      .prepare(
        `INSERT INTO school_review_versions(id,review_id,body,rating,teaching,environment,support,communication,
      relationship,experience_year,locale,actor_id,created_at)
      SELECT ?,?,?,?,?,?,?,?,?,?,?,?,? FROM school_reviews WHERE id=? AND latest_id=?`,
      )
      .bind(
        revision,
        reviewId,
        (body as string).trim(),
        rating,
        ...dimensions,
        relationship ?? null,
        experienceYear ?? null,
        requestEmailLocale(req, input.locale, actor.preferred_locale),
        actor.id,
        now,
        reviewId,
        revision,
      ),
  ]);
  if (write.meta.changes) return schoolReply({ ok: true }, 201);
  const rate = await db
    .prepare(`SELECT ${rateSql} AS count`)
    .bind(actor.id, now - 3600000)
    .first<number>("count");
  return rate != null && rate >= 10
    ? schoolError("limited", 429)
    : schoolError("conflict", 409);
}

export async function moderateSchoolReviews(
  req: Request,
  db: D1Database,
  actor: SchoolActor,
  id?: string,
) {
  if (req.method === "GET") {
    if (id) {
      const [versions, decisions] = await db.batch([
        db
          .prepare(
            `SELECT v.id,${reviewFields},v.created_at AS createdAt,v.actor_id AS actorId,
        (v.id=r.public_id) AS isPublic,(v.id=r.latest_id) AS isLatest
        FROM school_review_versions v JOIN school_reviews r ON r.id=v.review_id
        WHERE r.id=? ORDER BY v.created_at DESC LIMIT 50`,
          )
          .bind(id),
        db
          .prepare(
            `SELECT id,action,reason,actor_id AS actorId,version_id AS versionId,created_at AS createdAt
          FROM school_review_moderation WHERE review_id=? ORDER BY created_at DESC LIMIT 50`,
          )
          .bind(id),
      ]);
      return schoolReply({
        versions: versions.results,
        decisions: decisions.results,
      });
    }
    const params = new URL(req.url).searchParams;
    const status = params.get("status") ?? "pending";
    const campus = params.get("campus") ?? "";
    const locale = params.get("locale") ?? "";
    const page = Math.max(
      0,
      Math.min(10000, Math.floor(Number(params.get("page")) || 0)),
    );
    const { results } = await db
      .prepare(
        `SELECT r.id,r.campus_id AS campusId,r.status,r.etag,r.reason,
      r.updated_at AS updatedAt,r.public_id IS NOT NULL AS hasPublic,${reviewFields},
      a.name AS author,a.email AS authorEmail,(r.author_id=?) AS own,
      json_extract(c.record,'$.学校正式名称') AS schoolName
      FROM school_reviews r JOIN school_review_versions v ON v.id=r.latest_id
      JOIN accounts a ON a.id=r.author_id JOIN school_campus_profiles c ON c.id=r.campus_id
      WHERE (?='all' AND r.status<>'deleted' OR r.status=?)
        AND (?='' OR r.school_key=(SELECT school_key FROM school_campus_profiles WHERE id=?))
        AND (?='' OR v.locale=?) ORDER BY r.updated_at DESC,r.id LIMIT 31 OFFSET ?`,
      )
      .bind(actor.id, status, status, campus, campus, locale, locale, page * 30)
      .all();
    return schoolReply({
      entries: results.slice(0, 30),
      more: results.length > 30,
    });
  }
  if (req.method !== "POST" || !id) return schoolError("invalid", 405);
  const input = await schoolInput(req);
  const action = typeof input?.action === "string" ? input.action : "";
  const reason = typeof input?.reason === "string" ? input.reason.trim() : "";
  if (
    !input ||
    typeof input.etag !== "string" ||
    !reason ||
    reason.length > 1000
  )
    return schoolError("invalid", 400);
  const existing = await db
    .prepare("SELECT * FROM school_reviews WHERE id=?")
    .bind(id)
    .first<{
      author_id: string;
      latest_id: string;
      public_id: string | null;
      status: string;
      etag: string;
    }>();
  if (!existing) return schoolError("missing", 404);
  if (existing.author_id === actor.id) return schoolError("forbidden", 403);
  if (existing.etag !== input.etag || existing.status === "deleted")
    return schoolError("conflict", 409);
  const etag = crypto.randomUUID();
  const now = Date.now();
  const statements: D1PreparedStatement[] = [];
  if (action === "redact") {
    if (
      !reviewText(input.body) ||
      !["pending", "published"].includes(existing.status)
    )
      return schoolError("invalid", 400);
    statements.push(
      db
        .prepare(
          `UPDATE school_reviews SET latest_id=?,public_id=CASE WHEN public_id=latest_id THEN ? ELSE public_id END,
        etag=?,updated_at=? WHERE id=? AND etag=?`,
        )
        .bind(etag, etag, etag, now, id, existing.etag),
      db
        .prepare(
          `INSERT INTO school_review_versions(id,review_id,body,rating,teaching,environment,support,communication,
        relationship,experience_year,locale,actor_id,created_at)
        SELECT ?,v.review_id,?,v.rating,v.teaching,v.environment,v.support,v.communication,
          v.relationship,v.experience_year,v.locale,?,? FROM school_review_versions v JOIN school_reviews r ON r.id=v.review_id
          WHERE v.id=? AND r.etag=?`,
        )
        .bind(
          etag,
          (input.body as string).trim(),
          actor.id,
          now,
          existing.latest_id,
          etag,
        ),
    );
  } else {
    const statuses: Record<string, string> = {
      approve: "published",
      return: "returned",
      reject: "rejected",
      hide: "hidden",
      delete: "deleted",
    };
    const status = Object.hasOwn(statuses, action) ? statuses[action] : null;
    if (
      !status ||
      (["approve", "return", "reject"].includes(action) &&
        existing.status !== "pending")
    )
      return schoolError("invalid", 400);
    const visibility =
      action === "approve"
        ? "latest_id"
        : ["hide", "delete"].includes(action)
          ? "NULL"
          : "public_id";
    const published =
      action === "approve"
        ? "?"
        : visibility === "NULL"
          ? "NULL"
          : "published_at";
    statements.push(
      db
        .prepare(
          `UPDATE school_reviews SET status=?,reason=?,public_id=${visibility},
      published_at=${published},etag=?,updated_at=? WHERE id=? AND etag=?`,
        )
        .bind(
          status,
          reason,
          ...(action === "approve" ? [now] : []),
          etag,
          now,
          id,
          existing.etag,
        ),
    );
  }
  // Store the decision separately from the author's status message.
  statements.push(
    db
      .prepare(
        `INSERT INTO school_review_moderation(id,review_id,actor_id,action,reason,version_id,created_at)
    SELECT ?,?,?,?,?,latest_id,? FROM school_reviews WHERE id=? AND etag=?`,
      )
      .bind(etag, id, actor.id, action, reason, now, id, etag),
  );
  statements.push(audit(db, actor, "school.review." + action, id));
  const [write] = await db.batch(statements);
  return write.meta.changes
    ? schoolReply({ ok: true })
    : schoolError("conflict", 409);
}
