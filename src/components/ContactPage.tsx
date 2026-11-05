import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, type Data } from "../api";
import { t } from "../i18n";
import { settingsDestination } from "../routing";
import { PublicHeader } from "./PublicHeader";
export function FeedbackForm({ user }: { user: Data | null }) {
  useTranslation();
  const [busy, setBusy] = useState(false),
    [sent, setSent] = useState(false),
    [error, setError] = useState("");
  const [submission, setSubmission] = useState(() => crypto.randomUUID());
  return (
    <section className="card feedback-card">
      <h1>{t("feedback.title")}</h1>
      <p>{t("feedback.intro")}</p>
      {sent ? (
        <div role="status">
          <h2>{t("feedback.sent")}</h2>
          <button
            onClick={() => {
              setSent(false);
              setSubmission(crypto.randomUUID());
            }}
          >
            {t("feedback.another")}
          </button>
        </div>
      ) : (
        <form
          onChange={() => {
            if (!busy) setSubmission(crypto.randomUUID());
          }}
          onSubmit={async (e) => {
            e.preventDefault();
            if (busy) return;
            const data = new FormData(e.currentTarget);
            setBusy(true);
            setError("");
            try {
              await api("/feedback", {
                id: submission,
                name: data.get("name"),
                email: user?.email || data.get("email"),
                phone: data.get("phone"),
                message: data.get("message"),
                category: data.get("category"),
                path: location.pathname,
              });
              setSent(true);
            } catch (err: any) {
              setError(err.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            {t("adminHub.category")}
            <select
              aria-label={t("adminHub.category")}
              name="category"
              defaultValue="contact"
            >
              <option value="contact">{t("adminHub.contact")}</option>
              <option value="issue">{t("adminHub.issue")}</option>
            </select>
          </label>
          {!user && (
            <label>
              {t("feedback.name")}
              <input name="name" maxLength={120} autoComplete="name" />
            </label>
          )}
          <label>
            {t("feedback.email")}
            <input
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              readOnly={!!user}
              value={user ? user.email : undefined}
            />
          </label>
          {user && <small>{t("feedback.locked")}</small>}
          <label>
            {t("feedback.phone")}
            <input name="phone" type="tel" maxLength={40} autoComplete="tel" />
          </label>
          <label>
            {t("feedback.message")}
            <textarea name="message" rows={8} required maxLength={10000} />
          </label>
          <small>{t("feedback.plain")}</small>
          {error && <p role="alert">{t(error)}</p>}
          <button type="submit" className="primary" disabled={busy}>
            {t(busy ? "feedback.sending" : "feedback.send")}
          </button>
        </form>
      )}
    </section>
  );
}
export function ContactPage() {
  useTranslation();
  const [user, setUser] = useState<Data | null>(null),
    [ready, setReady] = useState(false),
    [failed, setFailed] = useState(false);
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "same-origin", cache: "no-store" })
      .then(async (r) => {
        if (r.status === 401) return;
        if (!r.ok) throw Error();
        const b = (await r.json()) as { user: Data };
        setUser(b.user);
        location.replace(settingsDestination(b.user.role) + "/contact");
      })
      .catch(() => setFailed(true))
      .finally(() => setReady(true));
  }, []);
  return (
    <>
      <PublicHeader />
      <main className="contact-page">
        {failed ? (
          <p role="alert">{t("feedback.loadError")}</p>
        ) : ready && !user ? (
          <FeedbackForm user={null} />
        ) : (
          <p role="status">{t("feedback.loading")}</p>
        )}
      </main>
    </>
  );
}
