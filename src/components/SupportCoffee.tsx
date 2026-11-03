import { X } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../api";
export function SupportCoffee() {
  const { t, i18n } = useTranslation(),
    dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function checkout(amount: number) {
    setBusy(true);
    setError("");
    try {
      const result = await api("/support/checkout", {
        amount,
        language: i18n.resolvedLanguage || "fr",
      });
      location.assign(result.url);
    } catch (e: any) {
      setError(e.message);
      setBusy(false);
    }
  }
  return (
    <>
      <button
        className="support-coffee-button"
        aria-label={t("support.title")}
        onClick={() => {
          setError("");
          dialog.current?.showModal();
        }}
        title={t("support.title")}
      >
        <span aria-hidden="true">☕</span>
        <span>{t("support.button")}</span>
      </button>
      <dialog
        ref={dialog}
        className="support-coffee-dialog"
        aria-labelledby="support-title"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialog.current?.close();
        }}
      >
        <div className="support-coffee-content">
          <button
            className="support-close"
            aria-label={t("support.close")}
            onClick={() => dialog.current?.close()}
          >
            <X size={20} aria-hidden="true" />
          </button>
          <h2 id="support-title">{t("support.title")}</h2>
          <p>{t("support.body")}</p>
          <div className="support-qr-grid">
            {["wechat", "alipay"].map((method) => (
              <figure key={method}>
                <img
                  src={"/support/" + method + ".png"}
                  width="180"
                  height="180"
                  alt={t("support.qrAlt", { method: t("support." + method) })}
                />
                <figcaption>{t("support." + method)}</figcaption>
              </figure>
            ))}
          </div>
          <p className="support-payment-note">{t("support.paymentNote")}</p>
          <div className="support-amounts">
            {[2, 5, 10].map((amount) => (
              <button
                key={amount}
                disabled={busy}
                onClick={() => void checkout(amount)}
              >
                {t("support.amount", { amount })}
              </button>
            ))}
          </div>
          {busy && <p role="status">{t("support.processing")}</p>}
          {error && (
            <p role="alert" className="support-error">
              {t(error)}
            </p>
          )}
          <small>{t("support.note")}</small>
        </div>
      </dialog>
    </>
  );
}
