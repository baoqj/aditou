export type RecordFields = Record<string, string | number>;
export type Campus = {
  id: string;
  record: RecordFields;
  facts: RecordFields[];
  remote?: boolean;
  profileRevision?: { sourceUrl: string; updatedAt: number } | null;
  supplement?: Partial<
    Record<"primary" | "secondary", CampusSupplement>
  > | null;
};
export type CampusSupplement = {
  catchment?: string;
  admission?: string;
  englishEligibility?: string;
  program?: string;
  gender?: string;
  genderNote?: string;
  genderYear?: string;
  genderSource?: string;
  imse?: number;
  imseYear?: string;
  imseSource?: string;
  remote?: boolean;
  policies?: {
    year?: string;
    program?: string;
    description?: string;
    start?: string;
    deadline?: string;
    assessment?: string;
    source?: string;
    checked?: string;
    target?: string;
    targetId?: string;
  }[];
};
export type Point = { lat: number; lng: number };

export const name = "学校正式名称";
export const municipality = "市镇";
export const stage = "教学阶段";
export const filters = {
  stage,
  type: "性质",
  language: "授课语言／模式",
  region: "CMM 分区",
  city: municipality,
  network: "教育网络",
  board: "教育局／私立主办方",
};
export const labels: Record<string, string> = {
  学前: "preschool",
  小学: "primary",
  中学: "secondary",
  公立: "public",
  私立: "private",
  英语: "english",
  法语: "french",
  蒙特利尔都会区: "montreal",
  隆格伊都会区: "longueuil",
  北岸: "north",
  南岸: "south",
  法语公立网络: "frenchPublicNetwork",
  英语公立网络: "englishPublicNetwork",
};
export const normalize = (value: unknown) =>
  String(value ?? "")
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();
export const values = (record: RecordFields, field: string) =>
  String(record[field] ?? "")
    .split(field === stage ? " · " : /\n/)
    .filter(Boolean);
export const address = (record: RecordFields) =>
  [record["校区地址"], record[municipality], record["校区邮编"]]
    .filter(Boolean)
    .join(", ");
export const coordinates = (record: RecordFields): Point | null => {
  const lat = Number(record["纬度"]),
    lng = Number(record["经度"]);
  return Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    Math.abs(lat) <= 90 &&
    Math.abs(lng) <= 180
    ? { lat, lng }
    : null;
};
export const distance = (a: Point, b: Point) => {
  const rad = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * rad) / 2) ** 2 +
    Math.cos(a.lat * rad) *
      Math.cos(b.lat * rad) *
      Math.sin(((b.lng - a.lng) * rad) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, h)));
};
export const postalCode = (input: string) => {
  const value = input.toUpperCase().replace(/\s/g, "");
  return /^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z]\d[ABCEGHJ-NPRSTV-Z]\d$/.test(
    value,
  )
    ? value.slice(0, 3) + " " + value.slice(3)
    : null;
};

export function instructionLanguage(
  value: unknown,
): "french" | "english" | "both" | "" {
  const text = normalize(value);
  if (["french", "english", "both"].includes(text))
    return text as "french" | "english" | "both";
  const french = /法[语文]|\b(?:french|francais)\b/.test(text);
  const english = /英[语文]|\b(?:english|anglais)\b/.test(text);
  if ((french && english) || /英法双语|法英双语/.test(text)) return "both";
  return french ? "french" : english ? "english" : "";
}
