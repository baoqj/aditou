import type { Env } from "./index";
export async function adminDirectory(
  req: Request,
  e: Env,
  user: Record<string, any>,
  path: string,
) {
  const reply = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (user.role !== "admin") return reply({ error: "Accès refusé." }, 403);
  const match = path.match(
    /^\/api\/admin\/(users|organizations)(?:\/([^/]+))?$/,
  );
  if (!match) return reply({ error: "admin.notFound" }, 404);
  const [, kind, target] = match,
    url = new URL(req.url);
  if (req.method === "GET" && !target) {
    const q = String(url.searchParams.get("q") || "")
        .trim()
        .slice(0, 120),
      filter = url.searchParams.get("filter") || "",
      status = url.searchParams.get("status") || "";
    const page = Math.max(
      1,
      Math.min(100000, Number(url.searchParams.get("page")) || 1),
    );
    const conditions: string[] = [],
      args: any[] = [];
    if (q) {
      conditions.push(
        kind === "users"
          ? "(instr(lower(a.name),lower(?))>0 OR instr(lower(a.email),lower(?))>0)"
          : "(instr(lower(o.name),lower(?))>0 OR instr(lower(a.name),lower(?))>0 OR instr(lower(a.email),lower(?))>0)",
      );
      args.push(q, q);
      if (kind === "organizations") args.push(q);
    }
    if (
      kind === "users" &&
      ["admin", "teacher", "student", "parent"].includes(filter)
    ) {
      conditions.push("a.role=?");
      args.push(filter);
    }
    if (kind === "organizations" && filter) {
      conditions.push("o.owner_id=?");
      args.push(filter);
    }
    if (["active", "disabled"].includes(status)) {
      conditions.push("a.disabled=?");
      args.push(status === "disabled" ? 1 : 0);
    }
    const from =
        kind === "users"
          ? "accounts a"
          : "organizations o JOIN accounts a ON a.id=o.owner_id",
      where = conditions.length ? " WHERE " + conditions.join(" AND ") : "";
    const count = await e.DB.prepare(
      "SELECT COUNT(*) total FROM " + from + where,
    )
      .bind(...args)
      .first<{ total: number }>();
    const fields =
      kind === "users"
        ? "a.id,a.name,a.email,a.role,a.created_at,a.disabled,a.preferred_locale"
        : "o.id,o.name,o.owner_id,o.created_at,a.name owner_name,a.email owner_email,a.disabled";
    const result = await e.DB.prepare(
      "SELECT " +
        fields +
        " FROM " +
        from +
        where +
        " ORDER BY " +
        (kind === "users" ? "a" : "o") +
        ".created_at DESC, " +
        (kind === "users" ? "a" : "o") +
        ".id LIMIT 25 OFFSET ?",
    )
      .bind(...args, (page - 1) * 25)
      .all();
    const owners =
      kind === "organizations"
        ? (
            await e.DB.prepare(
              "SELECT a.id,a.name,a.email FROM accounts a JOIN organizations o ON o.owner_id=a.id ORDER BY a.name",
            ).all()
          ).results
        : [];
    return reply({
      items: result.results,
      total: count?.total || 0,
      page,
      owners,
    });
  }
  if (req.method === "POST" && target) {
    const table = kind === "users" ? "accounts" : "organizations";
    const existing = await e.DB.prepare(
      "SELECT id FROM " + table + " WHERE id=?",
    )
      .bind(target)
      .first();
    if (!existing) return reply({ error: "admin.notFound" }, 404);
    const b = (await req.json()) as Record<string, unknown>;
    if (b.name !== undefined) {
      const name = String(b.name).trim();
      if (!name || name.length > 120)
        return reply({ error: "admin.invalidName" }, 400);
      await e.DB.prepare("UPDATE " + table + " SET name=? WHERE id=?")
        .bind(name, target)
        .run();
    }
    if (kind === "users" && b.disabled !== undefined) {
      if (typeof b.disabled !== "boolean")
        return reply({ error: "admin.invalidStatus" }, 400);
      if (target === user.id)
        return reply({ error: "admin.selfProtection" }, 400);
      await e.DB.prepare("UPDATE accounts SET disabled=? WHERE id=?")
        .bind(b.disabled ? 1 : 0, target)
        .run();
      if (b.disabled)
        await e.DB.prepare("DELETE FROM auth_sessions WHERE account_id=?")
          .bind(target)
          .run();
    }
    return reply({ ok: true });
  }
  return reply({ error: "Méthode refusée." }, 405);
}
