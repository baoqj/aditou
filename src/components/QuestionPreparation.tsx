import { t } from "../i18n";
export function QuestionPreparation({
  preparation,
  teacherOnly,
}: {
  preparation?: string;
  teacherOnly?: boolean;
}) {
  if (!preparation && !teacherOnly) return null;
  return (
    <div className="question-preparation">
      {teacherOnly && <p className="info-banner">{t("content.adultOnly")}</p>}
      {preparation && (
        <details>
          <summary>{t("content.adultPreparation")}</summary>
          <p>{preparation}</p>
        </details>
      )}
    </div>
  );
}
