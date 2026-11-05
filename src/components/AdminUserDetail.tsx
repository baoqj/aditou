import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, type Data } from "../api";

export function AdminUserDetail({
  id,
  listUrl,
}: {
  id: string;
  listUrl: string;
}) {
  const { t, i18n } = useTranslation();
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    setError("");
    api("/admin/users/" + encodeURIComponent(id) + "?page=" + page)
      .then((value) => {
        if (active) setData(value);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [id, page]);

  const date = (value: string | null) =>
    value
      ? new Date(
          value.includes("T") ? value : value.replace(" ", "T") + "Z",
        ).toLocaleString(i18n.resolvedLanguage)
      : "—";
  const account = data?.account;
  const profile = account
    ? [
        ["admin.userId", account.id],
        ["admin.name", account.name],
        ["admin.email", account.email],
        ["admin.role", t("admin.role." + account.role)],
        [
          "admin.status",
          t(account.disabled ? "admin.disabled" : "admin.active"),
        ],
        ["admin.created", date(account.created_at)],
        ["admin.lastLogin", date(account.last_login)],
        ["admin.verified", date(account.email_verified_at)],
        ["admin.locale", account.preferred_locale],
        [
          "admin.selfRegistered",
          t(account.self_registered ? "admin.yes" : "admin.no"),
        ],
        [
          "admin.googleLinked",
          t(account.google_linked ? "admin.yes" : "admin.no"),
        ],
        ...(data.learner
          ? [
              [
                "admin.learner",
                data.learner.alias +
                  " · " +
                  t("gradeLabel", { grade: data.learner.grade }),
              ],
            ]
          : []),
      ]
    : [];
  return (
    <section className="admin-directory admin-user-detail">
      <a href={listUrl}>{t("admin.backUsers")}</a>
      {error && <p role="alert">{t(error)}</p>}
      {!account && !error && <p role="status">{t("admin.loading")}</p>}
      {account && data && (
        <>
          <h1>{account.name}</h1>
          <section className="card">
            <h2>{t("admin.profile")}</h2>
            <dl>
              {profile.map(([label, value]) => (
                <div key={label}>
                  <dt>{t(label)}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            {(["classes", "family", "organizations"] as const).map((group) => (
              <div key={group}>
                <h3>{t("admin.related." + group)}</h3>
                {data[group].length ? (
                  <ul>
                    {data[group].map((row: Data) => (
                      <li key={row.id}>
                        {row.name || row.alias}
                        {row.grade &&
                          " · " + t("gradeLabel", { grade: row.grade })}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>—</p>
                )}
              </div>
            ))}
          </section>
          <h2>{t("admin.activity")}</h2>
          <p>{t("admin.activityNote")}</p>
          <div
            className="admin-directory-table"
            aria-busy={data.page !== page && !error}
          >
            <table>
              <thead>
                <tr>
                  {["time", "action", "actor", "resource"].map((key) => (
                    <th scope="col" key={key}>
                      {t("admin.log." + key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.events.map((event: Data) => (
                  <tr key={event.action + ":" + event.id}>
                    <td>{date(event.created_at)}</td>
                    <td>
                      {t("admin.event." + event.action, {
                        defaultValue: event.action,
                      })}
                    </td>
                    <td>
                      {event.actor_id === id
                        ? account.name
                        : event.actor_id || "—"}
                    </td>
                    <td>{event.resource_id || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!data.events.length && <p>{t("admin.noActivity")}</p>}
          </div>
          <div className="admin-pagination">
            <button
              disabled={page === 1 || data.page !== page}
              onClick={() => setPage(page - 1)}
            >
              {t("admin.previous")}
            </button>
            <span>{t("admin.page", { page: data.page })}</span>
            <button
              disabled={!data.hasMore || data.page !== page}
              onClick={() => setPage(page + 1)}
            >
              {t("admin.next")}
            </button>
          </div>
        </>
      )}
    </section>
  );
}
