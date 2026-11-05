import { useTranslation } from "react-i18next";
import { rankingPercent, type CampusRankResult } from "./school-ranking-data";

type Axis = { label: string; value: number | null; provisional?: boolean };

export function SchoolRadar({
  title,
  axes,
  maximum,
  format,
  allowRadar = true,
}: {
  title: string;
  axes: Axis[];
  maximum: number;
  allowRadar?: boolean;
  format: (value: number) => string;
}) {
  const { t } = useTranslation();
  const radar =
    allowRadar &&
    axes.length >= 3 &&
    axes.length <= 6 &&
    axes.every((axis) => axis.value != null);
  const points = (scale: number, index: number) => {
    const angle = (index * Math.PI * 2) / axes.length - Math.PI / 2;
    return [135 + Math.cos(angle) * scale, 105 + Math.sin(angle) * scale];
  };
  if (!axes.some((axis) => axis.value != null)) return null;
  return (
    <figure className="school-eval-chart">
      <figcaption>{title}</figcaption>
      {radar && (
        <svg viewBox="0 0 270 210" role="img" aria-label={title}>
          {[0.25, 0.5, 0.75, 1].map((step) => (
            <polygon
              key={step}
              className="school-eval-gridline"
              points={axes
                .map((_, i) => points(75 * step, i).join(","))
                .join(" ")}
            />
          ))}
          {axes.map((axis, i) => {
            const [x, y] = points(75, i);
            const [lx, ly] = points(90, i);
            return (
              <g key={axis.label}>
                <line
                  x1={135}
                  y1={105}
                  x2={x}
                  y2={y}
                  className="school-eval-gridline"
                />
                <text
                  x={lx}
                  y={ly}
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {i + 1}
                </text>
              </g>
            );
          })}
          <polygon
            className="school-eval-polygon"
            points={axes
              .map((axis, i) =>
                points((75 * axis.value!) / maximum, i).join(","),
              )
              .join(" ")}
          />
        </svg>
      )}
      <ol className="school-eval-legend">
        {axes.map((axis, i) => (
          <li key={i}>
            <div>
              <span>
                {radar && <b className="school-eval-index">{i + 1}</b>}
                {axis.label}
              </span>
              <strong>
                {axis.value == null
                  ? t("schoolEval.noData")
                  : format(axis.value)}
                {axis.provisional && " *"}
              </strong>
            </div>
            {!radar && axis.value != null && (
              <meter
                min={0}
                max={maximum}
                value={axis.value}
                aria-label={axis.label}
              />
            )}
          </li>
        ))}
      </ol>
      {axes.some((axis) => axis.provisional) && (
        <small>* {t("ranking.provisional")}</small>
      )}
    </figure>
  );
}

export function SchoolTrend({
  points,
  title,
  rank = false,
}: {
  points: CampusRankResult[];
  title: string;
  rank?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const data = points
    .filter((point) => !rank || point.rank != null)
    .sort((a, b) => a.year.localeCompare(b.year));
  if (!data.length) return null;
  const start = Number(data[0].year.slice(0, 4));
  const end = Number(data[data.length - 1].year.slice(0, 4));
  const ceiling = rank
    ? Math.max(2, ...data.map((point) => point.rankedCount ?? point.rank ?? 1))
    : 1000;
  const x = (point: CampusRankResult) =>
    50 +
    (end === start
      ? 145
      : (290 * (Number(point.year.slice(0, 4)) - start)) / (end - start));
  const y = (point: CampusRankResult) =>
    rank
      ? 20 + (112 * ((point.rank ?? 1) - 1)) / (ceiling - 1)
      : 132 - (112 * point.score) / ceiling;
  const format = (point: CampusRankResult) =>
    rank
      ? "#" + point.rank + (point.rankedCount ? " / " + point.rankedCount : "")
      : rankingPercent(point.score, i18n.language);
  return (
    <figure className="school-eval-chart">
      <figcaption>{title}</figcaption>
      <svg viewBox="0 0 375 156" role="img" aria-label={title}>
        {[20, 76, 132].map((row) => (
          <line
            key={row}
            x1={46}
            x2={348}
            y1={row}
            y2={row}
            className="school-eval-gridline"
          />
        ))}
        <text x={40} y={24} textAnchor="end">
          {rank ? "#1" : "100%"}
        </text>
        <text x={40} y={135} textAnchor="end">
          {rank ? "#" + ceiling : "0%"}
        </text>
        {data.map((point, i) => {
          const previous = data[i - 1];
          return (
            <g key={point.year}>
              {previous &&
                Number(point.year.slice(0, 4)) -
                  Number(previous.year.slice(0, 4)) ===
                  1 &&
                (!rank || point.comparison === "available") && (
                  <line
                    x1={x(previous)}
                    y1={y(previous)}
                    x2={x(point)}
                    y2={y(point)}
                    className="school-eval-series"
                    strokeDasharray={
                      point.provisional || previous.provisional
                        ? "5 4"
                        : undefined
                    }
                  />
                )}
              <circle
                cx={x(point)}
                cy={y(point)}
                r={4}
                className={
                  point.provisional
                    ? "school-eval-point is-provisional"
                    : "school-eval-point"
                }
              >
                <title>
                  {point.year} · {format(point)}
                  {point.provisional ? " · " + t("ranking.provisional") : ""}
                </title>
              </circle>
              <text x={x(point)} y={152} textAnchor="middle">
                {point.year.slice(0, 4)}
              </text>
            </g>
          );
        })}
      </svg>
      <ul className="school-eval-trend-values">
        {data.map((point) => (
          <li key={point.year}>
            {point.year} · {format(point)}
            {point.provisional && " *"}
          </li>
        ))}
      </ul>
      {data.some((point) => point.provisional) && (
        <small>* {t("ranking.provisional")}</small>
      )}
    </figure>
  );
}
