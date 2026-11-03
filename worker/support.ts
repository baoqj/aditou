// Reuse StudyAI's existing prices, Stripe account, webhook and payment confirmation.
export async function supportCheckout(req: Request, service?: {fetch: typeof fetch}): Promise<Response> {
  const json = (body: unknown, status = 200) =>
    Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
  if (req.method !== "POST") return json({ error: "support.failed" }, 405);
  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "support.failed" }, 400);
  }
  if (![2, 5, 10].includes(body?.amount))
    return json({ error: "support.failed" }, 400);
  const language =
    ({ en: "en", fr: "fr", es: "es", zh: "zh-CN" } as Record<string, string>)[
      body.language
    ] || "en";
  try {
    const upstream = await (service ? service.fetch.bind(service) : fetch)("https://studyai.now/api/donations/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://studyai.now",
      },
      body: JSON.stringify({ amount: body.amount, language }),
      signal: AbortSignal.timeout(15000),
    });
    const data = (await upstream.json()) as { url?: string };
    if (!upstream.ok)
      return json(
        {
          error:
            upstream.status === 503 ? "support.unavailable" : "support.failed",
        },
        upstream.status === 503 ? 503 : 502,
      );
    const url = new URL(data.url || "");
    if (url.protocol !== "https:" || url.hostname !== "checkout.stripe.com")
      return json({ error: "support.failed" }, 502);
    return json({ url: url.href });
  } catch {
    return json({ error: "support.failed" }, 502);
  }
}
