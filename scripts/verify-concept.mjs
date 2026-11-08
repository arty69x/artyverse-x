import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const dir = "tests/evidence/concept";
mkdirSync(dir, { recursive: true });
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:5320";
const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  c = await b.newContext();
await c.addInitScript(() => localStorage.setItem("av-motion", "Off"));
const p = await c.newPage(),
  cases = [],
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
try {
  for (const width of [320, 360, 390, 768, 1024, 1280, 1440, 1536])
    for (const screen of ["home", "copilot", "studio"]) {
      await p.setViewportSize({ width, height: 1000 });
      await p.goto(base + "/#/concept/" + screen);
      await p.locator(".cp-root").waitFor();
      await p.evaluate(() => document.fonts.ready);
      await p.waitForTimeout(150);
      const a = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const result = {
        width,
        screen,
        heroTextClipped:
          screen === "home"
            ? await p.locator(".cp-hero-copy h2 em").evaluate((el) => {
                const range = document.createRange();
                range.selectNodeContents(el);
                return (
                  range.getBoundingClientRect().right >
                  el.closest(".cp-home-hero").getBoundingClientRect().right - 8
                );
              })
            : false,
        violations: a.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        overflow: await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
      };
      cases.push(result);
      await p.screenshot({
        path: `${dir}/${screen}-${width}.png`,
        fullPage: true,
      });
      console.log(JSON.stringify(result));
    }
  writeFileSync(
    dir + "/visual-checks.json",
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
    throw Error("Concept visual checks failed");
} finally {
  await b.close();
}
