import { BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import "./marketing.css";

export function PublicFooter() {
  const { t } = useTranslation();
  return (
    <footer className="marketing-footer">
      <div className="public-container">
        <div>
          <a href="/" className="marketing-footer-brand">
            <BookOpen size={18} />
            {t("brand.name")}
          </a>
          <p>{t("marketing.footer.independent")}</p>
        </div>
        <div className="marketing-footer-links">
          <a href="/school">{t("school.title")}</a>
          <a href="/contact">{t("feedback.title")}</a>
          <a href="/#features">{t("marketing.nav.features")}</a>
          <a href="/login">{t("marketing.login")}</a>
          <a href="/signup">{t("marketing.signup")}</a>
        </div>
        <small>
          {t("marketing.footer.copyright", {
            year: new Date().getFullYear(),
          })}
        </small>
      </div>
    </footer>
  );
}
