import { chromium, expect } from "@playwright/test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
const base = process.env.BASE_URL || "http://localhost:8795";
const resources = Object.fromEntries(
  ["fr", "en", "es", "zh"].map((l) => [
    l,
    JSON.parse(readFileSync(`src/locales/${l}.json`, "utf8")),
  ]),
);
const browser = await chromium.launch({ headless: true }),
  errors = [];
const q = {
  id: "native-fr",
  logical_id: "native-fr",
  grade: 1,
  locale: "fr-CA",
  module: "skill.number_sense",
  title: "Écouter",
  prompt: "Compte les oiseaux. Combien y en a-t-il ?",
  script: "Compte les oiseaux. Combien y en a-t-il ?",
  response_type: "qcm",
  options: ["Un oiseau", "Deux oiseaux"],
  answer: "Deux oiseaux",
  explanation: "Il y a deux oiseaux.",
  preparation: "Préparer deux images.",
  teacher_notes: "Texte original — à conserver.",
  status: "published",
  text_policy: "full",
  version: 1,
  source: "Native fixture",
};
const eq = {
  ...q,
  id: "native-en",
  logical_id: "native-en",
  locale: "en-CA",
  title: "English birds",
  prompt: "Count the birds. How many are there?",
  script: "Count the birds. How many are there?",
  options: ["One bird", "Two birds"],
  answer: "Two birds",
  explanation: "There are two birds.",
};
async function context(role) {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await c.addInitScript(() => {
    if (!localStorage.getItem("entryexam.ui-language"))
      localStorage.setItem("entryexam.ui-language", "fr");
  });
  const page = await c.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/api/**", async (route) => {
    const path = new URL(route.request().url()).pathname;
    let body = {};
    let status = 200;
    const user = {
      id: "fixture-" + role,
      role,
      email: role + "@example.com",
      name: "Original user name",
    };
    if (path === "/api/auth/me") {
      body = { user };
      if (role === "guest") status = 401;
    } else if (path === "/api/bootstrap")
      body = {
        user,
        learner: role === "student" ? { id: "learner", grade: 1 } : null,
        classes: [],
        assignments: [],
        classrooms: [],
        children: [],
        staff: role === "teacher" || role === "admin",
        ttsConfigured: false,
      };
    else if (path === "/api/questions") body = { questions: [q, eq] };
    else if (path === "/api/audio") body = { assets: [] };
    else if (path === "/api/roster") body = { students: [], teachers: [] };
    else if (path === "/api/audio/settings")
      body = {
        settings: [],
        models: [
          {
            id: "xai/grok-tts",
            label: "Grok TTS",
            voices: ["ara"],
            defaultVoice: "ara",
          },
        ],
      };
    else if (path === "/api/attempts") body = { attempts: [] };
    else if (path === "/api/runs") body = { runs: [] };
    else if (path === "/api/organization") body = { organization: null };
    else if (path === "/api/auth/login") {
      status = 401;
      body = { error: "Identifiants incorrects." };
    } else if (path === "/api/auth/verify-email") {
      status = 400;
      body = { error: "email.passwordMismatch" };
    }
    return route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
  return { c, page };
}
async function switchTo(page, lang) {
  await page.locator(".language-picker select").first().selectOption(lang);
  await expect
    .poll(() => page.locator("html").getAttribute("lang"))
    .toBe({ fr: "fr-CA", en: "en-CA", es: "es", zh: "zh-CN" }[lang]);
}
const { c: gc, page: gp } = await context("guest");
for (const path of [
  "/",
  "/signup",
  "/login",
  "/forgot-password",
  "/verify-email#token=fixture-token",
]) {
  await gp.goto(base + path);
  for (const lang of ["es", "zh", "en", "fr"]) {
    await switchTo(gp, lang);
    const d = resources[lang];
    const key =
      path === "/"
        ? "marketing.hero.title"
        : path === "/signup"
          ? "Bienvenue dans l’atelier"
          : path === "/login"
            ? "Heureux de vous retrouver"
            : path === "/forgot-password"
              ? "email.forgotTitle"
              : "email.verifyTitle";
    await gp.getByRole("heading", { name: d[key], exact: true }).waitFor();
    if (path === "/signup") {
      await gp.getByText(d["signup.teacher"], { exact: true }).waitFor();
      await gp
        .getByRole("link", { name: d["auth.google"], exact: true })
        .waitFor();
    }
  }
}
await gp.goto(base + "/login");
await gp.locator("[name=email]").fill("unknown@example.com");
await gp.locator("[name=password]").fill("wrong");
await gp.locator("form button[type=submit],form button.btn").click();
for (const lang of ["es", "zh"]) {
  await switchTo(gp, lang);
  await gp
    .getByRole("alert")
    .getByText(resources[lang]["Identifiants incorrects."], { exact: true })
    .waitFor();
}
await gp.goto(base + "/signup");
await switchTo(gp, "zh");
await gp.reload();
await gp
  .getByRole("heading", {
    name: resources.zh["Bienvenue dans l’atelier"],
    exact: true,
  })
  .waitFor();
await gp.setViewportSize({ width: 390, height: 844 });
assert.equal(
  await gp.evaluate(() => document.documentElement.scrollWidth > innerWidth),
  false,
);
await gp.screenshot({ path: "artifacts/signup-zh-mobile.png", fullPage: true });
await gc.close();
for (const role of ["admin", "teacher", "parent", "student"]) {
  const { c, page } = await context(role);
  await page.goto(
    base +
      (role === "parent"
        ? "/family"
        : role === "student"
          ? "/learn/practice"
          : "/org/main/manage/bank"),
  );
  const key =
    role === "parent"
      ? "Le coin des parents"
      : role === "student"
        ? "Un monde à explorer"
        : "Banque d’exercices";
  for (const lang of ["es", "zh", "en", "fr"]) {
    await switchTo(page, lang);
    await page
      .getByRole("heading", { name: resources[lang][key], exact: true })
      .waitFor();
  }
  if (role === "student") {
    await page.getByRole("heading", { name: q.title, exact: true }).waitFor();
    const contentSelect = page
      .locator(".filters select")
      .filter({ has: page.locator('option[value="en-CA"]') });
    const languageSelect = page
      .locator("select")
      .filter({ has: page.locator('option[value="en-CA"]') })
      .first();
    await languageSelect.selectOption("en-CA");
    for (const lang of ["es", "zh", "en", "fr"]) {
      await switchTo(page, lang);
      assert.equal(await languageSelect.inputValue(), "en-CA");
      await page
        .getByRole("heading", { name: eq.title, exact: true })
        .waitFor();
    }
    await languageSelect.selectOption("fr-CA");
    await page.locator(".exercise-card").filter({ hasText: q.title }).click();
    for (const lang of ["es", "zh", "en", "fr"]) {
      await switchTo(page, lang);
      assert.equal(
        await page.locator(".question-prompt").innerText(),
        q.prompt,
      );
      await page.getByText("Un oiseau", { exact: true }).waitFor();
      await page.getByText("Deux oiseaux", { exact: true }).waitFor();
      await page.getByRole("heading", { name: q.title, exact: true }).waitFor();
      await page
        .getByRole("button", {
          name: resources[lang]["Valider ma réponse"],
          exact: true,
        })
        .waitFor();
    }
  }
  if (role === "teacher" || role === "admin") {
    await page
      .getByRole("button", { name: resources.fr["action.create"], exact: true })
      .click();
    for (const lang of ["es", "zh", "en", "fr"]) {
      await switchTo(page, lang);
      await page
        .getByText(resources[lang]["Texte à lire / script TTS"], {
          exact: true,
        })
        .waitFor();
    }
  }
  if (role === "teacher" || role === "admin") {
    for (const [tab, key] of [
      ["roster", "Élèves et classes"],
      ["class", "Classe en direct"],
      ["studio", "Studio d’enregistrement"],
      ["homework", "Devoirs et corrections"],
      ["reports", "Rapports d’apprentissage"],
      ["settings", "Mon compte"],
    ]) {
      await page.goto(base + "/org/main/manage/" + tab);
      for (const lang of ["es", "zh", "en", "fr"]) {
        await switchTo(page, lang);
        await page
          .getByRole("heading", { name: resources[lang][key], exact: true })
          .waitFor();
        if (tab === "studio") {
          assert.equal(
            await page.locator(".studio-script-input").inputValue(),
            q.script,
          );
        }
        if (tab === "settings" && role === "teacher") {
          await page
            .getByRole("heading", {
              name: resources[lang]["org.title"],
              exact: true,
            })
            .waitFor();
        }
      }
    }
  }
  await switchTo(page, "zh");
  await page.screenshot({
    path: `artifacts/i18n-${role}-four-languages.png`,
    fullPage: true,
  });
  await c.close();
}
assert.deepEqual(errors, []);
await browser.close();
writeFileSync(
  "artifacts/i18n-four-languages-validation.json",
  JSON.stringify(
    {
      languages: ["fr", "en", "es", "zh"],
      roles: ["guest", "admin", "teacher", "parent", "student"],
      errors,
      questionContentPreserved: true,
      contentLanguagePreserved: true,
      uiPreferencePersists: true,
    },
    null,
    2,
  ),
);
console.log(
  "Four-language browser validation passed: public/auth pages, all roles, errors, open dialogs, preference persistence, and unchanged native question content.",
);
