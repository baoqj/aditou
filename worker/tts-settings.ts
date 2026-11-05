export const TTS_MODELS = [
  {
    id: "xai/grok-tts",
    label: "Grok TTS",
    voices: ["ara", "eve", "rex", "sal", "leo"],
    defaultVoice: "ara",
  },
  {
    id: "@cf/myshell-ai/melotts",
    label: "MeloTTS",
    voices: ["default"],
    defaultVoice: "default",
  },
];
export function ttsSelection(model: unknown, voice: unknown) {
  const selected = TTS_MODELS.find((m) => m.id === model);
  if (!selected) throw { status: 400, message: "system.invalidModel" };
  const choice = String(voice || selected!.defaultVoice);
  if (!selected!.voices.includes(choice))
    throw { status: 400, message: "system.invalidVoice" };
  return { model: selected!.id, voice: choice };
}
