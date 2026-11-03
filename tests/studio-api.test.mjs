import { test } from "node:test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8787";
test("Studio TTS model/voice settings are authorized, validated and persisted", async () => {
  let r = await fetch(base + "/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "admin@gmail.com",
      password: process.env.ADMIN_PASSWORD || "Admin1234",
    }),
  });
  assert.equal(r.status, 200);
  const cookie = r.headers.get("set-cookie").split(";")[0];
  async function call(path, body, status = 200) {
    const r = await fetch(base + "/api" + path, {
      method: body ? "POST" : "GET",
      headers: { Cookie: cookie, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await r.json();
    assert.equal(r.status, status, JSON.stringify(data));
    return data;
  }
  const settings = await call("/audio/settings");
  assert.deepEqual(
    settings.models.map((m) => m.id),
    ["xai/grok-tts", "@cf/myshell-ai/melotts"],
  );
  const question_id = "practice-2-fr-CA";
  await call(
    "/audio/settings",
    { question_id, model: "invalid/model", voice: "ara" },
    400,
  );
  await call(
    "/audio/settings",
    { question_id, model: "xai/grok-tts", voice: "not-a-voice" },
    400,
  );
  await call("/audio/settings", {
    question_id,
    model: "xai/grok-tts",
    voice: "eve",
  });
  assert.equal(
    (await call("/audio/settings")).settings.find(
      (s) => s.question_id === question_id,
    ).voice,
    "eve",
  );
  await call("/audio/settings", {
    question_id,
    model: "@cf/myshell-ai/melotts",
    voice: "default",
  });
  assert.equal(
    (await call("/audio/settings")).settings.find(
      (s) => s.question_id === question_id,
    ).model,
    "@cf/myshell-ai/melotts",
  );
  await call("/audio/tts", { question_id, model: "invalid/model" }, 400);
  await call(
    "/audio/tts",
    { question_id, regenerate: true, request_id: "not-a-uuid" },
    400,
  );
  const sign = await fetch(base + "/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Settings Test",
      email: "studio-settings-" + Date.now() + "@example.com",
      password: "SettingsTest123",
    }),
  });
  const sc = sign.headers.get("set-cookie").split(";")[0];
  assert.equal(
    (await fetch(base + "/api/audio/settings", { headers: { Cookie: sc } }))
      .status,
    403,
  );
  assert.equal(
    (
      await fetch(base + "/api/audio/settings", {
        method: "POST",
        headers: { Cookie: sc, "Content-Type": "application/json" },
        body: JSON.stringify({ question_id, model: "xai/grok-tts" }),
      })
    ).status,
    403,
  );
});
