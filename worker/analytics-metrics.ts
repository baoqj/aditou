export type Fact = Record<string, any>;
export const METRIC_VERSION = "aditou-analytics-v1";
export const OBJECTIVE_TYPES = new Set([
  "qcm",
  "numeric",
  "multiple",
  "order",
  "matching",
]);
export const GRADED = new Set(["correct", "partial", "incorrect"]);
const dayFormatters = new Map<string, Intl.DateTimeFormat>();
export function localDay(ms: number, timezone: string) {
  let formatter = dayFormatters.get(timezone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (dayFormatters.size < 32) dayFormatters.set(timezone, formatter);
  }
  const parts = formatter.formatToParts(ms);
  return ["year", "month", "day"]
    .map((k) => parts.find((p) => p.type === k)!.value)
    .join("-");
}
export function addDays(day: string, n: number) {
  return new Date(Date.parse(day + "T12:00:00Z") + n * 86400000)
    .toISOString()
    .slice(0, 10);
}
export function midnight(day: string, timezone: string) {
  const target = Date.parse(day + "T00:00:00Z");
  let result = target;
  for (let i = 0; i < 4; i++) {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hourCycle: "h23",
    }).formatToParts(result);
    const part = (k: string) => parts.find((p) => p.type === k)!.value;
    const actual = Date.parse(
      `${part("year")}-${part("month")}-${part("day")}T${part("hour")}:${part("minute")}:${part("second")}Z`,
    );
    result += target - actual;
  }
  return result;
}
export function parseTime(value: string | number) {
  return typeof value === "number"
    ? value
    : Date.parse(
        value.includes("T")
          ? /[zZ]|[+-]\d\d:\d\d$/.test(value)
            ? value
            : value + "Z"
          : value.replace(" ", "T") + "Z",
      );
}
export function ratio(numerator: number, denominator: number) {
  return {
    numerator,
    denominator,
    percent: denominator
      ? Math.round((1000 * numerator) / denominator) / 10
      : null,
  };
}
export function performance(rows: Fact[]) {
  const graded = rows.filter((r) => GRADED.has(r.status) && r.score != null),
    objective = graded.filter((r) => OBJECTIVE_TYPES.has(r.response_type));
  return {
    submissions: rows.length,
    learners: new Set(rows.map((r) => r.learner_id)).size,
    pending: rows.filter((r) => r.status === "pending_manual").length,
    unreleased: rows.filter((r) => r.status === "submitted").length,
    graded: graded.length,
    accuracy: ratio(
      objective.filter((r) => r.status === "correct").length,
      objective.length,
    ),
    score: ratio(
      graded.reduce((s, r) => s + Number(r.score), 0),
      graded.reduce((s, r) => s + Number(r.possible || 2), 0),
    ),
    first: ratio(
      objective.filter((r) => r.first).filter((r) => r.status === "correct")
        .length,
      objective.filter((r) => r.first).length,
    ),
    repeat: ratio(
      objective.filter((r) => !r.first).filter((r) => r.status === "correct")
        .length,
      objective.filter((r) => !r.first).length,
    ),
    new_items: rows.filter((r) => r.first).length,
    repeats: rows.filter((r) => !r.first).length,
    help_unknown: rows.filter((r) => !r.hint_used).length,
    hinted: rows.filter((r) => r.hint_used).length,
  };
}
// Sweep all overlapping intervals per learner; one instant belongs to exactly one kind/source.
export function unionActivity(
  rows: Fact[],
  start: number,
  end: number,
  timezone: string,
) {
  const groups = new Map<string, Fact[]>();
  for (const r of rows) {
    const list = groups.get(r.learner_id) || [];
    list.push(r);
    groups.set(r.learner_id, list);
  }
  const output: Fact[] = [];
  const dayEnds = new Map<string, number>();
  const priority: Record<string, number> = {
    interaction: 3,
    listening: 2,
    reading: 1,
  };
  for (const [learner, items] of groups) {
    const events: Fact[] = [];
    for (const r of items) {
      const a = Math.max(start, Number(r.started_at)),
        b = Math.min(end, Number(r.ended_at));
      if (b > a) {
        events.push({ t: a, r, add: true }, { t: b, r, add: false });
      }
    }
    events.sort((a, b) => a.t - b.t);
    const active = new Map<string, Fact>();
    let previous = events[0]?.t;
    for (const event of events) {
      if (event.t > previous && active.size) {
        const top = [...active.values()].sort(
          (a, b) =>
            priority[b.kind] - priority[a.kind] ||
            String(a.id).localeCompare(String(b.id)),
        )[0];
        let cursor = previous;
        while (cursor < event.t) {
          const day = localDay(cursor, timezone);
          let dayEnd = dayEnds.get(day);
          if (dayEnd === undefined) {
            dayEnd = midnight(addDays(day, 1), timezone);
            dayEnds.set(day, dayEnd);
          }
          const finish = Math.min(event.t, dayEnd);
          if (finish <= cursor) break;
          output.push({
            learner_id: learner,
            day,
            context: top.context,
            kind: top.kind,
            ms: finish - cursor,
          });
          cursor = finish;
        }
      }
      if (event.add) active.set(event.r.id, event.r);
      else active.delete(event.r.id);
      previous = event.t;
    }
  }
  return output;
}
export function unionMs(rows: Fact[]) {
  const sorted = rows
    .map((r) => [Number(r.started_at), Number(r.ended_at)])
    .sort((a, b) => a[0] - b[0]);
  let total = 0,
    start = 0,
    end = 0;
  for (const [a, b] of sorted) {
    if (a > end) {
      total += end - start;
      start = a;
      end = b;
    } else end = Math.max(end, b);
  }
  return total + end - start;
}
export function summarize(
  rows: Fact[],
  intervals: Fact[],
  start: string,
  end: string,
  timezone: string,
) {
  const begin = midnight(start, timezone),
    finish = midnight(addDays(end, 1), timezone),
    pieces = unionActivity(intervals, begin, finish, timezone),
    daily: Fact[] = [];
  const byDay = new Map<string, Fact[]>(),
    timeByDay = new Map<string, Fact[]>();
  for (const r of rows) {
    const day = localDay(parseTime(r.created_at), timezone),
      group = byDay.get(day) || [];
    group.push(r);
    byDay.set(day, group);
  }
  for (const piece of pieces) {
    const group = timeByDay.get(piece.day) || [];
    group.push(piece);
    timeByDay.set(piece.day, group);
  }
  for (let day = start; day <= end; day = addDays(day, 1)) {
    const dayRows = byDay.get(day) || [],
      time = timeByDay.get(day) || [];
    const sources = Object.fromEntries(
      ["private", "assignment", "classroom"].map((c) => [
        c,
        time.filter((p) => p.context === c).reduce((s, p) => s + p.ms, 0) /
          60000,
      ]),
    );
    daily.push({
      day,
      ...performance(dayRows),
      minutes: time.reduce((s, p) => s + p.ms, 0) / 60000,
      sources,
    });
  }
  const by = (key: string) =>
    [...new Set(rows.map((r) => r[key]))]
      .sort()
      .map((value) => ({
        key: value,
        ...performance(rows.filter((r) => r[key] === value)),
      }));
  return {
    summary: {
      ...performance(rows),
      minutes: pieces.reduce((s, p) => s + p.ms, 0) / 60000,
      practice_days: new Set([...byDay.keys(), ...timeByDay.keys()]).size,
      time_learners: new Set(pieces.map((p) => p.learner_id)).size,
    },
    daily,
    skills: by("skill"),
    types: by("response_type"),
    conditions: [
      { key: "unknown", count: rows.filter((r) => !r.hint_used).length },
      { key: "hint", count: rows.filter((r) => r.hint_used).length },
    ],
    time_kinds: ["interaction", "listening", "reading"].map((kind) => ({
      key: kind,
      minutes:
        pieces.filter((p) => p.kind === kind).reduce((s, p) => s + p.ms, 0) /
        60000,
    })),
  };
}
