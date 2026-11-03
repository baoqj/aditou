import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
const base = process.env.BASE_URL || "http://localhost:8796",
  local = new URL(base).hostname === "localhost";
const browser = await chromium.launch({ headless: true }),
  ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
if (local) {
  const r = await ctx.request.post(base + "/api/auth/register", {
    data: {
      email: `content-browser-${Date.now()}@example.com`,
      password: "Testing12345",
      name: "Content",
      grade: 1,
    },
  });
  assert.equal(r.status(), 200);
} else {
  const r = await ctx.request.post(base + "/api/auth/login", {
    data: {
      email: "student@gmail.com",
      password: process.env.STUDENT_PASSWORD || "Student1234",
    },
  });
  assert.equal(r.status(), 200);
}
await ctx.addInitScript(() =>
  localStorage.setItem("entryexam.ui-language", "en"),
);
const p = await ctx.newPage(),
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
for (const grade of [1, 2, 3, 4])
  for (const locale of ["en-CA", "fr-CA"]) {
    await p.goto(base + "/learn/practice");
    await p
      .getByRole("combobox", { name: "Grade", exact: true })
      .selectOption(String(grade));
    await p
      .getByRole("combobox", { name: "Language", exact: true })
      .selectOption(locale);
    await p.getByRole("textbox", { name: "Search exercises" }).fill("Q24");
    const card = p.locator(".exercise-card");
    await expect(card).toHaveCount(1);
    await card.click();
    await p.locator(".player-card").waitFor();
    await expect(
      p.getByRole("textbox", { name: "Your answer", exact: true }),
    ).toBeFocused();
    await p.getByRole("heading", { name: /Q24/ }).waitFor();
  }
await p.goto(base + "/learn/practice");
await p.getByRole("combobox", { name: "Grade", exact: true }).selectOption("4");
await p.getByRole("textbox", { name: "Search exercises" }).fill("Q09");
await p.locator(".exercise-card").click();
await expect(p.locator(".question-prompt")).toContainText("Reading passage R1");
await expect(p.locator(".question-prompt")).toContainText("Inès counts");
for (const width of [320, 390, 820, 1440]) {
  await p.setViewportSize({ width, height: 1000 });
  assert.ok(
    await p.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    "Reading overflow " + width,
  );
  await p.screenshot({
    path: `artifacts/exam-content-reading-${width}.png`,
    fullPage: true,
  });
}
await p.goto(base + "/learn/practice");
await p.getByRole("combobox", { name: "Grade", exact: true }).selectOption("1");
await p.getByRole("textbox", { name: "Search exercises" }).fill("Q22");
await p.locator(".exercise-card").click();
await expect(
  p.getByText(
    "An adult should say the separate sounds, or use a teacher recording.",
    { exact: true },
  ),
).toBeVisible();
await p.locator(".question-preparation summary").click();
await expect(p.locator(".question-preparation details p")).toContainText("/ʌ/");
await p
  .getByRole("combobox", { name: "Interface language" })
  .selectOption("fr");
await expect(
  p.getByText("Pour l’adulte · préparer cette activité", { exact: true }),
).toBeVisible();
await p.screenshot({
  path: "artifacts/exam-content-adult.png",
  fullPage: true,
});
assert.deepEqual(errors, []);
console.log(
  "Curriculum browser passed: all 4 entry grades × 2 languages, numeric focus, complete reading context, adult preparation and responsive layouts.",
);
await ctx.request.post(base + "/api/auth/logout", {data:{}});
await browser.close();
