import { ExternalLink, Landmark } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Campus } from "./school-data";

export function SchoolCampusContext({ campus }: { campus: Campus }) {
  const { t } = useTranslation();
  if (!campus.supplement) return null;
  function source(url: string | undefined, text: string) {
    return (
      url &&
      /^https?:\/\//i.test(url) && (
        <a href={url} target="_blank" rel="noreferrer">
          {text} <ExternalLink size={12} />
        </a>
      )
    );
  }
  return (
    <section className="school-profile-panel school-rank-context">
      <div className="school-profile-section-title">
        <div>
          <h2>{t("ranking.context")}</h2>
          <p>{t("ranking.contextNote")}</p>
        </div>
        <Landmark size={21} aria-hidden="true" />
      </div>
      {(["primary", "secondary"] as const).map((level) => {
        const data = campus.supplement?.[level];
        if (
          !data ||
          ![
            data.catchment,
            data.admission,
            data.englishEligibility,
            data.genderSource,
            data.imseYear,
            data.program,
            data.policies?.length,
            data.remote,
          ].some(Boolean)
        )
          return null;
        return (
          <section key={level}>
            <h3>{t("school." + level)}</h3>
            {data.remote && <p>{t("ranking.remote")}</p>}
            {data.imse != null && (
              <p>
                <strong>{t("ranking.imse", { value: data.imse })}</strong>
                {data.imseYear && " · " + data.imseYear}{" "}
                {source(data.imseSource, t("ranking.evidence"))}
              </p>
            )}
            {data.genderSource && (
              <p>
                <strong>
                  {t("ranking.gender." + data.gender, {
                    defaultValue: t("school.unknown"),
                  })}
                </strong>
                {data.genderYear && " · " + data.genderYear}
                {data.genderNote && " · " + data.genderNote}{" "}
                {source(data.genderSource, t("ranking.evidence"))}
              </p>
            )}
            {data.program && <p>{data.program}</p>}
            <div className="school-rank-links">
              {source(data.catchment, t("ranking.catchment"))}
              {source(data.admission, t("ranking.admissionSource"))}
              {source(data.englishEligibility, t("ranking.eligibility"))}
            </div>
            {data.policies?.map((policy, index) => (
              <div className="school-rank-policy" key={index}>
                <strong>
                  {[policy.program, policy.year].filter(Boolean).join(" · ")}
                </strong>
                {policy.target &&
                  (policy.targetId && policy.targetId !== campus.id ? (
                    <a
                      href={
                        "/school/" +
                        encodeURIComponent(policy.targetId) +
                        location.search
                      }
                    >
                      {policy.target}
                    </a>
                  ) : (
                    <span>{policy.target}</span>
                  ))}
                {policy.description && <p>{policy.description}</p>}
                <p>
                  {[
                    policy.start &&
                      t("ranking.admissionStart", { value: policy.start }),
                    policy.deadline &&
                      t("ranking.admissionDeadline", {
                        value: policy.deadline,
                      }),
                    policy.assessment &&
                      t("ranking.assessment", { value: policy.assessment }),
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
                <div>
                  {source(policy.source, t("ranking.evidence"))}
                  {policy.checked && " · " + policy.checked}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </section>
  );
}
