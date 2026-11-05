import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { postalCode } from "./school-data";

type Configuration = { key: string; mapId: string };
let configPromise: Promise<Configuration | null> | undefined;
let initialized = false;

export function schoolMapConfig() {
  configPromise ??= fetch("/api/school-map/config")
    .then(async (response) => {
      if (!response.ok) return null;
      const config = (await response.json()) as Configuration;
      return config.key && config.mapId ? config : null;
    })
    .catch(() => null);
  return configPromise;
}

export function configureMaps(config: Configuration) {
  if (initialized) return;
  setOptions({
    key: config.key,
    region: "CA",
    v: "quarterly",
    authReferrerPolicy: "origin",
  });
  initialized = true;
}

export async function locatePostalCode(postal: string) {
  const config = await schoolMapConfig();
  if (!config) throw new Error("mapsUnavailable");
  configureMaps(config);
  const { Geocoder } = await importLibrary("geocoding");
  const { results } = await new Geocoder().geocode({
    componentRestrictions: { country: "CA", postalCode: postal },
    fulfillOnZeroResults: true,
  });
  const exact = results.find(
    (result) =>
      !result.partial_match &&
      result.address_components.some(
        (part) => part.types.includes("country") && part.short_name === "CA",
      ) &&
      result.address_components.some(
        (part) =>
          part.types.includes("postal_code") &&
          postalCode(part.long_name) === postal,
      ),
  );
  return exact?.geometry.location.toJSON() ?? null;
}
