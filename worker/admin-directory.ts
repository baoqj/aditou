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
  if (req.method === "GET" && kind === "users" && target) {
    const account = await e.DB.prepare(
      `SELECT a.id,a.name,a.email,a.role,a.created_at,a.disabled,a.preferred_locale,
        a.email_verified_at,a.self_registered,
        EXISTS(SELECT 1 FROM google_oauth_accounts g WHERE g.account_id=a.id) google_linked,
        (SELECT MAX(created_at) FROM audit_log WHERE actor_id=a.id AND action='auth.login') last_login
        FROM accounts a WHERE a.id=?`,
    )
      .bind(target)
      .first();
    if (!account) return reply({ error: "admin.notFound" }, 404);
    const page = Math.max(
      1,
      Math.min(100000, Math.floor(Number(url.searchParams.get("page")) || 1)),
    );
    const [learner, classes, family, organizations, events] = await e.DB.batch([
      e.DB.prepare(
        "SELECT id,alias,grade FROM learners WHERE account_id=?",
      ).bind(target),
      e.DB.prepare(
        `SELECT id,name,grade,locale FROM classes WHERE teacher_id=?
        OR id IN (SELECT en.class_id FROM enrollments en JOIN learners l ON l.id=en.learner_id WHERE l.account_id=?)
        ORDER BY name,id`,
      ).bind(target, target),
      e.DB.prepare(
        `SELECT l.id,l.alias,l.grade FROM guardianships g
        JOIN learners l ON l.id=g.learner_id WHERE g.parent_id=? ORDER BY l.alias,l.id`,
      ).bind(target),
      e.DB.prepare(
        "SELECT id,name,created_at FROM organizations WHERE owner_id=? ORDER BY name,id",
      ).bind(target),
      e.DB.prepare(
        `SELECT * FROM (
        SELECT id,actor_id,action,
          CASE WHEN action='analytics.export' THEN NULL ELSE resource_id END resource_id,created_at
        FROM audit_log WHERE actor_id=? OR (resource_id=? AND action LIKE 'account.%')
        UNION ALL
        SELECT at.id,l.account_id,'attempt.submit',at.question_id,at.created_at
        FROM attempts at JOIN learners l ON l.id=at.learner_id WHERE l.account_id=? AND at.run_id IS NULL
        UNION ALL
        SELECT r.id,l.account_id,'assessment.' || r.mode,r.id,r.submitted_at
        FROM assessment_runs r JOIN learners l ON l.id=r.learner_id WHERE l.account_id=? AND r.submitted_at IS NOT NULL
      ) ORDER BY created_at DESC,id DESC LIMIT 26 OFFSET ?`,
      ).bind(target, target, target, target, (page - 1) * 25),
    ]);
    return reply({
      account,
      learner: learner.results[0] || null,
      classes: classes.results,
      family: family.results,
      organizations: organizations.results,
      events: events.results.slice(0, 25),
      hasMore: events.results.length > 25,
      page,
    });
  }
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
        ? "a.id,a.name,a.email,a.role,a.created_at,a.disabled,a.preferred_locale,(SELECT MAX(created_at) FROM audit_log WHERE actor_id=a.id AND action='auth.login') last_login"
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
    const statements: D1PreparedStatement[] = [];
    const record = (action: string) =>
      e.DB.prepare(
        "INSERT INTO audit_log(id,actor_id,action,resource_id) VALUES(?,?,?,?)",
      ).bind(crypto.randomUUID(), user.id, action, target);
    if (b.name !== undefined) {
      const name = String(b.name).trim();
      if (!name || name.length > 120)
        return reply({ error: "admin.invalidName" }, 400);
      statements.push(
        e.DB.prepare("UPDATE " + table + " SET name=? WHERE id=?").bind(
          name,
          target,
        ),
        record(kind === "users" ? "account.rename" : "organization.rename"),
      );
    }
    if (kind === "users" && b.disabled !== undefined) {
      if (typeof b.disabled !== "boolean")
        return reply({ error: "admin.invalidStatus" }, 400);
      if (target === user.id)
        return reply({ error: "admin.selfProtection" }, 400);
      statements.push(
        e.DB.prepare("UPDATE accounts SET disabled=? WHERE id=?").bind(
          b.disabled ? 1 : 0,
          target,
        ),
        record(b.disabled ? "account.disable" : "account.restore"),
      );
      if (b.disabled)
        statements.push(
          e.DB.prepare("DELETE FROM auth_sessions WHERE account_id=?").bind(
            target,
          ),
        );
    }
    if (statements.length) await e.DB.batch(statements);
    return reply({ ok: true });
  }
  return reply({ error: "Méthode refusée." }, 405);
}
