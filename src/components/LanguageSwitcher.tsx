import { useTranslation } from "react-i18next";
import { setPageLanguage, t } from "../i18n";
export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation();
  return (
    <label
      className={
        "language-picker" + (compact ? " language-picker-compact" : "")
      }
    >
      <span className="sr-only">{t("ui.language")}</span>
      <select
        aria-label={t("ui.language")}
        title={t("ui.language.help")}
        value={i18n.resolvedLanguage || "fr"}
        onChange={(e) => setPageLanguage(e.target.value)}
      >
        <option value="en">English</option>
        <option value="fr">Français</option>
        <option value="es">Español</option>
        <option value="zh">中文</option>
      </select>
    </label>
  );
}
