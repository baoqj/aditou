import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  BookOpen,
  Building2,
  Mic,
  GraduationCap,
  Users,
  Headphones,
  Check,
  PenLine,
  ShieldCheck,
  Monitor,
  Languages,
  ClipboardList,
  BarChart3,
  RefreshCw,
} from "lucide-react";
import { t } from "../i18n";
import { PublicHeader } from "./PublicHeader";
import "./marketing.css";
export function MarketingPage() {
  useTranslation();
  const [answer, setAnswer] = useState(""),
    [submitted, setSubmitted] = useState(false);
  const correct =
    answer.trim() !== "" && Number(answer.replace(",", ".")) === 7;
  const roles = [
    { id: "schools", key: "school", icon: Building2, path: "/login" },
    {
      id: "teachers",
      key: "teacher",
      icon: Mic,
      path: "/login?next=%2Forg%2Fmain%2Fmanage%2Fstudio",
    },
    {
      id: "students",
      key: "student",
      icon: GraduationCap,
      path: "/login?next=%2Flearn",
    },
    { id: "parents", key: "parent", icon: Users, path: "/login" },
  ];
  const steps = [
    { id: "class", icon: Monitor },
    { id: "home", icon: Headphones },
    { id: "progress", icon: BarChart3 },
  ];
  return (
    <div className="marketing-page">
      <a className="public-skip" href="#main-content">
        {t("marketing.skip")}
      </a>
      <PublicHeader />
      <main id="main-content">
        <section className="marketing-hero">
          <div className="public-container">
            <div className="marketing-intro">
              <div className="public-eyebrow">
                {t("marketing.hero.eyebrow")}
                <span>·</span>
                <span>{t("marketing.hero.grades")}</span>
              </div>
              <h1>{t("marketing.hero.title")}</h1>
              <p>{t("marketing.hero.description")}</p>
            </div>
            <nav
              className="marketing-role-shortcuts"
              aria-label={t("marketing.roleNavigation")}
            >
              {roles.map(({ id, key, icon: Icon }) => (
                <a href={"#" + id} key={key}>
                  <span>{t("marketing.role." + key)}</span>
                  <Icon size={20} />
                </a>
              ))}
            </nav>
            <div className="marketing-previews">
              <section className="marketing-preview teacher-preview">
                <div className="marketing-preview-heading">
                  <span className="preview-indicator" />
                  <h2>{t("marketing.preview.teacher")}</h2>
                  <span className="public-tag">
                    {t("marketing.preview.example")}
                  </span>
                </div>
                <div className="marketing-reading">
                  <div className="marketing-reading-meta">
                    <span>{t("marketing.preview.readingLabel")}</span>
                    <span>{t("marketing.preview.language")}</span>
                  </div>
                  <p>{t("marketing.preview.script")}</p>
                  <div className="marketing-reading-foot">
                    <span>{t("marketing.preview.skill")}</span>
                    <BookOpen size={17} />
                  </div>
                </div>
                <div className="marketing-recording">
                  <span className="marketing-recording-icon">
                    <Mic size={21} />
                  </span>
                  <div>
                    <strong>{t("marketing.preview.recording")}</strong>
                    <span>{t("marketing.preview.audioSources")}</span>
                  </div>
                  <a
                    className="public-button primary small"
                    href="/login?next=%2Forg%2Fmain%2Fmanage%2Fstudio"
                  >
                    {t("marketing.preview.openStudio")}
                    <ArrowRight size={14} />
                  </a>
                </div>
                <div className="marketing-preview-foot">
                  <ShieldCheck size={13} />
                  {t("marketing.preview.review")}
                </div>
              </section>
              <section className="marketing-preview student-preview">
                <div className="marketing-preview-heading">
                  <span className="preview-indicator secondary" />
                  <h2>{t("marketing.preview.student")}</h2>
                  <span className="public-tag">
                    {t("marketing.preview.try")}
                  </span>
                </div>
                <div className="marketing-listening">
                  <Headphones size={24} />
                  <div>
                    <strong>{t("marketing.preview.promptTitle")}</strong>
                    <p>{t("marketing.preview.studentPrompt")}</p>
                  </div>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setSubmitted(true);
                  }}
                >
                  <label
                    className="marketing-demo-label"
                    htmlFor="marketing-answer"
                  >
                    <span id="marketing-answer-label">
                      {t("marketing.preview.answerLabel")}
                    </span>
                    <span>{t("marketing.preview.noTimer")}</span>
                  </label>
                  <div className="marketing-answer-input">
                    <input
                      id="marketing-answer"
                      aria-labelledby="marketing-answer-label"
                      inputMode="numeric"
                      type="text"
                      value={answer}
                      onChange={(e) => {
                        setAnswer(e.target.value);
                        setSubmitted(false);
                      }}
                      required
                      placeholder={t("marketing.preview.answerPlaceholder")}
                      aria-describedby="marketing-demo-help"
                    />
                    <PenLine size={19} />
                  </div>
                  <div className="marketing-demo-action">
                    <span
                      role="status"
                      className={
                        "marketing-demo-feedback " +
                        (submitted
                          ? correct
                            ? "is-correct"
                            : "is-incorrect"
                          : "")
                      }
                    >
                      {submitted ? (
                        <>
                          {correct ? (
                            <Check size={15} />
                          ) : (
                            <RefreshCw size={15} />
                          )}{" "}
                          {t(
                            correct
                              ? "marketing.preview.correct"
                              : "marketing.preview.retry",
                          )}
                        </>
                      ) : (
                        <>{t("marketing.preview.encouragement")}</>
                      )}
                    </span>
                    <button
                      className="public-button primary small"
                      type="submit"
                    >
                      {t("marketing.preview.submit")}
                    </button>
                  </div>
                </form>
                <p id="marketing-demo-help" className="marketing-preview-foot">
                  <ShieldCheck size={13} />
                  {t("marketing.preview.localOnly")}
                </p>
              </section>
            </div>
          </div>
        </section>
        <section className="marketing-how" id="features">
          <div className="public-container">
            <div className="marketing-section-heading">
              <div>
                <div className="public-eyebrow">
                  {t("marketing.how.eyebrow")}
                </div>
                <h2>{t("marketing.how.title")}</h2>
              </div>
              <p>{t("marketing.how.description")}</p>
            </div>
            <div className="marketing-steps">
              {steps.map(({ id, icon: Icon }, index) => (
                <article className="marketing-step" key={id}>
                  <div className="marketing-step-top">
                    <strong>{String(index + 1).padStart(2, "0")}</strong>
                    <span className="public-tag">
                      {t("marketing.step." + id + ".tag")}
                    </span>
                  </div>
                  <h3>{t("marketing.step." + id + ".title")}</h3>
                  <p>{t("marketing.step." + id + ".description")}</p>
                  <ul>
                    {[1, 2, 3].map((n) => (
                      <li key={n}>
                        <Check size={16} />
                        {t("marketing.step." + id + ".point" + n)}
                      </li>
                    ))}
                  </ul>
                  <div className="marketing-step-foot">
                    <Icon size={14} />
                    {t("marketing.step." + id + ".foot")}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="marketing-portals">
          <div className="public-container">
            <div className="marketing-section-heading">
              <div>
                <div className="public-eyebrow">
                  {t("marketing.portals.eyebrow")}
                </div>
                <h2>{t("marketing.portals.title")}</h2>
              </div>
              <p>{t("marketing.portals.description")}</p>
            </div>
            <div className="marketing-portal-grid">
              {roles.map(({ id, key, icon: Icon, path }) => (
                <article className="marketing-portal" id={id} key={id}>
                  <div className="marketing-portal-top">
                    <span className="public-tag">
                      {t("marketing.portal." + key + ".tag")}
                    </span>
                    <Icon size={24} />
                  </div>
                  <h3>{t("marketing.portal." + key + ".title")}</h3>
                  <p>{t("marketing.portal." + key + ".description")}</p>
                  <div className="marketing-portal-facts">
                    {[1, 2].map((n) => (
                      <div key={n}>
                        <span>
                          {t("marketing.portal." + key + ".label" + n)}
                        </span>
                        <strong>
                          {t("marketing.portal." + key + ".value" + n)}
                        </strong>
                      </div>
                    ))}
                  </div>
                  <a className="marketing-portal-link" href={path}>
                    {t("marketing.portal." + key + ".action")}
                    <ArrowRight size={16} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="marketing-principles" id="families">
          <div className="public-container">
            {[
              { id: "languages", icon: Languages },
              { id: "audio", icon: Mic },
              { id: "privacy", icon: ShieldCheck },
              { id: "devices", icon: Monitor },
            ].map(({ id, icon: Icon }) => (
              <div key={id}>
                <Icon size={20} />
                <span>{t("marketing.principle." + id + ".label")}</span>
                <strong>{t("marketing.principle." + id + ".title")}</strong>
                <p>{t("marketing.principle." + id + ".description")}</p>
              </div>
            ))}
          </div>
        </section>
        <section className="marketing-cta" id="start">
          <div className="public-container">
            <div>
              <div className="public-eyebrow">{t("marketing.cta.eyebrow")}</div>
              <h2>{t("marketing.cta.title")}</h2>
              <p>{t("marketing.cta.description")}</p>
            </div>
            <div className="marketing-cta-actions">
              <a href="/signup" className="public-button white">
                {t("marketing.signup")}
                <ArrowRight size={17} />
              </a>
              <a href="/login" className="public-button outline">
                {t("marketing.cta.login")}
              </a>
            </div>
          </div>
        </section>
      </main>
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
    </div>
  );
}
