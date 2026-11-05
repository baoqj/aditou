import { t } from "../i18n";
import type { Data } from "../api";
export function ClassroomAnalytics({
  targets,
  attempts,
  released,
  objective,
}: {
  targets: Data[];
  attempts: Data[];
  released: boolean;
  objective: boolean;
}) {
  const submitted = targets.filter((l) =>
      attempts.some((a) => a.learner_id === l.learner_id),
    ),
    pending = attempts.filter((a) => a.status === "pending_manual").length,
    graded = attempts.filter((a) =>
      ["correct", "partial", "incorrect"].includes(a.status),
    ),
    correct = graded.filter((a) => a.status === "correct").length;
  return (
    <div className="classroom-analytics">
      <h3>{t("analytics.liveSubmission")}</h3>
      <div className="analytics-large-number">
        {submitted.length} / {targets.length}
      </div>
      <p>
        {t("analytics.submitted")} ·{" "}
        {targets.length
          ? Math.round((100 * submitted.length) / targets.length) + "%"
          : "—"}
      </p>
      <div className="analytics-skill-track">
        <span
          style={{
            width: `${targets.length ? (100 * submitted.length) / targets.length : 0}%`,
          }}
        />
      </div>
      <p>
        {targets.length - submitted.length} {t("analytics.notSubmitted")} ·{" "}
        {t("analytics.onlineUnknown")}
      </p>
      {released ? (
        <p>
          {objective
            ? `${t("analytics.objectiveAccuracy")}: ${correct}/${graded.length}`
            : `${t("analytics.pending")}: ${pending}`}
        </p>
      ) : (
        <p>{t("analytics.liveResultsHidden")}</p>
      )}
      <details>
        <summary>{t("analytics.viewData")}</summary>
        <div className="analytics-table-wrap">
          <table>
            <thead>
              <tr>
                <th>{t("analytics.learner")}</th>
                <th>{t("analytics.state")}</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((l) => {
                const a = attempts.find((a) => a.learner_id === l.learner_id);
                return (
                  <tr key={l.learner_id}>
                    <td>{l.alias}</td>
                    <td>
                      {a
                        ? t(
                            released
                              ? "analytics.result." + a.status
                              : "analytics.submitted",
                          )
                        : t("analytics.notSubmitted")}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>
    </div>
  );
}
