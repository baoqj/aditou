import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import fr from "./locales/fr.json";
import en from "./locales/en.json";
import es from "./locales/es.json";
import zh from "./locales/zh.json";

export const UI_LOCALES = {
  fr: "fr-CA",
  en: "en-CA",
  es: "es",
  zh: "zh-CN",
} as const;

let languageSync = Promise.resolve();
function syncEmailLanguage(language: string) {
  languageSync = languageSync
    .catch(() => {})
    .then(async () => {
      await fetch("/api/auth/language", {
        method: "POST",
        credentials: "same-origin",
        headers: { "X-Aditou-UI-Language": language },
      });
    })
    .catch(() => {});
}
function pageLanguage() {
  const linked = new URLSearchParams(location.search).get("lang");
  if (linked && Object.hasOwn(UI_LOCALES, linked)) return linked;
  const preferred = (navigator.languages.length ? navigator.languages : [navigator.language])
    .map((locale) => locale.toLowerCase().split("-")[0])
    .find((language) => Object.hasOwn(UI_LOCALES, language));
  return preferred ?? "fr";
}
function applyLanguage(language: string) {
  const locale = UI_LOCALES[language as keyof typeof UI_LOCALES] || "fr-CA";
  document.documentElement.lang = locale;
  syncEmailLanguage(language);
  document.title = String(i18n.t("page.title"));
  document
    .querySelector('meta[name="description"]')
    ?.setAttribute("content", String(i18n.t("page.description")));

}
i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
    es: { translation: es },
    zh: { translation: zh },
  },
  lng: pageLanguage(),
  fallbackLng: "fr",
  supportedLngs: ["fr", "en", "es", "zh"],
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  returnEmptyString: false,
  initAsync: false,
});
applyLanguage(i18n.language);
i18n.on("languageChanged", applyLanguage);
window.addEventListener("popstate", () => {
  const language = pageLanguage();
  if (language !== i18n.resolvedLanguage) void i18n.changeLanguage(language);
});

export function setPageLanguage(language: string) {
  if (!Object.hasOwn(UI_LOCALES, language)) return;
  const url = new URL(location.href);
  url.searchParams.set("lang", language);
  history.replaceState(history.state, "", url);
  void i18n.changeLanguage(language);
}

export function t(key: string, options?: Record<string, unknown>): string {
  return String(i18n.t(key, { ...options, defaultValue: key }));
}
export function dateLocale() {
  return (
    UI_LOCALES[i18n.resolvedLanguage as keyof typeof UI_LOCALES] || "fr-CA"
  );
}
export default i18n;

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  // Date-only due dates are calendar dates, not UTC timestamps shifted into Toronto time.
  return new Intl.DateTimeFormat(
    dateLocale(),
    /^\d{4}-\d{2}-\d{2}$/.test(value) ? { timeZone: "UTC" } : {},
  ).format(date);
}
