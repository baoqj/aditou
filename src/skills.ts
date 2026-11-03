import taxonomy from "./data/skills.json";
import assignments from "./data/question-skills.json";
export const SKILLS = taxonomy;
const ids = new Set(taxonomy.map((s) => s.id));
const aliases = new Map(
  taxonomy.flatMap((s) =>
    [s.en, s.fr].map((label) => [label.toLocaleLowerCase(), s.id] as const),
  ),
);
export function canonicalSkill(value: unknown): string {
  const key = String(value || "").trim();
  return ids.has(key)
    ? key
    : aliases.get(key.toLocaleLowerCase()) || "skill.general";
}
export function questionSkill(q: {
  module?: unknown;
  logical_id?: unknown;
}): string {
  const key = String(q.module || "").trim();
  if (ids.has(key)) return key;
  return (
    (assignments as Record<string, string>)[String(q.logical_id)] ||
    canonicalSkill(key)
  );
}
