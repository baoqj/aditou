import { useEffect, useState } from "react";
import { api } from "../api";
import { t } from "../i18n";
export function OrganizationSettings() {
  const [organization, setOrganization] = useState<{ name: string } | null>(
      null,
    ),
    [ready, setReady] = useState(false),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(() => {
    api("/organization")
      .then((r) => setOrganization(r.organization))
      .catch((e) => setError(e.message))
      .finally(() => setReady(true));
  }, []);
  return (
    <section className="organization-settings">
      <h3>{t("org.title")}</h3>
      <p>{t("org.description")}</p>
      {error && (
        <p className="alert error" role="alert">
          {t(error)}
        </p>
      )}
      {ready &&
        (organization ? (
          <p className="organization-name">{organization.name}</p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const data = new FormData(e.currentTarget);
              setBusy(true);
              setError("");
              try {
                const r = await api("/organization", {
                  name: data.get("name"),
                });
                setOrganization(r.organization);
              } catch (e) {
                setError(e instanceof Error ? e.message : "email.unavailable");
              } finally {
                setBusy(false);
              }
            }}
          >
            <label className="email-field">
              {t("org.name")}
              <input
                name="name"
                maxLength={120}
                required
                autoComplete="organization"
              />
            </label>
            <button className="btn" disabled={busy}>
              {t(busy ? "Un instant…" : "org.create")}
            </button>
          </form>
        ))}
    </section>
  );
}
