import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, Data } from "../api";
export function AdminDirectory({
  kind,
  selfId,
}: {
  kind: "users" | "organizations";
  selfId: string;
}) {
  const { t, i18n } = useTranslation();
  const [q, setQ] = useState(""),
    [filter, setFilter] = useState(""),
    [status, setStatus] = useState(""),
    [page, setPage] = useState(1),
    [data, setData] = useState<Data>({ items: [], total: 0, owners: [] }),
    [loading, setLoading] = useState(true),
    [error, setError] = useState(""),
    [edit, setEdit] = useState<Data | null>(null),
    [name, setName] = useState(""),
    [busy, setBusy] = useState(false),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let current = true;
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      api(
        "/admin/" +
          kind +
          "?" +
          new URLSearchParams({ q, filter, status, page: String(page) }),
      )
        .then((result) => {
          if (current) setData(result);
        })
        .catch((e) => {
          if (current) setError(e.message);
        })
        .finally(() => {
          if (current) setLoading(false);
        });
    }, 250);
    return () => {
      current = false;
      clearTimeout(timer);
    };
  }, [kind, q, filter, status, page, revision]);
  async function save(row: Data, body: Data) {
    setBusy(true);
    setError("");
    try {
      await api("/admin/" + kind + "/" + encodeURIComponent(row.id), body);
      setEdit(null);
      setRevision((x) => x + 1);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="admin-directory">
      <div className="admin-directory-title">
        <h1>{t(kind === "users" ? "admin.users" : "admin.organizations")}</h1>
        <span>{t("admin.total", { count: data.total })}</span>
      </div>
      <div className="admin-directory-filters">
        <input
          type="search"
          aria-label={t("admin.search")}
          placeholder={t(
            kind === "users"
              ? "admin.searchUsers"
              : "admin.searchOrganizations",
          )}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
        />
        <select
          aria-label={t(kind === "users" ? "admin.role" : "admin.owner")}
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="">
            {t(kind === "users" ? "admin.allRoles" : "admin.allOwners")}
          </option>
          {kind === "users"
            ? ["admin", "teacher", "student", "parent"].map((role) => (
                <option key={role} value={role}>
                  {t("admin.role." + role)}
                </option>
              ))
            : data.owners.map((owner: Data) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} · {owner.email}
                </option>
              ))}
        </select>
        <select
          aria-label={t("admin.status")}
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="">{t("admin.allStatuses")}</option>
          <option value="active">{t("admin.active")}</option>
          <option value="disabled">{t("admin.disabled")}</option>
        </select>
      </div>
      {error && (
        <p role="alert" className="alert error">
          {t(error)}
        </p>
      )}
      <div className="admin-directory-table" aria-busy={loading}>
        <table>
          <thead>
            <tr>
              <th>{t("admin.name")}</th>
              <th>{t(kind === "users" ? "admin.email" : "admin.owner")}</th>
              {kind === "users" && <th>{t("admin.role")}</th>}
              <th>{t("admin.status")}</th>
              <th>{t("admin.created")}</th>
              <th>{t("admin.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {!loading &&
              data.items.map((row: Data) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>
                    {kind === "users" ? (
                      row.email
                    ) : (
                      <>
                        <div>{row.owner_name}</div>
                        <small>{row.owner_email}</small>
                      </>
                    )}
                  </td>
                  {kind === "users" && <td>{t("admin.role." + row.role)}</td>}
                  <td>{t(row.disabled ? "admin.disabled" : "admin.active")}</td>
                  <td>
                    {new Date(
                      row.created_at.replace(" ", "T") + "Z",
                    ).toLocaleDateString(i18n.resolvedLanguage)}
                  </td>
                  <td>
                    <div className="admin-row-actions">
                      <button
                        disabled={busy}
                        onClick={() => {
                          setEdit(row);
                          setName(row.name);
                        }}
                      >
                        {t("admin.edit")}
                      </button>
                      {kind === "users" && row.id !== selfId && (
                        <button
                          disabled={busy}
                          onClick={() => {
                            setEdit({ ...row, statusChange: true });
                            setName(row.name);
                          }}
                        >
                          {t(row.disabled ? "admin.restore" : "admin.disable")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading ? (
          <p role="status">{t("admin.loading")}</p>
        ) : (
          !data.items.length && <p>{t("admin.empty")}</p>
        )}
      </div>
      <div className="admin-pagination">
        <button
          disabled={page === 1 || loading}
          onClick={() => setPage((p) => p - 1)}
        >
          {t("admin.previous")}
        </button>
        <span>{t("admin.page", { page })}</span>
        <button
          disabled={page * 25 >= data.total || loading}
          onClick={() => setPage((p) => p + 1)}
        >
          {t("admin.next")}
        </button>
      </div>
      {edit && (
        <div className="modal-backdrop">
          <form
            className="modal admin-edit"
            role="dialog"
            aria-modal="true"
            aria-label={t(edit.statusChange ? "admin.confirm" : "admin.edit")}
            onSubmit={(e) => {
              e.preventDefault();
              void save(
                edit,
                edit.statusChange ? { disabled: !edit.disabled } : { name },
              );
            }}
          >
            <h2>{t(edit.statusChange ? "admin.confirm" : "admin.edit")}</h2>
            {edit.statusChange ? (
              <p>
                {t(
                  edit.disabled
                    ? "admin.restoreConfirm"
                    : "admin.disableConfirm",
                  { name: edit.name },
                )}
              </p>
            ) : (
              <label>
                {t("admin.name")}
                <input
                  required
                  maxLength={120}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>
            )}
            <div className="admin-row-actions">
              <button
                type="button"
                disabled={busy}
                onClick={() => setEdit(null)}
              >
                {t("admin.cancel")}
              </button>
              <button disabled={busy || !name.trim()}>{t("admin.save")}</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
