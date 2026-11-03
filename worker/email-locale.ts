export const EMAIL_LOCALES = ["fr", "en", "es", "zh"] as const;
export type EmailLocale = (typeof EMAIL_LOCALES)[number];
export function normalizeEmailLocale(
  value: unknown,
  fallback: EmailLocale = "fr",
): EmailLocale {
  const language = String(value || "")
    .trim()
    .toLowerCase()
    .split(/[-_]/)[0];
  return EMAIL_LOCALES.includes(language as EmailLocale)
    ? (language as EmailLocale)
    : fallback;
}
export function requestEmailLocale(
  request: Request,
  value?: unknown,
  fallback: unknown = "fr",
): EmailLocale {
  return normalizeEmailLocale(
    value || request.headers.get("X-Aditou-UI-Language"),
    normalizeEmailLocale(fallback),
  );
}
