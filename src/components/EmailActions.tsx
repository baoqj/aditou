import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api";
import i18n, { t } from "../i18n";
import { PublicHeader } from "./PublicHeader";
export function EmailActions({
  mode,
  email: initialEmail = "",
}: {
  mode: "check-email" | "verify-email" | "forgot-password" | "reset-password";
  email?: string;
}) {
  useTranslation();
  const [email, setEmail] = useState(initialEmail),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false),
    [sent, setSent] = useState(false);
  const [token, setToken] = useState(
    () => new URLSearchParams(location.hash.slice(1)).get("token") || "",
  );
  useEffect(() => {
    const receive = () => {
      const incoming = new URLSearchParams(location.hash.slice(1)).get("token");
      if (incoming) {
        setToken(incoming);
        setDone(false);
        setError("");
        history.replaceState(null, "", location.pathname);
      }
    };
    receive();
    addEventListener("hashchange", receive);
    return () => removeEventListener("hashchange", receive);
  }, []);
  const heading =
    mode === "check-email"
      ? "email.checkTitle"
      : mode === "verify-email"
        ? "email.verifyTitle"
        : mode === "forgot-password"
          ? "email.forgotTitle"
          : "email.resetTitle";
  return (
    <>
      <PublicHeader />
      <main className="email-auth-page">
        <section className="card email-auth-card">
          <a className="auth-brand" href="/">
            {t("Atelier Bilingue")}
          </a>
          <h1>{t(heading)}</h1>
          {done ? (
            <>
              <p role="status">
                {t(
                  mode === "verify-email"
                    ? "email.verified"
                    : mode === "reset-password"
                      ? "email.resetDone"
                      : "email.resetSent",
                )}
              </p>
              {mode !== "forgot-password" && (
                <a className="btn full" href="/login">
                  {t("Se connecter")}
                </a>
              )}
            </>
          ) : (
            <>
              <p>
                {t(
                  mode === "check-email"
                    ? "email.checkBody"
                    : mode === "verify-email"
                      ? "email.verifyBody"
                      : mode === "forgot-password"
                        ? "email.forgotBody"
                        : "email.resetBody",
                )}
              </p>
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setBusy(true);
                  setError("");
                  const data = new FormData(e.currentTarget);
                  try {
                    if (mode === "check-email") {
                      await api("/auth/resend-verification", {
                        email,
                        locale: i18n.language,
                      });
                      setSent(true);
                    } else if (mode === "forgot-password") {
                      await api("/auth/forgot-password", {
                        email,
                        locale: i18n.language,
                      });
                      setDone(true);
                    } else if (mode === "verify-email") {
                      if (data.get("password") !== data.get("confirm"))
                        throw new Error("email.passwordMismatch");
                      await api("/auth/verify-email", {
                        token,
                        password: data.get("password"),
                        confirm: data.get("confirm"),
                      });
                      setDone(true);
                    } else {
                      if (data.get("password") !== data.get("confirm"))
                        throw new Error("email.passwordMismatch");
                      await api("/auth/reset-password", {
                        token,
                        password: data.get("password"),
                      });
                      setDone(true);
                    }
                  } catch (err) {
                    setError(
                      err instanceof Error ? err.message : "email.unavailable",
                    );
                  } finally {
                    setBusy(false);
                  }
                }}
              >
                {(mode === "check-email" || mode === "forgot-password") && (
                  <label className="email-field">
                    {t("Courriel ou identifiant élève")}
                    <input
                      type="email"
                      required
                      maxLength={254}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                    />
                  </label>
                )}
                {(mode === "reset-password" || mode === "verify-email") && (
                  <>
                    <label className="email-field">
                      {t(
                        mode === "verify-email"
                          ? "signup.enterPassword"
                          : "Nouveau mot de passe (10 caractères minimum)",
                      )}
                      <input
                        name="password"
                        type="password"
                        minLength={10}
                        maxLength={128}
                        required
                        autoComplete="new-password"
                      />
                    </label>
                    <label className="email-field">
                      {t(
                        mode === "verify-email"
                          ? "signup.repeatPassword"
                          : "email.confirmPassword",
                      )}
                      <input
                        name="confirm"
                        type="password"
                        minLength={10}
                        maxLength={128}
                        required
                        autoComplete="new-password"
                      />
                    </label>
                  </>
                )}
                {error && (
                  <p className="alert error" role="alert">
                    {t(error)}
                  </p>
                )}
                {sent && (
                  <p className="alert" role="status">
                    {t("email.resendSent")}
                  </p>
                )}
                {(mode === "verify-email" || mode === "reset-password") &&
                !token ? (
                  <p role="alert">{t("email.linkInvalid")}</p>
                ) : (
                  <button className="btn full" disabled={busy}>
                    {t(
                      busy
                        ? "Un instant…"
                        : mode === "check-email"
                          ? "email.resend"
                          : mode === "forgot-password"
                            ? "email.sendReset"
                            : mode === "verify-email"
                              ? "email.verifyAction"
                              : "email.resetAction",
                    )}
                  </button>
                )}
              </form>
            </>
          )}
          <p className="auth-switch">
            <a href="/login">{t("email.backLogin")}</a>
            {" · "}
            <a href="/resend-verification">{t("email.resend")}</a>
          </p>
        </section>
      </main>
    </>
  );
}
