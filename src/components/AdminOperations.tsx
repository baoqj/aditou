import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api, type Data } from "../api";
import "./admin-operations.css";

function useOperations(path: string, revision: number) {
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
export function AdminOperations({ page }: { page: string }) {
  if (page === "feedback") return <FeedbackInbox />;
  if (page === "visitors") return <VisitorLog />;
  return <SystemSettings />;
}
function Loading({ error, retry }: { error?: string; retry: () => void }) {
  const { t } = useTranslation();
  return (
    <p role={error ? "alert" : "status"}>
      {t(error ?? "feedback.loading")}
      {error && (
        <button className="btn" type="button" onClick={retry}>
          {t("schoolEval.retry")}
        </button>
      )}
    </p>
  );
}
function FeedbackInbox() {
  const { t, i18n } = useTranslation();
  const [category, setCategory] = useState("contact"),
    [page, setPage] = useState(0),
    [query, setQuery] = useState(""),
    [status, setStatus] = useState("");
  const [revision, setRevision] = useState(0),
    [selected, setSelected] = useState<string | null>(null);
  const params = new URLSearchParams({
    category,
    page: String(page),
    q: query,
    status,
  });
  const result = useOperations("/admin/feedback?" + params, revision);
  const categories = ["contact", "issue", "school", "review"];
  const statuses =
    category === "review"
      ? [
          "pending",
          "published",
          "returned",
          "rejected",
          "withdrawn",
          "hidden",
          "deleted",
        ]
      : category === "school"
        ? ["pending", "reviewed"]
        : ["pending", "accepted"];
  const statusLabel = (value: string) =>
    t(
      value === "accepted"
        ? "adminHub.received"
        : value === "reviewed"
          ? "schoolEval.markedReviewed"
          : "schoolEval.status." + value,
    );
  const selectedEntry = result?.data?.entries.find(
    (entry: Data) => entry.id === selected,
  );
  const date = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  return (
    <section className="admin-operations">
      <h1>{t("adminHub.feedback")}</h1>
      <div
        className="operations-tabs"
        role="group"
        aria-label={t("adminHub.category")}
      >
        {categories.map((value) => (
          <button
            type="button"
            className="btn"
            key={value}
            aria-pressed={category === value}
            onClick={() => {
              setCategory(value);
              setStatus("");
              setPage(0);
              setSelected(null);
            }}
          >
            {t("adminHub." + value)}
            {result?.data && " (" + (result.data.counts[value] ?? 0) + ")"}
          </button>
        ))}
      </div>
      <form
        className="operations-filters"
        onSubmit={(event) => {
          event.preventDefault();
          setQuery(String(new FormData(event.currentTarget).get("q") ?? ""));
          setPage(0);
          setSelected(null);
        }}
      >
        <label>
          {t("adminHub.search")}
          <input type="search" name="q" defaultValue={query} maxLength={120} />
        </label>
        <label>
          {t("adminHub.status")}
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPage(0);
              setSelected(null);
            }}
          >
            <option value="">{t("school.all")}</option>
            {statuses.map((value) => (
              <option key={value} value={value}>
                {statusLabel(value)}
              </option>
            ))}
          </select>
        </label>
        <button className="btn" type="submit">
          {t("adminHub.search")}
        </button>
        <button
          className="btn"
          type="button"
          onClick={() => setRevision((value) => value + 1)}
        >
          {t("adminHub.refresh")}
        </button>
      </form>
      {!result?.data ? (
        <Loading
          error={result?.error}
          retry={() => setRevision((value) => value + 1)}
        />
      ) : (
        <>
          <div
            className="operations-table"
            tabIndex={0}
            role="region"
            aria-label={t("adminHub.feedback")}
          >
            <table>
              <thead>
                <tr>
                  {["dateTime", "sender", "context", "status"].map((key) => (
                    <th scope="col" key={key}>
                      {t("adminHub." + key)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.data.entries.map((entry: Data) => (
                  <tr key={entry.id} aria-selected={entry.id === selected}>
                    <td>
                      <button
                        type="button"
                        className="operations-detail-button"
                        onClick={() =>
                          setSelected(selected === entry.id ? null : entry.id)
                        }
                      >
                        {date.format(entry.createdAt)}
                      </button>
                    </td>
                    <td>
                      {entry.username || entry.name}
                      <small>{entry.email}</small>
                    </td>
                    <td>
                      {entry.schoolName ||
                        entry.submittedPath ||
                        t("adminHub." + category)}
                      <small className="operations-message-preview">
                        {entry.message.slice(0, 100)}
                      </small>
                    </td>
                    <td>{statusLabel(entry.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!result.data.entries.length && <p>{t("school.empty")}</p>}
          <div className="operations-filters">
            <button
              type="button"
              className="btn"
              disabled={!page}
              onClick={() => {
                setPage(page - 1);
                setSelected(null);
              }}
            >
              {t("school.previous")}
            </button>
            <button
              type="button"
              className="btn"
              disabled={!result.data.more}
              onClick={() => {
                setPage(page + 1);
                setSelected(null);
              }}
            >
              {t("school.next")}
            </button>
          </div>
          {selectedEntry && (
            <article className="operations-panel">
              <h2>{selectedEntry.schoolName || t("adminHub." + category)}</h2>
              <dl className="operations-meta">
                <div>
                  <dt>{t("adminHub.dateTime")}</dt>
                  <dd>{date.format(selectedEntry.createdAt)}</dd>
                </div>
                <div>
                  <dt>{t("adminHub.sender")}</dt>
                  <dd>{selectedEntry.username || selectedEntry.name}</dd>
                </div>
                <div>
                  <dt>{t("feedback.email")}</dt>
                  <dd>{selectedEntry.email}</dd>
                </div>
                {selectedEntry.phone && (
                  <div>
                    <dt>{t("feedback.phone")}</dt>
                    <dd>{selectedEntry.phone}</dd>
                  </div>
                )}
              </dl>
              {category === "review" && (
                <p>
                  {t("schoolEval.rating")} · {selectedEntry.rating}/5
                  {selectedEntry.experienceYear &&
                    " · " + selectedEntry.experienceYear}
                </p>
              )}
              <p className="operations-message">{selectedEntry.message}</p>
              {selectedEntry.reviewNote && <p>{selectedEntry.reviewNote}</p>}
              {selectedEntry.sourceUrl && (
                <a
                  href={selectedEntry.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("school.source")}
                </a>
              )}
              {selectedEntry.campusId && (
                <div className="operations-filters">
                  <a
                    className="btn"
                    href={
                      "/school/" +
                      selectedEntry.campusId +
                      "?lang=" +
                      i18n.language
                    }
                  >
                    {t("school.detail")}
                  </a>
                  <a
                    className="btn"
                    href={
                      "/admin/schools?" +
                      new URLSearchParams({
                        campus: selectedEntry.campusId,
                        tab: category === "review" ? "reviews" : "suggestions",
                        lang: i18n.language,
                      })
                    }
                  >
                    {t("adminHub.openSource")}
                  </a>
                </div>
              )}
            </article>
          )}
        </>
      )}
    </section>
  );
}

function VisitorLog() {
  const { t, i18n } = useTranslation();
  const [period, setPeriod] = useState("day"),
    [revision, setRevision] = useState(0),
    [filters, setFilters] = useState({ q: "", route: "", from: "", to: "" });
  const [cursors, setCursors] = useState<string[]>([""]);
  const chart = useOperations(
    "/admin/visitors?view=chart&period=" + period,
    revision,
  );
  const params = new URLSearchParams({ ...filters, cursor: cursors.at(-1)! });
  const records = useOperations("/admin/visitors?" + params, revision);
  const timezone = records?.data?.timezone ?? "America/Toronto";
  const date = new Intl.DateTimeFormat(i18n.language, {
    dateStyle: "medium",
    timeZone: timezone,
  });
  const time = new Intl.DateTimeFormat(i18n.language, {
    timeStyle: "medium",
    timeZone: timezone,
  });
  const duration = (milliseconds: number) =>
    t("visitors.durationValue", {
      minutes: Math.floor(milliseconds / 60000),
      seconds: Math.floor(milliseconds / 1000) % 60,
    });
  return (
    <section className="admin-operations">
      <h1>{t("adminHub.visitors")}</h1>
      <div
        className="operations-tabs"
        role="group"
        aria-label={t("visitors.period")}
      >
        {["day", "week", "month"].map((value) => (
          <button
            key={value}
            type="button"
            className="btn"
            aria-pressed={value === period}
            onClick={() => setPeriod(value)}
          >
            {t("visitors." + value)}
          </button>
        ))}
        <button
          type="button"
          className="btn"
          onClick={() => setRevision((value) => value + 1)}
        >
          {t("adminHub.refresh")}
        </button>
      </div>
      {!chart?.data ? (
        <Loading
          error={chart?.error}
          retry={() => setRevision((value) => value + 1)}
        />
      ) : (
        <>
          <VisitorChart data={chart.data} />
          <p className="operations-note">
            {t("visitors.durationNote")} · {chart.data.timezone}
          </p>
          {chart.data.firstRecordedAt && (
            <p className="operations-note">
              {t("visitors.since", {
                date: date.format(chart.data.firstRecordedAt),
              })}
            </p>
          )}
        </>
      )}
      <form
        className="operations-filters"
        onSubmit={(event) => {
          event.preventDefault();
          const form = new FormData(event.currentTarget);
          setFilters({
            q: String(form.get("q") ?? ""),
            route: String(form.get("route") ?? ""),
            from: String(form.get("from") ?? ""),
            to: String(form.get("to") ?? ""),
          });
          setCursors([""]);
        }}
      >
        <label>
          {t("visitors.search")}
          <input name="q" type="search" maxLength={120} />
        </label>
        <label>
          {t("visitors.route")}
          <input name="route" maxLength={512} />
        </label>
        <label>
          {t("visitors.from")}
          <input name="from" type="date" />
        </label>
        <label>
          {t("visitors.to")}
          <input name="to" type="date" />
        </label>
        <button className="btn" type="submit">
          {t("adminHub.search")}
        </button>
      </form>
      {!records?.data ? (
        <Loading
          error={records?.error}
          retry={() => setRevision((value) => value + 1)}
        />
      ) : (
        <>
          <div
            className="operations-table"
            tabIndex={0}
            role="region"
            aria-label={t("visitors.records")}
          >
            <table>
              <thead>
                <tr>
                  {["date", "time", "ip", "username", "route", "duration"].map(
                    (key) => (
                      <th scope="col" key={key}>
                        {t("visitors." + key)}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {records.data.entries.map((entry: Data) => (
                  <tr key={entry.id}>
                    <td>{date.format(entry.startedAt)}</td>
                    <td>{time.format(entry.startedAt)}</td>
                    <td>{entry.ip || "—"}</td>
                    <td>{entry.username || ""}</td>
                    <td>{entry.path}</td>
                    <td>{duration(entry.durationMs)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!records.data.entries.length && <p>{t("school.empty")}</p>}
          <div className="operations-filters">
            <button
              className="btn"
              type="button"
              disabled={cursors.length === 1}
              onClick={() => setCursors((values) => values.slice(0, -1))}
            >
              {t("school.previous")}
            </button>
            <button
              className="btn"
              type="button"
              disabled={!records.data.nextCursor}
              onClick={() =>
                setCursors((values) => [...values, records.data!.nextCursor])
              }
            >
              {t("school.next")}
            </button>
          </div>
        </>
      )}
    </section>
  );
}

function VisitorChart({ data }: { data: Data }) {
  const { t, i18n } = useTranslation();
  const points = data.points as {
    bucket: string;
    visits: number;
    visitors: number;
  }[];
  const maximum = Math.max(2, ...points.map((point) => point.visits));
  const x = (index: number) =>
      60 + (index * 780) / Math.max(1, points.length - 1),
    y = (value: number) => 208 - (value * 166) / maximum;
  const line = points
    .map(
      (point, index) => (index ? "L" : "M") + x(index) + "," + y(point.visits),
    )
    .join(" ");
  const label = (bucket: string) =>
    new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      ...(data.period === "month" ? { year: "numeric" } : { day: "numeric" }),
      timeZone: "UTC",
    }).format(
      new Date(bucket + (bucket.length === 7 ? "-01" : "") + "T00:00:00Z"),
    );
  return (
    <figure className="operations-chart">
      <figcaption>{t("visitors.pageViews")}</figcaption>
      <svg
        viewBox="0 0 900 260"
        role="img"
        aria-label={t("visitors.pageViews")}
      >
        {[0, 0.5, 1].map((value) => (
          <g key={value}>
            <line
              x1={60}
              x2={840}
              y1={y(maximum * value)}
              y2={y(maximum * value)}
              className="operations-grid"
            />
            <text x={48} y={y(maximum * value) + 4} textAnchor="end">
              {Math.round(maximum * value)}
            </text>
          </g>
        ))}
        <path
          d={line + " L840,208 L60,208 Z"}
          className="operations-chart-fill"
        />
        <path d={line} className="operations-chart-line" />
        {points.map((point, index) => (
          <g key={point.bucket}>
            <circle
              cx={x(index)}
              cy={y(point.visits)}
              r={3.5}
              tabIndex={0}
              aria-label={point.bucket + " · " + point.visits}
              className="operations-chart-point"
            >
              <title>
                {point.bucket} · {t("visitors.pageViews")} {point.visits}
              </title>
            </circle>
            {(index === 0 ||
              index === points.length - 1 ||
              index % Math.ceil(points.length / 5) === 0) && (
              <text x={x(index)} y={237} textAnchor="middle">
                {label(point.bucket)}
              </text>
            )}
          </g>
        ))}
      </svg>
      <details>
        <summary>{t("visitors.chartData")}</summary>
        <div className="operations-table">
          <table>
            <thead>
              <tr>
                <th>{t("visitors.date")}</th>
                <th>{t("visitors.pageViews")}</th>
                <th>{t("visitors.unique")}</th>
              </tr>
            </thead>
            <tbody>
              {points.map((point) => (
                <tr key={point.bucket}>
                  <td>{point.bucket}</td>
                  <td>{point.visits}</td>
                  <td>{point.visitors}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}

function SystemSettings() {
  const { t } = useTranslation();
  const [revision, setRevision] = useState(0),
    [notice, setNotice] = useState(false);
  const response = useOperations("/admin/system", revision);
  return (
    <section className="admin-operations">
      <h1>{t("adminHub.system")}</h1>
      {notice && <p role="status">{t("system.saved")}</p>}
      {response?.data ? (
        <SystemForm
          key={response.data.version}
          data={response.data}
          refresh={() => {
            setNotice(true);
            setRevision((value) => value + 1);
          }}
        />
      ) : (
        <Loading
          error={response?.error}
          retry={() => setRevision((value) => value + 1)}
        />
      )}
    </section>
  );
}
function SystemForm({ data, refresh }: { data: Data; refresh: () => void }) {
  const { t } = useTranslation();
  const [registrationOpen, setRegistrationOpen] = useState(
    Boolean(data.registrationOpen),
  );
  const [model, setModel] = useState(data.ttsModel),
    [voice, setVoice] = useState(data.ttsVoice);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const selected = data.models.find((item: Data) => item.id === model);
  return (
    <form
      className="operations-panel operations-system"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        try {
          await api("/admin/system", {
            version: data.version,
            registrationOpen,
            ttsModel: model,
            ttsVoice: voice,
          });
          refresh();
        } catch (error) {
          setError(
            error instanceof Error ? error.message : "system.loadFailed",
          );
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2>{t("system.registration")}</h2>
      <label className="operations-switch">
        <input
          type="checkbox"
          checked={registrationOpen}
          onChange={(event) => setRegistrationOpen(event.target.checked)}
        />
        {t("system.allowRegistration")}
      </label>
      <p>{t(registrationOpen ? "system.open" : "system.paused")}</p>
      <h2>{t("system.tts")}</h2>
      <label>
        {t("system.model")}
        <select
          aria-label={t("system.model")}
          value={model}
          onChange={(event) => {
            setModel(event.target.value);
            setVoice(
              data.models.find((item: Data) => item.id === event.target.value)
                .defaultVoice,
            );
          }}
        >
          {data.models.map((item: Data) => (
            <option value={item.id} key={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("system.voice")}
        <select
          value={voice}
          onChange={(event) => setVoice(event.target.value)}
        >
          {selected?.voices.map((value: string) => (
            <option key={value}>{value}</option>
          ))}
        </select>
      </label>
      <p className="operations-note">{t("system.ttsNote")}</p>
      <button className="btn primary" type="submit" disabled={busy}>
        {t("system.save")}
      </button>
      {error && <p role="alert">{t(error)}</p>}
    </form>
  );
}
