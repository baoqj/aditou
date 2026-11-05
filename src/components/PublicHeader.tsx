import { SupportCoffee } from "./SupportCoffee";
import { useEffect, useRef, useState } from "react";
import { api, type Data } from "../api";
import { AccountMenu } from "./AccountMenu";
import { authDestination, schoolRankingPath, settingsDestination } from "../routing";
import { BookOpen } from "lucide-react";
import { t, UI_LOCALES } from "../i18n";
import { LanguageSwitcher } from "./LanguageSwitcher";
export function PublicHeader({ school = false }: { school?: boolean } = {}) {
  const language = new URLSearchParams(location.search).get("lang");
  const rankingUrl = schoolRankingPath + (language && Object.hasOwn(UI_LOCALES, language) ? "?lang=" + language : "");
  const [user, setUser] = useState<Data | null>(null),
    [ready, setReady] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const version = useRef(0);
  useEffect(() => {
    let alive = true;
    async function refresh() {
      const ticket = ++version.current;
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "same-origin",
          cache: "no-store",
        });
        if (!response.ok) {
          if (response.status === 401 && alive && ticket === version.current)
            setUser(null);
          return;
        }
        const data = (await response.json()) as { user: Data };
        if (alive && ticket === version.current) setUser(data.user);
      } catch {
        // A temporary network failure does not clear an established session.
      } finally {
        if (alive && ticket === version.current) setReady(true);
      }
    }
    const visible = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    void refresh();
    window.addEventListener("pageshow", refresh);
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", visible);
    return () => {
      alive = false;
      window.removeEventListener("pageshow", refresh);
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);
  async function logout() {
    if (busy) return;
    version.current++;
    setBusy(true);
    setError("");
    try {
      await api("/auth/logout", {});
      version.current++;
      setUser(null);
      setReady(true);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <header className={school ? "public-header public-header-school" : "public-header"}>
      <div className="public-header-inner">
        <a className="public-brand" href="/" aria-label={t("marketing.home")}>
          <span>
            <BookOpen size={21} />
          </span>
          <strong>{t("brand.name")}</strong>
        </a>
        <nav
          className="public-section-nav"
          aria-label={t("marketing.navigation")}
        >
          <a href="/#features">{t("marketing.nav.features")}</a>
          <a href="/#organization">{t("marketing.nav.organization")}</a>
          <a href="/#students">{t("marketing.nav.students")}</a>
          <a href="/#start">{t("marketing.nav.start")}</a>
        </nav>
        <div className="public-header-actions">
          {!school && <a className="public-login" href={rankingUrl}>{t("marketing.nav.schoolRanking")}</a>}
          <SupportCoffee />
          <LanguageSwitcher compact />
          {!ready ? (
            <span className="public-account-loading" aria-hidden="true" />
          ) : user ? (
            <AccountMenu
              name={user.name}
              email={user.email}
              busy={busy}
              onDashboard={() =>
                location.assign(
                  authDestination(user.role, null, location.origin),
                )
              }
              onSettings={() => location.assign(settingsDestination(user.role))}
              onContact={() => location.assign(settingsDestination(user.role)+"/contact")}
              onLogout={() => void logout()}
            />
          ) : (
            <>
              <a
                className={
                  "public-login " +
                  (location.pathname === "/login" ? "is-current" : "")
                }
                href="/login"
              >
                {t("marketing.login")}
              </a>
              <a className="public-button primary small" href="/signup">
                {t("marketing.signup")}
              </a>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="public-session-error" role="alert">
          {t(error)}
        </p>
      )}
    </header>
  );
}
