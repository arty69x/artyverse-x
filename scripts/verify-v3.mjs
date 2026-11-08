import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4318",
  out = "tests/evidence/v3";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const context = await browser.newContext(),
  page = await context.newPage(),
  errors = [],
  cases = [],
  layouts = [];
page.on("pageerror", (e) => errors.push(e.message));
const routes = [
  "home",
  "projects",
  "copilot",
  "practice",
  "questions",
  "marketplace",
  "analytics",
  "design-system",
  "code",
  "create",
  "research",
  "chat",
  "voice",
  "live",
  "automate",
  "library",
  "settings",
  "design",
  "agents",
  "sound",
  "dynamics",
  "story",
  "system",
  "templates",
  "explore",
];
try {
  await page.goto(base);
  for (const theme of ["dark", "light"]) {
    await page.evaluate((t) => {
      localStorage.setItem("artyverse-theme", t);
      localStorage.setItem("av-locale", "en");
    }, theme);
    await page.reload();
    await page.evaluate(() => document.fonts.ready);
    for (const route of routes) {
      await page.setViewportSize({ width: 1440, height: 1000 });
      await page.goto(base + "/#/" + route);
      await page.getByRole("main").waitFor();
      await page.waitForTimeout(150);
      const a = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const violations = a.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        );
      cases.push({ theme, route, viewport: 1440, violations, overflow });
      if (violations.length || overflow)
        console.log("FINDING", JSON.stringify(cases.at(-1)));
      if (
        [
          "home",
          "projects",
          "copilot",
          "marketplace",
          "code",
          "sound",
          "design-system",
          "analytics",
        ].includes(route)
      )
        await page.screenshot({
          path: `${out}/${route}-${theme}-1440.png`,
          fullPage: true,
        });
    }
  }
  await page.evaluate(() => {
    localStorage.setItem("artyverse-theme", "dark");
    localStorage.setItem("av-locale", "th");
  });
  await page.reload();
  await page.evaluate(() => document.fonts.ready);
  for (const width of [320, 390, 640, 768, 820, 1024, 1280, 1440, 1536]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "home",
      "projects",
      "copilot",
      "practice",
      "questions",
      "marketplace",
      "analytics",
      "design-system",
      "code",
      "sound",
      "story",
      "dynamics",
      "automate",
      "create",
      "library",
    ]) {
      await page.goto(base + "/#/" + route);
      await page.waitForTimeout(120);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      layouts.push({ route, width, overflow });
      if (overflow) console.log("OVERFLOW", width, route);
      if (
        width === 390 &&
        [
          "home",
          "projects",
          "copilot",
          "code",
          "marketplace",
          "design-system",
        ].includes(route)
      )
        await page.screenshot({
          path: `${out}/${route}-dark-th-390.png`,
          fullPage: true,
        });
      if (width === 820 && route === "home")
        await page.screenshot({
          path: `${out}/home-dark-th-820.png`,
          fullPage: true,
        });
    }
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(base + "/#/copilot");
  await page.getByRole("button", { name: "เปิดพื้นที่คำตอบ" }).click();
  const modalAxe = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const mobileSheetViolations = modalAxe.violations.map((v) => ({
    id: v.id,
    targets: v.nodes.map((n) => n.target),
  }));
  await page.screenshot({
    path: `${out}/copilot-answer-sheet-390.png`,
    fullPage: true,
  });
  await page.keyboard.press("Escape");
  await page.goto(base + "/#/home");
  await page.evaluate(() => document.fonts.ready);
  const mascot = page.locator(".v3-hero-character .v3-arcyca");
  const svg = await mascot.evaluate((e) => {
    const c = e.cloneNode(true);
    c.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    c.setAttribute("width", "440");
    c.setAttribute("height", "440");
    c.removeAttribute("style");
    return new XMLSerializer().serializeToString(c);
  });
  if (!existsSync("public/assets/arcyca-idle.svg"))
    writeFileSync("public/assets/arcyca-idle.svg", svg + "\n");
  const result = {
    timestamp: new Date().toISOString(),
    baseURL: base,
    browser: browser.version(),
    conditions:
      "Built local app via npm start, isolated data; default states at 1440 in both themes; Thai responsive viewports with loaded fonts; headless simulation, not real devices.",
    cases,
    layouts,
    mobileSheetViolations,
    errors,
  };
  writeFileSync(out + "/visual-audit.json", JSON.stringify(result, null, 2));
  console.log(
    JSON.stringify(
      {
        cases: cases.length,
        layoutCases: layouts.length,
        failedCases: cases.filter((c) => c.overflow || c.violations.length),
        overflows: layouts.filter((c) => c.overflow),
        mobileSheetViolations,
        errors,
      },
      null,
      2,
    ),
  );
  if (
    errors.length ||
    cases.some((c) => c.overflow || c.violations.length) ||
    layouts.some((c) => c.overflow) ||
    mobileSheetViolations.length
  )
    throw Error("V3 audit found defects");
} finally {
  await browser.close();
}
