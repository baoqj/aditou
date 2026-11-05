import type { ReactNode } from "react";
import { ExternalLink, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  coordinates,
  filters,
  name,
  type Campus,
  type RecordFields,
} from "./school-data";
import {
  defaultRankBoard,
  rankingPercent,
  type RankBoard,
  type RankLevel,
  type RankRow,
  type RankSnapshot,
} from "./school-ranking-data";
import "./school-rankings.css";

export type RankedSchool = { row: RankRow; campuses: Campus[] };
const scope = (board: RankBoard) =>
  board.network === "private"
    ? "ranking.scopePrivate"
    : board.network === "fr"
      ? "ranking.scopeFrench"
      : "ranking.scopeEnglish";

export function rankPaper(
  board: Pick<RankBoard, "level" | "grade" | "code" | "label">,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  const grade = t(
    board.level === "primary"
      ? "ranking.primaryGrade"
      : "ranking.secondaryGrade",
    { grade: board.grade },
  );
  return (
    grade +
    " · " +
    (board.level === "primary"
      ? t("ranking.paper." + board.code)
      : board.label + " (" + board.code + ")")
  );
}

export function RankingFields({
  boards,
  selected,
  year,
  choose,
}: {
  boards: RankBoard[];
  selected: RankBoard;
  year: string;
  choose: (board: RankBoard, year?: string) => void;
}) {
  const { t } = useTranslation();
  const unique = [
    ...new Map(
      boards
        .filter(
          (board) =>
            board.level === selected.level &&
            board.dimension === selected.dimension,
        )
        .map((board) => [board.id, board]),
    ).values(),
  ];
  const exam = (board: RankBoard) => board.grade + "-" + board.code;
  const exams = [
    ...new Map(unique.map((board) => [exam(board), board])).values(),
  ];
  const scopes = unique.filter((board) => exam(board) === exam(selected));
  const years = boards
    .filter((board) => board.id === selected.id)
    .map((board) => board.year)
    .sort()
    .reverse();
  return (
    <div
      className={
        "school-ranking-fields" +
        (selected.level === "primary" ? " has-dimension" : "")
      }
    >
      <label>
        {t("ranking.level")}
        <select
          aria-label={t("ranking.level")}
          value={selected.level}
          onChange={(event) => {
            const board = defaultRankBoard(
              boards,
              event.target.value as RankLevel,
            );
            if (board) choose(board);
          }}
        >
          {(["primary", "secondary"] as const)
            .filter((level) => boards.some((board) => board.level === level))
            .map((level) => (
              <option key={level} value={level}>
                {t("school." + level)}
              </option>
            ))}
        </select>
      </label>
      {selected.level === "primary" && (
        <label>
          {t("ranking.dimension")}
          <select
            aria-label={t("ranking.dimension")}
            value={selected.dimension}
            onChange={(event) => {
              const options = boards.filter(
                (board) =>
                  board.level === "primary" &&
                  board.dimension === event.target.value,
              );
              const board =
                options.find(
                  (board) =>
                    board.grade === 6 &&
                    board.network === selected.network &&
                    board.code ===
                      (event.target.value === "programme"
                        ? "subject-french"
                        : "reading"),
                ) ??
                options.find(
                  (board) =>
                    board.grade === 6 && board.network === selected.network,
                ) ??
                options[0];
              if (board)
                choose(
                  board,
                  boards.some(
                    (option) => option.id === board.id && option.year === year,
                  )
                    ? year
                    : board.year,
                );
            }}
          >
            <option value="competence">
              {t("ranking.dimensionCompetence")}
            </option>
            {boards.some(
              (board) =>
                board.level === "primary" && board.dimension === "programme",
            ) && (
              <option value="programme">
                {t("ranking.dimensionProgramme")}
              </option>
            )}
          </select>
        </label>
      )}
      <label>
        {t(
          selected.dimension === "programme"
            ? "ranking.subject"
            : "ranking.exam",
        )}
        <select
          aria-label={t(
            selected.dimension === "programme"
              ? "ranking.subject"
              : "ranking.exam",
          )}
          value={exam(selected)}
          onChange={(event) => {
            const options = unique.filter(
              (board) => exam(board) === event.target.value,
            );
            choose(
              options.find((board) => board.network === selected.network) ??
                options[0],
            );
          }}
        >
          {exams.map((board) => (
            <option key={exam(board)} value={exam(board)}>
              {rankPaper(board, t)}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("ranking.scope")}
        <select
          aria-label={t("ranking.scope")}
          value={selected.id}
          onChange={(event) => {
            const board = scopes.find(
              (board) => board.id === event.target.value,
            );
            if (board) choose(board);
          }}
        >
          {scopes.map((board) => (
            <option key={board.id} value={board.id}>
              {t(scope(board))}
            </option>
          ))}
        </select>
      </label>
      <label>
        {t("ranking.year")}
        <select
          aria-label={t("ranking.year")}
          value={year}
          onChange={(event) => choose(selected, event.target.value)}
        >
          {years.map((value) => (
            <option value={value} key={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export function RankingOptions({
  selected,
  changes,
  onChanges,
  release,
}: {
  selected: RankBoard;
  changes: boolean;
  onChanges: (value: boolean) => void;
  release: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="school-ranking-options">
      {selected.dimension !== "programme" && (
        <label>
          <input
            type="checkbox"
            checked={changes}
            onChange={(event) => onChanges(event.target.checked)}
          />{" "}
          {t("ranking.changes")}
        </label>
      )}
      <details>
        <summary>{t("ranking.method")}</summary>
        <p>
          {t(
            selected.dimension === "programme"
              ? "ranking.methodProgramme"
              : selected.metric === "pass"
                ? "ranking.methodPrimary"
                : "ranking.methodSecondary",
          )}
        </p>
        {selected.sector === "private" && <p>{t("ranking.privateMethod")}</p>}
        {selected.dimension !== "programme" && (
          <p>{t("ranking.coverageNote")}</p>
        )}
        <a href={selected.sourceUrl} target="_blank" rel="noreferrer">
          MEQ {selected.sourceId} <ExternalLink size={13} />
        </a>
        <small>{release}</small>
      </details>
    </div>
  );
}

export function rankChange(
  row: { rank: number | null; previousRank: number | null },
  status: RankBoard["comparison"] | null,
  t: (key: string, options?: Record<string, unknown>) => string,
) {
  if (status !== "available")
    return t(
      status === "unverified"
        ? "ranking.changeUnverified"
        : "ranking.changeMissing",
    );
  if (row.previousRank == null || row.rank == null)
    return t("ranking.changeMissing");
  const delta = row.previousRank - row.rank;
  return delta === 0
    ? t("ranking.steady")
    : t(delta > 0 ? "ranking.up" : "ranking.down", { count: Math.abs(delta) });
}

export function RankingRows({
  snapshot,
  rows,
  changes,
  selecting,
  mapPanelId,
  link,
  locate,
  select,
  display,
}: {
  snapshot: RankSnapshot;
  rows: { row: RankRow | null; campuses: Campus[] }[];
  changes: boolean;
  selecting: boolean;
  mapPanelId: string;
  link: (campusId: string) => string;
  locate: (campuses: Campus[]) => void;
  select: (campus: Campus, relatedIds?: string[]) => ReactNode;
  display: (record: RecordFields, field: string) => string;
}) {
  const { t, i18n } = useTranslation();
  const showChanges = changes && snapshot.board.dimension !== "programme";
  const educationLevel = t("school." + snapshot.board.level);
  const scoreLabel = t(
    snapshot.board.metric === "pass" ? "ranking.metric.pass" : "ranking.score",
  );
  return (
    <div
      role="table"
      aria-label={t("ranking.title")}
      className={
        "school-ranking-rows" +
        (selecting ? " is-selecting" : "") +
        (showChanges ? " has-changes" : "")
      }
    >
      <div className="school-ranking-columns school-ranking-header" role="row">
        {selecting && (
          <span role="columnheader" aria-label={t("school.compare")} />
        )}
        <span role="columnheader">{t("ranking.rank")}</span>
        <span role="columnheader">{t("ranking.schoolName")}</span>
        <span role="columnheader">{t("school.stage")}</span>
        <span role="columnheader">{t("school.type")}</span>
        <span role="columnheader">{scoreLabel}</span>
        <span role="columnheader" aria-label={t("ranking.locate")} />
      </div>
      {rows.map(({ row, campuses }) => {
        const campus = campuses[0];
        const canLocate = campuses.some(
          (item) => !item.remote && coordinates(item.record),
        );
        const change =
          showChanges && row?.rank != null
            ? rankChange(row, snapshot.board.comparison, t)
            : undefined;
        const delta =
          change &&
          snapshot.board.comparison === "available" &&
          row?.previousRank != null &&
          row.rank != null
            ? row.previousRank - row.rank
            : null;
        const schoolType = display(campus.record, filters.type);
        const score = row ? rankingPercent(row.score, i18n.language) : null;
        const scoreStatus =
          !row && snapshot.heldCampusIds.includes(campus.id)
            ? t("ranking.scopePending")
            : row?.smallGroup
              ? t("ranking.smallGroup")
              : undefined;
        return (
          <div
            className="school-ranking-columns school-ranking-row"
            role="row"
            key={row?.schoolId ?? campus.id}
          >
            {selecting && (
              <span role="cell">{select(campus, row?.campusIds)}</span>
            )}
            <span role="cell" className="school-ranking-place" title={change}>
              {row?.rank ?? "—"}
              {change && (
                <small aria-label={change}>
                  {delta == null ? "·" : delta > 0 ? "+" + delta : delta}
                </small>
              )}
            </span>
            <span role="cell" className="school-ranking-name">
              <a
                href={link(campus.id)}
                title={[campus.record[name], change, scoreStatus]
                  .filter(Boolean)
                  .join(" · ")}
              >
                {campus.record[name]}
              </a>
            </span>
            <span
              role="cell"
              className="school-ranking-level"
              title={educationLevel}
            >
              {educationLevel}
            </span>
            <span
              role="cell"
              className="school-ranking-type"
              title={schoolType}
            >
              {schoolType}
            </span>
            <span
              role="cell"
              className="school-ranking-score"
              title={scoreStatus}
            >
              {score ?? "—"}
              {scoreStatus && (
                <small aria-label={scoreStatus}>
                  {score ? "*" : scoreStatus}
                </small>
              )}
            </span>
            <div role="cell">
              <button
                className="school-icon school-ranking-action"
                type="button"
                aria-label={t("ranking.locate")}
                title={t(canLocate ? "ranking.locate" : "school.noCoordinates")}
                aria-controls={mapPanelId}
                disabled={!canLocate}
                onClick={() => locate(campuses)}
              >
                <MapPin size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
