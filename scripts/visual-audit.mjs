import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, mkdirSync } from "node:fs";
mkdirSync("tests/evidence", { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const cases = [];
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const route of [
    "home",
    "chat",
    "explore",
    "templates",
    "create",
    "research",
    "voice",
    "live",
    "automate",
    "library",
    "settings",
    "design",
  ]) {
    await page.goto("http://localhost:5173/#/" + route);
    await page.waitForTimeout(1000);
    await page.evaluate(() => document.fonts.ready);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    cases.push({
      route,
      width,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      violations: axe.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    await page.screenshot({
      path: `tests/evidence/${route}-${width}.png`,
      fullPage: true,
    });
  }
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://localhost:5173/#/design");
await page.getByRole("tab", { name: "Motion Lab", exact: true }).click();
await page.waitForTimeout(1000);
await page.screenshot({
  path: "tests/evidence/motion-lab-1440.png",
  fullPage: true,
});
const timing = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const intervals = [];
      let previous = performance.now();
      function tick(now) {
        intervals.push(now - previous);
        previous = now;
        if (intervals.length < 120) requestAnimationFrame(tick);
        else {
          const sorted = intervals.slice(1).sort((a, b) => a - b);
          resolve({
            sampleFrames: sorted.length,
            medianMs: sorted[Math.floor(sorted.length * 0.5)],
            p95Ms: sorted[Math.floor(sorted.length * 0.95)],
            maxMs: Math.max(...sorted),
            devicePixelRatio,
            viewport: { width: innerWidth, height: innerHeight },
            heapBytes: performance.memory?.usedJSHeapSize ?? null,
          });
        }
      }
      requestAnimationFrame(tick);
    }),
);
for (const width of [320, 390, 768]) {
  await page.setViewportSize({ width, height: 900 });
  await page.waitForTimeout(300);
  cases.push({
    route: "motion-lab",
    width,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
  });
  await page.screenshot({
    path: `tests/evidence/motion-lab-${width}.png`,
    fullPage: true,
  });
}
writeFileSync(
  "tests/evidence/visual-audit.json",
  JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      browser: await browser.version(),
      conditions:
        "Headless system Chromium in Linux container; simulated viewports, not physical devices; rAF intervals are a limited timing sample, not proof of sustained 60 FPS.",
      cases,
      errors,
      kineticTiming: timing,
    },
    null,
    2,
  ),
);
console.log(
  JSON.stringify(
    {
      cases: cases.length,
      overflow: cases.filter((c) => c.overflow).map((c) => [c.route, c.width]),
      violations: cases
        .filter((c) => c.violations?.length)
        .map((c) => ({
          route: c.route,
          width: c.width,
          violations: c.violations,
        })),
      errors,
      timing,
    },
    null,
    2,
  ),
);
await browser.close();
