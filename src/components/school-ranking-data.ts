import { useEffect, useState } from "react";

export type RankLevel = "primary" | "secondary";
export type RankBoard = {
  id: string;
  level: RankLevel;
  grade: number;
  code: string;
  label: string;
  sector: "public" | "private";
  network: "fr" | "en" | "private";
  examLanguage: string;
  metric: "pass" | "mean";
  dimension: "competence" | "programme";
  sourceId: string;
  sourceUrl: string;
  sourceVersion: string;
  year: string;
  rankedCount: number;
  provisional: number;
  comparison: "available" | "missing" | "unverified";
};
export type RankRow = {
  schoolId: string;
  rank: number | null;
  score: number;
  participants: number | null;
  countText?: string | null;
  smallGroup?: number | null;
  sourcePage: number | null;
  previousRank: number | null;
  campusIds: string[];
  subjects: {
    code: string;
    label: string;
    score: number;
    sourcePage: number | null;
  }[];
};
type Release = { id: string; method: string };
export type RankSnapshot = {
  release: Release;
  board: RankBoard;
  rows: RankRow[];
  heldCampusIds: string[];
};
export type RankCatalog = { release: Release; boards: RankBoard[] };
export type CampusRankResult = Omit<RankBoard, "rankedCount" | "comparison"> &
  Pick<
    RankRow,
    | "score"
    | "participants"
    | "sourcePage"
    | "previousRank"
    | "countText"
    | "smallGroup"
  > & {
    correctionUrl?: string | null;
    rank: number | null;
    rankedCount: number | null;
    scope: "school" | "campus" | "programme";
    reportedLabel?: string | null;
    unassignedBuilding?: number;
    comparison: RankBoard["comparison"] | null;
  };

export function useRankingData<T>(path: string | null) {
  const [response, setResponse] = useState<{
    path: string;
    data: T | null;
  } | null>(null);
  useEffect(() => {
    if (path === null) return;
    const controller = new AbortController();
    fetch("/api/school-rankings" + path, { signal: controller.signal })
      .then(async (result) => {
        if (!result.ok) throw new Error("Ranking unavailable");
        setResponse({ path, data: (await result.json()) as T });
      })
      .catch(() => {
        if (!controller.signal.aborted) setResponse({ path, data: null });
      });
    return () => controller.abort();
  }, [path]);
  return response?.path === path ? response.data : undefined;
}

export function rankingPreference() {
  const match = document.cookie.match(/(?:^|; )aditou_school_rankings=([^;]*)/);
  try {
    return new URLSearchParams(match ? decodeURIComponent(match[1]) : "");
  } catch {
    return new URLSearchParams();
  }
}

export function saveRankingPreference(params: URLSearchParams) {
  const preference = new URLSearchParams();
  for (const key of ["level", "rankBoard", "year", "change"]) {
    const value = params.get(key);
    if (value) preference.set(key, value);
  }
  document.cookie =
    "aditou_school_rankings=" +
    encodeURIComponent(preference.toString()) +
    "; Path=/school; Max-Age=31536000; SameSite=Lax" +
    (location.protocol === "https:" ? "; Secure" : "");
}

export function defaultRankBoard(boards: RankBoard[], level: RankLevel) {
  const candidates = boards.filter((board) => board.level === level);
  const preferred = level === "primary" ? "reading" : "132520";
  return (
    candidates.find(
      (board) => board.code === preferred && board.network === "fr",
    ) ?? candidates[0]
  );
}

export function sourcePage(url: string, page: number | null) {
  return url + (page ? "#page=" + page : "");
}

export function rankingPercent(value: number, locale: string) {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 1000);
}
