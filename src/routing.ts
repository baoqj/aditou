export function authDestination(
  role: string,
  next: string | null,
  origin: string,
) {
  const fallback =
    role === "admin" || role === "teacher"
      ? "/org/main/manage/bank"
      : role === "parent"
        ? "/family"
        : "/learn";
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  try {
    const url = new URL(next, origin);
    if (url.origin !== origin) return fallback;
    const permitted =
      role === "admin" || role === "teacher"
        ? /^\/org\/main\/manage(?:\/|$)/.test(url.pathname)
        : role === "parent"
          ? /^\/family(?:\/|$)/.test(url.pathname)
          : /^\/learn(?:\/|$)/.test(url.pathname);
    return permitted ? url.pathname + url.search + url.hash : fallback;
  } catch {
    return fallback;
  }
}

export function settingsDestination(role: string) {
  return role === "admin" || role === "teacher"
    ? "/org/main/manage/settings"
    : role === "parent"
      ? "/family/settings"
      : "/learn/settings";
}
