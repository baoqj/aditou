import { useEffect, useRef, useState } from "react";
import { Headphones, Play, Pause, X } from "lucide-react";
import { t } from "../i18n";
import { api } from "../api";
export function QuestionAudio({
  questionId,
  accountKey,
  onSource,
}: {
  questionId: string;
  accountKey: string;
  onSource?: (source: string) => void;
}) {
  const storage = "aditou.autoplay:" + accountKey;
  const [autoplay, setAutoplay] = useState(() => {
      try {
        return localStorage.getItem(storage) === "true";
      } catch {
        return false;
      }
    }),
    [open, setOpen] = useState(false),
    [loading, setLoading] = useState(false),
    [playing, setPlaying] = useState(false),
    [error, setError] = useState(""),
    [source, setSource] = useState<{
      id: string;
      kind: string;
      url: string;
    } | null>(null);
  const audio = useRef<HTMLAudioElement | null>(null),
    alive = useRef(true),
    playback = useRef(0),
    pending = useRef<Promise<any> | null>(null),
    holder = useRef<HTMLDivElement>(null);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
      playback.current++;
      audio.current?.pause();
      audio.current = null;
    };
  }, []);
  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!holder.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);
  async function play() {
    if (loading || !alive.current) return;
    const ticket = ++playback.current;
    setLoading(true);
    setError("");
    try {
      let selected = source;
      if (!selected) {
        pending.current ??= api(
          "/questions/" + encodeURIComponent(questionId) + "/audio",
        );
        selected = await pending.current;
        if (!alive.current) return;
        setSource(selected);
        onSource?.(selected!.id);
      }
      if (ticket !== playback.current) return;
      if (!audio.current) {
        const a = new Audio(selected!.url);
        a.onended = () => {
          if (alive.current) setPlaying(false);
        };
        a.onerror = () => {
          if (alive.current) {
            setPlaying(false);
            setError("learn.audioUnavailable");
          }
        };
        audio.current = a;
      }
      audio.current.currentTime = 0;
      await audio.current.play();
      if (alive.current && ticket === playback.current) setPlaying(true);
      else audio.current?.pause();
    } catch (e: any) {
      pending.current = null;
      if (alive.current) {
        setError(
          e.name === "NotAllowedError" ? "learn.audioBlocked" : e.message,
        );
        setPlaying(false);
      }
    } finally {
      if (alive.current) setLoading(false);
    }
  }
  useEffect(() => {
    if (autoplay) void play();
  }, []);
  return (
    <div className="question-audio-tools" ref={holder}>
      <label className="autoplay-option">
        <input
          type="checkbox"
          checked={autoplay}
          onChange={(e) => {
            setAutoplay(e.target.checked);
            try {
              localStorage.setItem(storage, String(e.target.checked));
            } catch {}
            if (e.target.checked) void play();
            else {
              playback.current++;
              audio.current?.pause();
              setPlaying(false);
            }
          }}
        />
        {t("learn.autoplay")}
      </label>
      <button
        className={"question-headphones " + (playing ? "is-playing" : "")}
        type="button"
        aria-label={t("learn.audioHelp")}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        <Headphones size={21} />
      </button>
      {open && (
        <div className="question-audio-popover">
          <button
            type="button"
            className="icon-button"
            aria-label={t("Fermer")}
            onClick={() => setOpen(false)}
          >
            <X size={15} />
          </button>
          <strong>{t("Lis la consigne à ton rythme")}</strong>
          <p>{t("Un adulte peut aussi te la lire.")}</p>
          <div className="question-audio-source">
            {source
              ? t(
                  source.kind === "teacher"
                    ? "Voix de l’enseignant"
                    : "Voix IA · TTS",
                )
              : t("learn.audioPriority")}
          </div>
          <button
            type="button"
            className="btn secondary"
            disabled={loading}
            onClick={() => {
              if (playing) {
                audio.current?.pause();
                setPlaying(false);
              } else void play();
            }}
          >
            {playing ? <Pause size={15} /> : <Play size={15} />}{" "}
            {t(
              loading
                ? "learn.audioLoading"
                : playing
                  ? "learn.pauseAudio"
                  : "Écouter",
            )}
          </button>
        </div>
      )}
      {error && (
        <span role="status" className="audio-inline-error">
          {t(error)}
        </span>
      )}
    </div>
  );
}
