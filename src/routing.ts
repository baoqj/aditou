const staffPages = ["bank", "students", "classes", "classroom", "studio", "homework", "reports", "settings"];

export const schoolRankingPath = "/school/ranking";

export function isStaffRole(role: string) {
  return role === "admin" || role === "teacher";
}

export function canonicalPath(path: string) {
  const legacy = /^\/org\/main\/manage(?:\/([^/]+))?(\/contact)?$/.exec(path);
  if (!legacy) return path;
  const aliases: Record<string, string> = { roster: "students", organizations: "organization", class: "classroom" };
  const page = legacy[1] || "bank";
  return "/" + (aliases[page] ?? page) + (legacy[2] ?? "");
}

export function authDestination(role: string, next: string | null, origin: string) {
  const fallback = isStaffRole(role) ? "/bank" : role === "parent" ? "/family" : "/learn";
  if (!next || !next.startsWith("/") || next.startsWith("//")) return fallback;
  try {
    const url = new URL(next, origin);
    if (url.origin !== origin) return fallback;
    const path = canonicalPath(url.pathname.replace(/\/+$/, "") || "/");
    if (/^\/school\/[a-z0-9-]+$/i.test(path)) return path + url.search + url.hash;
    const permitted = isStaffRole(role)
      ? staffPages.includes(path.slice(1)) || ["/settings/contact", "/organization"].includes(path) ||
        (role === "admin" && (["/admin/schools","/feedback","/visitors","/system"].includes(path) || /^\/users(?:\/[^/]+)?$/.test(path)))
      : role === "parent"
        ? /^\/family(?:\/settings(?:\/contact)?)?$/.test(path)
        : /^\/learn(?:\/(?:practice|progress|settings(?:\/contact)?))?$/.test(path);
    return permitted ? path + url.search + url.hash : fallback;
  } catch {
    return fallback;
  }
}

export function settingsDestination(role: string) {
  return isStaffRole(role) ? "/settings" : role === "parent" ? "/family/settings" : "/learn/settings";
}
