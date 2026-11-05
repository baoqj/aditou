import { useState } from "react";
import { ExternalLink, PencilLine, Trophy } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  rankingPercent,
  sourcePage,
  useRankingData,
  type CampusRankResult,
} from "./school-ranking-data";
import { schoolRankingPath } from "../routing";
import { SchoolRadar, SchoolTrend } from "./SchoolEvaluationCharts";
import { rankChange, rankPaper } from "./SchoolRankings";

const primaryAxes = ["reading", "writing", "problem-solving", "reasoning"];
const chartEligible = (item: CampusRankResult) =>
  item.scope === "school" &&
  (item.level === "secondary" ||
    ((item.participants ?? 0) >= 15 &&
      !item.smallGroup &&
      item.countText !== "XX"));
const preferred = (item: CampusRankResult) =>
  item.level === "primary"
    ? item.grade === 6 && item.code === "reading"
    : item.grade === 5 && item.code === "132520";

export function SchoolCampusRankings({
  campusId,
  suggest,
}: {
  campusId: string;
  suggest: (description: string) => void;
}) {
  const { t, i18n } = useTranslation();
  const [params] = useState(() => new URLSearchParams(location.search));
  const [selectedYear, setSelectedYear] = useState(params.get("year") ?? "");
  const data = useRankingData<{
    release: { id: string };
    results: CampusRankResult[];
    reviews: { year: string; code: string }[];
  }>("/campus/" + encodeURIComponent(campusId));
  const [selectedSeries, setSelectedSeries] = useState(
    params.get("rankBoard") ?? "",
  );
  const [selectedLevel, setSelectedLevel] = useState(params.get("level") ?? "");
  const [dimension, setDimension] = useState("");
  const [historical, setHistorical] = useState(false);
  if (data === undefined)
    return (
      <section
        className="school-profile-panel school-rank-campus"
        role="status"
      >
        {t("feedback.loading")}
      </section>
    );
  if (!data)
    return (
      <section className="school-profile-panel school-rank-campus">
        <h2>{t("ranking.results")}</h2>
        <p>{t("ranking.unavailable")}</p>
      </section>
    );
  const levels = [...new Set(data.results.map((item) => item.level))];
  const boardContext =
    selectedSeries && selectedSeries === params.get("rankBoard");
  if (
    boardContext &&
    (selectedLevel === "primary" || selectedLevel === "secondary") &&
    !levels.includes(selectedLevel)
  )
    levels.push(selectedLevel);
  const level =
    levels.find((item) => item === selectedLevel) ??
    levels.find(
      (item) =>
        item === data.results.find((row) => row.id === selectedSeries)?.level,
    ) ??
    levels[0] ??
    "primary";
  const scopedResults = data.results.filter((item) => item.level === level);
  const dimensions = [...new Set(scopedResults.map((item) => item.dimension))];
  const activeDimension =
    dimensions.find((item) => item === dimension) ??
    scopedResults.find((item) => item.id === selectedSeries)?.dimension ??
    (dimensions.includes("competence") ? "competence" : dimensions[0]);
  const scoped = scopedResults.filter(
    (item) => item.dimension === activeDimension,
  );
  const reviews = level === "primary" ? data.reviews : [];
  const requestedYear =
    boardContext && /^20\d{2}-20\d{2}$/.test(params.get("year") ?? "")
      ? params.get("year")!
      : "";
  const years = [
    ...new Set([
      ...scoped.map((item) => item.year),
      ...reviews.map((item) => item.year),
      ...(requestedYear ? [requestedYear] : []),
    ]),
  ]
    .sort()
    .reverse();
  const year = years.includes(selectedYear) ? selectedYear : years[0];
  const available = [
    ...new Map(
      scoped
        .filter((item) => item.scope === "school")
        .map((item) => [item.id, item]),
    ).values(),
  ];
  const series = selectedSeries
    ? available.find((item) => item.id === selectedSeries)
    : (available.find(preferred) ?? available[0]);
  const active = scoped.find(
    (item) =>
      item.id === series?.id && item.year === year && item.scope === "school",
  );
  const current = scoped.filter((item) => item.year === year);
  const results = (
    historical
      ? scoped.filter((item) => !series || item.id === series.id)
      : current
  ).sort(
    (a, b) =>
      b.year.localeCompare(a.year) ||
      Number(b.id === series?.id) - Number(a.id === series?.id),
  );
  const trend = scoped.filter(
    (item) => item.id === series?.id && chartEligible(item),
  );
  const radarFacts = scopedResults.filter(
    (item) =>
      item.year === year &&
      chartEligible(item) &&
      item.grade === 6 &&
      item.dimension === "competence" &&
      (!series || item.network === series.network),
  );
  const academicRadar =
    level === "primary" &&
    activeDimension === "competence" &&
    radarFacts.length > 0;
  const axes = academicRadar
    ? primaryAxes.map((code) => {
        const item = radarFacts.find((row) => row.code === code);
        return {
          label: t("ranking.paper." + code),
          value: item?.score ?? null,
          provisional: Boolean(item?.provisional),
        };
      })
    : current.filter(chartEligible).map((item) => ({
        label: rankPaper(item, t),
        value: item.score,
        provisional: Boolean(item.provisional),
      }));
  const boardParams = new URLSearchParams();
  if (series && year) {
    boardParams.set("rankBoard", series.id);
    boardParams.set("year", year);
    boardParams.set("level", level);
    if (params.has("lang")) boardParams.set("lang", params.get("lang")!);
  }
  const context = [
    data.release.id,
    year,
    active && rankPaper(active, t),
    active && rankingPercent(active.score, i18n.language),
    active && sourcePage(active.sourceUrl, active.sourcePage),
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <section className="school-profile-panel school-rank-campus">
      <div className="school-profile-section-title">
        <div>
          <h2>{t("ranking.results")}</h2>
          <p>{t("ranking.scopeNote")}</p>
        </div>
        <Trophy size={21} aria-hidden="true" />
      </div>
      <div className="school-eval-controls">
        {levels.length > 1 && (
          <label className="school-select">
            {t("ranking.level")}
            <select
              value={level}
              onChange={(event) => {
                setSelectedLevel(event.target.value);
                setSelectedSeries("");
                setDimension("");
              }}
            >
              {levels.map((item) => (
                <option key={item} value={item}>
                  {t("school." + item)}
                </option>
              ))}
            </select>
          </label>
        )}
        {dimensions.length > 1 && (
          <label className="school-select">
            {t("ranking.dimension")}
            <select
              value={activeDimension}
              onChange={(event) => {
                setDimension(event.target.value);
                setSelectedSeries("");
              }}
            >
              {dimensions.map((item) => (
                <option key={item} value={item}>
                  {t(
                    item === "competence"
                      ? "ranking.dimensionCompetence"
                      : "ranking.dimensionProgramme",
                  )}
                </option>
              ))}
            </select>
          </label>
        )}
        {years.length > 0 && (
          <label className="school-select">
            {t("ranking.year")}
            <select
              value={year}
              onChange={(event) => setSelectedYear(event.target.value)}
            >
              {years.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        )}
        {(available.length > 0 || boardContext) && (
          <label className="school-select">
            {t("ranking.exam")}
            <select
              value={series?.id ?? (boardContext ? selectedSeries : "")}
              onChange={(event) => setSelectedSeries(event.target.value)}
            >
              {boardContext && !series && (
                <option value={selectedSeries}>{t("schoolEval.noData")}</option>
              )}
              {available.map((item) => (
                <option key={item.id} value={item.id}>
                  {rankPaper(item, t)}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>
      {reviews.some((review) => review.year === year) && (
        <p className="school-ranking-coverage">{t("ranking.scopePending")}</p>
      )}
      {!years.length && <p>{t("schoolEval.noData")}</p>}
      {(series || boardContext) && !active && (
        <p className="school-ranking-coverage">
          {t("schoolEval.noData")} · {year}
        </p>
      )}
      {active && (
        <div className="school-ranking-coverage">
          <strong>
            {rankPaper(active, t)} ·{" "}
            {rankingPercent(active.score, i18n.language)}
            {active.rank != null && " · #" + active.rank}
          </strong>
          {active.rankedCount != null && (
            <p>{t("ranking.total", { count: active.rankedCount })}</p>
          )}
          {params.get("change") === "1" && active.dimension !== "programme" && (
            <p>{rankChange(active, active.comparison, t)}</p>
          )}
          {active.provisional ? <p>{t("ranking.provisional")}</p> : null}
          {active.rank != null && (
            <a href={schoolRankingPath + "?" + boardParams}>
              {t("schoolEval.openBoard")}
            </a>
          )}
        </div>
      )}
      {(axes.some((axis) => axis.value != null) || trend.length > 0) && (
        <div className="school-eval-charts">
          <SchoolRadar
            title={t("schoolEval.overview") + " · " + year}
            axes={axes}
            allowRadar={academicRadar}
            maximum={1000}
            format={(value) => rankingPercent(value, i18n.language)}
          />
          <div className="school-eval-trends">
            <SchoolTrend
              title={
                t("schoolEval.scoreTrend") +
                (series ? " · " + rankPaper(series, t) : "")
              }
              points={trend}
            />
            <SchoolTrend
              title={t("schoolEval.rankTrend")}
              points={trend}
              rank
            />
          </div>
        </div>
      )}
      {scoped.length > 0 && (
        <button
          className="school-button"
          type="button"
          aria-pressed={historical}
          onClick={() => setHistorical(!historical)}
        >
          {t(historical ? "schoolEval.currentYear" : "ranking.history")}
        </button>
      )}
      {results.length > 0 && (
        <div
          className="school-table-scroll"
          role="region"
          aria-label={t("ranking.results")}
          tabIndex={0}
        >
          <table>
            <thead>
              <tr>
                {[
                  ...(historical ? ["year"] : []),
                  "exam",
                  "score",
                  "rank",
                  "evidence",
                ].map((key) => (
                  <th scope="col" key={key}>
                    {t("ranking." + key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  key={[
                    result.id,
                    result.year,
                    result.scope,
                    result.reportedLabel,
                    result.sourcePage,
                  ].join(":")}
                >
                  {historical && <td>{result.year}</td>}
                  <th scope="row">
                    {rankPaper(result, t)}
                    {result.scope !== "school" && (
                      <small>
                        {" · "}
                        {t(
                          result.scope === "programme"
                            ? "ranking.programmeScope"
                            : "ranking.campusScope",
                        )}
                        {result.reportedLabel && " · " + result.reportedLabel}
                        {!!result.unassignedBuilding &&
                          " · " + t("ranking.buildingPending")}
                      </small>
                    )}
                    {result.dimension === "programme" && (
                      <small> · {t("ranking.subjectReference")}</small>
                    )}
                  </th>
                  <td>
                    {rankingPercent(result.score, i18n.language)}{" "}
                    <small>
                      {t("ranking.metric." + result.metric)}
                      {result.provisional
                        ? " · " + t("ranking.provisional")
                        : ""}
                    </small>
                    {result.countText === "XX" && (
                      <small> · {t("ranking.withheldCount")}</small>
                    )}
                    {!!result.smallGroup && (
                      <small> · {t("ranking.smallGroup")}</small>
                    )}
                    {result.participants != null && (
                      <small>
                        {" "}
                        ·{" "}
                        {t("ranking.participants", {
                          count: result.participants,
                        })}
                      </small>
                    )}
                  </td>
                  <td>
                    {result.rank == null
                      ? t(
                          result.dimension === "programme"
                            ? "ranking.subjectReference"
                            : result.scope !== "school" &&
                                reviews.some(
                                  (review) =>
                                    review.year === year &&
                                    review.code === result.code,
                                )
                              ? "ranking.scopePending"
                              : "ranking.notRanked",
                        )
                      : "#" + result.rank + " / " + result.rankedCount}
                  </td>
                  <td>
                    <a
                      href={sourcePage(result.sourceUrl, result.sourcePage)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      MEQ {result.sourceId} <ExternalLink size={12} />
                    </a>
                    {result.correctionUrl && (
                      <a
                        href={result.correctionUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {t("schoolEval.correctionSource")}
                      </a>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button
        type="button"
        className="school-detail-inline"
        onClick={() => suggest(context)}
      >
        <PencilLine size={14} /> {t("ranking.suggest")}
      </button>
    </section>
  );
}
