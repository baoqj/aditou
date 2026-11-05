import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSquareText } from "lucide-react";
import { api } from "../api";
import { SchoolRadar } from "./SchoolEvaluationCharts";

const metrics = [
  "teaching",
  "environment",
  "support",
  "communication",
] as const;
const relationships = ["parent", "student", "alumni", "staff", "other"];
type Metric = (typeof metrics)[number];
type Review = {
  id: string;
  body: string;
  rating: number;
  relationship: string | null;
  experienceYear: string | null;
  publishedAt: number;
};
type Mine = Review &
  Record<Metric, number | null> & {
    etag: string;
    status: string;
    reason: string | null;
    hasPublic: number;
  };
type Summary = { total: number; rating: number | null } & Record<
  Metric,
  number | null
> &
  Record<`${Metric}Count`, number> &
  Record<`star${1 | 2 | 3 | 4 | 5}`, number | null>;
type ReviewPage = {
  entries: Review[];
  summary: Summary;
  mine: Mine | null;
  signedIn: boolean;
};

export function SchoolReviews({ campusId }: { campusId: string }) {
  const { t, i18n } = useTranslation();
  const path = "/school/" + encodeURIComponent(campusId) + "/reviews";
  const [page, setPage] = useState(0);
  const [reload, setReload] = useState(0);
  const [data, setData] = useState<ReviewPage>();
  const [failed, setFailed] = useState(false);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  useEffect(() => {
    let active = true;
    setFailed(false);
    api(path + "?page=" + page)
      .then((result) => {
        if (active) setData(result);
      })
      .catch(() => {
        if (active) setFailed(true);
      });
    return () => {
      active = false;
    };
  }, [path, page, reload]);
  useEffect(() => {
    if (location.hash === "#school-reviews")
      document.getElementById("school-reviews")?.scrollIntoView();
  }, []);
  const mine = data?.mine;
  const number = new Intl.NumberFormat(i18n.language, {
    maximumFractionDigits: 1,
  });
  const date = new Intl.DateTimeFormat(i18n.language, { dateStyle: "medium" });
  const next = location.pathname + location.search + "#school-reviews";
  const auth = new URLSearchParams({
    next,
    lang: i18n.resolvedLanguage ?? "fr",
  });

  async function submit(action: string, fields?: FormData) {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const detail = fields
        ? {
            body: fields.get("body"),
            rating: Number(fields.get("rating")),
            ...Object.fromEntries(
              metrics.map((metric) => [
                metric,
                Number(fields.get(metric)) || null,
              ]),
            ),
            relationship: fields.get("relationship") || null,
            experienceYear: fields.get("year") || null,
          }
        : {};
      await api(path, { action, etag: mine?.etag ?? null, ...detail });
      setData(await api(path + "?page=" + page));
      setEditing(false);
      if (action === "submit") setNotice(t("schoolEval.submitted"));
    } catch (problem) {
      const key =
        problem instanceof Error ? problem.message : "schoolEval.failed";
      setError(key.startsWith("schoolEval.") ? t(key) : t("schoolEval.failed"));
      if (key === "schoolEval.conflict") setReload((value) => value + 1);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="school-profile-panel school-eval-panel"
      id="school-reviews"
    >
      <div className="school-profile-section-title">
        <div>
          <h2>{t("schoolEval.reviews")}</h2>
          <p>{t("schoolEval.reviewsNote")}</p>
        </div>
        <MessageSquareText size={21} aria-hidden="true" />
      </div>
      {failed ? (
        <p role="alert">
          {t("schoolEval.failed")}{" "}
          <button
            className="school-button"
            onClick={() => setReload((value) => value + 1)}
          >
            {t("schoolEval.retry")}
          </button>
        </p>
      ) : !data ? (
        <p role="status">{t("feedback.loading")}</p>
      ) : (
        <>
          <div className="school-eval-review-summary">
            <div>
              <h3>
                {t("schoolEval.publishedCount", { count: data.summary.total })}
              </h3>
              {data.summary.rating != null ? (
                <>
                  <p>
                    {t("schoolEval.average")}{" "}
                    <strong>{number.format(data.summary.rating)} / 5</strong>
                  </p>
                  <ol className="school-eval-legend">
                    {([5, 4, 3, 2, 1] as const).map((star) => (
                      <li key={star}>
                        <div>
                          <span>{star} / 5</span>
                          <strong>{data.summary[`star${star}`]}</strong>
                        </div>
                        <meter
                          min={0}
                          max={data.summary.total}
                          value={data.summary[`star${star}`] ?? 0}
                          aria-label={star + " / 5"}
                        />
                      </li>
                    ))}
                  </ol>
                </>
              ) : (
                <p>{t("schoolEval.sample")}</p>
              )}
            </div>
            <SchoolRadar
              title={t("schoolEval.communityOverview")}
              maximum={5}
              format={(value) => number.format(value) + " / 5"}
              axes={metrics.map((metric) => ({
                label:
                  t("schoolEval." + metric) +
                  " · " +
                  t("schoolEval.sampleCount", {
                    count: data.summary[`${metric}Count`],
                  }),
                value: data.summary[metric],
              }))}
            />
          </div>
          {data.entries.length > 0 && (
            <ul className="school-eval-review-list">
              {data.entries.map((entry) => (
                <li key={entry.id}>
                  <header>
                    <strong>{t("schoolEval.alias")}</strong>
                    <span>{entry.rating} / 5</span>
                    <time>{date.format(entry.publishedAt)}</time>
                  </header>
                  {(entry.relationship || entry.experienceYear) && (
                    <small>
                      {[
                        entry.relationship &&
                          t("schoolEval.relationship." + entry.relationship),
                        entry.experienceYear,
                      ]
                        .filter(Boolean)
                        .join(" · ")}
                    </small>
                  )}
                  <p>{entry.body}</p>
                </li>
              ))}
            </ul>
          )}
          {data.summary.total > 10 && (
            <nav
              className="school-eval-controls"
              aria-label={t("school.pagination")}
            >
              <button
                type="button"
                className="school-button"
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
              >
                {t("school.previous")}
              </button>
              <button
                type="button"
                className="school-button"
                disabled={(page + 1) * 10 >= data.summary.total}
                onClick={() => setPage(page + 1)}
              >
                {t("school.next")}
              </button>
            </nav>
          )}
          {data.signedIn ? (
            <>
              {mine && (
                <div className="school-eval-my-review">
                  <h3>{t("schoolEval.mine")}</h3>
                  <p>
                    {t("schoolEval.status." + mine.status)}
                    {mine.hasPublic && mine.status !== "published"
                      ? " · " + t("schoolEval.oldPublic")
                      : ""}
                  </p>
                  {mine.reason && <p>{mine.reason}</p>}
                  <p>
                    {mine.rating} / 5 · {mine.body}
                  </p>
                  {mine.status !== "withdrawn" && mine.status !== "deleted" && (
                    <div className="school-eval-controls">
                      <button
                        type="button"
                        className="school-button"
                        disabled={busy}
                        onClick={() => submit("withdraw")}
                      >
                        {t("schoolEval.withdraw")}
                      </button>
                      {mine.status === "pending" && Boolean(mine.hasPublic) && (
                        <button
                          type="button"
                          className="school-button"
                          disabled={busy}
                          onClick={() => submit("unpublish")}
                        >
                          {t("schoolEval.unpublish")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
              {mine?.status !== "deleted" && (
                <button
                  type="button"
                  className="school-button school-button-primary"
                  aria-expanded={editing}
                  onClick={() => setEditing(!editing)}
                >
                  {t(
                    editing
                      ? "schoolEval.cancel"
                      : mine
                        ? "schoolEval.editReview"
                        : "schoolEval.writeReview",
                  )}
                </button>
              )}
              {editing && mine?.status !== "deleted" && (
                <form
                  className="school-eval-review-form"
                  key={mine?.etag ?? "new"}
                  onSubmit={(event) => {
                    event.preventDefault();
                    void submit("submit", new FormData(event.currentTarget));
                  }}
                >
                  <p>{t("schoolEval.privacy")}</p>
                  <div className="school-eval-controls">
                    {(["rating", ...metrics] as const).map((metric) => (
                      <label key={metric}>
                        {t("schoolEval." + metric)}
                        <select
                          name={metric}
                          aria-label={t("schoolEval." + metric)}
                          required={metric === "rating"}
                          defaultValue={mine?.[metric] ?? ""}
                        >
                          <option value="">
                            {t(
                              metric === "rating"
                                ? "schoolEval.choose"
                                : "schoolEval.notExperienced",
                            )}
                          </option>
                          {[1, 2, 3, 4, 5].map((value) => (
                            <option key={value}>{value}</option>
                          ))}
                        </select>
                      </label>
                    ))}
                  </div>
                  <div className="school-eval-controls">
                    <label>
                      {t("schoolEval.relationship")}
                      <select
                        name="relationship"
                        defaultValue={mine?.relationship ?? ""}
                      >
                        <option value="">{t("schoolEval.notDisclosed")}</option>
                        {relationships.map((value) => (
                          <option key={value} value={value}>
                            {t("schoolEval.relationship." + value)}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {t("schoolEval.experienceYear")}
                      <input
                        name="year"
                        type="text"
                        placeholder="2024-2025"
                        pattern="20[0-9]{2}-20[0-9]{2}"
                        defaultValue={mine?.experienceYear ?? ""}
                      />
                    </label>
                  </div>
                  <label>
                    {t("schoolEval.reviewBody")}
                    <textarea
                      name="body"
                      aria-label={t("schoolEval.reviewBody")}
                      required
                      minLength={20}
                      maxLength={2000}
                      rows={5}
                      defaultValue={mine?.body ?? ""}
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={busy}
                    className="school-button school-button-primary"
                  >
                    {t("schoolEval.submitReview")}
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="school-eval-controls">
              <a
                className="school-button school-button-primary"
                href={"/login?" + auth}
              >
                {t("schoolEval.signIn")}
              </a>
              <a className="school-button" href={"/signup?" + auth}>
                {t("marketing.signup")}
              </a>
            </div>
          )}
          {notice && <p role="status">{notice}</p>}
          {error && <p role="alert">{error}</p>}
        </>
      )}
    </section>
  );
}
