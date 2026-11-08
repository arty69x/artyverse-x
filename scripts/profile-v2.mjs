import { chromium } from "@playwright/test";
import { writeFileSync } from "node:fs";
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const c = await b.newContext({ viewport: { width: 1440, height: 1000 } }),
  p = await c.newPage();
await p.addInitScript(() => {
  window.__tasks = [];
  if (PerformanceObserver.supportedEntryTypes.includes("longtask"))
    new PerformanceObserver((l) =>
      window.__tasks.push(
        ...l
          .getEntries()
          .map((e) => ({ start: e.startTime, duration: e.duration })),
      ),
    ).observe({ type: "longtask", buffered: true });
});
try {
  await p.goto(
    (process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4315") +
      "/#/dynamics",
  );
  const body = p.locator('[data-body="arty"]');
  await body.waitFor();
  const box = await body.boundingBox();
  if (!box) throw Error("Body not rendered");
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width / 2 + 90, box.y + box.height / 2 + 30, {
    steps: 15,
  });
  await p.mouse.up();
  const result = await p.evaluate(
    () =>
      new Promise((resolve) => {
        const began = performance.now(),
          samples = [];
        let last = began;
        function tick(now) {
          samples.push(now - last);
          last = now;
          if (samples.length < 180) requestAnimationFrame(tick);
          else {
            const sorted = samples.slice(1).sort((a, b) => a - b);
            resolve({
              samples: sorted.length,
              medianMs: sorted[Math.floor(sorted.length * 0.5)],
              p95Ms: sorted[Math.floor(sorted.length * 0.95)],
              maxMs: Math.max(...sorted),
              longTasks: window.__tasks.filter((t) => t.start >= began),
              heapBytes: performance.memory?.usedJSHeapSize ?? null,
              dpr: devicePixelRatio,
            });
          }
        }
        requestAnimationFrame(tick);
      }),
  );
  writeFileSync(
    "tests/evidence/v2/performance-sample.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        conditions:
          "Isolated built-app headless Chromium at 1440×1000 / DPR1. SVG body dragged 90×30 viewport px, then 179 rAF intervals during spring settling. WebGL off. No axe/screenshot workload during sample. Scheduler intervals are not a GPU or real-device FPS guarantee.",
        browser: b.version(),
        ...result,
      },
      null,
      2,
    ),
  );
  console.log(result);
} finally {
  await b.close();
}
