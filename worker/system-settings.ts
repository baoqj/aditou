import type { Env } from "./index";
import { TTS_MODELS, ttsSelection } from "./tts-settings";

export const systemReply = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
export async function systemSettings(env: Env) {
  const value = await env.DB.prepare(
    "SELECT registration_open,tts_model,tts_voice,version,updated_at FROM system_configuration WHERE id=1",
  ).first<{
    registration_open: number;
    tts_model: string | null;
    tts_voice: string | null;
    version: number;
    updated_at: number | null;
  }>();
  const fallback =
    TTS_MODELS.find((model) => model.id === env.TTS_MODEL) ?? TTS_MODELS[0];
  const model = value?.tts_model ?? fallback.id;
  const selected = TTS_MODELS.find((item) => item.id === model) ?? fallback;
  const preferredVoice =
    value?.tts_voice ??
    (selected.id === env.TTS_MODEL ? env.TTS_VOICE : undefined);
  const voice = selected.voices.includes(preferredVoice ?? "")
    ? preferredVoice!
    : selected.defaultVoice;
  return {
    registrationOpen: value?.registration_open !== 0,
    ttsModel: selected.id,
    ttsVoice: voice,
    version: value?.version ?? 0,
    updatedAt: value?.updated_at ?? null,
  };
}
export async function systemAdmin(
  req: Request,
  env: Env,
  actor: { id: string; role: string },
) {
  if (actor.role !== "admin")
    return systemReply({ error: "system.forbidden" }, 403);
  const settings = await systemSettings(env);
  if (req.method === "GET")
    return systemReply({ ...settings, models: TTS_MODELS });
  if (req.method !== "POST")
    return systemReply({ error: "system.invalid" }, 405);
  let data: Record<string, unknown>;
  try {
    const raw = await req.text();
    data = raw.length <= 4096 ? JSON.parse(raw) : null;
  } catch {
    return systemReply({ error: "system.invalid" }, 400);
  }
  if (
    !data ||
    typeof data.registrationOpen !== "boolean" ||
    typeof data.version !== "number"
  )
    return systemReply({ error: "system.invalid" }, 400);
  const selected = ttsSelection(data.ttsModel, data.ttsVoice);
  const [write] = await env.DB.batch([
    env.DB.prepare(
      "UPDATE system_configuration SET registration_open=?,tts_model=?,tts_voice=?,version=version+1,updated_at=?,updated_by=? WHERE id=1 AND version=?",
    ).bind(
      Number(data.registrationOpen),
      selected.model,
      selected.voice,
      Date.now(),
      actor.id,
      data.version,
    ),
    env.DB.prepare(
      "INSERT INTO audit_log(id,actor_id,action,resource_id) SELECT ?,?,'system.settings.update','system' WHERE changes()=1",
    ).bind(crypto.randomUUID(), actor.id),
  ]);
  return write.meta.changes
    ? systemReply({ ok: true, ...(await systemSettings(env)) })
    : systemReply({ error: "system.conflict" }, 409);
}
