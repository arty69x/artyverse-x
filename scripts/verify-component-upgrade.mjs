import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, mkdirSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:5320",
  out = "tests/evidence/component-upgrade";
mkdirSync(out, { recursive: true });
const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  c = await b.newContext();
await c.addInitScript(() => {
  if (window.top !== window) return;
  localStorage.setItem("av-motion", "Off");
});
const p = await c.newPage(),
  cases = [],
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
try {
  for (const width of [320, 360, 390, 768, 1024, 1280, 1440, 1536])
    for (const screen of ["home", "copilot", "studio", "builder"]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base + "/#/concept/" + screen);
      await p
        .locator(screen === "builder" ? ".ax-builder" : ".cp-root")
        .waitFor();
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(180);
      const audit = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const result = {
        screen,
        width,
        heroTextClipped:
          screen === "home"
            ? await p.locator(".cp-hero-copy h2").evaluate((el) => {
                const hero = el
                  .closest(".cp-home-hero")
                  .getBoundingClientRect();
                return [...el.querySelectorAll("strong,em")].some((word) => {
                  const range = document.createRange();
                  range.selectNodeContents(word);
                  return range.getBoundingClientRect().right > hero.right - 6;
                });
              })
            : false,
        overflow: await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        violations: audit.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      };
      cases.push(result);
      await p.screenshot({
        path: `${out}/${screen}-${width}.png`,
        fullPage: true,
      });
      console.log(JSON.stringify(result));
    }
  writeFileSync(
    out + "/visual-checks.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        base,
        browser: b.version(),
        cases,
        errors,
      },
      null,
      2,
    ),
  );
  if (
    errors.length ||
    cases.some((c) => c.overflow || c.heroTextClipped || c.violations.length)
  )
    throw Error("Component upgrade visual defects");
} finally {
  await b.close();
}
