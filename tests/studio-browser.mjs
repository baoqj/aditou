import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8792";
if (!base.includes("localhost"))
  throw Error("Studio editing test is local only");
const browser = await chromium.launch({
  headless: true,
  args: [
    "--use-fake-device-for-media-stream",
    "--use-fake-ui-for-media-stream",
  ],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  permissions: ["microphone"],
});
await context.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
let res = await context.request.post(base + "/api/auth/login", {
  data: { email: "admin@gmail.com", password: "Admin1234" },
});
assert.equal(res.status(), 200);
const stamp = Date.now();
const editedTitle = "Studio edited " + stamp;
const initial = (
  await (await context.request.get(base + "/api/questions")).json()
).questions.find((q) => q.id === "practice-3-fr-CA");
const fixture = (
  await (
    await context.request.post(base + "/api/questions", {
      data: {
        ...initial,
        id: undefined,
        title: "Studio jetons " + stamp,
        status: "published",
      },
    })
  ).json()
).id;

const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.goto(base + "/org/main/manage/studio");
await page
  .getByRole("heading", { name: "Recording studio", exact: true })
  .waitFor();
await page
  .getByRole("combobox", { name: "Speech model", exact: true })
  .waitFor();
const library = page.getByRole("complementary", {
  name: "Exercise library",
  exact: true,
});
assert.ok((await library.getByRole("listitem").count()) >= 416);
assert.equal(await library.locator("select").count(), 3);
assert.equal(await page.getByLabel("Exercise and version").count(), 0);
await library.getByLabel("Exercise language").selectOption("fr-CA");
await library.getByLabel("Status", { exact: true }).selectOption("published");
await library.getByRole("textbox").fill("jetons");
assert.ok((await library.getByRole("listitem").count()) >= 1);
await library.locator('[data-question-id="' + fixture + '"]').click();
await page.getByLabel("Title", { exact: true }).fill(editedTitle);
await page
  .getByLabel("Reading text / TTS script", { exact: true })
  .fill("Tu as huit jetons. Tu en donnes deux. Combien en reste-t-il ?");
await page
  .getByRole("combobox", { name: "Speech model", exact: true })
  .selectOption("@cf/myshell-ai/melotts");
assert.equal(
  await page.getByRole("combobox", { name: "Voice", exact: true }).inputValue(),
  "default",
);
await page.getByRole("button", { name: "Save changes", exact: true }).click();
await page
  .getByRole("status")
  .getByText("Text and audio settings saved.")
  .waitFor();
assert.equal(
  await page.getByLabel("Title", { exact: true }).inputValue(),
  editedTitle,
);
const data = await (await context.request.get(base + "/api/questions")).json();
const edited = data.questions.find((q) => q.title === editedTitle);
assert.ok(edited);
assert.equal(edited.version, 2);
const original = data.questions.find((q) => q.id === fixture);
assert.equal(original.status, "retired");
assert.equal(original.script, initial.script);
assert.equal(
  edited.script,
  "Tu as huit jetons. Tu en donnes deux. Combien en reste-t-il ?",
);
assert.equal(edited.locale, "fr-CA");
assert.notEqual(edited.id, original.id);
const settings = await (
  await context.request.get(base + "/api/audio/settings")
).json();
assert.equal(
  settings.settings.find((s) => s.question_id === edited.id).model,
  "@cf/myshell-ai/melotts",
);
await page.reload();
await page
  .getByRole("combobox", { name: "Speech model", exact: true })
  .waitFor();
await library.getByRole("textbox").fill(editedTitle);
await library.getByRole("listitem").getByRole("button").click();
assert.equal(
  await page
    .getByRole("combobox", { name: "Speech model", exact: true })
    .inputValue(),
  "@cf/myshell-ai/melotts",
);
assert.equal(
  await page
    .getByLabel("Reading text / TTS script", { exact: true })
    .inputValue(),
  edited.script,
);
await page.getByLabel("Title", { exact: true }).fill("Unsaved temporary title");
await library.getByRole("textbox").fill("");
await library.getByLabel("Exercise language").selectOption("");
await library.getByLabel("Status", { exact: true }).selectOption("active");
page.once("dialog", (dialog) => dialog.dismiss());
await library
  .getByRole("listitem")
  .getByRole("button")
  .filter({ hasText: "Les côtés du triangle" })
  .first()
  .click();
assert.equal(
  await page.getByLabel("Title", { exact: true }).inputValue(),
  "Unsaved temporary title",
);
await page.getByLabel("Title", { exact: true }).fill(editedTitle);
for (const [width, height, label] of [
  [1440, 1100, "desktop"],
  [820, 1180, "tablet"],
  [390, 844, "mobile"],
]) {
  await page.setViewportSize({ width, height });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "overflow " + label,
  );
  await page.screenshot({
    path: `artifacts/studio-redesign-${label}.png`,
    fullPage: true,
  });
}
await page.locator(".language-picker select").selectOption("fr");
await page
  .getByRole("heading", { name: "Studio d’enregistrement", exact: true })
  .waitFor();
await page
  .getByRole("combobox", { name: "Modèle vocal", exact: true })
  .waitFor();
assert.equal(
  await page.getByLabel("Titre", { exact: true }).inputValue(),
  editedTitle,
);
await page.locator(".language-picker select").selectOption("en");
// Verify the upload preview and storage path without requesting microphone access.
const wav = Buffer.alloc(2044);
wav.write("RIFF");
wav.writeUInt32LE(2036, 4);
wav.write("WAVE", 8);
wav.write("fmt ", 12);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24);
wav.writeUInt32LE(16000, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(2000, 40);
await page.getByLabel("Choose an audio file", { exact: true }).setInputFiles({
  name: "studio-test.wav",
  mimeType: "audio/wav",
  buffer: wav,
});
await page.getByText("studio-test.wav", { exact: true }).waitFor();
await page.getByRole("button", { name: "Save draft", exact: true }).click();
await page
  .getByRole("status")
  .getByText("Audio saved as a draft. Listen before publishing.")
  .waitFor();
assert.ok((await page.locator(".studio-audio-version").count()) > 0);
await page
  .getByRole("button", { name: "Record my voice", exact: true })
  .click();
await page.getByRole("button", { name: "Stop", exact: true }).waitFor();
assert.ok(
  await library.getByRole("listitem").getByRole("button").first().isDisabled(),
);
await page.waitForFunction(() =>
  document
    .querySelector(".record-orb.recording")
    ?.parentElement?.innerText.includes("0:01"),
);
await page.getByRole("button", { name: "Stop", exact: true }).click();
await page.getByText("Preview my recording", { exact: true }).waitFor();
await page.getByRole("button", { name: "Save draft", exact: true }).click();
await page
  .getByRole("status")
  .getByText("Audio saved as a draft. Listen before publishing.")
  .waitFor();
const persisted = (
  await (await context.request.get(base + "/api/audio")).json()
).assets;
assert.ok(
  persisted.filter((a) => a.question_id === edited.id && a.kind === "teacher")
    .length >= 2,
);
await page
  .getByLabel("Reading text / TTS script", { exact: true })
  .fill("Écoute bien. Combien font deux plus deux ?");
const pendingRequest = page.waitForRequest(
  (r) => r.url().endsWith("/api/audio/tts") && r.method() === "POST",
);
const pendingResponse = page.waitForResponse(
  (r) => r.url().endsWith("/api/audio/tts") && r.request().method() === "POST",
  { timeout: 120000 },
);
await page
  .getByRole("button", { name: "Regenerate TTS audio", exact: true })
  .click();
const generatedRequest = (await pendingRequest).postDataJSON();
assert.equal(generatedRequest.model, "@cf/myshell-ai/melotts");
assert.equal(generatedRequest.regenerate, true);
assert.notEqual(generatedRequest.question_id, edited.id);
const generatedResponse = await pendingResponse;
assert.equal(generatedResponse.status(), 200, await generatedResponse.text());
await page
  .getByRole("status")
  .getByText("Speech generated. Listen to the audio, then publish it.")
  .waitFor();
const afterGeneration = (
  await (await context.request.get(base + "/api/questions")).json()
).questions.find((q) => q.id === generatedRequest.question_id);
assert.equal(
  afterGeneration.script,
  "Écoute bien. Combien font deux plus deux ?",
);
assert.equal(afterGeneration.version, 3);
const afterAudio = (
  await (await context.request.get(base + "/api/audio")).json()
).assets;
assert.ok(
  afterAudio.some(
    (a) =>
      a.question_id === generatedRequest.question_id &&
      a.model === "@cf/myshell-ai/melotts",
  ),
);
assert.ok(
  afterAudio.filter((a) => a.question_id === edited.id && a.kind === "teacher")
    .length >= 2,
);
assert.deepEqual(errors, []);
writeFileSync(
  "artifacts/studio-browser.json",
  JSON.stringify(
    {
      testedAt: new Date().toISOString(),
      fullList: true,
      searchAndFilters: true,
      immutableTextSave: true,
      modelSettingsPersisted: true,
      unsavedSwitchProtected: true,
      bilingual: true,
      audioUpload: true,
      microphoneRecording: true,
      savesEditedScriptBeforeGeneration: true,
      viewports: [1440, 820, 390],
      errors,
    },
    null,
    2,
  ),
);
await browser.close();
console.log(
  "Studio layout, text/version save, model settings, filters, upload and bilingual responsive checks passed.",
);
