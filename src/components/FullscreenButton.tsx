import { useEffect, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import { t } from "../i18n";
type FullDocument = Document & {
  webkitFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
};
type FullElement = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void>;
};
export function FullscreenButton() {
  const [active, setActive] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  useEffect(() => {
    const update = () =>
      setActive(
        !!(
          document.fullscreenElement ||
          (document as FullDocument).webkitFullscreenElement
        ),
      );
    update();
    document.addEventListener("fullscreenchange", update);
    document.addEventListener("webkitfullscreenchange", update);
    return () => {
      document.removeEventListener("fullscreenchange", update);
      document.removeEventListener("webkitfullscreenchange", update);
    };
  }, []);
  async function toggle() {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const doc = document as FullDocument,
        root = document.documentElement as FullElement;
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        if (doc.exitFullscreen) await doc.exitFullscreen();
        else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
        else throw new Error();
      } else if (root.requestFullscreen) await root.requestFullscreen();
      else if (root.webkitRequestFullscreen)
        await root.webkitRequestFullscreen();
      else {
        setError("fullscreen.unsupported");
        return;
      }
    } catch {
      setError("fullscreen.failed");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="fullscreen-control">
      <button
        type="button"
        className="fullscreen-button"
        disabled={busy}
        onClick={() => void toggle()}
        aria-label={t(active ? "fullscreen.exit" : "fullscreen.enter")}
        title={t(active ? "fullscreen.exit" : "fullscreen.enter")}
        aria-pressed={active}
      >
        {active ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
      {error && (
        <span className="fullscreen-error" role="status">
          {t(error)}
        </span>
      )}
    </div>
  );
}
