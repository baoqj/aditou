import { useEffect } from "react";
import { canonicalPath } from "../routing";

export function VisitorTracker() {
  useEffect(() => {
    let visitor: string;
    try {
      visitor =
        localStorage.getItem("aditou_visitor_id") ?? crypto.randomUUID();
      if (!/^[a-f0-9-]{36}$/i.test(visitor)) visitor = crypto.randomUUID();
      localStorage.setItem("aditou_visitor_id", visitor);
    } catch {
      visitor = crypto.randomUUID();
    }
    let path = "",
      id = "",
      secret = "",
      visibleMs = 0,
      last = performance.now(),
      visible = document.visibilityState === "visible",
      active = false;
    function accrue() {
      const now = performance.now();
      if (active && visible) visibleMs += Math.max(0, now - last);
      last = now;
    }
    function flush(beacon = false) {
      if (!active) return;
      accrue();
      const body = JSON.stringify({
        id,
        secret,
        visitor,
        path,
        durationMs: Math.round(visibleMs),
      });
      if (
        beacon &&
        navigator.sendBeacon?.(
          "/api/visits",
          new Blob([body], { type: "application/json" }),
        )
      )
        return;
      void fetch("/api/visits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: "same-origin",
      }).catch(() => {});
    }
    function route() {
      const next = canonicalPath(location.pathname.replace(/\/+$/, "") || "/");
      if (active && path === next) return;
      flush(true);
      path = next;
      id = crypto.randomUUID();
      secret = crypto.randomUUID();
      visibleMs = 0;
      last = performance.now();
      visible = document.visibilityState === "visible";
      active = true;
      flush();
    }
    const originalPush = history.pushState,
      originalReplace = history.replaceState;
    const push: History["pushState"] = function (this: History, ...args) {
      originalPush.apply(this, args);
      queueMicrotask(route);
    };
    const replace: History["replaceState"] = function (this: History, ...args) {
      originalReplace.apply(this, args);
      queueMicrotask(route);
    };
    history.pushState = push;
    history.replaceState = replace;
    function visibility() {
      accrue();
      visible = document.visibilityState === "visible";
      flush(!visible);
    }
    function pagehide() {
      flush(true);
      active = false;
    }
    function pageshow(event: PageTransitionEvent) {
      if (event.persisted) route();
    }
    const timer = setInterval(() => flush(), 15000);
    window.addEventListener("popstate", route);
    window.addEventListener("pagehide", pagehide);
    window.addEventListener("pageshow", pageshow);
    document.addEventListener("visibilitychange", visibility);
    route();
    return () => {
      flush(true);
      active = false;
      clearInterval(timer);
      if (history.pushState === push) history.pushState = originalPush;
      if (history.replaceState === replace)
        history.replaceState = originalReplace;
      window.removeEventListener("popstate", route);
      window.removeEventListener("pagehide", pagehide);
      window.removeEventListener("pageshow", pageshow);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);
  return null;
}
