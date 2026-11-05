import type { Env } from "./index";
import { digest } from "./auth-crypto";
import { systemReply } from "./system-settings";

const visitorTimezone = "America/Toronto";
const dateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: visitorTimezone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
export function visitorDay(time: number) {
  const fields = Object.fromEntries(
    dateFormatter.formatToParts(time).map((part) => [part.type, part.value]),
  );
  return fields.year + "-" + fields.month + "-" + fields.day;
}
function monday(day: string) {
  const date = new Date(day + "T00:00:00Z");
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date.toISOString().slice(0, 10);
}
const uuid = (value: unknown): value is string =>
  typeof value === "string" &&
  /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/i.test(value);

export async function trackVisit(
  req: Request,
  env: Env,
  user: { id: string; disabled?: number } | null,
) {
  if (req.method !== "POST")
    return systemReply({ error: "visitors.invalid" }, 405);
  let data: Record<string, unknown>;
  try {
    const raw = await req.text();
    data = raw.length <= 4096 ? JSON.parse(raw) : null;
  } catch {
    return systemReply({ error: "visitors.invalid" }, 400);
  }
  if (
    !data ||
    !uuid(data.id) ||
    !uuid(data.visitor) ||
    !uuid(data.secret) ||
    typeof data.path !== "string" ||
    !data.path.startsWith("/") ||
    data.path.startsWith("//") ||
    data.path.includes("?") ||
    data.path.includes("#") ||
    /[\u0000-\u0020]/.test(data.path) ||
    data.path.length > 512 ||
    data.path.startsWith("/api/") ||
    typeof data.durationMs !== "number" ||
    !Number.isSafeInteger(data.durationMs) ||
    data.durationMs < 0
  )
    return systemReply({ error: "visitors.invalid" }, 400);
  const now = Date.now(),
    day = visitorDay(now),
    ip = (req.headers.get("CF-Connecting-IP") ?? "").slice(0, 64);
  const [visitor, owner] = await Promise.all([
    digest(data.visitor),
    digest(data.secret),
  ]);
  const result = await env.DB.prepare(
    `INSERT INTO visitor_pages(id,visitor_key,ownership_hash,account_id,ip,path,started_at,started_day,started_week,updated_at)
   SELECT ?,?,?,?,?,?,?,?,?,? WHERE
     (EXISTS(SELECT 1 FROM visitor_pages WHERE id=?) OR
      ((SELECT COUNT(*) FROM visitor_pages WHERE visitor_key=? AND started_at>?)<120
       AND (SELECT COUNT(*) FROM visitor_pages WHERE ip=? AND started_at>?)<1000))
   ON CONFLICT(id) DO UPDATE SET duration_ms=MAX(visitor_pages.duration_ms,MIN(?,MAX(0,?-visitor_pages.started_at))),updated_at=?
   WHERE visitor_pages.ownership_hash=excluded.ownership_hash AND visitor_pages.visitor_key=excluded.visitor_key
     AND visitor_pages.path=excluded.path`,
  )
    .bind(
      data.id,
      visitor,
      owner,
      user && !user.disabled ? user.id : null,
      ip,
      data.path,
      now,
      day,
      monday(day),
      now,
      data.id,
      visitor,
      now - 60000,
      ip,
      now - 60000,
      data.durationMs,
      now,
      now,
    )
    .run();
  return result.meta.changes
    ? new Response(null, {
        status: 204,
        headers: { "Cache-Control": "no-store" },
      })
    : systemReply({ error: "visitors.invalid" }, 409);
}

export async function visitorAdmin(
  req: Request,
  env: Env,
  user: { role: string },
) {
  if (user.role !== "admin")
    return systemReply({ error: "system.forbidden" }, 403);
  if (req.method !== "GET")
    return systemReply({ error: "visitors.invalid" }, 405);
  const params = new URL(req.url).searchParams;
  if (params.get("view") === "chart") {
    const period = params.get("period") ?? "day";
    if (!["day", "week", "month"].includes(period))
      return systemReply({ error: "visitors.invalid" }, 400);
    const today = visitorDay(Date.now());
    const end =
      period === "week"
        ? monday(today)
        : period === "month"
          ? today.slice(0, 7) + "-01"
          : today;
    const date = new Date(end + "T00:00:00Z"),
      buckets: string[] = [];
    const length = period === "day" ? 30 : 12;
    for (let index = length - 1; index >= 0; index--) {
      const point = new Date(date);
      if (period === "month") point.setUTCMonth(point.getUTCMonth() - index);
      else
        point.setUTCDate(
          point.getUTCDate() - index * (period === "week" ? 7 : 1),
        );
      buckets.push(point.toISOString().slice(0, period === "month" ? 7 : 10));
    }
    const field =
      period === "week"
        ? "started_week"
        : period === "month"
          ? "substr(started_day,1,7)"
          : "started_day";
    const { results } = await env.DB.prepare(
      `SELECT ${field} AS bucket,COUNT(*) AS visits,COUNT(DISTINCT visitor_key) AS visitors,
    SUM(duration_ms) AS durationMs FROM visitor_pages WHERE started_day>=? GROUP BY ${field} ORDER BY bucket`,
    )
      .bind(buckets[0] + (period === "month" ? "-01" : ""))
      .all<{
        bucket: string;
        visits: number;
        visitors: number;
        durationMs: number;
      }>();
    const points = new Map(results.map((row) => [row.bucket, row]));
    const first = await env.DB.prepare(
      "SELECT MIN(started_at) AS first FROM visitor_pages",
    ).first<number>("first");
    return systemReply({
      period,
      timezone: visitorTimezone,
      firstRecordedAt: first ?? null,
      points: buckets.map(
        (bucket) =>
          points.get(bucket) ?? {
            bucket,
            visits: 0,
            visitors: 0,
            durationMs: 0,
          },
      ),
    });
  }
  const route = (params.get("route") ?? "").trim().slice(0, 512),
    search = (params.get("q") ?? "").trim().slice(0, 120);
  const from = params.get("from") ?? "",
    to = params.get("to") ?? "",
    cursor = params.get("cursor") ?? "";
  if (
    (from && !/^\d{4}-\d{2}-\d{2}$/.test(from)) ||
    (to && !/^\d{4}-\d{2}-\d{2}$/.test(to)) ||
    (from && to && from > to)
  )
    return systemReply({ error: "visitors.invalid" }, 400);
  const parts = cursor.split(":"),
    time = parts[0] ? Number(parts[0]) : Number.MAX_SAFE_INTEGER,
    id = parts[1] ?? "";
  if (cursor && (!Number.isSafeInteger(time) || !uuid(id)))
    return systemReply({ error: "visitors.invalid" }, 400);
  const { results } = await env.DB.prepare(
    `SELECT v.id,v.started_at AS startedAt,v.updated_at AS updatedAt,v.ip,v.path,v.duration_ms AS durationMs,
   a.name AS username FROM visitor_pages v LEFT JOIN accounts a ON a.id=v.account_id
   WHERE (v.started_at<? OR v.started_at=? AND v.id<?)
     AND (?='' OR instr(v.path,?)>0) AND (?='' OR instr(lower(COALESCE(a.name,'')),lower(?))>0 OR instr(v.ip,?)>0)
     AND (?='' OR v.started_day>=?) AND (?='' OR v.started_day<=?)
   ORDER BY v.started_at DESC,v.id DESC LIMIT 51`,
  )
    .bind(
      time,
      time,
      id,
      route,
      route,
      search,
      search,
      search,
      from,
      from,
      to,
      to,
    )
    .all<{ id: string; startedAt: number }>();
  const entries = results.slice(0, 50),
    last = entries.at(-1);
  return systemReply({
    entries,
    timezone: visitorTimezone,
    nextCursor:
      results.length > 50 && last ? last.startedAt + ":" + last.id : null,
  });
}
