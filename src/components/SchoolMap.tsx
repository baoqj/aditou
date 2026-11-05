import { useEffect, useRef, useState } from "react";
import { Map, MapPin, Maximize2, Minimize2, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { coordinates, name, type Campus, type Point } from "./school-data";
import { configureMaps, schoolMapConfig } from "./school-google";
import { importLibrary } from "@googlemaps/js-api-loader";

export type MapEntry = { campus: Campus; position: Point; rank?: number };
const montreal = { lat: 45.55, lng: -73.65 };

export function SchoolMap({
  entries,
  center,
  radius,
  onPick,
  focusCampus,
  expanded,
  onExpand,
}: {
  entries: MapEntry[];
  center: Point | null;
  radius: number;
  onPick: (campuses: Campus[]) => void;
  focusCampus?: Campus | null;
  expanded: boolean;
  onExpand: () => void;
}) {
  const { t } = useTranslation();
  const canvas = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [status, setStatus] = useState<"loading" | "fallback" | "ready">(
    "loading",
  );
  const [zoom, setZoom] = useState(1);
  const [fitVersion, setFitVersion] = useState(0);
  const focus = useRef(focusCampus);
  focus.current = focusCampus;

  useEffect(() => {
    let active = true;
    let failed = false;
    let timer: number | undefined;
    let tilesListener: google.maps.MapsEventListener | undefined;
    const globals = window as Window & { gm_authFailure?: () => void };
    const previous = globals.gm_authFailure;
    const authFailure = () => {
      failed = true;
      window.clearTimeout(timer);
      if (active) {
        setStatus("fallback");
        setMap(null);
      }
    };
    async function initialize() {
      const config = await schoolMapConfig();
      if (!config) throw new Error("Map unavailable");
      if (!active) return;
      globals.gm_authFailure = authFailure;
      timer = window.setTimeout(authFailure, 12000);
      configureMaps(config);
      const { Map: GoogleMap } = await importLibrary("maps");
      if (!active || failed || !canvas.current) return;
      const instance = new GoogleMap(canvas.current, {
        center: montreal,
        zoom: 10,
        mapId: config.mapId,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoomControl: false,
        gestureHandling: "cooperative",
      });
      tilesListener = google.maps.event.addListenerOnce(
        instance,
        "tilesloaded",
        () => {
          window.clearTimeout(timer);
          if (active && !failed) {
            setMap(instance);
            setStatus("ready");
          }
        },
      );
    }
    const observer = new ResizeObserver(([entry]) => {
      if (!entry.contentRect.width || !entry.contentRect.height) return;
      observer.disconnect();
      initialize().catch(authFailure);
    });
    if (canvas.current) observer.observe(canvas.current);
    return () => {
      active = false;
      observer.disconnect();
      window.clearTimeout(timer);
      tilesListener?.remove();
      if (globals.gm_authFailure === authFailure)
        globals.gm_authFailure = previous;
    };
  }, []);

  useEffect(() => {
    if (!map) return;
    let active = true;
    let dispose = () => {};
    Promise.all([
      google.maps.importLibrary("marker"),
      import("@googlemaps/markerclusterer"),
    ])
      .then(([{ AdvancedMarkerElement }, { MarkerClusterer }]) => {
        if (!active) return;
        const grouped = new globalThis.Map<string, MapEntry[]>();
        for (const entry of entries) {
          const key = entry.position.lat + "," + entry.position.lng;
          const group = grouped.get(key) ?? [];
          group.push(entry);
          grouped.set(key, group);
        }
        const markers = [...grouped.values()].map((group) => {
          const marker = new AdvancedMarkerElement({
            position: group[0].position,
            title:
              (group[0].rank && group.length === 1
                ? "#" + group[0].rank + " "
                : "") + String(group[0].campus.record[name]),
            gmpClickable: true,
          });
          const pin = document.createElement("span");
          pin.className =
            "school-google-pin " +
            (group[0].campus.record["性质"] === "私立" ? "is-private" : "");
          pin.textContent =
            group.length > 1
              ? String(group.length)
              : group[0].rank
                ? "#" + group[0].rank
                : "•";
          marker.appendChild(pin);
          marker.addEventListener("gmp-click", () =>
            onPick(group.map((entry) => entry.campus)),
          );
          return marker;
        });
        const cluster = new MarkerClusterer({ map, markers });
        const circle = center
          ? new google.maps.Circle({
              map,
              center,
              radius: radius * 1000,
              fillColor: "#2454cb",
              fillOpacity: 0.12,
              strokeColor: "#2454cb",
              strokeOpacity: 0.65,
              strokeWeight: 2,
              clickable: false,
            })
          : null;
        const searchPin = center
          ? new AdvancedMarkerElement({
              position: center,
              map,
              title: t("school.searchCenter"),
            })
          : null;
        const bounds = new google.maps.LatLngBounds();
        entries.forEach((entry) => bounds.extend(entry.position));
        const circleBounds = circle?.getBounds();
        if (circleBounds) bounds.union(circleBounds);
        const focusPoint =
          fitVersion === 0 &&
          focus.current &&
          coordinates(focus.current.record);
        if (focusPoint) {
          map.panTo(focusPoint);
          map.setZoom(14);
        } else if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 38);
          google.maps.event.addListenerOnce(map, "idle", () => {
            if (active && (map.getZoom() ?? 0) > 16) map.setZoom(16);
          });
        }
        dispose = () => {
          cluster.clearMarkers();
          cluster.setMap(null);
          circle?.setMap(null);
          if (searchPin) searchPin.map = null;
        };
      })
      .catch(() => {
        if (active) {
          setStatus("fallback");
          setMap(null);
        }
      });
    return () => {
      active = false;
      dispose();
    };
  }, [map, entries, center, radius, onPick, fitVersion, t]);

  useEffect(() => {
    const point = focusCampus && coordinates(focusCampus.record);
    if (map && point) {
      map.panTo(point);
      map.setZoom(14);
    }
  }, [map, focusCampus]);

  const points = entries.map((entry) => entry.position);
  if (center) {
    const dy = radius / 111;
    const dx = dy / Math.cos((center.lat * Math.PI) / 180);
    points.push(
      { lat: center.lat - dy, lng: center.lng - dx },
      { lat: center.lat + dy, lng: center.lng + dx },
    );
  }
  const latitudes = points.map((point) => point.lat);
  const longitudes = points.map((point) => point.lng);
  const minLat = points.length ? Math.min(...latitudes) : montreal.lat;
  const maxLat = points.length ? Math.max(...latitudes) : montreal.lat;
  const minLng = points.length ? Math.min(...longitudes) : montreal.lng;
  const maxLng = points.length ? Math.max(...longitudes) : montreal.lng;
  const middleLat = (minLat + maxLat) / 2;
  const middleLng = (minLng + maxLng) / 2;
  const aspect = Math.cos((middleLat * Math.PI) / 180);
  const scale =
    zoom *
    Math.min(
      290 / Math.max((maxLng - minLng) * aspect, 0.02),
      250 / Math.max(maxLat - minLat, 0.02),
    );
  const project = (point: Point) => ({
    x: 170 + (point.lng - middleLng) * scale * aspect,
    y: 150 - (point.lat - middleLat) * scale,
  });
  const buckets = new globalThis.Map<
    string,
    { x: number; y: number; campuses: Campus[]; rank?: number }
  >();
  for (const entry of entries) {
    const { x, y } = project(entry.position);
    if (x < 8 || x > 332 || y < 8 || y > 292) continue;
    const key = Math.round(x / 23) + "," + Math.round(y / 23);
    const bucket = buckets.get(key) ?? { x, y, campuses: [], rank: entry.rank };
    bucket.campuses.push(entry.campus);
    buckets.set(key, bucket);
  }
  const origin = center && project(center);
  return (
    <aside
      className={"school-map-panel" + (expanded ? " is-expanded" : "")}
      aria-label={t("school.map")}
    >
      <div className="school-panel-heading">
        <Map size={17} /> <h2>{t("school.map")}</h2>
        <button
          type="button"
          className="school-icon"
          onClick={onExpand}
          aria-label={t(expanded ? "school.reduceMap" : "school.expandMap")}
        >
          {expanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>
      <div className="school-map-frame">
        <div
          ref={canvas}
          className="school-google-map"
          aria-hidden={status !== "ready"}
          style={{ visibility: status === "ready" ? "visible" : "hidden" }}
        />
        {status !== "ready" && (
          <div className="school-coordinate-map">
            <svg viewBox="0 0 340 300" aria-hidden="true">
              <defs>
                <pattern
                  id="school-map-grid"
                  width="22"
                  height="22"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M 22 0 H 0 V 22"
                    fill="none"
                    stroke="#c4d5ed"
                    strokeWidth=".6"
                  />
                </pattern>
              </defs>
              <rect width="340" height="300" fill="url(#school-map-grid)" />
              {origin && (
                <>
                  <circle
                    cx={origin.x}
                    cy={origin.y}
                    r={(radius / 111) * scale}
                    fill="#2454cb19"
                    stroke="#2454cb"
                    strokeDasharray="3 3"
                  />
                  <circle cx={origin.x} cy={origin.y} r="4" fill="#143eae" />
                </>
              )}
            </svg>
            {[...buckets.entries()].map(([key, group]) => (
              <button
                key={key}
                type="button"
                className={
                  "school-map-dot" +
                  (group.campuses.every(
                    (campus) => campus.record["性质"] === "私立",
                  )
                    ? " is-private"
                    : "") +
                  (group.campuses.some(
                    (campus) => campus.id === focusCampus?.id,
                  )
                    ? " is-focused"
                    : "")
                }
                style={{
                  left: (group.x / 340) * 100 + "%",
                  top: (group.y / 300) * 100 + "%",
                }}
                title={
                  group.campuses.length === 1
                    ? (group.rank ? "#" + group.rank + " " : "") +
                      String(group.campuses[0].record[name])
                    : t("school.results", { count: group.campuses.length })
                }
                onClick={() => onPick(group.campuses)}
              >
                {group.campuses.length > 1 ? (
                  group.campuses.length
                ) : group.rank ? (
                  "#" + group.rank
                ) : (
                  <MapPin size={11} />
                )}
              </button>
            ))}
          </div>
        )}
        <div className="school-map-controls">
          <button
            type="button"
            aria-label={t("school.zoomOut")}
            onClick={() =>
              map
                ? map.setZoom((map.getZoom() ?? 10) - 1)
                : setZoom(Math.max(1, zoom - 0.5))
            }
          >
            <Minus size={15} />
          </button>
          <button
            type="button"
            aria-label={t("school.zoomIn")}
            onClick={() =>
              map
                ? map.setZoom((map.getZoom() ?? 10) + 1)
                : setZoom(Math.min(5, zoom + 0.5))
            }
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
      <div className="school-map-legend">
        <span>
          <i />
          {t("school.public")}
        </span>
        <span>
          <i />
          {t("school.private")}
        </span>
        <span>{t("school.mapped", { count: entries.length })}</span>
      </div>
      {status !== "ready" && (
        <p className="school-map-note">
          {t(
            status === "loading"
              ? "school.mapLoading"
              : "school.coordinatePreview",
          )}
        </p>
      )}
      <button
        className="school-map-fit"
        type="button"
        onClick={() => {
          setZoom(1);
          setFitVersion((value) => value + 1);
        }}
      >
        {t("school.fit")}
      </button>
    </aside>
  );
}

export function mapEntries(
  campuses: Campus[],
  ranks?: ReadonlyMap<string, { rank: number | null }>,
): MapEntry[] {
  return campuses.flatMap((campus) => {
    const position = campus.remote ? null : coordinates(campus.record);
    return position
      ? [{ campus, position, rank: ranks?.get(campus.id)?.rank ?? undefined }]
      : [];
  });
}
