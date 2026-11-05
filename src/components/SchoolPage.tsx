import { schoolRankingPath } from "../routing";
import {
  RankingRows,
  RankingFields,
  RankingOptions,
  rankChange,
  rankPaper,
  type RankedSchool,
} from "./SchoolRankings";
import {
  defaultRankBoard,
  rankingPercent,
  rankingPreference,
  saveRankingPreference,
  useRankingData,
  type RankBoard,
  type RankCatalog,
  type RankLevel,
  type RankRow,
  type RankSnapshot,
} from "./school-ranking-data";
import {
  IconArrowBigUpLine,
  IconCreativeCommonsNd,
  IconFilterPlus,
  IconMap2,
  IconMapOff,
  IconReload,
  IconVs,
} from "@tabler/icons-react";
import {
  SchoolCampusDetail,
  SchoolSource as Source,
} from "./SchoolCampusDetail";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  GitCompareArrows,
  List,
  LocateFixed,
  MapPin,
  Search,
  Table2,
  Trophy,
  X,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { PublicFooter } from "./PublicFooter";
import { PublicHeader } from "./PublicHeader";
import { SchoolMap, mapEntries } from "./SchoolMap";
import { locatePostalCode } from "./school-google";
import {
  address,
  coordinates,
  distance,
  filters,
  labels,
  instructionLanguage,
  municipality,
  name,
  normalize,
  postalCode,
  stage,
  values,
  type Campus,
  type Point,
  type RecordFields,
} from "./school-data";
import "./marketing.css";
import "./school.css";

const maxCompare = 5;
const directoryPageSizes = [10, 20, 50];
const rankingPageSizes = [50, 100, 200];
const radiusOptions = [1, 3, 5, 10, 20, 50];

function officialWebsite(record: RecordFields) {
  return record["学校官网"] || record["教育局／主办方官网"];
}

export function SchoolPage() {
  const { t, i18n } = useTranslation();
  const [campuses, setCampuses] = useState<Campus[] | null>(null);
  const [failure, setFailure] = useState(0);
  const [page, setPage] = useState(() =>
    Math.max(
      0,
      Math.min(
        500,
        Number(new URLSearchParams(location.search).get("rankPage")) || 0,
      ),
    ),
  );
  const [located, setLocated] = useState<Campus | null>(null);
  const preference = rankingPreference();
  const [params, setParams] = useState(
    () => new URLSearchParams(location.search),
  );
  const path = location.pathname.replace(/\/+$/, "");
  const id =
    path.toLowerCase() === schoolRankingPath ? undefined : path.split("/")[2];
  const rankingMode =
    !id &&
    (path.toLowerCase() === schoolRankingPath ||
      params.get("mode") === "rankings");
  const listPath = rankingMode ? schoolRankingPath : "/school";
  const directoryRef = useRef<HTMLElement>(null);
  const rankingResultsRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const directory = directoryRef.current;
    const header = directory?.previousElementSibling;
    if (!rankingMode || !directory || !header) return;
    const observer = new ResizeObserver(() => {
      directory.style.setProperty(
        "--school-header-height",
        header.getBoundingClientRect().height + "px",
      );
    });
    observer.observe(header);
    return () => observer.disconnect();
  }, [rankingMode]);
  useEffect(() => {
    if (!rankingMode || (path === schoolRankingPath && !params.has("mode")))
      return;
    const next = new URLSearchParams(params);
    next.delete("mode");
    history.replaceState(
      history.state,
      "",
      schoolRankingPath + (next.size ? "?" + next : "") + location.hash,
    );
    setParams(next);
  }, [rankingMode, path, params]);
  const pageSizes = rankingMode ? rankingPageSizes : directoryPageSizes;
  const requestedSize = Number(params.get("perPage"));
  const pageSize = pageSizes.includes(requestedSize)
    ? requestedSize
    : pageSizes[0];
  const [view, setView] = useState<"cards" | "table" | "compare">(() =>
    params.get("view") === "compare" ? "compare" : "cards",
  );
  const [mapOpen, setMapOpen] = useState(
    () => !rankingMode && !matchMedia("(max-width: 740px)").matches,
  );
  const [expandedMap, setExpandedMap] = useState(false);
  const mapVisible = mapOpen && view !== "compare";
  const mapPanelId = useId();
  const mapToggleLabel = t(mapVisible ? "school.hideMap" : "school.showMap");
  const [compareSelecting, setCompareSelecting] = useState(false);
  const selectingRanks = compareSelecting && view !== "compare";
  const compareSelectionLabel = t(
    selectingRanks ? "ranking.hideSelection" : "ranking.showSelection",
  );
  const [picked, setPicked] = useState<Campus[]>([]);
  const [moreFilters, setMoreFilters] = useState(
    () =>
      !rankingMode &&
      ["city", "network", "board"].some((key) => params.has(key)),
  );
  const advancedFiltersId = useId();
  const toggleFiltersLabel = t(
    moreFilters ? "school.fewerFilters" : "school.moreFilters",
  );
  const [postal, setPostal] = useState("");
  const [center, setCenter] = useState<Point | null>(null);
  const [radius, setRadius] = useState(5);
  const [nearbyStatus, setNearbyStatus] = useState("");
  const [locating, setLocating] = useState(false);
  const unrankedOnly = rankingMode && params.get("rankList") === "unranked";
  const catalog = useRankingData<RankCatalog>(id ? null : "");
  const boards = catalog?.boards ?? [];
  const savedLevel =
    params.get("level") ||
    boards.find((board) => board.id === params.get("rankBoard"))?.level ||
    preference.get("level");
  const level: RankLevel = savedLevel === "secondary" ? "secondary" : "primary";
  const wantedBoard = params.get("rankBoard") || preference.get("rankBoard");
  const activeBoard =
    boards.find((board) => board.id === wantedBoard && board.level === level) ??
    defaultRankBoard(boards, level);
  const wantedYear = params.get("year") || preference.get("year");
  const activeYear =
    boards.find(
      (board) => board.id === activeBoard?.id && board.year === wantedYear,
    )?.year ?? activeBoard?.year;
  const snapshot = useRankingData<RankSnapshot>(
    rankingMode && activeBoard && activeYear
      ? "/" + activeBoard.id + "/" + activeYear
      : null,
  );
  const subjectView = activeBoard?.dimension === "programme";
  const changes = (params.get("change") ?? preference.get("change")) === "1";
  useEffect(() => {
    if (!rankingMode || !activeBoard || !activeYear) return;
    saveRankingPreference(
      new URLSearchParams({
        level: activeBoard.level,
        rankBoard: activeBoard.id,
        year: activeYear,
        change: changes ? "1" : "0",
      }),
    );
  }, [rankingMode, activeBoard, activeYear, changes]);

  const translate = (value: string) =>
    labels[value] ? t("school." + labels[value]) : value;
  const display = (record: RecordFields, field: string) =>
    values(record, field).map(translate).join(" · ") || t("school.unknown");
  const query = params.get("q") ?? "";
  const requestedIds = (params.get("compare") ?? "").split(",").filter(Boolean);
  const compareIds = [...new Set(requestedIds)]
    .filter((key) => campuses?.some((campus) => campus.id === key))
    .slice(0, maxCompare);

  function updateParams(change: (next: URLSearchParams) => void) {
    const next = new URLSearchParams(location.search);
    change(next);
    history.replaceState(
      history.state,
      "",
      listPath + (next.size ? "?" + next : "") + location.hash,
    );
    setParams(next);
  }
  function filter(key: string, value: string) {
    updateParams((next) => {
      if (value) next.set(key, value);
      else next.delete(key);
      if (key === "region") next.delete("city");
      next.delete("rankPage");
    });
    setPage(0);
    setPicked([]);
    setLocated(null);
  }
  function compare(ids: string[]) {
    updateParams((next) => {
      if (ids.length) next.set("compare", ids.join(","));
      else {
        next.delete("compare");
        next.delete("view");
      }
    });
    if (!ids.length && view === "compare") setView("cards");
  }
  function toggleCompare(key: string) {
    compare(
      compareIds.includes(key)
        ? compareIds.filter((id) => id !== key)
        : [...compareIds, key].slice(0, maxCompare),
    );
  }
  function resetFilters() {
    updateParams((next) =>
      ["q", "rankPage", ...Object.keys(filters)].forEach((key) =>
        next.delete(key),
      ),
    );
    setCenter(null);
    setPostal("");
    setNearbyStatus("");
    setPage(0);
    setPicked([]);
    setLocated(null);
  }
  function openView(next: typeof view) {
    setView(next);
    updateParams((url) => {
      if (next === "compare") url.set("view", "compare");
      else url.delete("view");
    });
  }
  function chooseBoard(board: RankBoard, year = board.year) {
    updateParams((next) => {
      next.set("level", board.level);
      next.set("rankBoard", board.id);
      next.set("year", year);
      next.set("change", changes ? "1" : "0");
      next.delete("rankPage");
      next.delete("rankList");
    });
    setPage(0);
    setPicked([]);
    setLocated(null);
  }
  function modeUrl(ranking: boolean) {
    if (ranking === rankingMode) return listPath + location.search;
    const next = new URLSearchParams(params);
    for (const key of [
      "mode",
      "level",
      "rankBoard",
      "year",
      "density",
      "change",
      "rankPage",
      "rankList",
      "view",
    ])
      next.delete(key);
    return (
      (ranking ? schoolRankingPath : "/school") + (next.size ? "?" + next : "")
    );
  }
  function changePage(nextPage: number) {
    if (rankingMode) {
      updateParams((next) => {
        if (nextPage) next.set("rankPage", String(nextPage));
        else next.delete("rankPage");
      });
      rankingResultsRef.current?.scrollIntoView({ block: "start" });
    }
    setPage(nextPage);
  }
  function showUnranked(value: boolean) {
    updateParams((next) => {
      if (value) next.set("rankList", "unranked");
      else next.delete("rankList");
      next.delete("rankPage");
    });
    setPage(0);
  }
  function locateRank(campuses: Campus[]) {
    const mapped = campuses.filter(
      (campus) => !campus.remote && coordinates(campus.record),
    );
    if (!mapped.length) return;
    setLocated(mapped[0]);
    setPicked(mapped);
    setMapOpen(true);
    if (matchMedia("(max-width: 740px)").matches) {
      requestAnimationFrame(() =>
        document.getElementById(mapPanelId)?.scrollIntoView(),
      );
    }
  }
  async function searchPostal(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const code = postalCode(postal);
    if (!code) {
      setNearbyStatus("invalidPostal");
      return;
    }
    setCenter(null);
    setPage(0);
    setPicked([]);
    setPostal(code);
    setLocating(true);
    setNearbyStatus("");
    try {
      const point = await locatePostalCode(code);
      if (!point) setNearbyStatus("postalNotFound");
      else {
        setCenter(point);
        setPage(0);
        setPicked([]);
      }
    } catch {
      setNearbyStatus("mapsUnavailable");
    } finally {
      setLocating(false);
    }
  }
  function useLocation() {
    setNearbyStatus("");
    if (!navigator.geolocation) {
      setNearbyStatus("locationError");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setCenter({ lat: coords.latitude, lng: coords.longitude });
        setNearbyStatus(coords.accuracy > 1000 ? "locationLowAccuracy" : "");
        setPage(0);
        setPicked([]);
        setLocating(false);
      },
      () => {
        setNearbyStatus("locationError");
        setLocating(false);
      },
      { timeout: 10000, maximumAge: 60000 },
    );
  }
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/school" + (id ? "/" + encodeURIComponent(id) : ""), {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          setFailure(response.status);
          return;
        }
        const data = (await response.json()) as Campus | Campus[];
        setCampuses(Array.isArray(data) ? data : [data]);
      })
      .catch(() => {
        if (!controller.signal.aborted) setFailure(500);
      });
    return () => controller.abort();
  }, [id]);

  const filtered = useMemo(() => {
    const term = normalize(query);
    const rank = (school: string) =>
      school === term ? 0 : school.startsWith(term) ? 1 : 2;
    return (campuses ?? [])
      .flatMap((campus) => {
        const { record, facts } = campus;
        const searchable = [name, "校区／建筑名", municipality, filters.board]
          .map((field) => record[field])
          .concat(facts.map((fact) => fact["项目／适用范围"]));
        const haystack = normalize(searchable.join(" "));
        if (!term.split(" ").every((word) => haystack.includes(word)))
          return [];
        if (
          !Object.entries(filters).every(([key, field]) => {
            if (
              rankingMode &&
              (key === "stage" || key === "type" || key === "network")
            )
              return true;
            const selected = params.get(key);
            if (key === "language") {
              const language = instructionLanguage(selected);
              return (
                !language || instructionLanguage(record[field]) === language
              );
            }
            return !selected || values(record, field).includes(selected);
          })
        )
          return [];
        if (rankingMode && activeBoard) {
          if (
            !values(record, stage).includes(
              activeBoard.level === "primary" ? "小学" : "中学",
            )
          )
            return [];
          if (
            (record[filters.type] === "私立" ? "private" : "public") !==
            activeBoard.sector
          )
            return [];
          if (
            activeBoard.network !== "private" &&
            record[filters.network] !==
              (activeBoard.network === "fr" ? "法语公立网络" : "英语公立网络")
          )
            return [];
        }
        const point = center && !campus.remote && coordinates(record);
        const km = center && point ? distance(center, point) : null;
        if (center && (km === null || km > radius)) return [];
        return [{ campus, km, rank: rank(normalize(record[name])) }];
      })
      .sort(
        (a, b) =>
          (a.km ?? 0) - (b.km ?? 0) ||
          a.rank - b.rank ||
          String(a.campus.record[name]).localeCompare(
            String(b.campus.record[name]),
            i18n.language,
          ),
      );
  }, [
    campuses,
    center,
    i18n.language,
    params,
    query,
    radius,
    rankingMode,
    activeBoard,
  ]);
  const rankByCampus = useMemo(() => {
    const index = new globalThis.Map<string, RankRow>();
    snapshot?.rows.forEach((row) =>
      row.campusIds.forEach((campusId) => index.set(campusId, row)),
    );
    return index;
  }, [snapshot]);
  const ranked = useMemo(() => {
    const grouped = new globalThis.Map<string, RankedSchool>();
    for (const { campus } of filtered) {
      const row = rankByCampus.get(campus.id);
      if (!row) continue;
      const group = grouped.get(row.schoolId) ?? { row, campuses: [] };
      group.campuses.push(campus);
      grouped.set(row.schoolId, group);
    }
    return [...grouped.values()].sort(
      (a, b) =>
        (a.row.rank ?? 0) - (b.row.rank ?? 0) ||
        String(a.campuses[0].record[name]).localeCompare(
          String(b.campuses[0].record[name]),
          i18n.language,
        ) ||
        a.row.schoolId.localeCompare(b.row.schoolId),
    );
  }, [filtered, rankByCampus, i18n.language]);
  const unranked = useMemo(
    () => filtered.filter((item) => !rankByCampus.has(item.campus.id)),
    [filtered, rankByCampus],
  );
  const entries = useMemo(
    () =>
      mapEntries(
        filtered.map((item) => item.campus),
        rankByCampus,
      ),
    [filtered, rankByCampus],
  );
  const count = rankingMode
    ? unrankedOnly
      ? unranked.length
      : ranked.length
    : filtered.length;
  const selected = compareIds.flatMap(
    (key) => campuses?.find((campus) => campus.id === key) ?? [],
  );
  const selectedCount = selected.length;
  const pageCount = Math.ceil(count / pageSize);
  const displayPage = Math.min(page, Math.max(0, pageCount - 1));
  const detailUrl = (key: string) => {
    const search = new URLSearchParams(location.search);
    if (rankingMode) search.set("mode", "rankings");
    if (rankingMode && activeBoard && activeYear) {
      search.set("level", activeBoard.level);
      search.set("rankBoard", activeBoard.id);
      search.set("year", activeYear);
    }
    return (
      "/school/" + encodeURIComponent(key) + (search.size ? "?" + search : "")
    );
  };
  const detail = id ? campuses?.[0] : undefined;
  useEffect(() => {
    document.title =
      (detail?.record[name] ??
        t(rankingMode ? "ranking.title" : "school.directoryHeading")) +
      " | Aditou";
  }, [detail, rankingMode, t]);

  const visible = (rankingMode && unrankedOnly ? unranked : filtered).slice(
    displayPage * pageSize,
    (displayPage + 1) * pageSize,
  );
  const compareFields = [
    filters.type,
    stage,
    filters.language,
    filters.board,
    municipality,
    "校区地址",
    "入学方式",
    "费用",
    "课前课后托管",
  ];
  const compareRows = [
    "type",
    "stage",
    "language",
    "board",
    "city",
    "address",
    "admission",
    "fees",
    "care",
  ];

  function exportCsv() {
    const cell = (value: string | number) => {
      const str = String(value);
      return (
        '"' +
        (/^[\s]*[=+\-@]/.test(str) ? "'" : "") +
        str.replaceAll('"', '""') +
        '"'
      );
    };
    const rows = [
      [t("school.criteria"), ...selected.map(({ record }) => record[name])],
      ...compareFields.map((field, index) => [
        t("school." + compareRows[index]),
        ...selected.map(({ record }) => display(record, field)),
      ]),
    ];
    if (rankingMode && snapshot)
      rows.push([
        rankPaper(snapshot.board, t) + " · " + snapshot.board.year,
        ...selected.map((campus) => {
          const row = rankByCampus.get(campus.id);
          if (!row)
            return t(
              snapshot.heldCampusIds.includes(campus.id)
                ? "ranking.scopePending"
                : "ranking.notRanked",
            );
          const rankLabel =
            row.rank === null
              ? ""
              : "#" + row.rank + " / " + snapshot.board.rankedCount + " · ";
          return rankLabel + rankingPercent(row.score, i18n.language);
        }),
      ]);
    const url = URL.createObjectURL(
      new Blob(
        ["\uFEFF", rows.map((row) => row.map(cell).join(",")).join("\r\n")],
        {
          type: "text/csv;charset=utf-8",
        },
      ),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "aditou-school-comparison.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function filterTitle(key: keyof typeof filters | "perPage") {
    return t("school.filter." + key, {
      fallbackLng: false,
      defaultValue: t("school." + key),
    });
  }

  function selectFilter(key: keyof typeof filters) {
    const field = filters[key];
    const region = params.get("region");
    const options =
      key === "language"
        ? ["french", "english", "both"]
        : [
            ...new Set(
              (campuses ?? []).flatMap(({ record }) =>
                key === "city" && region && record[filters.region] !== region
                  ? []
                  : values(record, field),
              ),
            ),
          ].sort((a, b) =>
            translate(a).localeCompare(translate(b), i18n.language),
          );
    return (
      <label key={key} className="school-select">
        <span>{filterTitle(key)}</span>
        <select
          value={
            key === "language"
              ? instructionLanguage(params.get(key))
              : (params.get(key) ?? "")
          }
          onChange={(event) => filter(key, event.target.value)}
        >
          <option value="">{t("school.all")}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {key === "language" ? t("school." + option) : translate(option)}
            </option>
          ))}
        </select>
      </label>
    );
  }

  function selectSchool(
    campus: Campus,
    relatedIds = [campus.id],
    compact = false,
  ) {
    const selectedId = compareIds.find((key) => relatedIds.includes(key));
    const checked = selectedId !== undefined;
    return (
      <label className="school-compare-checkbox">
        <input
          type="checkbox"
          checked={checked}
          disabled={!checked && selectedCount >= maxCompare}
          onChange={() => toggleCompare(selectedId ?? campus.id)}
          aria-label={t("school.compareCampus", { name: campus.record[name] })}
        />
        {!compact && (
          <span>{t(checked ? "school.inCompare" : "school.addCompare")}</span>
        )}
      </label>
    );
  }

  function campusCard(
    { campus, km }: (typeof filtered)[number],
    index: number,
  ) {
    const { record } = campus;
    return (
      <article
        key={campus.id}
        className={
          "school-card" + (compareIds.includes(campus.id) ? " is-selected" : "")
        }
      >
        <div className="school-card-meta">
          <span className="school-index">
            {String(displayPage * pageSize + index + 1).padStart(2, "0")}
          </span>
          <span>
            {record[municipality]}{" "}
            {record["官方学校编号"] && " · MEQ " + record["官方学校编号"]}
          </span>
          {campus.facts.length > 0 && (
            <span className="school-verified">{t("school.verified")}</span>
          )}
          {km !== null && (
            <span className="school-distance" title={t("school.straightLine")}>
              {new Intl.NumberFormat(i18n.language, {
                maximumFractionDigits: 1,
              }).format(km)}{" "}
              km
            </span>
          )}
        </div>
        <h2>
          <a href={detailUrl(campus.id)}>{record[name]}</a>
        </h2>
        <p className="school-address">{address(record)}</p>
        <div className="school-tags">
          {[
            ...new Set(
              [filters.type, stage, filters.language, filters.network]
                .filter((field) => record[field])
                .map((field) => display(record, field)),
            ),
          ].map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
        <dl className="school-card-facts">
          {[filters.board, "确切年级", "入学方式", "课前课后托管"].map(
            (field, index) => (
              <div key={field}>
                <dt>
                  {t(
                    "school." + ["board", "grades", "admission", "care"][index],
                  )}
                </dt>
                <dd>{display(record, field)}</dd>
              </div>
            ),
          )}
        </dl>
        <div className="school-card-actions">
          {selectSchool(campus)}
          <Source value={officialWebsite(record)}>
            {t("school.official")} <ExternalLink size={13} />
          </Source>
          {!coordinates(record) && <small>{t("school.noCoordinates")}</small>}
          <a
            className="school-button school-button-primary school-detail-link"
            href={detailUrl(campus.id)}
          >
            {t("school.detail")} <ArrowRight size={15} />
          </a>
        </div>
      </article>
    );
  }

  const listFilters = (
    <div className="school-filters">
      {(rankingMode
        ? (["language", "region"] as const)
        : (["stage", "type", "language", "region"] as const)
      ).map(selectFilter)}
      <label className="school-select">
        <span>{filterTitle("perPage")}</span>
        <select
          value={pageSize}
          onChange={(event) => filter("perPage", event.target.value)}
        >
          {pageSizes.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>
    </div>
  );

  return (
    <>
      <PublicHeader school />
      <main
        className="school-directory"
        aria-label={
          id
            ? undefined
            : t(rankingMode ? "ranking.title" : "school.directoryHeading")
        }
        ref={directoryRef}
      >
        <div className="school-directory-inner">
          {!id ? (
            <header className="school-heading">
              <nav className="school-mode-tabs" aria-label={t("school.title")}>
                <a
                  className="school-button"
                  aria-current={rankingMode ? "page" : undefined}
                  href={modeUrl(true)}
                >
                  <Trophy size={16} /> {t("ranking.title")}
                </a>
                <a
                  className="school-button"
                  aria-current={!rankingMode ? "page" : undefined}
                  href={modeUrl(false)}
                >
                  <List size={16} /> {t("ranking.directory")}
                </a>
              </nav>
              <p className="school-community-title" title={t("school.cmm")}>
                {t("school.cmm")}
              </p>
              <label className="school-search">
                <Search size={18} aria-hidden="true" />
                <input
                  aria-label={t("school.search")}
                  placeholder={t("school.search")}
                  type="search"
                  value={query}
                  onChange={(event) => filter("q", event.target.value)}
                />
              </label>
            </header>
          ) : (
            !detail && (
              <a className="school-back" href={"/school" + location.search}>
                <ArrowLeft size={16} /> {t("school.back")}
              </a>
            )
          )}
          {failure ? (
            <p role="alert" className="school-message">
              {t(failure === 404 ? "school.missing" : "school.error")}
            </p>
          ) : !campuses ? (
            <p role="status" className="school-message">
              {t("feedback.loading")}
            </p>
          ) : detail ? (
            <SchoolCampusDetail
              key={detail.id}
              campus={detail}
              display={display}
              maxCompare={maxCompare}
            />
          ) : (
            <>
              <section
                className={
                  "school-filter-panel" +
                  (rankingMode ? " school-ranking-filters" : "")
                }
                aria-label={t("school.filters")}
              >
                <div className="school-filter-row">
                  {rankingMode
                    ? activeBoard &&
                      activeYear && (
                        <RankingFields
                          boards={boards}
                          selected={activeBoard}
                          year={activeYear}
                          choose={chooseBoard}
                        />
                      )
                    : listFilters}
                  <div className="school-filter-actions">
                    <button
                      className="school-button school-filter-icon"
                      type="button"
                      aria-label={toggleFiltersLabel}
                      title={toggleFiltersLabel}
                      aria-controls={advancedFiltersId}
                      aria-expanded={moreFilters}
                      onClick={() => setMoreFilters(!moreFilters)}
                    >
                      {moreFilters ? (
                        <IconArrowBigUpLine size={19} aria-hidden="true" />
                      ) : (
                        <IconFilterPlus size={19} aria-hidden="true" />
                      )}
                    </button>
                    <button
                      className="school-button school-filter-icon"
                      type="button"
                      aria-label={t("school.reset")}
                      title={t("school.reset")}
                      onClick={resetFilters}
                      disabled={locating}
                    >
                      <IconReload size={19} aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div
                  id={advancedFiltersId}
                  className="school-advanced-filters"
                  hidden={!moreFilters}
                >
                  {rankingMode && (
                    <>
                      {activeBoard && catalog && (
                        <RankingOptions
                          selected={activeBoard}
                          release={catalog.release.id}
                          changes={changes}
                          onChanges={(value) =>
                            updateParams((next) =>
                              next.set("change", value ? "1" : "0"),
                            )
                          }
                        />
                      )}
                      {listFilters}
                    </>
                  )}
                  <div className="school-advanced-selects">
                    {(rankingMode
                      ? (["city", "board"] as const)
                      : (["city", "network", "board"] as const)
                    ).map(selectFilter)}
                  </div>
                  <form className="school-nearby" onSubmit={searchPostal}>
                    <label>
                      <span>{t("school.postal")}</span>
                      <input
                        type="text"
                        value={postal}
                        title={t("school.postalPrivacy")}
                        maxLength={8}
                        placeholder="H2X 1Y4"
                        onChange={(event) => setPostal(event.target.value)}
                      />
                    </label>
                    <label>
                      <span>{t("school.radius")}</span>
                      <select
                        value={radius}
                        onChange={(event) => {
                          setRadius(Number(event.target.value));
                          setPage(0);
                          setPicked([]);
                        }}
                      >
                        {radiusOptions.map((option) => (
                          <option key={option} value={option}>
                            {t("school.radiusOption", { count: option })}
                          </option>
                        ))}
                      </select>
                    </label>
                    <button
                      className="school-button school-button-primary"
                      disabled={locating}
                    >
                      {t("school.nearby")}
                    </button>
                    <button
                      className="school-button"
                      type="button"
                      disabled={locating}
                      onClick={useLocation}
                      title={t("school.myLocation")}
                      aria-label={t("school.myLocation")}
                    >
                      <LocateFixed size={18} />
                    </button>
                  </form>
                  {(center || locating || nearbyStatus) && (
                    <div className="school-filter-notes">
                      {center && (
                        <button
                          className="school-text-button"
                          type="button"
                          disabled={locating}
                          onClick={() => {
                            setCenter(null);
                            setPage(0);
                            setPicked([]);
                          }}
                        >
                          {t("school.clearRadius")}
                        </button>
                      )}
                      {(locating || nearbyStatus) && (
                        <small role="status">
                          {t(
                            locating
                              ? "school.locating"
                              : "school." + nearbyStatus,
                          )}
                        </small>
                      )}
                    </div>
                  )}
                </div>
              </section>
              <div
                className={
                  "school-workspace" +
                  (rankingMode ? " school-ranking-workspace" : "") +
                  (!mapVisible
                    ? " school-map-hidden"
                    : expandedMap
                      ? " school-show-map"
                      : "")
                }
              >
                <section
                  className={
                    "school-results" +
                    (rankingMode ? " school-ranking-results" : "")
                  }
                  aria-label={t("school.title")}
                  ref={rankingMode ? rankingResultsRef : undefined}
                >
                  <div className="school-result-bar">
                    <div>
                      <strong role="status">
                        {rankingMode && !unrankedOnly
                          ? t(
                              subjectView
                                ? "ranking.resultsShown"
                                : "ranking.filtered",
                              { count },
                            )
                          : t("school.results", { count })}
                      </strong>
                      {rankingMode && snapshot && (
                        <small>
                          {subjectView
                            ? t("ranking.subjectReference")
                            : t("ranking.total", {
                                count: snapshot.board.rankedCount,
                              })}
                          {snapshot.board.provisional
                            ? " · " + t("ranking.provisional")
                            : ""}
                        </small>
                      )}
                      {center && (
                        <small>
                          {t("school.straightLine")} · {radius} km
                        </small>
                      )}
                    </div>
                    <div className="school-views">
                      {rankingMode ? (
                        <button
                          type="button"
                          aria-pressed={view !== "compare"}
                          onClick={() => openView("cards")}
                        >
                          <Trophy size={16} /> {t("ranking.title")}
                        </button>
                      ) : (
                        <>
                          <button
                            type="button"
                            aria-pressed={view === "cards"}
                            onClick={() => openView("cards")}
                          >
                            <List size={16} /> {t("school.cards")}
                          </button>
                          <button
                            type="button"
                            aria-pressed={view === "table"}
                            onClick={() => openView("table")}
                          >
                            <Table2 size={16} /> {t("school.table")}
                          </button>
                        </>
                      )}
                      <button
                        type="button"
                        aria-pressed={view === "compare"}
                        onClick={() => openView("compare")}
                      >
                        <GitCompareArrows size={16} /> {t("school.compare")} (
                        {selectedCount})
                      </button>
                      {rankingMode && (
                        <button
                          type="button"
                          className="school-ranking-select-toggle"
                          aria-label={compareSelectionLabel}
                          aria-pressed={selectingRanks}
                          title={compareSelectionLabel}
                          onClick={() => {
                            const selecting = !selectingRanks;
                            setCompareSelecting(selecting);
                            if (view === "compare") openView("cards");
                            if (
                              selecting &&
                              matchMedia("(max-width: 740px)").matches
                            )
                              setMapOpen(false);
                          }}
                        >
                          {selectingRanks ? (
                            <IconCreativeCommonsNd
                              size={18}
                              aria-hidden="true"
                            />
                          ) : (
                            <IconVs size={18} aria-hidden="true" />
                          )}
                        </button>
                      )}
                      {(!rankingMode || mapVisible) && (
                        <button
                          type="button"
                          className="school-map-toggle"
                          aria-label={mapToggleLabel}
                          aria-controls={mapPanelId}
                          aria-expanded={mapVisible}
                          title={mapToggleLabel}
                          disabled={view === "compare"}
                          onClick={() => setMapOpen(!mapOpen)}
                        >
                          {mapVisible ? (
                            <IconMapOff size={18} aria-hidden="true" />
                          ) : (
                            <IconMap2 size={18} aria-hidden="true" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  {view === "compare" ? (
                    <section className="school-comparison">
                      <div className="school-compare-heading">
                        <div>
                          <h2>
                            <GitCompareArrows size={20} />{" "}
                            {t("school.compareHeading")}
                          </h2>
                          <p>
                            {t("school.compareCount", {
                              count: selectedCount,
                              max: maxCompare,
                            })}
                          </p>
                        </div>
                        <div className="school-compare-tools">
                          <button
                            className="school-button"
                            type="button"
                            disabled={!selectedCount}
                            onClick={exportCsv}
                          >
                            <Download size={15} /> CSV
                          </button>
                          <button
                            className="school-button"
                            type="button"
                            disabled={!selectedCount}
                            onClick={() => compare([])}
                          >
                            {t("school.clearCompare")}
                          </button>
                        </div>
                      </div>
                      {selectedCount ? (
                        <div
                          className="school-table-scroll"
                          tabIndex={0}
                          role="region"
                          aria-label={t("school.compareHeading")}
                        >
                          <table className="school-comparison-table">
                            <thead>
                              <tr>
                                <th scope="col">{t("school.criteria")}</th>
                                {selected.map((campus) => (
                                  <th scope="col" key={campus.id}>
                                    <button
                                      type="button"
                                      className="school-icon"
                                      aria-label={t("school.removeCampus", {
                                        name: campus.record[name],
                                      })}
                                      onClick={() => toggleCompare(campus.id)}
                                    >
                                      <X size={16} />
                                    </button>
                                    <a href={detailUrl(campus.id)}>
                                      {campus.record[name]}
                                    </a>
                                    <small>
                                      {campus.record["官方学校编号"] &&
                                        "MEQ " + campus.record["官方学校编号"]}
                                    </small>
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rankingMode && snapshot && (
                                <tr>
                                  <th scope="row">
                                    {rankPaper(snapshot.board, t)} ·{" "}
                                    {snapshot.board.year}
                                  </th>
                                  {selected.map((campus) => {
                                    const row = rankByCampus.get(campus.id);
                                    return (
                                      <td key={campus.id}>
                                        {row ? (
                                          <>
                                            <strong>
                                              {row.rank !== null &&
                                                "#" + row.rank + " · "}
                                              {rankingPercent(
                                                row.score,
                                                i18n.language,
                                              )}
                                            </strong>
                                            {row.rank !== null && (
                                              <p>
                                                {t("ranking.total", {
                                                  count:
                                                    snapshot.board.rankedCount,
                                                })}
                                              </p>
                                            )}
                                            {changes && row.rank !== null && (
                                              <p>
                                                {rankChange(
                                                  row,
                                                  snapshot.board.comparison,
                                                  t,
                                                )}
                                              </p>
                                            )}
                                          </>
                                        ) : (
                                          t(
                                            snapshot.heldCampusIds.includes(
                                              campus.id,
                                            )
                                              ? "ranking.scopePending"
                                              : "ranking.notRanked",
                                          )
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              )}
                              {compareFields.map((field, index) => (
                                <tr key={field}>
                                  <th scope="row">
                                    {t("school." + compareRows[index])}
                                  </th>
                                  {selected.map(({ id: key, record }) => (
                                    <td key={key}>{display(record, field)}</td>
                                  ))}
                                </tr>
                              ))}
                              <tr>
                                <th scope="row">{t("school.official")}</th>
                                {selected.map(({ id: key, record }) => (
                                  <td key={key}>
                                    <Source value={officialWebsite(record)}>
                                      {t("school.website")}{" "}
                                      <ExternalLink size={13} />
                                    </Source>
                                  </td>
                                ))}
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <p className="school-message">
                          {t("school.compareEmpty")}
                        </p>
                      )}
                      <button
                        type="button"
                        className="school-button"
                        onClick={() => openView("cards")}
                      >
                        <ArrowLeft size={16} /> {t("school.back")}
                      </button>
                    </section>
                  ) : rankingMode ? (
                    !snapshot ? (
                      <p role="status" className="school-message">
                        {t(
                          catalog === null || snapshot === null
                            ? "ranking.unavailable"
                            : "feedback.loading",
                        )}
                      </p>
                    ) : (
                      <>
                        <div className="school-ranking-sections">
                          <button
                            className="school-button"
                            type="button"
                            aria-pressed={!unrankedOnly}
                            onClick={() => showUnranked(false)}
                          >
                            {t(
                              subjectView
                                ? "ranking.subjectReference"
                                : "ranking.ranked",
                            )}
                          </button>
                          <button
                            className="school-button"
                            type="button"
                            aria-pressed={unrankedOnly}
                            onClick={() => showUnranked(true)}
                          >
                            {t(
                              subjectView
                                ? "ranking.noSubjectResult"
                                : "ranking.notRanked",
                            )}{" "}
                            ({unranked.length})
                          </button>
                        </div>
                        {!count ? (
                          <p className="school-message">{t("school.empty")}</p>
                        ) : (
                          <RankingRows
                            snapshot={snapshot}
                            rows={
                              unrankedOnly
                                ? visible.map(({ campus }) => ({
                                    row: null,
                                    campuses: [campus],
                                  }))
                                : ranked.slice(
                                    displayPage * pageSize,
                                    (displayPage + 1) * pageSize,
                                  )
                            }
                            changes={changes}
                            selecting={selectingRanks}
                            mapPanelId={mapPanelId}
                            link={detailUrl}
                            locate={locateRank}
                            select={(campus, relatedIds) =>
                              selectSchool(campus, relatedIds, true)
                            }
                            display={display}
                          />
                        )}
                      </>
                    )
                  ) : !count ? (
                    <p className="school-message">{t("school.empty")}</p>
                  ) : view === "cards" ? (
                    <div className="school-grid">{visible.map(campusCard)}</div>
                  ) : (
                    <div
                      className="school-table-scroll school-directory-table"
                      tabIndex={0}
                      role="region"
                      aria-label={t("school.title")}
                    >
                      <table>
                        <thead>
                          <tr>
                            {["title", "city", "type", "stage", "compare"].map(
                              (key) => (
                                <th scope="col" key={key}>
                                  {t("school." + key)}
                                </th>
                              ),
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {visible.map(({ campus }) => (
                            <tr key={campus.id}>
                              <th scope="row">
                                <a href={detailUrl(campus.id)}>
                                  {campus.record[name]}
                                </a>
                              </th>
                              {[municipality, filters.type, stage].map(
                                (field) => (
                                  <td key={field}>
                                    {display(campus.record, field)}
                                  </td>
                                ),
                              )}
                              <td>{selectSchool(campus)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {view !== "compare" && pageCount > 1 && (
                    <nav
                      className="school-pagination"
                      aria-label={t("school.pagination")}
                    >
                      <span>
                        {t("school.pageRange", {
                          first: displayPage * pageSize + 1,
                          last: Math.min((displayPage + 1) * pageSize, count),
                          count,
                        })}
                      </span>
                      <button
                        className="school-button"
                        disabled={displayPage === 0}
                        onClick={() => changePage(displayPage - 1)}
                        aria-label={t("school.previous")}
                      >
                        <ArrowLeft size={16} />
                      </button>
                      <button
                        className="school-button"
                        disabled={displayPage + 1 >= pageCount}
                        onClick={() => changePage(displayPage + 1)}
                        aria-label={t("school.next")}
                      >
                        <ArrowRight size={16} />
                      </button>
                    </nav>
                  )}
                </section>
                <div
                  className={
                    "school-map-column" +
                    (rankingMode ? " school-ranking-map" : "")
                  }
                  id={mapPanelId}
                  hidden={!mapVisible}
                >
                  <SchoolMap
                    entries={entries}
                    center={center}
                    radius={radius}
                    focusCampus={located}
                    onPick={setPicked}
                    expanded={expandedMap}
                    onExpand={() => setExpandedMap(!expandedMap)}
                  />
                  {!!picked.length && (
                    <section
                      className="school-map-results"
                      aria-label={t("school.mapSelection")}
                    >
                      <div className="school-panel-heading">
                        <MapPin size={17} />
                        <h2>{t("school.results", { count: picked.length })}</h2>
                        <button
                          className="school-icon"
                          type="button"
                          onClick={() => setPicked([])}
                          aria-label={t("school.closeMap")}
                        >
                          <X size={16} />
                        </button>
                      </div>
                      <ul>
                        {picked.map((campus) => (
                          <li key={campus.id}>
                            <a href={detailUrl(campus.id)}>
                              {rankByCampus.get(campus.id)?.rank != null &&
                                "#" + rankByCampus.get(campus.id)!.rank + " "}
                              {campus.record[name]}
                            </a>
                            <small>{address(campus.record)}</small>
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </div>
              {selectedCount > 0 && view !== "compare" && (
                <div className="school-compare-dock">
                  <span>
                    <GitCompareArrows size={17} />{" "}
                    {t("school.compareCount", {
                      count: selectedCount,
                      max: maxCompare,
                    })}
                  </span>
                  <ul>
                    {selected.map((campus) => (
                      <li key={campus.id}>
                        {campus.record[name]}{" "}
                        <button
                          type="button"
                          onClick={() => toggleCompare(campus.id)}
                          aria-label={t("school.removeCampus", {
                            name: campus.record[name],
                          })}
                        >
                          <X size={14} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <button
                    className="school-button school-button-primary"
                    type="button"
                    onClick={() => openView("compare")}
                  >
                    {t("school.compare")} <ArrowRight size={16} />
                  </button>
                </div>
              )}
              <p className="school-data-source">
                <Source value={campuses[0]?.record["政府名录来源"]}>
                  {t("school.source")} <ExternalLink size={13} />
                </Source>
              </p>
            </>
          )}
        </div>
      </main>
      <div className="school-public-footer">
        <PublicFooter />
      </div>
    </>
  );
}
