import { useEffect, useRef, useState } from "react";
import { t } from "../i18n";
import { api } from "../api";
// Only interval timestamps and context are sent; no text, keys, or audio are collected.
export function ActivityTracker({
  questionId,
  context = "private",
  contextId = "",
  enabled = true,
}: {
  questionId: string;
  context?: string;
  contextId?: string;
  enabled?: boolean;
}) {
  const [paused, setPaused] = useState(false),
    [reading, setReading] = useState(false),
    [syncError, setSyncError] = useState(false),
    touch = useRef(Date.now()),
    read = useRef(false);
  useEffect(() => {
    read.current = reading;
    touch.current = Date.now();
  }, [reading]);
  useEffect(() => {
    if (!enabled) return;
    touch.current = Date.now();
    let previous = Date.now(),
      lastInteraction = 0,
      lastPlayback = 0,
      segments: any[] = [],
      pending: any[] = [];
    const base = { question_id: questionId, context, context_id: contextId };
    const record = (start: number, end: number, kind: string) => {
      if (end <= start) return;
      const last = segments.at(-1);
      if (
        last &&
        last.kind === kind &&
        Math.abs(last.end - start) < 100 &&
        end - last.start <= 30000
      )
        last.end = end;
      else
        segments.push({
          ...base,
          id: crypto.randomUUID(),
          start: Math.round(start),
          end: Math.round(end),
          kind,
        });
    };
    const meaningful = (event: Event) => {
      const target = event.target;
      if (
        !(target instanceof Element) ||
        !target.closest(".player-card,.activity-status,.assessment-navigation")
      )
        return;
      touch.current = Date.now();
      if (target.closest(".question-response")) lastInteraction = touch.current;
      setPaused(false);
    };
    const audio = (event: Event) => {
      const d = (event as CustomEvent).detail;
      if (
        d.questionId === questionId &&
        document.visibilityState === "visible"
      ) {
        lastPlayback = d.end;
        touch.current = d.end;
        record(d.start, d.end, "listening");
        setPaused(false);
      }
    };
    const tick = () => {
      const now = Date.now();
      if (
        document.visibilityState === "visible" &&
        now - touch.current <= 90000 &&
        now - previous < 2000
      ) {
        // Use actual playback spans. The estimated reading window must not absorb listening time.
        if (!read.current && now - lastInteraction <= 1500)
          record(Math.max(previous, lastInteraction), now, "interaction");
        else if (now - lastPlayback > 1500) record(previous, now, "reading");
        setPaused(false);
      } else setPaused(true);
      previous = now;
    };
    const flush = () => {
      pending.push(...segments);
      segments = [];
      const batch = pending;
      pending = [];
      for (const item of batch) {
        if (Date.now() - item.start > 110000) {
          setSyncError(true);
          continue;
        }
        void api("/analytics/intervals", item)
          .then(() => setSyncError(false))
          .catch(() => {
            pending.push(item);
            setSyncError(true);
          });
      }
    };
    const visibility = () => {
      tick();
      flush();
      previous = Date.now();
    };
    for (const name of ["pointerdown", "keydown", "input"])
      window.addEventListener(name, meaningful, { passive: true });
    window.addEventListener("aditou-audio-progress", audio);
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", visibility);
    const timer = setInterval(tick, 1000),
      sender = setInterval(flush, 30000);
    return () => {
      clearInterval(timer);
      clearInterval(sender);
      tick();
      flush();
      for (const name of ["pointerdown", "keydown", "input"])
        window.removeEventListener(name, meaningful);
      window.removeEventListener("aditou-audio-progress", audio);
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", visibility);
    };
  }, [questionId, context, contextId, enabled]);
  if (!enabled) return null;
  return (
    <div className="activity-status">
      <span role="status">
        {t(
          syncError
            ? "analytics.syncIncomplete"
            : paused
              ? "analytics.timerPaused"
              : "analytics.timerActive",
        )}
      </span>
      <button
        type="button"
        className="text-button"
        aria-pressed={reading}
        onClick={() => {
          setReading(!reading);
          touch.current = Date.now();
          setPaused(false);
        }}
      >
        {t(reading ? "analytics.answerMode" : "analytics.readingMode")}
      </button>
      {paused && (
        <button
          type="button"
          className="text-button"
          onClick={() => {
            touch.current = Date.now();
            setPaused(false);
          }}
        >
          {t("analytics.resume")}
        </button>
      )}
    </div>
  );
}
