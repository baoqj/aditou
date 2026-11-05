import type { Env } from "./index";
import { systemReply } from "./system-settings";

export async function adminFeedback(
  req: Request,
  env: Env,
  actor: { role: string },
) {
  if (actor.role !== "admin")
    return systemReply({ error: "system.forbidden" }, 403);
  if (req.method !== "GET")
    return systemReply({ error: "adminHub.invalid" }, 405);
  const params = new URL(req.url).searchParams,
    category = params.get("category") ?? "contact";
  if (!["contact", "issue", "school", "review"].includes(category))
    return systemReply({ error: "adminHub.invalid" }, 400);
  const page = Math.max(0, Math.floor(Number(params.get("page")) || 0));
  if (!Number.isSafeInteger(page) || page > 100000)
    return systemReply({ error: "adminHub.invalid" }, 400);
  const query = (params.get("q") ?? "").trim().slice(0, 120),
    status = params.get("status") ?? "";
  const countStatements = [
    env.DB.prepare(
      "SELECT category,COUNT(*) AS total FROM feedback_messages GROUP BY category",
    ),
    env.DB.prepare("SELECT COUNT(*) AS total FROM school_suggestions"),
    env.DB.prepare("SELECT COUNT(*) AS total FROM school_reviews"),
  ];
  const countResult = await env.DB.batch<{category?:string;total:number}>(countStatements);
  const counts: Record<string, number> = {
    contact: 0,
    issue: 0,
    school: Number(countResult[1].results[0]?.total ?? 0),
    review: Number(countResult[2].results[0]?.total ?? 0),
  };
  for (const row of countResult[0].results)
    if (row.category) counts[row.category] = Number(row.total);
  let statement: D1PreparedStatement;
  if (category === "contact" || category === "issue") {
    statement = env.DB.prepare(
      `SELECT f.id,f.created_at AS createdAt,f.name,f.email,f.phone,f.message,f.status,
   f.submitted_path AS submittedPath,f.locale,a.name AS username
   FROM feedback_messages f LEFT JOIN accounts a ON a.id=f.account_id
   WHERE f.category=? AND (?='' OR instr(lower(f.message||' '||f.name||' '||f.email),lower(?))>0)
     AND (?='' OR f.status=?) ORDER BY f.created_at DESC,f.id LIMIT 26 OFFSET ?`,
    ).bind(category, query, query, status, status, page * 25);
  } else if (category === "school") {
    statement = env.DB.prepare(
      `SELECT s.id,s.created_at AS createdAt,s.name,s.email,s.message,s.status,
   s.source_url AS sourceUrl,s.campus_id AS campusId,s.review_note AS reviewNote,s.locale,a.name AS username,
   json_extract(c.record,'$.学校正式名称') AS schoolName
   FROM school_suggestions s JOIN school_campus_profiles c ON c.id=s.campus_id LEFT JOIN accounts a ON a.id=s.account_id
   WHERE (?='' OR instr(lower(s.message||' '||s.name||' '||s.email||' '||c.record),lower(?))>0)
     AND (?='' OR s.status=?) ORDER BY s.created_at DESC,s.id LIMIT 26 OFFSET ?`,
    ).bind(query, query, status, status, page * 25);
  } else {
    statement = env.DB.prepare(
      `SELECT r.id,r.updated_at AS createdAt,a.name,a.name AS username,a.email,v.body AS message,
    r.status,r.campus_id AS campusId,v.rating,v.teaching,v.environment,v.support,v.communication,v.experience_year AS experienceYear,
    r.reason AS reviewNote,r.public_id IS NOT NULL AS hasPublic,
    json_extract(c.record,'$.学校正式名称') AS schoolName
    FROM school_reviews r JOIN school_review_versions v ON v.id=r.latest_id JOIN accounts a ON a.id=r.author_id
    JOIN school_campus_profiles c ON c.id=r.campus_id
    WHERE (?='' OR instr(lower(v.body||' '||a.name||' '||a.email||' '||c.record),lower(?))>0)
      AND (?='' OR r.status=?) ORDER BY r.updated_at DESC,r.id LIMIT 26 OFFSET ?`,
    ).bind(query, query, status, status, page * 25);
  }
  const { results } = await statement.all();
  return systemReply({
    category,
    counts,
    entries: results.slice(0, 25),
    more: results.length > 25,
  });
}
