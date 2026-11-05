import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart3,
  Clock,
  Download,
  RefreshCw,
  ArrowRight,
  X,
  Info,
  CheckCircle2,
  Layers,
  Users,
  BookOpen,
} from "lucide-react";
import { api, type Data } from "../api";
import i18n, { t } from "../i18n";
import { SKILLS } from "../skills";
import "./analytics.css";
type Filters = {
  start: string;
  end: string;
  timezone: string;
  locale: string;
  grade: string;
  context: string;
  context_id?: string;
  class_id: string;
  skill: string;
  type: string;
  view: string;
  org_id: string;
};
const timezone = "America/Toronto";
const dateKey = (date: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
function dateOffset(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return dateKey(d);
}
const weekStart = () =>
  dateOffset(-((new Date(dateOffset(0) + "T12:00:00Z").getUTCDay() + 6) % 7));
const number = (n: number) =>
  new Intl.NumberFormat(i18n.resolvedLanguage, {
    maximumFractionDigits: 1,
  }).format(n);
function Ratio({ value }: { value: Data }) {
  return (
    <>
      {value?.denominator ? (
        <>
          <strong>{number(value.percent)}%</strong>
          <small>
            {value.numerator} / {value.denominator}
          </small>
        </>
      ) : (
        <span>{t("analytics.noGraded")}</span>
      )}
    </>
  );
}
function Table({ headers, rows }: { headers: string[]; rows: any[][] }) {
  return (
    <div className="analytics-table-wrap">
      <table>
        <thead>
          <tr>
            {headers.map((h, i) => (
              <th scope="col" key={i}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) =>
                  j === 0 ? (
                    <th scope="row" key={j}>
                      {v}
                    </th>
                  ) : (
                    <td key={j}>{v}</td>
                  ),
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length}>{t("analytics.empty")}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
function DataTable({ headers, rows }: { headers: string[]; rows: any[][] }) {
  return (
    <details className="analytics-data-table">
      <summary>{t("analytics.viewData")}</summary>
      <Table headers={headers} rows={rows} />
    </details>
  );
}
function Panel({
  title,
  note,
  children,
  action,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="analytics-panel">
      <div className="analytics-panel-head">
        <h2>{title}</h2>
        {action}
      </div>
      {note && <p className="analytics-caption">{note}</p>}
      {children}
    </section>
  );
}
function Metric({
  label,
  value,
  note,
  onClick,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  note?: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button className="analytics-metric" onClick={onClick}>
      <span>
        {icon}
        {label}
      </span>
      <div className="analytics-metric-value">{value}</div>
      {note && <small>{note}</small>}
      <ArrowRight size={15} className="metric-arrow" />
    </button>
  );
}
function DailyChart({
  data,
  time,
  onDay,
  teaching = false,
}: {
  data: Data[];
  time: boolean;
  teaching?: boolean;
  onDay: (day: string) => void;
}) {
  const maximum = Math.max(
    1,
    ...data.map((d) => (time ? d.minutes : d.submissions)),
  );
  const visible =
    data.length > 31
      ? data.filter((_, i) => i % Math.ceil(data.length / 31) === 0)
      : data;
  return (
    <>
      <div className="analytics-chart-scroll">
        <div
          className="analytics-daily-chart"
          style={{ minWidth: Math.max(280, visible.length * 34) }}
          aria-label={t(
            time ? "analytics.dailyMinutes" : "analytics.dailySubmissions",
          )}
        >
          <div className="analytics-axis">
            <span>
              {number(maximum)}{" "}
              {t(time ? "analytics.minutes" : "analytics.submissionsUnit")}
            </span>
            <span>0</span>
          </div>
          <div className="analytics-columns">
            {visible.map((d) => (
              <button
                className="analytics-column"
                key={d.day}
                onClick={() => onDay(d.day)}
                aria-label={`${d.day}: ${number(time ? d.minutes : d.submissions)} ${t(time ? "analytics.minutes" : "analytics.submissionsUnit")}`}
                title={`${d.day}: ${number(time ? d.minutes : d.submissions)}`}
              >
                <span className="analytics-bar-space">
                  <span
                    className="analytics-bar-stack"
                    style={{
                      height: `${(100 * (time ? d.minutes : d.submissions)) / maximum}%`,
                    }}
                  >
                    {time ? (
                      ["private", "assignment", "classroom"].map((c) => (
                        <span
                          key={c}
                          className={"source-" + c}
                          style={{
                            height: `${d.minutes ? (100 * d.sources[c]) / d.minutes : 0}%`,
                          }}
                        />
                      ))
                    ) : (
                      <span
                        className="source-classroom"
                        style={{ height: "100%" }}
                      />
                    )}
                  </span>
                </span>
                <span className="analytics-day">{d.day.slice(5)}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {time && !teaching && (
        <div className="analytics-legend">
          {["private", "assignment", "classroom"].map((c) => (
            <span key={c}>
              <i className={"source-" + c} />
              {t("analytics.source." + c)}
            </span>
          ))}
        </div>
      )}
      {data.length > 31 && (
        <p className="analytics-caption">{t("analytics.sampledChart")}</p>
      )}
      <DataTable
        headers={[
          t("analytics.date"),
          t(
            teaching
              ? "analytics.confirmedMinutes"
              : "analytics.recordedMinutes",
          ),
          t(teaching ? "analytics.confirmedSessions" : "analytics.submissions"),
        ]}
        rows={data.map((d) => [d.day, number(d.minutes), d.submissions])}
      />
    </>
  );
}
function ResultPoints({
  data,
  onDay,
}: {
  data: Data[];
  onDay: (d: string) => void;
}) {
  return (
    <>
      <div
        className="analytics-points"
        role="group"
        aria-label={t("analytics.firstResults")}
      >
        <div className="analytics-point-axis">
          <span>100%</span>
          <span>50%</span>
          <span>0%</span>
        </div>
        <div className="analytics-point-canvas">
          {data.map(
            (d, i) =>
              d.first.denominator > 0 && (
                <button
                  key={d.day}
                  className={
                    "analytics-point " +
                    (d.first.denominator < 10 ? "low-sample" : "")
                  }
                  style={{
                    left: `${5 + (data.length > 1 ? i / (data.length - 1) : 0) * 90}%`,
                    bottom: `${d.first.percent}%`,
                  }}
                  aria-label={`${d.day}: ${d.first.numerator}/${d.first.denominator}, ${d.first.percent}%`}
                  title={`${d.day}: ${d.first.numerator}/${d.first.denominator}`}
                  onClick={() => onDay(d.day)}
                />
              ),
          )}
          {!data.some((d) => d.first.denominator) && (
            <p>{t("analytics.noGraded")}</p>
          )}
        </div>
      </div>
      <div className="analytics-point-dates">
        <span>{data[0]?.day}</span>
        <span>{data.at(-1)?.day}</span>
      </div>
      <p className="analytics-caption">{t("analytics.pointsNote")}</p>
      <DataTable
        headers={[
          t("analytics.date"),
          t("analytics.first"),
          t("analytics.repeat"),
        ]}
        rows={data.map((d) => [
          d.day,
          `${d.first.numerator}/${d.first.denominator}`,
          `${d.repeat.numerator}/${d.repeat.denominator}`,
        ])}
      />
    </>
  );
}
function Skills({
  skills,
  onSkill,
  limit,
}: {
  skills: Data[];
  onSkill: (s: string) => void;
  limit?: number;
}) {
  return (
    <div className="analytics-skill-bars">
      {skills.slice(0, limit).map((s) => (
        <button key={s.key} onClick={() => onSkill(s.key)}>
          <span>
            <strong>{t(s.key)}</strong>
            <small>
              {s.accuracy.denominator
                ? `${s.accuracy.numerator}/${s.accuracy.denominator} · ${s.accuracy.percent}%`
                : t("analytics.noGraded")}{" "}
              {` · n=${s.submissions}`}
            </small>
          </span>
          <span className="analytics-skill-track">
            <span style={{ width: `${s.accuracy.percent || 0}%` }} />
          </span>
          {s.accuracy.denominator < 10 && (
            <small>{t("analytics.smallSample")}</small>
          )}
        </button>
      ))}
      {!skills.length && (
        <p className="analytics-empty">{t("analytics.noSkills")}</p>
      )}
    </div>
  );
}
export function AnalyticsDashboard({
  user,
  onPractice,
}: {
  user: Data;
  onPractice?: (skill: string, locale: string, grade: string) => void;
}) {
  useTranslation();
  const staff = ["admin", "teacher"].includes(user.role),
    orgDefault = user.role === "admin";
  const [scope, setScope] = useState<Data | null>(null),
    [data, setData] = useState<Data | null>(null),
    [tab, setTab] = useState("overview"),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [revision, setRevision] = useState(0),
    [advanced, setAdvanced] = useState(staff),
    [exporting, setExporting] = useState(false),
    [notice, setNotice] = useState("");
  const [filters, setFilters] = useState<Filters>(() => {
    const defaults: Filters = {
      start: weekStart(),
      end: dateOffset(0),
      timezone,
      locale:
        localStorage.getItem("aditou.exercise-language") === "en-CA"
          ? "en-CA"
          : "fr-CA",
      grade: "1",
      context: "",
      class_id: "",
      skill: "",
      type: "",
      view: orgDefault ? "organization" : "personal",
      org_id: "",
    };
    try {
      return {
        ...defaults,
        ...JSON.parse(
          sessionStorage.getItem("aditou.analytics.filters:" + user.id) || "{}",
        ),
      };
    } catch {
      return defaults;
    }
  });
  const [detail, setDetail] = useState<Partial<Filters> | null>(null),
    [detailData, setDetailData] = useState<Data | null>(null),
    [offset, setOffset] = useState(0),
    [detailError, setDetailError] = useState("");
  const dialog = useRef<HTMLDialogElement>(null),
    detailBack = useRef<HTMLElement | null>(null);
  const params = (f: Filters) =>
    new URLSearchParams(Object.entries(f).filter(([, v]) => !!v)).toString();
  useEffect(() => {
    api("/analytics/scope")
      .then((s) => {
        setScope(s);
        setFilters((f) => ({
          ...f,
          grade: sessionStorage.getItem("aditou.analytics.filters:" + user.id)
            ? f.grade
            : String(s.grade || s.classes[0]?.grade || 1),
          org_id: s.organizations[0]?.id || "",
          view:
            orgDefault && s.organizations.length ? "organization" : "personal",
        }));
      })
      .catch((e) => setError(e.message));
  }, []);
  useEffect(() => {
    if (scope)
      sessionStorage.setItem(
        "aditou.analytics.filters:" + user.id,
        JSON.stringify(filters),
      );
  }, [filters, scope]);
  useEffect(() => {
    if (!scope) return;
    let active = true;
    setLoading(true);
    setError("");
    setData(null);
    api("/analytics/overview?" + params(filters))
      .then((d) => {
        if (active) setData(d);
      })
      .catch((e) => {
        if (active) setError(e.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [filters, scope, revision]);
  useEffect(() => {
    if (!detail) {
      dialog.current?.close();
      return;
    }
    detailBack.current = document.activeElement as HTMLElement;
    dialog.current?.showModal();
    return () => {
      detailBack.current?.focus();
    };
  }, [!!detail]);
  useEffect(() => {
    if (!detail) return;
    let active = true;
    setDetailData(null);
    setDetailError("");
    api(
      "/analytics/overview?" +
        params({ ...filters, ...detail }) +
        "&offset=" +
        offset,
    )
      .then((d) => {
        if (active) setDetailData(d);
      })
      .catch((e) => {
        if (active) setDetailError(e.message);
      });
    return () => {
      active = false;
    };
  }, [detail, offset, filters]);
  const change = (key: keyof Filters, value: string) =>
    setFilters((f) => ({
      ...f,
      [key]: value,
      ...(["locale", "grade", "view", "org_id"].includes(key)
        ? { class_id: "", skill: "", type: "" }
        : {}),
    }));
  const drill = (part: Partial<Filters>) => {
    setOffset(0);
    setDetail(part);
  };
  async function exportReport() {
    setExporting(true);
    try {
      const d = await api("/analytics/export?" + params(filters), {});
      const blob = new Blob([JSON.stringify(d, null, 2)], {
          type: "application/json",
        }),
        a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `aditou-report-${filters.start}-${filters.end}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setExporting(false);
    }
  }
  const summary = data?.summary,
    assignmentTotal =
      data?.assignments.reduce((s: number, a: Data) => s + a.target, 0) || 0,
    assignmentSubmitted =
      data?.assignments.reduce((s: number, a: Data) => s + a.submitted, 0) || 0;
  const tabs = staff
    ? [
        "overview",
        "time",
        "performance",
        "skills",
        "assignments",
        "teaching",
        "content",
        "quality",
        "records",
      ]
    : ["overview", "time", "performance", "skills", "records"];
  return (
    <div className="analytics-dashboard">
      <section className="analytics-toolbar">
        <div className="analytics-toolbar-title">
          <span className="analytics-kicker">
            {"ADITOU · " + t("analytics.learningInsights")}
          </span>
          <h1>
            {t(
              staff
                ? filters.view === "organization"
                  ? "analytics.orgTitle"
                  : "analytics.teacherTitle"
                : "analytics.studentTitle",
            )}
          </h1>
          <p>{t(staff ? "analytics.staffIntro" : "analytics.studentIntro")}</p>
        </div>
        <div className="analytics-toolbar-actions">
          <button
            className="btn secondary"
            onClick={() => setRevision((x) => x + 1)}
            aria-label={t("analytics.refresh")}
          >
            <RefreshCw size={16} />
          </button>
          <button
            className="btn secondary"
            disabled={!data || exporting}
            onClick={() => void exportReport()}
          >
            <Download size={16} />
            {t("analytics.export")}
          </button>
        </div>
      </section>
      <div className="analytics-filter-bar">
        <label>
          {t("analytics.period")}
          <select
            aria-label={t("analytics.period")}
            value={
              filters.start === weekStart() && filters.end === dateOffset(0)
                ? "week"
                : filters.start === dateOffset(-6)
                  ? "7"
                  : filters.start === dateOffset(-29)
                    ? "30"
                    : "custom"
            }
            onChange={(e) => {
              if (e.target.value !== "custom")
                setFilters((f) => ({
                  ...f,
                  start:
                    e.target.value === "week"
                      ? weekStart()
                      : dateOffset(1 - Number(e.target.value)),
                  end: dateOffset(0),
                }));
              else setAdvanced(true);
            }}
          >
            <option value="week">{t("analytics.thisWeek")}</option>
            <option value="7">{t("analytics.last7")}</option>
            <option value="30">{t("analytics.last30")}</option>
            <option value="custom">{t("analytics.custom")}</option>
          </select>
        </label>
        <label>
          {t("analytics.language")}
          <select
            aria-label={t("analytics.language")}
            value={filters.locale}
            onChange={(e) => change("locale", e.target.value)}
          >
            <option value="fr-CA">{t("language.fr-CA")}</option>
            <option value="en-CA">{t("language.en-CA")}</option>
          </select>
        </label>
        <label>
          {t("analytics.grade")}
          <select
            aria-label={t("analytics.grade")}
            value={filters.grade}
            onChange={(e) => change("grade", e.target.value)}
          >
            {[1, 2, 3, 4].map((g) => (
              <option key={g} value={g}>
                {t("gradeLabel", { grade: g })}
              </option>
            ))}
          </select>
        </label>
        {staff && (
          <label>
            {t("analytics.scope")}
            <select
              value={filters.view}
              onChange={(e) => change("view", e.target.value)}
            >
              <option value="personal">{t("analytics.myClasses")}</option>
              {scope?.organizations.length > 0 && (
                <option value="organization">
                  {t("analytics.institution")}
                </option>
              )}
            </select>
          </label>
        )}
        {filters.view === "organization" && (
          <label>
            {t("analytics.institution")}
            <select
              value={filters.org_id}
              onChange={(e) => change("org_id", e.target.value)}
            >
              {scope?.organizations.map((o: Data) => (
                <option value={o.id} key={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <button
          className="text-button"
          aria-expanded={advanced}
          onClick={() => setAdvanced(!advanced)}
        >
          {t(advanced ? "analytics.fewerFilters" : "analytics.moreFilters")}
        </button>
      </div>
      {advanced && (
        <section className="analytics-advanced">
          <label>
            {t("analytics.from")}
            <input
              type="date"
              max={filters.end}
              value={filters.start}
              onChange={(e) => change("start", e.target.value)}
            />
          </label>
          <label>
            {t("analytics.to")}
            <input
              type="date"
              max={dateOffset(0)}
              min={filters.start}
              value={filters.end}
              onChange={(e) => change("end", e.target.value)}
            />
          </label>
          <label>
            {t("analytics.timezone")}
            <select
              value={filters.timezone}
              onChange={(e) => change("timezone", e.target.value)}
            >
              {["America/Toronto", "Europe/Paris", "UTC"].map((z) => (
                <option key={z}>{z}</option>
              ))}
            </select>
          </label>
          <label>
            {t("analytics.source")}
            <select
              value={filters.context}
              onChange={(e) => change("context", e.target.value)}
            >
              <option value="">{t("analytics.allSources")}</option>
              {(staff
                ? ["assignment", "classroom"]
                : ["private", "assignment", "classroom"]
              ).map((s) => (
                <option key={s} value={s}>
                  {t("analytics.source." + s)}
                </option>
              ))}
            </select>
          </label>
          {staff && (
            <label>
              {t("analytics.class")}
              <select
                value={filters.class_id}
                onChange={(e) => change("class_id", e.target.value)}
              >
                <option value="">{t("analytics.allClasses")}</option>
                {(filters.view === "personal"
                  ? scope?.classes
                  : data?.scope.classes
                )?.map((c: Data) => (
                  <option value={c.id} key={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          <label>
            {t("analytics.skill")}
            <select
              value={filters.skill}
              onChange={(e) => change("skill", e.target.value)}
            >
              <option value="">{t("analytics.allSkills")}</option>
              {SKILLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {t(s.id)}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("analytics.type")}
            <select
              value={filters.type}
              onChange={(e) => change("type", e.target.value)}
            >
              <option value="">{t("analytics.allTypes")}</option>
              {[
                "qcm",
                "numeric",
                "multiple",
                "order",
                "matching",
                "text",
                "drawing",
                "oral",
                "observation",
              ].map((s) => (
                <option key={s} value={s}>
                  {t("analytics.type." + s)}
                </option>
              ))}
            </select>
          </label>
          <button
            className="text-button"
            onClick={() =>
              setFilters((f) => ({
                ...f,
                start: weekStart(),
                end: dateOffset(0),
                context: "",
                class_id: "",
                skill: "",
                type: "",
              }))
            }
          >
            {t("analytics.clear")}
          </button>
        </section>
      )}
      <nav className="analytics-tabs" aria-label={t("analytics.sections")}>
        {tabs.map((item) => (
          <button
            aria-current={tab === item ? "page" : undefined}
            className={tab === item ? "selected" : ""}
            key={item}
            onClick={() => setTab(item)}
          >
            {t("analytics.tab." + item)}
          </button>
        ))}
      </nav>
      {loading && (
        <p role="status" className="analytics-loading">
          {t("analytics.loading")}
        </p>
      )}
      {error && (
        <p className="alert error" role="alert">
          {t(error)}
        </p>
      )}
      {notice && <p role="status">{t(notice)}</p>}
      {data && summary && (
        <>
          <div className="analytics-asof">
            <CheckCircle2 size={14} />
            {t("analytics.updated")}{" "}
            {new Date(data.as_of).toLocaleString(i18n.resolvedLanguage, {
              timeZone: filters.timezone,
            })}{" "}
            · {filters.timezone} · {data.metric_version}
          </div>
          {tab === "overview" && (
            <>
              <div className={"analytics-metrics " + (staff ? "staff" : "")}>
                {staff ? (
                  <>
                    <Metric
                      label={t("analytics.classroomHours")}
                      value={number(data.teaching_minutes / 60)}
                      note={t("analytics.confirmedOnly")}
                      onClick={() => setTab("teaching")}
                      icon={<Clock size={18} />}
                    />
                    <Metric
                      label={t("analytics.confirmedSessions")}
                      value={data.confirmed_sessions}
                      onClick={() => setTab("teaching")}
                      icon={<BookOpen size={18} />}
                    />
                    <Metric
                      label={t("analytics.activeLearners")}
                      value={summary.learners}
                      note={t("analytics.uniqueSubmitters")}
                      onClick={() => setTab("records")}
                      icon={<Users size={18} />}
                    />
                    <Metric
                      label={t("analytics.recordedMinutes")}
                      value={
                        summary.time_learners ? number(summary.minutes) : "—"
                      }
                      note={t("analytics.partialTime")}
                      onClick={() => setTab("time")}
                      icon={<Clock size={18} />}
                    />
                    <Metric
                      label={t("analytics.assignmentCompletion")}
                      value={`${assignmentSubmitted} / ${assignmentTotal}`}
                      note={t("analytics.dueBatch")}
                      onClick={() => setTab("assignments")}
                      icon={<Layers size={18} />}
                    />
                    <Metric
                      label={t("analytics.pending")}
                      value={summary.pending}
                      note={t("analytics.pendingSeparate")}
                      onClick={() => setTab("assignments")}
                      icon={<Info size={18} />}
                    />
                  </>
                ) : (
                  <>
                    <Metric
                      label={t("analytics.recordedMinutes")}
                      value={
                        summary.time_learners ? number(summary.minutes) : "—"
                      }
                      note={t("analytics.partialTime")}
                      onClick={() => setTab("time")}
                      icon={<Clock size={18} />}
                    />
                    <Metric
                      label={t("analytics.practiceDays")}
                      value={summary.practice_days}
                      onClick={() => setTab("time")}
                      icon={<CheckCircle2 size={18} />}
                    />
                    <Metric
                      label={t("analytics.newItems")}
                      value={summary.new_items}
                      note={t("analytics.firstSubmission")}
                      onClick={() => drill({})}
                      icon={<BookOpen size={18} />}
                    />
                    <Metric
                      label={t("analytics.firstResults")}
                      value={<Ratio value={summary.first} />}
                      note={t("analytics.helpUnknown")}
                      onClick={() => setTab("performance")}
                      icon={<BarChart3 size={18} />}
                    />
                  </>
                )}
              </div>
              <div className="analytics-grid">
                <Panel
                  title={t("analytics.dailyMinutes")}
                  note={t("analytics.partialTime")}
                >
                  <DailyChart
                    data={data.daily}
                    time
                    onDay={(d) => drill({ start: d, end: d })}
                  />
                </Panel>
                {staff ? (
                  <Panel
                    title={t("analytics.confirmedMinutes")}
                    note={t("analytics.classroomHoursNote")}
                  >
                    <DailyChart
                      data={data.teaching_daily}
                      time
                      teaching
                      onDay={() => setTab("teaching")}
                    />
                  </Panel>
                ) : (
                  <Panel
                    title={t("analytics.firstResults")}
                    note={t("analytics.noCalibratedTrend")}
                  >
                    <ResultPoints
                      data={data.daily}
                      onDay={(d) => drill({ start: d, end: d })}
                    />
                  </Panel>
                )}
              </div>
              <Panel
                title={t("analytics.practicedSkills")}
                action={
                  <button
                    className="text-button"
                    onClick={() => setTab("skills")}
                  >
                    {t("analytics.viewAll")} <ArrowRight size={15} />
                  </button>
                }
              >
                <Skills
                  skills={data.skills}
                  limit={4}
                  onSkill={(s) => drill({ skill: s })}
                />
              </Panel>
              {!staff && (
                <section className="analytics-next">
                  <div>
                    <span className="analytics-kicker">
                      {t("analytics.nextStep")}
                    </span>
                    <h2>{t("analytics.chooseSkill")}</h2>
                    <p>{t("analytics.chooseSkillNote")}</p>
                  </div>
                  <button
                    className="btn"
                    onClick={() => {
                      const s = data.skills.find(
                        (s: Data) =>
                          s.accuracy.denominator >= 10 &&
                          s.accuracy.percent < 80,
                      );
                      onPractice?.(s?.key || "", filters.locale, filters.grade);
                    }}
                  >
                    {t("analytics.practice")}
                    <ArrowRight size={17} />
                  </button>
                </section>
              )}
              {staff && (
                <Panel title={t("analytics.toFollowUp")}>
                  <p>
                    {summary.pending} {t("analytics.pending")} ·{" "}
                    {data.assignments.reduce(
                      (n: number, a: Data) => n + a.not_started + a.started,
                      0,
                    )}{" "}
                    {t("analytics.unsubmittedTasks")}
                  </p>
                  <button
                    className="text-button"
                    onClick={() => setTab("assignments")}
                  >
                    {t("analytics.openAssignments")} <ArrowRight size={15} />
                  </button>
                </Panel>
              )}
            </>
          )}
          {tab === "time" && (
            <>
              <Panel
                title={t("analytics.dailyMinutes")}
                note={t("analytics.timeDefinition")}
              >
                <DailyChart
                  data={data.daily}
                  time
                  onDay={(d) => drill({ start: d, end: d })}
                />
              </Panel>
              <div className="analytics-grid">
                <Panel title={t("analytics.timeComposition")}>
                  <Table
                    headers={[
                      t("analytics.activity"),
                      t("analytics.recordedMinutes"),
                    ]}
                    rows={data.time_kinds.map((k: Data) => [
                      t("analytics.kind." + k.key),
                      number(k.minutes),
                    ])}
                  />
                </Panel>
                <Panel title={t("analytics.dataCoverage")}>
                  <p>
                    {data.quality.time_recorded_learners} /{" "}
                    {data.quality.submission_learners}{" "}
                    {t("analytics.recordedLearners")}
                  </p>
                  <p>{t("analytics.partialTime")}</p>
                  <p>
                    {t("analytics.trackingSince")}{" "}
                    {new Date(data.quality.tracking_since).toLocaleDateString(
                      i18n.resolvedLanguage,
                    )}
                  </p>
                </Panel>
              </div>
            </>
          )}
          {tab === "performance" && (
            <>
              <div className="analytics-grid">
                <Panel
                  title={t("analytics.first")}
                  note={t("analytics.helpUnknown")}
                >
                  <div className="analytics-big-ratio">
                    <Ratio value={summary.first} />
                  </div>
                </Panel>
                <Panel
                  title={t("analytics.repeat")}
                  note={t("analytics.repetitionNote")}
                >
                  <div className="analytics-big-ratio">
                    <Ratio value={summary.repeat} />
                  </div>
                </Panel>
              </div>
              <Panel
                title={t("analytics.firstResults")}
                note={t("analytics.noCalibratedTrend")}
              >
                <ResultPoints
                  data={data.daily}
                  onDay={(d) => drill({ start: d, end: d })}
                />
              </Panel>
              <div className="analytics-grid">
                <Panel
                  title={t("analytics.scoreRate")}
                  note={t("analytics.scoreDefinition")}
                >
                  <Ratio value={summary.score} />
                  <p>
                    {summary.pending} {t("analytics.pending")} ·{" "}
                    {summary.unreleased} {t("analytics.unreleased")}
                  </p>
                </Panel>
                <Panel title={t("analytics.answerConditions")}>
                  <Table
                    headers={[
                      t("analytics.condition"),
                      t("analytics.submissions"),
                    ]}
                    rows={data.conditions.map((c: Data) => [
                      t("analytics.condition." + c.key),
                      c.count,
                    ])}
                  />
                </Panel>
              </div>
              <Panel title={t("analytics.questionMix")}>
                <Table
                  headers={[
                    t("analytics.type"),
                    t("analytics.submissions"),
                    t("analytics.objectiveAccuracy"),
                  ]}
                  rows={data.types.map((r: Data) => [
                    t("analytics.type." + r.key),
                    r.submissions,
                    <Ratio value={r.accuracy} />,
                  ])}
                />
              </Panel>
            </>
          )}
          {tab === "skills" && (
            <>
              <Panel
                title={t("analytics.practicedSkills")}
                note={t("analytics.skillsNote")}
              >
                <Skills
                  skills={data.skills}
                  onSkill={(s) => drill({ skill: s })}
                />
                <DataTable
                  headers={[
                    t("analytics.skill"),
                    t("analytics.submissions"),
                    t("analytics.objectiveAccuracy"),
                    t("analytics.pending"),
                  ]}
                  rows={data.skills.map((s: Data) => [
                    t(s.key),
                    s.submissions,
                    `${s.accuracy.numerator}/${s.accuracy.denominator}`,
                    s.pending,
                  ])}
                />
              </Panel>
              {staff && (
                <Panel
                  title={t(
                    filters.view === "organization"
                      ? "analytics.classSkillMatrix"
                      : "analytics.skillMatrix",
                  )}
                  note={t("analytics.noRanking")}
                >
                  <Table
                    headers={[
                      t("analytics.learner"),
                      ...data.skills.map((s: Data) => t(s.key)),
                    ]}
                    rows={data.matrix.map((l: Data) => [
                      l.alias,
                      ...l.skills.map((s: Data) => (
                        <span>
                          {s.accuracy.denominator
                            ? `${s.accuracy.numerator}/${s.accuracy.denominator}`
                            : "—"}
                          <small>
                            {" "}
                            {`n=${s.submissions}`}
                            {s.pending
                              ? ` · ${t("analytics.pending")}: ${s.pending}`
                              : ""}
                          </small>
                        </span>
                      )),
                    ])}
                  />
                </Panel>
              )}
            </>
          )}
          {tab === "assignments" && (
            <>
              <Panel
                title={t("analytics.assignmentFunnel")}
                note={t("analytics.dueBatch")}
              >
                <div className="analytics-status-bars">
                  {data.assignments.slice(0, 8).map((assignment: Data) => (
                    <div key={assignment.id}>
                      <strong>{assignment.title}</strong>
                      <StatusBar
                        total={assignment.target}
                        segments={[
                          ["notStarted", assignment.not_started, "#c9d7d1"],
                          ["inProgress", assignment.started, "#dca358"],
                          ["submitted", assignment.submitted, "#0f766e"],
                        ]}
                      />
                      <StatusBar
                        total={assignment.submitted}
                        segments={[
                          ["pendingStudents", assignment.waiting, "#dca358"],
                          ["gradedStudents", assignment.graded, "#0f766e"],
                        ]}
                      />
                    </div>
                  ))}
                </div>
                <Table
                  headers={[
                    t("analytics.assignment"),
                    t("analytics.target"),
                    t("analytics.notStarted"),
                    t("analytics.inProgress"),
                    t("analytics.submitted"),
                    t("analytics.pendingStudents"),
                    t("analytics.gradedStudents"),
                    t("analytics.onTime"),
                    t("analytics.late"),
                  ]}
                  rows={data.assignments.map((a: Data) => [
                    <button
                      className="text-button"
                      onClick={() => {
                        setDetailData(null);
                        drill({
                          context: "assignment",
                          context_id: a.id,
                          class_id: a.class_id,
                        });
                      }}
                    >
                      {a.title}
                    </button>,
                    a.target,
                    a.not_started,
                    a.started,
                    `${a.submitted}/${a.target}`,
                    a.waiting,
                    a.graded,
                    a.on_time,
                    a.late,
                  ])}
                />
                {data.quality.historical_targets && (
                  <p className="analytics-warning">
                    {t("analytics.legacyTargets")}
                  </p>
                )}
              </Panel>
              <Panel title={t("analytics.pendingAge")}>
                <Table
                  headers={[t("analytics.ageDays"), t("analytics.pending")]}
                  rows={data.pending_age.map((b: Data) => [b.key, b.count])}
                />
                <a className="btn secondary" href="/homework">
                  {t("analytics.openAssignments")}
                </a>
              </Panel>
              {filters.view !== "organization" &&
                data.assignments.map((a: Data) => (
                  <Panel
                    key={a.id}
                    title={a.title}
                    note={`${t("analytics.due")}: ${a.due_at}`}
                  >
                    <Table
                      headers={[t("analytics.learner"), t("analytics.state")]}
                      rows={a.learners.map((l: Data) => [
                        l.alias,
                        t("analytics.state." + l.status),
                      ])}
                    />
                  </Panel>
                ))}
            </>
          )}
          {tab === "teaching" && (
            <>
              <div className="analytics-grid">
                <Panel
                  title={t("analytics.classroomHours")}
                  note={t("analytics.classroomHoursNote")}
                >
                  <div className="analytics-large-number">
                    {number(data.teaching_minutes / 60)}
                  </div>
                </Panel>
                <Panel
                  title={t("analytics.teacherHours")}
                  note={t("analytics.teacherHoursNote")}
                >
                  <div className="analytics-large-number">
                    {number(data.teacher_person_minutes / 60)}
                  </div>
                </Panel>
              </div>
              <Panel
                title={t("analytics.workload")}
                note={t("analytics.noTeacherRanking")}
              >
                <Table
                  headers={[
                    t("analytics.teacher"),
                    t("analytics.classes"),
                    t("analytics.confirmedMinutes"),
                    t("analytics.submissions"),
                    t("analytics.pending"),
                  ]}
                  rows={data.teachers.map((r: Data) => [
                    r.name,
                    r.classes,
                    number(r.minutes),
                    r.submissions,
                    r.pending,
                  ])}
                />
              </Panel>
              <Panel
                title={t("analytics.classroomReview")}
                note={t("analytics.sessionPeriod")}
              >
                <Table
                  headers={[
                    t("analytics.session"),
                    t("analytics.target"),
                    t("analytics.currentRound"),
                    t("analytics.submitted"),
                    t("analytics.state"),
                  ]}
                  rows={data.sessions.map((s: Data) => [
                    s.title,
                    s.target,
                    s.round,
                    `${s.current_submitted}/${s.target}`,
                    t("analytics.phase." + s.phase),
                  ])}
                />
                {data.sessions.map((s: Data) => (
                  <details key={s.id}>
                    <summary>
                      {s.title} · {t("analytics.rounds")}
                    </summary>
                    <Table
                      headers={[
                        t("analytics.round"),
                        t("analytics.submitted"),
                        t("analytics.correct"),
                        t("analytics.pending"),
                      ]}
                      rows={s.rounds.map((r: Data) => [
                        r.round,
                        r.submitted,
                        r.correct,
                        r.pending,
                      ])}
                    />
                  </details>
                ))}
              </Panel>
              <Panel title={t("analytics.teachingRecords")}>
                <Table
                  headers={[
                    t("analytics.session"),
                    t("analytics.teacher"),
                    t("analytics.from"),
                    t("analytics.to"),
                    t("analytics.reason"),
                  ]}
                  rows={data.teaching.map((r: Data) => [
                    r.title,
                    r.teacher_name,
                    new Date(r.started_at).toLocaleString(
                      i18n.resolvedLanguage,
                    ),
                    new Date(r.ended_at).toLocaleString(i18n.resolvedLanguage),
                    r.reason || "—",
                  ])}
                />
              </Panel>
              {filters.view === "personal" && (
                <TeachingForm
                  sessions={data.sessions}
                  onSaved={() => setRevision((x) => x + 1)}
                />
              )}
            </>
          )}
          {tab === "content" && (
            <Panel
              title={t("analytics.contentCoverage")}
              note={t("analytics.contentNote")}
            >
              <p>
                {data.content.published} {t("analytics.publishedQuestions")} ·{" "}
                {data.content.recorded} {t("analytics.recordedQuestions")}
              </p>
              <Table
                headers={[
                  t("analytics.skill"),
                  t("analytics.publishedQuestions"),
                  t("analytics.recordedQuestions"),
                ]}
                rows={data.content.skills.map((s: Data) => [
                  t(s.key),
                  s.count,
                  s.recorded,
                ])}
              />
              <a className="btn secondary" href="/studio">
                {t("analytics.openStudio")}
              </a>
            </Panel>
          )}
          {tab === "quality" && (
            <>
              <Panel title={t("analytics.dataQuality")}>
                <Table
                  headers={[t("analytics.metric"), t("analytics.availability")]}
                  rows={[
                    [t("analytics.time"), t("analytics.partialTime")],
                    [t("analytics.independence"), t("analytics.helpUnknown")],
                    [
                      t("analytics.plannedDelivery"),
                      t("analytics.unavailable"),
                    ],
                    [t("analytics.attendance"), t("analytics.unavailable")],
                    [
                      t("analytics.comparableTrend"),
                      t("analytics.noCalibratedTrend"),
                    ],
                    [
                      t("analytics.targets"),
                      t(
                        data.quality.historical_targets
                          ? "analytics.legacyTargets"
                          : "analytics.frozenTargets",
                      ),
                    ],
                  ]}
                />
                <p>{t("analytics.qualityNote")}</p>
              </Panel>
              <ScopeManagement
                scope={scope}
                onSaved={() => {
                  const firstOrganization = !scope?.organizations.length;
                  void api("/analytics/scope")
                    .then((next) => {
                      setScope(next);
                      const orgId = next.organizations[0]?.id || "";
                      if (orgId)
                        setFilters((f) => ({
                          ...f,
                          org_id: orgId,
                          view:
                            firstOrganization && orgDefault
                              ? "organization"
                              : f.view,
                          class_id: "",
                        }));
                      setNotice("analytics.saved");
                    })
                    .catch((e) => setError(e.message));
                }}
              />
            </>
          )}
          {tab === "records" && (
            <Panel title={t("analytics.records")}>
              <button className="btn secondary" onClick={() => drill({})}>
                {t("analytics.browseRecords")}
              </button>
              <p>
                {summary.submissions} {t("analytics.submissionsUnit")} ·{" "}
                {summary.pending} {t("analytics.pending")} ·{" "}
                {summary.unreleased} {t("analytics.unreleased")}
              </p>
            </Panel>
          )}
          <p className="analytics-footnote">
            <Info size={15} />
            {t("analytics.disclaimer")}
          </p>
        </>
      )}
      <dialog
        ref={dialog}
        className="analytics-detail-dialog"
        onCancel={() => setDetail(null)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setDetail(null);
        }}
      >
        <div className="analytics-detail-head">
          <h2>
            {t("analytics.records")}
            {detail?.skill ? " · " + t(detail.skill) : ""}
          </h2>
          <button
            className="text-button"
            aria-label={t("analytics.close")}
            onClick={() => setDetail(null)}
          >
            <X />
          </button>
        </div>
        {detailError && <p role="alert">{t(detailError)}</p>}
        {!detailData && !detailError ? (
          <p role="status">{t("analytics.loading")}</p>
        ) : (
          detailData && (
            <>
              <p>
                {detailData.filters.start} — {detailData.filters.end} ·{" "}
                {t("language." + detailData.filters.locale)} ·{" "}
                {detailData.record_total} {t("analytics.submissionsUnit")}
              </p>
              {filters.view === "organization" ? (
                <Table
                  headers={[
                    t("analytics.date"),
                    t("analytics.submissions"),
                    t("analytics.objectiveAccuracy"),
                    t("analytics.pending"),
                  ]}
                  rows={detailData.daily.map((d: Data) => [
                    d.day,
                    d.submissions,
                    <Ratio value={d.accuracy} />,
                    d.pending,
                  ])}
                />
              ) : (
                <>
                  <Table
                    headers={[
                      t("analytics.date"),
                      ...(staff ? [t("analytics.learner")] : []),
                      t("analytics.question"),
                      t("analytics.source"),
                      t("analytics.round"),
                      t("analytics.state"),
                      t("analytics.scoreRate"),
                    ]}
                    rows={detailData.records.map((r: Data) => [
                      new Date(
                        r.created_at.replace(" ", "T") + "Z",
                      ).toLocaleString(i18n.resolvedLanguage, {
                        timeZone: filters.timezone,
                      }),
                      ...(staff ? [r.alias] : []),
                      r.title,
                      t("analytics.source." + r.context),
                      r.first ? t("analytics.first") : t("analytics.repeat"),
                      t("analytics.result." + r.status),
                      r.score == null ? "—" : `${r.score}/${r.possible}`,
                    ])}
                  />
                  <div className="analytics-pagination">
                    <button
                      disabled={!offset}
                      onClick={() => setOffset((x) => Math.max(0, x - 100))}
                    >
                      {t("analytics.previous")}
                    </button>
                    <span>
                      {offset + 1}–
                      {Math.min(offset + 100, detailData.record_total)} /{" "}
                      {detailData.record_total}
                    </span>
                    <button
                      disabled={offset + 100 >= detailData.record_total}
                      onClick={() => setOffset((x) => x + 100)}
                    >
                      {t("analytics.next")}
                    </button>
                  </div>
                </>
              )}
              {!staff && detail?.skill && (
                <button
                  className="btn"
                  onClick={() =>
                    onPractice?.(detail.skill!, filters.locale, filters.grade)
                  }
                >
                  {t("analytics.practiceSkill")}
                </button>
              )}
            </>
          )
        )}
      </dialog>
    </div>
  );
}
function StatusBar({
  total,
  segments,
}: {
  total: number;
  segments: [string, number, string][];
}) {
  return (
    <div className="analytics-status-bar">
      <div className="analytics-status-track" aria-hidden="true">
        {segments.map(([label, count, color]) => (
          <span
            key={label}
            style={{
              width: `${total ? (100 * count) / total : 0}%`,
              background: color,
            }}
          />
        ))}
      </div>
      <div className="analytics-legend">
        {segments.map(([label, count, color]) => (
          <span key={label}>
            <i style={{ background: color }} />
            {t("analytics." + label)} {count}/{total}
          </span>
        ))}
      </div>
    </div>
  );
}
function TeachingForm({
  sessions,
  onSaved,
}: {
  sessions: Data[];
  onSaved: () => void;
}) {
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  return (
    <Panel
      title={t("analytics.confirmTeaching")}
      note={t("analytics.confirmTeachingNote")}
    >
      <form
        className="analytics-form"
        onSubmit={async (e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          setBusy(true);
          setError("");
          try {
            await api("/analytics/teaching", {
              session_id: f.get("session"),
              start: new Date(String(f.get("start"))).getTime(),
              end: new Date(String(f.get("end"))).getTime(),
              reason: f.get("reason"),
            });
            setDone(true);
            onSaved();
          } catch (e: any) {
            setError(e.message);
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          {t("analytics.session")}
          <select name="session" required>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("analytics.from")}
          <input type="datetime-local" name="start" required />
        </label>
        <label>
          {t("analytics.to")}
          <input type="datetime-local" name="end" required />
        </label>
        <label>
          {t("analytics.reason")}
          <input name="reason" required maxLength={1000} />
        </label>
        <button disabled={busy || !sessions.length} className="btn">
          {t("analytics.confirm")}
        </button>
      </form>
      {error && <p role="alert">{t(error)}</p>}
      {done && <p role="status">{t("analytics.saved")}</p>}
    </Panel>
  );
}
function ScopeManagement({
  scope,
  onSaved,
}: {
  scope: Data | null;
  onSaved: () => void;
}) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(path: string, b: Data, method = "POST") {
    setBusy(true);
    setError("");
    try {
      await api(path, b, method);
      onSaved();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Panel
      title={t("analytics.scopeManagement")}
      note={t("analytics.scopeNote")}
    >
      {!scope?.organizations.length && (
        <form
          className="analytics-form"
          onSubmit={(e) => {
            e.preventDefault();
            void submit("/analytics/organization", {
              name: new FormData(e.currentTarget).get("name"),
            });
          }}
        >
          <label>
            {t("analytics.institutionName")}
            <input name="name" required maxLength={120} />
          </label>
          <button className="btn" disabled={busy}>
            {t("analytics.createInstitution")}
          </button>
        </form>
      )}
      <form
        className="analytics-form"
        onSubmit={(e) => {
          e.preventDefault();
          const f = new FormData(e.currentTarget);
          void submit("/analytics/grants", {
            class_id: f.get("class"),
            email: f.get("email"),
          });
        }}
      >
        <label>
          {t("analytics.class")}
          <select name="class" required>
            {scope?.classes.map((c: Data) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          {t("analytics.orgOwnerEmail")}
          <input name="email" type="email" required />
        </label>
        <button
          className="btn secondary"
          disabled={busy || !scope?.classes.length}
        >
          {t("analytics.authorize")}
        </button>
      </form>
      <Table
        headers={[
          t("analytics.class"),
          t("analytics.institution"),
          t("analytics.action"),
        ]}
        rows={
          scope?.grants.map((g: Data) => [
            scope.classes.find((c: Data) => c.id === g.class_id)?.name,
            g.name,
            <button
              disabled={busy}
              onClick={() =>
                void submit(
                  "/analytics/grants",
                  { class_id: g.class_id, email: g.email },
                  "DELETE",
                )
              }
            >
              {t("analytics.revoke")}
            </button>,
          ]) || []
        }
      />
      {error && <p role="alert">{t(error)}</p>}
    </Panel>
  );
}
