import { useEffect, useId, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { PencilLine, Send, ShieldCheck } from "lucide-react";
import { api } from "../api";

export function SchoolSuggestionForm({
  campusId,
  panelId,
  topic,
  onTopicChange,
  topics,
  context,
}: {
  campusId: string;
  panelId: string;
  topic: string;
  onTopicChange: (value: string) => void;
  topics: { key: string; label: string }[];
  context?: string;
}) {
  const { t } = useTranslation();
  const headingId = useId();
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const submission = useRef<{ data: string; id: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const abort = new AbortController();
    fetch("/api/auth/me", { signal: abort.signal, cache: "no-store" })
      .then((response) => {
        if (!response.ok && response.status !== 401) throw new Error();
        setSignedIn(response.ok);
      })
      .catch(() => {
        if (!abort.signal.aborted) setError("school.suggestionUnavailable");
      });
    return () => abort.abort();
  }, []);

  const topicLabel = topics.find((option) => option.key === topic)?.label;
  const prefix = [topicLabel, context].filter(Boolean).join("\n");
  const messageLimit = prefix ? 10000 - prefix.length - 2 : 10000;

  return (
    <section
      id={panelId}
      className="school-profile-panel school-suggestion"
      tabIndex={-1}
      aria-labelledby={headingId}
    >
      <div className="school-profile-section-title">
        <div>
          <h2 id={headingId}>{t("school.detailSuggestTitle")}</h2>
          <p>{t("school.detailSuggestNote")}</p>
        </div>
        <PencilLine size={21} aria-hidden="true" />
      </div>
      {sent ? (
        <p role="status">{t("school.suggestionSent")}</p>
      ) : signedIn === null ? (
        <p role={error ? "alert" : "status"}>
          {t(error || "feedback.loading")}
        </p>
      ) : (
        <form
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy) return;
            const form = new FormData(event.currentTarget);
            const message = String(form.get("message") ?? "").trim();
            const content = prefix ? prefix + "\n\n" + message : message;
            if (!message || content.length > 10000) {
              setError("school.suggestionInvalid");
              return;
            }
            const payload = {
              name: form.get("name"),
              email: form.get("email"),
              message: content,
              source: form.get("source"),
            };
            const data = JSON.stringify(payload);
            if (submission.current?.data !== data)
              submission.current = { data, id: crypto.randomUUID() };
            setBusy(true);
            setError("");
            try {
              await api(
                "/school/" + encodeURIComponent(campusId) + "/suggestions",
                { ...payload, id: submission.current.id },
              );
              setSent(true);
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "school.suggestionUnavailable",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            {t("school.detailSuggestionTopic")}
            <select
              name="topic"
              disabled={busy}
              value={topic}
              onChange={(event) => onTopicChange(event.target.value)}
            >
              <option value="">{t("school.detailGeneralTopic")}</option>
              {topics.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {context && <p className="school-suggestion-note">{context}</p>}
          {!signedIn && (
            <>
              <label>
                {t("school.suggestionName")}
                <input
                  name="name"
                  autoComplete="name"
                  maxLength={120}
                  readOnly={busy}
                />
              </label>
              <label>
                {t("school.suggestionEmail")}
                <input
                  name="email"
                  readOnly={busy}
                  autoComplete="email"
                  type="email"
                  required
                  maxLength={254}
                />
              </label>
            </>
          )}
          <label>
            {t("school.suggestionMessage")}
            <textarea
              name="message"
              required
              rows={6}
              maxLength={messageLimit}
              readOnly={busy}
            />
          </label>
          <label>
            {t("school.suggestionSource")}
            <input
              name="source"
              readOnly={busy}
              type="url"
              required
              maxLength={2048}
              placeholder="https://"
            />
          </label>
          {error && <p role="alert">{t(error)}</p>}
          <p className="school-suggestion-note">
            <ShieldCheck size={16} /> {t("school.detailReviewNote")}
          </p>
          <button
            type="submit"
            className="school-button school-button-primary"
            disabled={busy}
          >
            <Send size={15} />{" "}
            {t(busy ? "feedback.sending" : "school.suggestionSubmit")}
          </button>
        </form>
      )}
    </section>
  );
}
