import i18n from "./i18n";
export type Data = Record<string, any>;
export async function api(
  path: string,
  body?: unknown,
  method?: string,
): Promise<any> {
  const r = await fetch("/api" + path, {
    method: method || (body === undefined ? "GET" : "POST"),
    credentials: "same-origin",
    headers: {
      "X-Aditou-UI-Language": i18n.resolvedLanguage || "fr",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const b: any = await r.json();
  if (!r.ok) throw new Error(b.error || "Erreur du serveur");
  return b;
}
