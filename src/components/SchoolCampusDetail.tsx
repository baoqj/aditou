import { SchoolReviews } from "./SchoolReviews";
import { schoolRankingPath } from "../routing";
import { SchoolCampusContext } from "./SchoolCampusContext";
import { SchoolCampusRankings } from "./SchoolCampusRankings";
import { useId, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowLeft,
  Building2,
  CalendarDays,
  ClipboardCheck,
  Database,
  ExternalLink,
  GitCompareArrows,
  Globe2,
  GraduationCap,
  Languages,
  MapPin,
  Network,
  PencilLine,
  Phone,
  Plus,
  Share2,
  ShieldCheck,
  TriangleAlert,
  Wallet,
  Clock3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { SchoolSuggestionForm } from "./SchoolSuggestionForm";
import {
  address,
  coordinates,
  filters,
  municipality,
  name,
  type Campus,
  type RecordFields,
} from "./school-data";
import "./school-detail.css";
import "./school-evaluation.css";

const identity = [
  { key: "stage", field: filters.stage, Icon: GraduationCap },
  { key: "type", field: filters.type, Icon: Building2 },
  { key: "language", field: filters.language, Icon: Languages },
  { key: "network", field: filters.network, Icon: Network },
  { key: "board", field: filters.board, Icon: Building2 },
  { key: "region", field: filters.region, Icon: MapPin },
] as const;
const admissions = [
  { key: "fees", field: "费用", Icon: Wallet },
  { key: "admission", field: "入学方式", Icon: ClipboardCheck },
  { key: "openHouse", field: "开放日／说明会", Icon: CalendarDays },
  { key: "care", field: "课前课后托管", Icon: Clock3 },
] as const;
const evidenceKeys: Record<string, string> = {
  ...Object.fromEntries(
    [...identity, ...admissions].map(({ field, key }) => [field, key]),
  ),
  确切年级: "grades",
  教学理念: "approach",
  交通: "transport",
  午餐服务: "lunch",
  课外活动: "activities",
  第二语言: "secondLanguage",
  第三语言: "thirdLanguage",
  地址核对提示: "addressNote",
};
const schoolId = "官方学校编号";
const buildingId = "官方建筑／安装点编号";

export function SchoolSource({
  value,
  children,
  className,
}: {
  value: unknown;
  children: ReactNode;
  className?: string;
}) {
  if (typeof value !== "string" || !/^https?:\/\//i.test(value)) return null;
  return (
    <a className={className} href={value} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function SchoolCampusDetail({
  campus,
  display,
  maxCompare,
}: {
  campus: Campus;
  display: (record: RecordFields, field: string) => string;
  maxCompare: number;
}) {
  const { t, i18n } = useTranslation();
  const panelId = useId();
  const [topic, setTopic] = useState("");
  const [scoreContext, setScoreContext] = useState("");
  const [shareStatus, setShareStatus] = useState<"copied" | "manual" | "">("");
  const { record, facts } = campus;
  const source = record["政府名录来源"];
  const snapshot = record["数据截面日期"];
  const identifiers = [record[schoolId], record[buildingId]]
    .filter(Boolean)
    .join(" / ");
  const campusAddress = address(record);
  const point = coordinates(record);
  const mapQuery = point ? point.lat + "," + point.lng : campusAddress;
  const params = new URLSearchParams(location.search);
  const rankingOrigin = params.get("mode") === "rankings";
  const directoryPath = rankingOrigin ? schoolRankingPath : "/school";
  if (rankingOrigin) params.delete("mode");
  const backUrl = directoryPath + (params.size ? "?" + params : "");
  const compareIds = [
    ...new Set((params.get("compare") ?? "").split(",").filter(Boolean)),
  ].slice(0, maxCompare);
  const alreadyCompared = compareIds.includes(campus.id);
  const compareFull = !alreadyCompared && compareIds.length >= maxCompare;
  if (!alreadyCompared && !compareFull) compareIds.push(campus.id);
  params.set("compare", compareIds.join(","));
  params.set("view", "compare");
  const compareUrl = directoryPath + "?" + params;
  const publicUrl = new URL(location.pathname, location.origin);
  if (params.has("lang"))
    publicUrl.searchParams.set("lang", params.get("lang")!);
  const topicOptions = [...identity, ...admissions].map(({ key }) => ({
    key,
    label: t("school." + key),
  }));

  function propose(topic = "", context = "") {
    setTopic(topic);
    setScoreContext(context);
    const target = document.getElementById(panelId);
    target?.focus({ preventScroll: true });
    target?.scrollIntoView({ block: "start" });
  }

  async function share() {
    setShareStatus("");
    if (navigator.share) {
      try {
        await navigator.share({
          title: String(record[name]),
          url: publicUrl.href,
        });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }
    try {
      await navigator.clipboard.writeText(publicUrl.href);
      setShareStatus("copied");
    } catch {
      setShareStatus("manual");
    }
  }

  const proposeLink = (key: string, missing = false) => (
    <button
      className="school-detail-inline"
      type="button"
      aria-label={t(
        missing ? "school.detailAddField" : "school.detailEditField",
        { field: t("school." + key) },
      )}
      onClick={() => propose(key)}
    >
      {missing ? <Plus size={14} /> : <PencilLine size={13} />}
      {t(missing ? "school.suggest" : "school.detailSuggestEdit")}
    </button>
  );

  return (
    <article className="school-profile">
      <div className="school-profile-toolbar">
        <div className="school-profile-crumb">
          <a className="school-back" href={backUrl}>
            <ArrowLeft size={15} /> {t("school.back")}
          </a>
          {record[municipality] && <span>{record[municipality]}</span>}
          {record[schoolId] && <span>MEQ #{record[schoolId]}</span>}
        </div>
        <div className="school-profile-actions">
          <button
            className="school-button"
            type="button"
            onClick={() => void share()}
          >
            <Share2 size={15} /> {t("school.detailShare")}
          </button>
          <a className="school-button" href={compareUrl}>
            <GitCompareArrows size={16} />{" "}
            {t(
              compareFull
                ? "school.detailViewComparison"
                : alreadyCompared
                  ? "school.inCompare"
                  : "school.addCompare",
            )}
          </a>
          <button
            className="school-button school-profile-report"
            type="button"
            onClick={() => propose()}
          >
            <TriangleAlert size={16} /> {t("school.detailReport")}
          </button>
        </div>
      </div>
      {shareStatus === "copied" && (
        <p className="school-profile-status" role="status">
          {t("school.detailLinkCopied")}
        </p>
      )}
      {shareStatus === "manual" && (
        <label className="school-profile-share-url">
          {t("school.detailShare")}
          <input
            value={publicUrl.href}
            readOnly
            onFocus={(event) => event.currentTarget.select()}
          />
        </label>
      )}
      <header className="school-profile-hero">
        <div>
          <div className="school-profile-tags">
            {identifiers && (
              <span className="school-profile-id">MEQ {identifiers}</span>
            )}
            {record[filters.region] && (
              <span>{display(record, filters.region)}</span>
            )}
            {record[municipality] && <span>{record[municipality]}</span>}
          </div>
          <h1>{record[name]}</h1>
          {record["校区／建筑名"] &&
            record["校区／建筑名"] !== record[name] && (
              <p className="school-profile-campus">{record["校区／建筑名"]}</p>
            )}
          <div className="school-profile-address">
            {campusAddress && (
              <span>
                <MapPin size={17} />
                {campusAddress}
              </span>
            )}
            {mapQuery && (
              <SchoolSource
                value={
                  "https://www.google.com/maps/search/?api=1&query=" +
                  encodeURIComponent(mapQuery)
                }
              >
                {t("school.detailOpenMap")} <ExternalLink size={13} />
              </SchoolSource>
            )}
            {record["机构电话（如收录）"] && (
              <a
                href={
                  "tel:" +
                  String(record["机构电话（如收录）"]).replace(/[^\d+]/g, "")
                }
              >
                <Phone size={14} /> {record["机构电话（如收录）"]}
              </a>
            )}
          </div>
          <div className="school-profile-tags school-profile-tags-summary">
            {(
              [
                ["type", filters.type, Building2],
                ["language", filters.language, Languages],
                ["stage", filters.stage, GraduationCap],
              ] as const
            )
              .filter(([, field]) => record[field])
              .map(([key, field, Icon]) => (
                <span key={key}>
                  <Icon size={14} /> {display(record, field)}
                </span>
              ))}
          </div>
          <div className="school-profile-links">
            {record["学校官网"] ? (
              <SchoolSource
                value={record["学校官网"]}
                className="school-button"
              >
                <Globe2 size={15} /> {t("school.website")}{" "}
                <ExternalLink size={12} />
              </SchoolSource>
            ) : (
              <span>{t("school.noWebsite")}</span>
            )}
            <SchoolSource
              value={record["教育局／主办方官网"]}
              className="school-button"
            >
              <Building2 size={15} /> {t("school.boardWebsite")}{" "}
              <ExternalLink size={12} />
            </SchoolSource>
            <SchoolSource value={source} className="school-button">
              <Database size={15} /> {t("school.source")}{" "}
              <ExternalLink size={12} />
            </SchoolSource>
          </div>
        </div>
        <aside
          className="school-profile-registry"
          aria-label={t("school.detailRegistry")}
        >
          <div className="school-profile-registry-title">
            <Database size={20} />
            <div>
              <strong>{t("school.detailRegistry")}</strong>
              <small>{t("school.reference")}</small>
            </div>
          </div>
          <dl>
            {record[schoolId] && (
              <div>
                <dt>{t("school.detailSchoolId")}</dt>
                <dd>{record[schoolId]}</dd>
              </div>
            )}
            {record[buildingId] && (
              <div>
                <dt>{t("school.detailCampusId")}</dt>
                <dd>{record[buildingId]}</dd>
              </div>
            )}
            {record["校区邮编"] && (
              <div>
                <dt>{t("school.postal")}</dt>
                <dd>{record["校区邮编"]}</dd>
              </div>
            )}
            {snapshot && (
              <div>
                <dt>{t("school.snapshot")}</dt>
                <dd>
                  <time dateTime={String(snapshot)}>{snapshot}</time>
                </dd>
              </div>
            )}
          </dl>
        </aside>
      </header>
      <section className="school-profile-notice">
        <ShieldCheck size={23} aria-hidden="true" />
        <div>
          <h2>{t("school.detailOpenData")}</h2>
          <p>{t("school.detailOpenDataNote")}</p>
        </div>
        <div className="school-suggestion-action">
          <button
            className="school-button school-button-primary"
            type="button"
            onClick={() => propose()}
          >
            <PencilLine size={15} /> {t("school.suggest")}
          </button>
        </div>
      </section>
      <div className="school-profile-grid">
        <section className="school-profile-panel school-profile-identity">
          <div className="school-profile-section-title">
            <div>
              <h2>{t("school.detailIdentity")}</h2>
              <p>{t("school.detailIdentityNote")}</p>
            </div>
            <span className="school-profile-badge">MEQ</span>
          </div>
          <dl className="school-profile-fields">
            {identity.map(({ key, field, Icon }) => (
              <div key={key}>
                <dt>
                  {t("school." + key)} <Icon size={16} />
                </dt>
                <dd>
                  {display(record, field)}
                  {key === "region" && record[municipality] && (
                    <small>
                      {record[municipality]}
                      {record["市镇代码"] ? " · " + record["市镇代码"] : ""}
                    </small>
                  )}
                  {key === "stage" && record["确切年级"] && (
                    <small>{record["确切年级"]}</small>
                  )}
                  {proposeLink(key)}
                </dd>
              </div>
            ))}
          </dl>
        </section>
        <section className="school-profile-panel school-profile-admissions">
          <div className="school-profile-section-title">
            <div>
              <h2>{t("school.detailAdmissions")}</h2>
              <p>{t("school.detailAdmissionsNote")}</p>
            </div>
            <ClipboardCheck size={21} aria-hidden="true" />
          </div>
          <div className="school-profile-fields">
            {admissions.map(({ key, field, Icon }) => {
              const evidence = facts.filter((fact) => fact["字段"] === field);
              const missing = !record[field] && !evidence.length;
              return (
                <section key={key}>
                  <div className="school-profile-field-title">
                    <h3>
                      <Icon size={15} /> {t("school." + key)}
                    </h3>
                    {missing && (
                      <span className="school-profile-badge">
                        {t("school.detailMissing")}
                      </span>
                    )}
                  </div>
                  {record[field] ? (
                    <p className="school-profile-value">
                      {display(record, field)}
                    </p>
                  ) : missing ? (
                    <p>{t("school.detailAwaitingSource")}</p>
                  ) : null}
                  {evidence.length > 0 && (
                    <a
                      className="school-profile-evidence-link"
                      href={"#school-evidence-" + key}
                    >
                      {t("school.evidence")} <ArrowDown size={13} />
                    </a>
                  )}
                  {proposeLink(key, missing)}
                </section>
              );
            })}
          </div>
        </section>
        <SchoolCampusRankings
          campusId={campus.id}
          suggest={(context) => propose("examResults", context)}
        />
        <SchoolCampusContext campus={campus} />
        {record[filters.board] && (
          <section className="school-profile-panel school-profile-operator">
            <Building2 size={23} aria-hidden="true" />
            <div>
              <h2>{t("school.board")}</h2>
              <p>{display(record, filters.board)}</p>
              <SchoolSource value={record["教育局／主办方官网"]}>
                {t("school.boardWebsite")} <ExternalLink size={12} />
              </SchoolSource>
            </div>
          </section>
        )}
        <section className="school-profile-panel school-profile-trace">
          <div className="school-profile-section-title">
            <div>
              <h2>{t("school.detailTrace")}</h2>
              <p>{t("school.detailTraceNote")}</p>
            </div>
            <SchoolSource value={source}>
              {t("school.source")} <ExternalLink size={13} />
            </SchoolSource>
          </div>
          <ol className="school-profile-timeline">
            <li>
              <div>
                <h3>{t("school.detailOfficialImport")}</h3>
                {snapshot && (
                  <time dateTime={String(snapshot)}>{snapshot}</time>
                )}
              </div>
              <p>
                {t("school.detailOfficialImportNote")}
                {identifiers && " · MEQ " + identifiers}
              </p>
            </li>
            {campus.profileRevision && (
              <li>
                <div>
                  <h3>{t("schoolEval.profileRevision")}</h3>
                  <time
                    dateTime={new Date(
                      campus.profileRevision.updatedAt,
                    ).toISOString()}
                  >
                    {new Intl.DateTimeFormat(i18n.language, {
                      dateStyle: "medium",
                    }).format(campus.profileRevision.updatedAt)}
                  </time>
                </div>
                <SchoolSource value={campus.profileRevision.sourceUrl}>
                  {t("schoolEval.correctionSource")} <ExternalLink size={13} />
                </SchoolSource>
              </li>
            )}
            {facts.map((fact, index) => {
              const key = evidenceKeys[String(fact["字段"])];
              const first =
                facts.findIndex((item) => item["字段"] === fact["字段"]) ===
                index;
              return (
                <li
                  key={index}
                  id={key && first ? "school-evidence-" + key : undefined}
                >
                  <div>
                    <h3>{key ? t("school." + key) : fact["字段"]}</h3>
                    {fact["核实日期"] && (
                      <time dateTime={String(fact["核实日期"])}>
                        {fact["核实日期"]}
                      </time>
                    )}
                  </div>
                  <p className="school-profile-value">{fact["核实结果"]}</p>
                  <p>
                    {[fact["项目／适用范围"], fact["适用学年"]]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  <SchoolSource value={fact["官方来源 URL"]}>
                    {t("school.evidence")} <ExternalLink size={13} />
                  </SchoolSource>
                </li>
              );
            })}
            {!facts.length && (
              <li className="school-profile-timeline-empty">
                <p>{t("school.detailNoEvidence")}</p>
              </li>
            )}
          </ol>
        </section>
      </div>
      <div className="school-eval-contributions">
        <SchoolReviews campusId={campus.id} />
        <SchoolSuggestionForm
          campusId={campus.id}
          panelId={panelId}
          topic={topic}
          onTopicChange={setTopic}
          topics={[
            ...topicOptions,
            { key: "examResults", label: t("ranking.results") },
          ]}
          context={topic === "examResults" ? scoreContext : ""}
        />
      </div>
    </article>
  );
}
