import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, writeFileSync } from "node:fs";
const file = "tests/evidence/v3/visual-audit.json",
  report = JSON.parse(readFileSync(file, "utf8")),
  base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4318";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const results = [];
try {
  for (const theme of ["dark", "light"])
    for (const width of [390, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: 1000 },
      });
      await context.addInitScript((t) => {
        localStorage.setItem("artyverse-theme", t);
        localStorage.setItem("av-locale", "th");
      }, theme);
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(base + "/#/home");
      await page.evaluate(() => document.fonts.ready);
      await page.locator('.v3-stat-grid[aria-busy="false"]').waitFor();
      if ((await page.locator("html").getAttribute("data-theme")) !== theme)
        throw Error("Wrong theme");
      const audit = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const result = {
        theme,
        width,
        route: "home",
        checkedAt: new Date().toISOString(),
        violations: audit.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        overflow: await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        errors,
      };
      results.push(result);
      await page.screenshot({
        path: `tests/evidence/v3/home-${theme}-th-${width}.png`,
        fullPage: true,
      });
      await context.close();
    }
  report.finalHomeCases = results;
  report.finalHomeConditions =
    "Built final runtime: Thai Home in both themes at 390 and 1440; waiting for real data and fonts. Followup after early-render loading, accessible-name and delivery optimizations. Prior full-route and responsive surveys retained with their own timestamps.";
  writeFileSync(file, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(results, null, 2));
  if (results.some((r) => r.violations.length || r.overflow || r.errors.length))
    throw Error("Home audit failed");
} finally {
  await browser.close();
}
