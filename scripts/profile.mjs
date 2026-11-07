import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "node:fs";
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
await page.goto("http://localhost:5173/#/design");
await page.getByRole("tab", { name: "Motion Lab", exact: true }).click();
await page.waitForTimeout(1000);
const timing = await page.evaluate(
  () =>
    new Promise((resolve) => {
      const intervals = [];
      let last = performance.now();
      const tick = (now) => {
        intervals.push(now - last);
        last = now;
        if (intervals.length < 180) requestAnimationFrame(tick);
        else {
          const sorted = intervals.slice(1).sort((a, b) => a - b);
          resolve({
            frames: sorted.length,
            medianMs: sorted[Math.floor(sorted.length * 0.5)],
            p95Ms: sorted[Math.floor(sorted.length * 0.95)],
            maxMs: Math.max(...sorted),
            dpr: devicePixelRatio,
            heapBytes: performance.memory?.usedJSHeapSize ?? null,
          });
        }
      };
      requestAnimationFrame(tick);
    }),
);
const existing = JSON.parse(
  readFileSync("tests/evidence/visual-audit.json", "utf8"),
);
existing.kineticTimingFollowup = {
  timestamp: new Date().toISOString(),
  conditions:
    "Targeted headless Chromium sampling; see rAF intervals, no sustained FPS guarantee.",
  ...timing,
};
writeFileSync(
  "tests/evidence/visual-audit.json",
  JSON.stringify(existing, null, 2),
);
console.log(timing);
await browser.close();
