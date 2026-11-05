import { useEffect, useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { api, type Data } from "../api";
import { rankPaper } from "./SchoolRankings";
import { rankingPercent } from "./school-ranking-data";
import "./school-evaluation.css";

const root = "/admin/schools";
const statuses = [
  "pending",
  "published",
  "returned",
  "rejected",
  "withdrawn",
  "hidden",
  "deleted",
  "all",
];
const fieldLabels: Record<string, string> = {
  name: "ranking.schoolName",
  campus: "schoolEval.campus",
  website: "school.website",
  latitude: "schoolEval.latitude",
  longitude: "schoolEval.longitude",
};

function useAdminData(path: string, revision: number) {
  const [response, setResponse] = useState<{
    path: string;
    data?: Data;
    error?: string;
  }>();
  useEffect(() => {
    let active = true;
    api(path)
      .then((data) => {
        if (active) setResponse({ path, data });
      })
      .catch((error) => {
        if (active) setResponse({ path, error: error.message });
      });
    return () => {
      active = false;
    };
  }, [path, revision]);
  return response?.path === path ? response : undefined;
}

export function AdminSchools() {
  const { t, i18n } = useTranslation();
  const [query, setQuery] = useState("");
  const [queue, setQueue] = useState("");
  const [page, setPage] = useState(0);
  const [campus, setCampus] = useState(
    new URLSearchParams(location.search).get("campus") ?? "",
  );
  const [section, setSection] = useState(() => {
    const tab = new URLSearchParams(location.search).get("tab");
    return tab && ["reviews", "suggestions", "scores"].includes(tab)
      ? tab
      : "profile";
  });
  const [revision, setRevision] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useAdminData(
    root + "?" + new URLSearchParams({ q: query, queue, page: String(page) }),
    revision,
  );
  const displayDate = (date: number) =>
    new Intl.DateTimeFormat(i18n.language, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  function select(id: string) {
    setCampus(id);
    setSection("profile");
    setMessage("");
    setError("");
    const url = new URL(location.href);
    if (id) url.searchParams.set("campus", id);
    else url.searchParams.delete("campus");
    history.replaceState(history.state, "", url);
  }
  async function save(path: string, input: Data, refresh = true) {
    setBusy(true);
    setMessage("");
    setError("");
    try {
      const result = await api(path, input);
      if (refresh) {
        setRevision((value) => value + 1);
        setMessage(t("schoolEval.saved"));
      }
      return result as Data;
    } catch (problem) {
      setError(
        problem instanceof Error && problem.message.startsWith("schoolEval.")
          ? t(problem.message)
          : t("schoolEval.failed"),
      );
      return null;
    } finally {
      setBusy(false);
    }
  }
  const props = { revision, busy, save, displayDate };
  return (
    <section className="admin-schools">
      <h1>{t("schoolEval.manage")}</h1>
      <div className="school-eval-controls">
        <button
          className="btn"
          type="button"
          aria-pressed={section !== "reviews"}
          onClick={() => setSection("profile")}
        >
          {t("ranking.directory")}
        </button>
        <button
          className="btn"
          type="button"
          aria-pressed={section === "reviews"}
          onClick={() => setSection("reviews")}
        >
          {t("schoolEval.reviewQueue")}
        </button>
      </div>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
      {section === "reviews" ? (
        <AdminSchoolReviewQueue
          campus={campus}
          clearCampus={() => setCampus("")}
          {...props}
        />
      ) : (
        <div className="admin-schools-layout">
          <aside className="admin-school-section">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setQuery(
                  String(new FormData(event.currentTarget).get("q") ?? ""),
                );
                setPage(0);
              }}
            >
              <label>
                {t("school.search")}
                <input name="q" defaultValue={query} type="search" />
              </label>
              <button className="btn" type="submit">
                {t("school.search")}
              </button>
            </form>
            <label>
              {t("school.filters")}
              <select
                value={queue}
                onChange={(event) => {
                  setQueue(event.target.value);
                  setPage(0);
                }}
              >
                <option value="">{t("school.all")}</option>
                <option value="reviews">{t("schoolEval.reviewQueue")}</option>
                <option value="suggestions">
                  {t("schoolEval.suggestions")}
                </option>
              </select>
            </label>
            {list?.error ? (
              <p role="alert">{t("schoolEval.failed")}</p>
            ) : !list?.data ? (
              <p role="status">{t("feedback.loading")}</p>
            ) : (
              <ul className="admin-school-list">
                {list.data.entries.map((item: Data) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      aria-pressed={campus === item.id}
                      onClick={() => select(item.id)}
                    >
                      <strong>{item.name}</strong>
                      <small>
                        {[item.campus, item.city, item.code]
                          .filter(Boolean)
                          .join(" · ")}
                      </small>
                      {(item.reviews > 0 || item.suggestions > 0) && (
                        <small>
                          {t("schoolEval.pendingCounts", {
                            reviews: item.reviews,
                            suggestions: item.suggestions,
                          })}
                        </small>
                      )}
                    </button>
                  </li>
                ))}
                {!list.data.entries.length && <li>{t("school.empty")}</li>}
              </ul>
            )}
            <Pagination
              page={page}
              more={Boolean(list?.data?.more)}
              setPage={setPage}
            />
          </aside>
          {campus && (
            <div className="admin-school-section" key={campus}>
              <div className="school-eval-controls">
                {(["profile", "scores", "suggestions"] as const).map((key) => (
                  <button
                    type="button"
                    key={key}
                    className="btn"
                    aria-pressed={section === key}
                    onClick={() => setSection(key)}
                  >
                    {t("schoolEval." + key)}
                  </button>
                ))}
                <a
                  href={
                    "/school/" +
                    encodeURIComponent(campus) +
                    "?lang=" +
                    i18n.language
                  }
                >
                  {t("school.detail")}
                </a>
              </div>
              {section === "profile" && (
                <AdminSchoolProfile campus={campus} {...props} />
              )}
              {section === "scores" && (
                <AdminSchoolScores campus={campus} {...props} />
              )}
              {section === "suggestions" && (
                <AdminSchoolSuggestions campus={campus} {...props} />
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

type AdminProps = {
  campus: string;
  revision: number;
  busy: boolean;
  save: (path: string, input: Data, refresh?: boolean) => Promise<Data | null>;
  displayDate: (value: number) => string;
};

function Pagination({
  page,
  more,
  setPage,
}: {
  page: number;
  more: boolean;
  setPage: (value: number) => void;
}) {
  const { t } = useTranslation();
  if (!page && !more) return null;
  return (
    <nav className="school-eval-controls" aria-label={t("school.pagination")}>
      <button
        className="btn"
        type="button"
        disabled={!page}
        onClick={() => setPage(page - 1)}
      >
        {t("school.previous")}
      </button>
      <button
        className="btn"
        type="button"
        disabled={!more}
        onClick={() => setPage(page + 1)}
      >
        {t("school.next")}
      </button>
    </nav>
  );
}

function AdminSchoolProfile({
  campus,
  revision,
  busy,
  save,
  displayDate,
}: AdminProps) {
  const { t } = useTranslation();
  const path = root + "/campus/" + encodeURIComponent(campus);
  const response = useAdminData(path, revision);
  const profile = response?.data;
  if (!profile)
    return (
      <p role={response?.error ? "alert" : "status"}>
        {t(response?.error ? "schoolEval.failed" : "feedback.loading")}
      </p>
    );
  return (
    <>
      <form
        key={profile.version}
        onSubmit={(event) => {
          event.preventDefault();
          const data = new FormData(event.currentTarget);
          const fields = Object.fromEntries(
            profile.fields.map((field: Data) => [
              field.key,
              data.get(field.key),
            ]),
          );
          void save(path, {
            version: profile.version,
            fields,
            sourceUrl: data.get("sourceUrl"),
            reason: data.get("reason"),
          });
        }}
      >
        <div className="admin-school-fields">
          {profile.fields.map((field: Data) => (
            <label key={field.key}>
              {t(fieldLabels[field.key] ?? "school." + field.key)}
              {["fees", "admission", "care"].includes(field.key) ? (
                <textarea
                  name={field.key}
                  defaultValue={field.value}
                  rows={2}
                  maxLength={2500}
                />
              ) : (
                <input
                  name={field.key}
                  defaultValue={field.value}
                  required={field.key === "name"}
                  maxLength={2500}
                />
              )}
            </label>
          ))}
        </div>
        <EvidenceFields sourceUrl={profile.sourceUrl} />
        <button type="submit" className="btn primary" disabled={busy}>
          {t("schoolEval.saveProfile")}
        </button>
      </form>
      {profile.history.length > 0 && (
        <details>
          <summary>{t("schoolEval.revisions")}</summary>
          <ul>
            {profile.history.map((entry: Data) => (
              <li key={entry.version}>
                {displayDate(entry.createdAt)} · {entry.reason} ·{" "}
                <a href={entry.sourceUrl} target="_blank" rel="noreferrer">
                  {t("school.source")}
                </a>
              </li>
            ))}
          </ul>
        </details>
      )}
    </>
  );
}

function EvidenceFields({ sourceUrl }: { sourceUrl?: string }) {
  const { t } = useTranslation();
  return (
    <>
      <label>
        {t("school.suggestionSource")}
        <input
          type="url"
          name="sourceUrl"
          maxLength={2048}
          required
          defaultValue={sourceUrl ?? ""}
        />
      </label>
      <label>
        {t("schoolEval.reason")}
        <textarea name="reason" required maxLength={1000} rows={2} />
      </label>
    </>
  );
}

function AdminSchoolScores({ campus, revision, busy, save }: AdminProps) {
  const { t, i18n } = useTranslation();
  const path = root + "/campus/" + encodeURIComponent(campus) + "/scores";
  const data = useAdminData(path, revision);
  const [selected, setSelected] = useState<Data | null>(null);
  const [preview, setPreview] = useState<Data | null>(null);
  const [year, setYear] = useState("");
  const [level, setLevel] = useState("");
  const results = data?.data;
  if (!results)
    return (
      <p role={data?.error ? "alert" : "status"}>
        {t(data?.error ? "schoolEval.failed" : "feedback.loading")}
      </p>
    );
  const scoreLabel = (score: number) => rankingPercent(score, i18n.language);
  const applyDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected) return;
    const form = new FormData(event.currentTarget);
    const result = await save(path, {
      action: "draft",
      baseRelease: results.release,
      series: selected.series,
      year: selected.year,
      unit: selected.unit,
      score: Math.round(Number(form.get("score")) * 10),
      sourceUrl: form.get("sourceUrl"),
      reason: form.get("reason"),
    });
    if (result) setSelected(null);
  };
  return (
    <>
      <p>
        {t("schoolEval.release")} <strong>{results.release}</strong>
      </p>
      <div className="school-eval-controls">
        <label>
          {t("ranking.year")}
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            <option value="">{t("school.all")}</option>
            {[
              ...new Set<string>(results.facts.map((item: Data) => item.year)),
            ].map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          {t("ranking.level")}
          <select
            value={level}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="">{t("school.all")}</option>
            <option value="primary">{t("school.primary")}</option>
            <option value="secondary">{t("school.secondary")}</option>
          </select>
        </label>
      </div>
      <div
        className="admin-school-table"
        tabIndex={0}
        role="region"
        aria-label={t("schoolEval.scores")}
      >
        <table>
          <thead>
            <tr>
              {[
                "ranking.year",
                "ranking.exam",
                "schoolEval.original",
                "ranking.score",
                "ranking.rank",
                "ranking.evidence",
              ].map((key) => (
                <th scope="col" key={key}>
                  {t(key)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.facts
              .filter(
                (row: Data) =>
                  (!year || row.year === year) &&
                  (!level || row.level === level),
              )
              .map((row: Data) => (
                <tr key={[row.series, row.year, row.unit].join(":")}>
                  <td>{row.year}</td>
                  <th scope="row">
                    {rankPaper(row as Parameters<typeof rankPaper>[0], t)}
                    {row.reportedLabel && <small> · {row.reportedLabel}</small>}
                    {row.provisional ? (
                      <small> · {t("ranking.provisional")}</small>
                    ) : null}
                  </th>
                  <td>{scoreLabel(row.original)}</td>
                  <td>
                    {scoreLabel(row.score)}
                    {row.countText === "XX" && " · XX"}
                    {row.smallGroup ? " · " + t("ranking.smallGroup") : ""}
                  </td>
                  <td>{row.rank ?? "—"}</td>
                  <td>
                    <a
                      href={
                        row.correctionUrl ??
                        row.sourceUrl +
                          (row.sourcePage ? "#page=" + row.sourcePage : "")
                      }
                      target="_blank"
                      rel="noreferrer"
                    >
                      {t("school.source")}
                    </a>
                    {row.scope === "school" && (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => setSelected(row)}
                      >
                        {t("schoolEval.correct")}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {selected && (
        <form
          key={[selected.series, selected.year, selected.unit].join(":")}
          onSubmit={applyDraft}
        >
          <strong>
            {selected.year} ·{" "}
            {rankPaper(selected as Parameters<typeof rankPaper>[0], t)}
          </strong>
          <label>
            {t("ranking.score")} (%)
            <input
              name="score"
              type="number"
              step="0.1"
              min={0}
              max={100}
              required
              defaultValue={selected.score / 10}
            />
          </label>
          <EvidenceFields
            sourceUrl={
              selected.correctionUrl ??
              selected.sourceUrl +
                (selected.sourcePage ? "#page=" + selected.sourcePage : "")
            }
          />
          <div className="school-eval-controls">
            <button type="submit" className="btn primary" disabled={busy}>
              {t("schoolEval.saveDraft")}
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => setSelected(null)}
            >
              {t("schoolEval.cancel")}
            </button>
          </div>
        </form>
      )}
      {results.revisions.length > 0 && (
        <section>
          <h3>{t("schoolEval.revisions")}</h3>
          <ul className="admin-school-events">
            {results.revisions.map((item: Data) => (
              <li key={item.id}>
                <p>
                  {item.year} · {item.series} · {scoreLabel(item.score)} ·{" "}
                  {item.reason}
                </p>
                {item.publishedRelease ? (
                  <small>{item.publishedRelease}</small>
                ) : item.baseRelease !== results.release ? (
                  <small>{t("schoolEval.conflict")}</small>
                ) : (
                  <>
                    <button
                      className="btn"
                      type="button"
                      disabled={busy}
                      onClick={async () => {
                        const data = await save(
                          path,
                          { action: "preview", id: item.id },
                          false,
                        );
                        if (data)
                          setPreview({
                            ...data,
                            id: item.id,
                            release: results.release,
                          });
                      }}
                    >
                      {t("schoolEval.preview")}
                    </button>
                    {preview &&
                      preview.id === item.id &&
                      preview?.release === results.release && (
                        <div>
                          <p>
                            {t("schoolEval.rankImpact", {
                              before: preview.oldRank ?? "—",
                              after: preview.newRank ?? "—",
                              count: preview.affected,
                              total: preview.ranked,
                            })}
                          </p>
                          <button
                            className="btn primary"
                            type="button"
                            disabled={busy}
                            onClick={async () => {
                              if (
                                await save(path, {
                                  action: "publish",
                                  id: item.id,
                                })
                              )
                                setPreview(null);
                            }}
                          >
                            {t("schoolEval.publish")}
                          </button>
                        </div>
                      )}
                  </>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      {results.held.length > 0 && (
        <details>
          <summary>
            {t("ranking.scopePending")} ({results.held.length})
          </summary>
          <ul>
            {results.held.map((row: Data) => (
              <li key={row.sourcePage + ":" + row.sourceRow}>
                {row.year} · {row.code} · {row.visibility} · {row.sourcePage}/
                {row.sourceRow}
                <details>
                  <summary>{t("ranking.evidence")}</summary>
                  <pre>{JSON.stringify(JSON.parse(row.data), null, 2)}</pre>
                </details>
              </li>
            ))}
          </ul>
        </details>
      )}
      {results.releases.some((item: Data) => !item.current) && (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            void save(path, {
              action: "restore",
              baseRelease: results.release,
              release: form.get("release"),
              reason: form.get("reason"),
            });
          }}
        >
          <label>
            {t("schoolEval.release")}
            <select name="release" required>
              <option value="">{t("schoolEval.choose")}</option>
              {results.releases
                .filter((item: Data) => !item.current)
                .map((item: Data) => (
                  <option key={item.id} value={item.id}>
                    {item.id}
                  </option>
                ))}
            </select>
          </label>
          <label>
            {t("schoolEval.reason")}
            <textarea name="reason" maxLength={1000} required />
          </label>
          <button className="btn" type="submit" disabled={busy}>
            {t("schoolEval.restore")}
          </button>
        </form>
      )}
    </>
  );
}

function AdminSchoolSuggestions({
  campus,
  revision,
  busy,
  save,
  displayDate,
}: AdminProps) {
  const { t } = useTranslation();
  const path = root + "/campus/" + encodeURIComponent(campus) + "/suggestions";
  const [page, setPage] = useState(0);
  const response = useAdminData(path + "?page=" + page, revision);
  return (
    <>
      {!response?.data ? (
        <p role={response?.error ? "alert" : "status"}>
          {t(response?.error ? "schoolEval.failed" : "feedback.loading")}
        </p>
      ) : (
        <ul className="admin-school-events">
          {!response.data.entries.length && <li>{t("school.empty")}</li>}
          {response.data.entries.map((item: Data) => (
            <li key={item.id}>
              <strong>{displayDate(item.createdAt)}</strong>
              <p>{item.message}</p>
              <a href={item.sourceUrl} target="_blank" rel="noreferrer">
                {t("school.source")}
              </a>
              {item.status === "pending" ? (
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    void save(path, {
                      id: item.id,
                      reason: new FormData(event.currentTarget).get("reason"),
                    });
                  }}
                >
                  <label>
                    {t("schoolEval.reason")}
                    <textarea name="reason" maxLength={1000} required />
                  </label>
                  <button className="btn" type="submit" disabled={busy}>
                    {t("schoolEval.markReviewed")}
                  </button>
                </form>
              ) : (
                <p>
                  {t("schoolEval.markedReviewed")} · {item.reason}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={page}
        more={Boolean(response?.data?.more)}
        setPage={setPage}
      />
    </>
  );
}

function AdminSchoolReviewQueue({
  campus,
  clearCampus,
  revision,
  busy,
  save,
  displayDate,
}: AdminProps & { clearCampus: () => void }) {
  const { t } = useTranslation();
  const [status, setStatus] = useState("pending");
  const [locale, setLocale] = useState("");
  const [page, setPage] = useState(0);
  const [history, setHistory] = useState<Data | null>(null);
  const path = root + "/reviews";
  const response = useAdminData(
    path +
      "?" +
      new URLSearchParams({ campus, status, locale, page: String(page) }),
    revision,
  );
  return (
    <section className="admin-school-section">
      <div className="school-eval-controls">
        <label>
          {t("school.filters")}
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
            }}
          >
            {statuses.map((value) => (
              <option key={value} value={value}>
                {t(
                  value === "all" ? "school.all" : "schoolEval.status." + value,
                )}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("school.language")}
          <select
            value={locale}
            onChange={(event) => {
              setLocale(event.target.value);
              setPage(0);
            }}
          >
            <option value="">{t("school.all")}</option>
            {["en", "fr", "es", "zh"].map((value) => (
              <option key={value}>{value}</option>
            ))}
          </select>
        </label>
        {campus && (
          <button
            className="btn"
            type="button"
            onClick={() => {
              clearCampus();
              setPage(0);
            }}
          >
            {t("schoolEval.allSchools")}
          </button>
        )}
      </div>
      {!response?.data ? (
        <p role={response?.error ? "alert" : "status"}>
          {t(response?.error ? "schoolEval.failed" : "feedback.loading")}
        </p>
      ) : (
        <ul className="admin-school-events">
          {!response.data.entries.length && <li>{t("school.empty")}</li>}
          {response.data.entries.map((item: Data) => (
            <li key={item.id}>
              <h3>{item.schoolName}</h3>
              <p>
                {item.author} · {item.authorEmail} ·{" "}
                {displayDate(item.updatedAt)} ·{" "}
                {t("schoolEval.status." + item.status)}
              </p>
              <p>
                {item.rating} / 5 · {item.body}
              </p>
              <button
                className="btn"
                type="button"
                onClick={async () => {
                  try {
                    setHistory(
                      history?.id === item.id
                        ? null
                        : { ...(await api(path + "/" + item.id)), id: item.id },
                    );
                  } catch {
                    setHistory({ id: item.id, error: true });
                  }
                }}
              >
                {t("schoolEval.revisions")}
              </button>
              {history &&
                history.id === item.id &&
                (history.error ? (
                  <p role="alert">{t("schoolEval.failed")}</p>
                ) : (
                  <ul>
                    {history.versions.map((entry: Data) => (
                      <li key={entry.id}>
                        {displayDate(entry.createdAt)} · {entry.rating} / 5 ·{" "}
                        {entry.body}
                        {entry.isPublic
                          ? " · " + t("schoolEval.status.published")
                          : ""}
                      </li>
                    ))}
                    {history.decisions?.map((entry: Data) => (
                      <li key={entry.id}>
                        {displayDate(entry.createdAt)} ·{" "}
                        {t("schoolEval." + entry.action)} · {entry.reason}
                      </li>
                    ))}
                  </ul>
                ))}
              {!item.own && item.status !== "deleted" && (
                <ReviewAction
                  key={item.etag}
                  item={item}
                  path={path + "/" + item.id}
                  busy={busy}
                  save={save}
                />
              )}
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={page}
        more={Boolean(response?.data?.more)}
        setPage={setPage}
      />
    </section>
  );
}

function ReviewAction({
  item,
  path,
  busy,
  save,
}: {
  item: Data;
  path: string;
  busy: boolean;
  save: AdminProps["save"];
}) {
  const { t } = useTranslation();
  const [action, setAction] = useState("");
  const actions = [
    ...(item.status === "pending" ? ["approve", "return", "reject"] : []),
    ...(["pending", "published"].includes(item.status) ? ["redact"] : []),
    ...(item.hasPublic ? ["hide"] : []),
    "delete",
  ];
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const fields = new FormData(event.currentTarget);
        void save(path, {
          etag: item.etag,
          action,
          reason: fields.get("reason"),
          body: fields.get("body"),
        });
      }}
    >
      <label>
        {t("schoolEval.reviewAction")}
        <select
          required
          aria-label={t("schoolEval.reviewAction")}
          value={action}
          onChange={(event) => setAction(event.target.value)}
        >
          <option value="">{t("schoolEval.choose")}</option>
          {actions.map((value) => (
            <option key={value} value={value}>
              {t("schoolEval." + value)}
            </option>
          ))}
        </select>
      </label>
      {action && (
        <>
          {action === "redact" && (
            <label>
              {t("schoolEval.reviewBody")}
              <textarea
                name="body"
                defaultValue={item.body}
                required
                minLength={20}
                maxLength={2000}
                rows={4}
              />
            </label>
          )}
          <label>
            {t("schoolEval.reason")}
            <textarea name="reason" maxLength={1000} required rows={2} />
          </label>
          <button type="submit" className="btn primary" disabled={busy}>
            {t("schoolEval.apply")}
          </button>
        </>
      )}
    </form>
  );
}
