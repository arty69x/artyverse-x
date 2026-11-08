import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync, mkdirSync, readFileSync, mkdtempSync } from "node:fs";
import { spawn, execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  initialComposition,
  initialPhysics,
  newStoryScene,
  freshGraph,
} from "../shared/v2/contracts.ts";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4315",
  out = "tests/evidence/v2";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const context = await browser.newContext(),
  page = await context.newPage();
const errors = [],
  cases = [];
page.on("pageerror", (e) => errors.push(e.message));
await page.addInitScript(() => {
  window.__longTasks = [];
  if (PerformanceObserver.supportedEntryTypes.includes("longtask"))
    new PerformanceObserver((list) =>
      window.__longTasks.push(
        ...list
          .getEntries()
          .map((e) => ({ start: e.startTime, duration: e.duration })),
      ),
    ).observe({ type: "longtask", buffered: true });
});
try {
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "home",
      "projects",
      "agents",
      "code",
      "sound",
      "dynamics",
      "story",
      "automate",
      "system",
    ]) {
      await page.goto(base + "/#/" + route);
      await page.waitForTimeout(280);
      const layout = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth,
      }));
      const a = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const violations = a.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      }));
      cases.push({ route, width, ...layout, violations });
      await page.screenshot({
        path: `${out}/${route}-${width}.png`,
        fullPage: true,
      });
      if (layout.scrollWidth > width + 1 || violations.length)
        throw Error("Visual/accessibility failure " + route + " " + width);
    }
  }
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.goto(base + "/#/home");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await page.screenshot({ path: `${out}/home-th-390.png`, fullPage: true });
  const thaiOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  );
  if (thaiOverflow) throw Error("Thai overflow");
  await page.getByRole("button", { name: "TH", exact: true }).click();
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(base + "/#/dynamics");
  await page.waitForTimeout(200);
  const timing = await page.evaluate(
    () =>
      new Promise((resolve) => {
        let last = performance.now();
        const values = [];
        function tick(now) {
          values.push(now - last);
          last = now;
          if (values.length < 120) requestAnimationFrame(tick);
          else {
            const s = values.slice(1).sort((a, b) => a - b);
            resolve({
              samples: s.length,
              medianMs: s[Math.floor(s.length * 0.5)],
              p95Ms: s[Math.floor(s.length * 0.95)],
              maxMs: Math.max(...s),
              dpr: devicePixelRatio,
              heapBytes: performance.memory?.usedJSHeapSize ?? null,
              longTasks: window.__longTasks,
            });
          }
        }
        requestAnimationFrame(tick);
      }),
  );
  await page.getByLabel("WebGL holographic light field").check();
  await page.waitForTimeout(300);
  const webgl = await page.evaluate(() => ({
    canvas: !!document.querySelector(".v2-physical-stage canvas"),
    fallback:
      document
        .querySelector(".v2-physical-stage")
        ?.textContent?.includes("unavailable") || false,
  }));
  await page.screenshot({
    path: `${out}/dynamics-webgl-1440.png`,
    fullPage: true,
  });
  await page.getByLabel("WebGL holographic light field").uncheck();
  // Built application → actual user artifact, without touching the development workspace DB.
  await page.goto(base + "/#/code");
  await page.getByLabel("Studio title").fill("Built V2 smoke artifact");
  await page.getByRole("button", { name: "Run preview", exact: true }).click();
  await page
    .frameLocator("iframe")
    .getByRole("button", { name: "A little spark" })
    .click();
  if (
    (await page.frameLocator("iframe").locator("em").textContent()) !==
    "possibility."
  )
    throw Error("Built interaction failed");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.waitForURL(/code\//);
  const codeId = page.url().split("/").at(-1);
  const call = async (path, data) => {
    const r = await context.request.fetch(base + "/api" + path, {
      method: data ? "POST" : "GET",
      data,
    });
    if (!r.ok()) throw Error(path + " " + r.status() + " " + (await r.text()));
    return r.json();
  };
  const project = await call("/items", {
    kind: "project",
    title: "Built restore project",
    data: {
      schemaVersion: 2,
      description: "Verification fixture",
      color: "#D7E317",
    },
  });
  const graph = freshGraph();
  graph.nodes[0].config.text = "Restore graph evidence";
  const created = [];
  for (const [kind, data] of [
    ["composition", initialComposition],
    ["scene", initialPhysics],
    ["story", { schemaVersion: 2, scenes: [newStoryScene()] }],
    ["workflow", { graph }],
  ])
    created.push(
      await call("/items", {
        kind,
        title: "Built restore " + kind,
        data: { ...data, projectId: project.id },
      }),
    );
  const code = (await call("/items")).find((i) => i.id === codeId);
  if (code.kind !== "code") throw Error("Missing saved code");
  const backup = await call("/backup");
  const child = spawn(
    process.execPath,
    ["--experimental-strip-types", "server/index.ts"],
    {
      env: {
        ...process.env,
        PORT: "4317",
        ARTYVERSE_DATA_DIR: mkdtempSync(join(tmpdir(), "av-v2-built-restore-")),
      },
      stdio: "ignore",
    },
  );
  let restored;
  try {
    for (let i = 0; i < 100; i++) {
      try {
        if (
          (await context.request.get("http://127.0.0.1:4317/api/status")).ok()
        )
          break;
      } catch {}
      await new Promise((r) => setTimeout(r, 50));
    }
    const result = await context.request.post(
      "http://127.0.0.1:4317/api/restore",
      { data: backup },
    );
    if (!result.ok())
      throw Error("V2 backup restore failed " + (await result.text()));
    restored = await result.json();
    const rows = await (
      await context.request.get("http://127.0.0.1:4317/api/items")
    ).json();
    for (const item of [project, code, ...created]) {
      const copy = rows.find((i) => i.id === item.id);
      if (!copy || JSON.stringify(copy.data) !== JSON.stringify(item.data))
        throw Error("Restored data mismatch " + item.kind);
    }
  } finally {
    child.kill();
  }
  const source = execFileSync("git", ["rev-parse", "HEAD"], {
    encoding: "utf8",
  }).trim();
  const result = {
    timestamp: new Date().toISOString(),
    sourceRevision: source,
    baseURL: base,
    conditions:
      "Built app via npm start, isolated SQLite. Linux headless Chromium; viewport simulation, not real devices. Default states only; no WCAG certification or sustained FPS claim.",
    browser: browser.version(),
    cases,
    thaiOverflow,
    errors,
    timing: {
      surface:
        "Dynamics default SVG physics, WebGL off, 1440×1000, 119 rAF intervals",
      ...timing,
    },
    webgl,
    builtSmoke: {
      codeId,
      actualInteraction: true,
      save: true,
      restoredKinds: [
        "project",
        "code",
        "composition",
        "scene",
        "story",
        "workflow",
      ],
      restoreResult: restored,
    },
  };
  writeFileSync(
    out + "/built-visual-audit.json",
    JSON.stringify(result, null, 2),
  );
  console.log(
    JSON.stringify(
      {
        cases: cases.length,
        errors,
        timing,
        webgl,
        builtSmoke: result.builtSmoke,
      },
      null,
      2,
    ),
  );
  if (errors.length) throw Error("Runtime errors recorded");
} finally {
  await browser.close();
}
