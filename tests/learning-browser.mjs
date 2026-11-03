import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8795";
const browser = await chromium.launch({
  headless: true,
  args: ["--autoplay-policy=no-user-gesture-required"],
});
const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  }),
  admin = await browser.newContext();
const stamp = Date.now(),
  email = `keyboard-${stamp}@example.com`;
async function api(ctx, path, body, method) {
  const r = await ctx.request.fetch(base + "/api" + path, {
    method: method || (body === undefined ? "GET" : "POST"),
    data: body,
  });
  assert.equal(r.status(), 200, path + ": " + (await r.text()));
  return r.json();
}
await api(admin, "/auth/login", {
  email: "admin@gmail.com",
  password: process.env.ADMIN_PASSWORD || "Admin1234",
});
await api(context, "/auth/register", {
  email,
  name: "Keyboard",
  password: "Testing12345",
  grade: 2,
});
const learner = (await api(context, "/bootstrap")).learner.id;
const seeds = (await api(admin, "/questions")).questions;
const ids = [];
for (let i = 1; i <= 2; i++) {
  const q = seeds.find((q) => q.id === `practice-${i}-en-CA`);
  ids.push(
    (
      await api(admin, "/questions", {
        ...q,
        id: undefined,
        grade: 2,
        title: `KeyboardQA ${stamp} ${i}`,
        script: "How many? " + i,
        answer: "7",
        explanation: "The answer is seven.",
        status: "published",
      })
    ).id,
  );
}
const ordered = (await api(admin, "/questions")).questions.filter((q) =>
  ids.includes(q.id),
);
ids.splice(0, ids.length, ...ordered.map((q) => q.id));
const firstTitle = ordered[0].title,
  secondTitle = ordered[1].title;
const cls = await api(admin, "/classes", {
  name: "Keyboard " + stamp,
  grade: 2,
  locale: "en-CA",
  teacher_id: (await api(admin, "/auth/me")).user.id,
});
await api(admin, "/enrollments", { class_id: cls.id, learner_id: learner });
const hw = await api(admin, "/assignments", {
  class_id: cls.id,
  title: "Keyboard homework " + stamp,
  due_at: "2026-12-10",
  question_ids: ids,
});
// A real WAV teacher asset provides deterministic playback and precedence over TTS.
const wav = Buffer.alloc(16044);
wav.write("RIFF");
wav.writeUInt32LE(16036, 4);
wav.write("WAVEfmt ", 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(8000, 24);
wav.writeUInt32LE(16000, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write("data", 36);
wav.writeUInt32LE(16000, 40);
const up = await admin.request.post(
  base + "/api/audio/upload?question=" + ids[0],
  { headers: { "Content-Type": "audio/wav" }, data: wav },
);
assert.equal(up.status(), 200);
const asset = await up.json();
await api(admin, "/audio/" + asset.id + "/publish", {});
const page = await context.newPage(),
  errors = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
await page.goto(base + "/learn");
await page.locator(".student-header-nav").waitFor();
assert.equal(await page.locator(".student-nav").count(), 0);
assert.equal(
  await page.locator(".topbar .student-header-nav button").count(),
  3,
);
for (const width of [320, 390, 820, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Dashboard overflow " + width,
  );
  const box = await page.locator(".topbar").boundingBox();
  assert.ok(box.height <= 56);
  await page.screenshot({
    path: `artifacts/learn-${width}.png`,
    fullPage: true,
  });
}
await page.getByRole("button", { name: "Practice", exact: true }).click();
await page.locator(".filters .search input").fill("KeyboardQA " + stamp);
await page.getByRole("button", { name: new RegExp(firstTitle) }).click();
const answer = page.getByRole("textbox", { name: "Your answer", exact: true });
await answer.waitFor();
await expect(answer).toBeFocused();
for (const width of [320, 390, 820, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Practice overflow " + width,
  );
  await page.screenshot({
    path: `artifacts/practice-${width}.png`,
    fullPage: true,
  });
}
assert.equal(await page.locator(".question-audio-popover").count(), 0);
await page.getByRole("button", { name: "Audio and reading help" }).click();
await page
  .getByText("Read the instructions at your own pace", { exact: true })
  .waitFor();
await page.getByRole("button", { name: "Close", exact: true }).click();
const teacherResponse = page.waitForResponse((r) =>
  r.url().endsWith("/questions/" + ids[0] + "/audio"),
);
await page.getByRole("checkbox", { name: "Auto-play audio" }).check();
assert.equal((await (await teacherResponse).json()).id, asset.id);
await answer.focus();
await page.keyboard.type("7");
const submitBox = await page
  .getByRole("button", { name: "Submit my answer" })
  .boundingBox();
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: "Great job!" }).waitFor();
const cont = page.getByRole("button", { name: "Continue", exact: true });
await cont.waitFor();
await expect(cont).toBeFocused();
const continueBox = await cont.boundingBox();
assert.ok(
  Math.abs(submitBox.x + submitBox.width - continueBox.x - continueBox.width) <
    2,
  "Submit and Continue right aligned",
);
// The next question has no teacher audio: automatic resolution must generate real TTS.
const ttsResponse = page.waitForResponse(
  (r) => r.url().endsWith("/questions/" + ids[1] + "/audio"),
  { timeout: 120000 },
);
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: secondTitle }).waitFor();
await expect(answer).toBeFocused();
const tr = await ttsResponse;
assert.equal(tr.status(), 200, await tr.text());
const tts = await tr.json();
assert.equal(tts.kind, "tts");
const file = await context.request.get(base + tts.url);
assert.equal(file.status(), 200);
assert.ok((await file.body()).length > 100);
const duration = await page.evaluate(async (url) => {
  const a = new AudioContext();
  const data = await (await fetch(url)).arrayBuffer();
  const decoded = await a.decodeAudioData(data);
  await a.close();
  return decoded.duration;
}, tts.url);
assert.ok(duration > 0);
await page.getByRole("checkbox", { name: "Auto-play audio" }).uncheck();
await answer.focus();
await page.keyboard.type("7");
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: "Great job!" }).waitFor();
await page.keyboard.press("Enter");
await page.locator(".filters .search input").fill("KeyboardQA " + stamp);
await page.getByRole("button", { name: "Start exam (2)", exact: true }).click();
await page.locator(".assessment-question").waitFor();
await answer.fill("99");
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: secondTitle }).waitFor();
assert.equal(await page.locator(".assessment-summary,.feedback").count(), 0);
await answer.fill("7");
await page.getByRole("button", { name: "Previous", exact: true }).click();
await expect(answer).toHaveValue("99");
await expect(answer).toBeFocused();
await answer.fill("7");
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: secondTitle }).waitFor();
await expect(answer).toBeFocused();
await page.keyboard.press("Enter");
await page
  .getByRole("dialog")
  .getByRole("button", { name: "Submit", exact: true })
  .click();
await page.getByRole("heading", { name: "Results", exact: true }).waitFor();
assert.equal(
  await page
    .locator(
      ".assessment-question input:not([type=checkbox]),.assessment-question textarea",
    )
    .count(),
  0,
);
await page.getByText("4 / 4", { exact: true }).waitFor();
await page
  .getByRole("heading", { name: "Reference answer:", exact: true })
  .waitFor();
await page.screenshot({ path: "artifacts/exam-results.png", fullPage: true });
await page.getByRole("button", { name: "Back to my workspace" }).click();
await page.getByRole("button", { name: "My homework", exact: true }).click();
await page
  .locator(".homework-card")
  .filter({ hasText: hw.title })
  .getByRole("button")
  .click();
await answer.fill("7");
await page.keyboard.press("Enter");
await page.getByRole("heading", { name: secondTitle }).waitFor();
await expect(answer).toBeFocused();
await answer.fill("7");
await page.keyboard.press("Enter");
await page
  .getByRole("heading", { name: "Homework submitted", exact: true })
  .waitFor();
assert.equal(
  await page.getByText("Reference answer:", { exact: true }).count(),
  0,
);
assert.equal(await page.getByText("4 / 4", { exact: true }).count(), 0);
await page.screenshot({
  path: "artifacts/homework-submitted.png",
  fullPage: true,
});
await page
  .getByRole("combobox", { name: "Interface language", exact: true })
  .selectOption("fr");
await page
  .getByRole("heading", { name: "Devoir remis", exact: true })
  .waitFor();
for (const width of [320, 390, 820]) {
  await page.setViewportSize({ width, height: 1000 });
  assert.ok(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
    "Paper overflow " + width,
  );
  await page.screenshot({
    path: `artifacts/homework-${width}.png`,
    fullPage: true,
  });
}
const homeworkAttempts = (await api(admin, "/attempts")).attempts.filter(
  (a) => a.context_id === hw.id,
);
for (const attempt of homeworkAttempts)
  await api(admin, "/attempts/" + attempt.id + "/grade", {
    status: "correct",
    feedback: "Reviewed by teacher",
  });
await page.reload();
await page
  .getByRole("combobox", { name: "Interface language", exact: true })
  .selectOption("fr");
await page
  .locator(".homework-card")
  .filter({ hasText: hw.title })
  .getByRole("button")
  .click();
await page.getByRole("heading", { name: "Résultats", exact: true }).waitFor();
await page.getByText("4 / 4", { exact: true }).waitFor();
assert.equal(
  await page.locator(".assessment-question .question-response").count(),
  0,
);
await page.screenshot({
  path: "artifacts/homework-marked.png",
  fullPage: true,
});
assert.deepEqual(errors, []);
console.log(
  "Learning browser passed: unified header, responsive layouts, keyboard-only practice, teacher audio/TTS autoplay, editable exam drafts, locked results and hidden homework marks.",
);
await browser.close();
