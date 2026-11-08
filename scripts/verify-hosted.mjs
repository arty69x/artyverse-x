import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdirSync, writeFileSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4320",
  out = "tests/evidence/deployment";
mkdirSync(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const checks = [],
  errors = [];
let context;
const check = (name, detail = {}) =>
  checks.push({ name, result: "passed", ...detail });
async function start() {
  const c = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  await c.addInitScript(() => localStorage.setItem("av-locale", "en"));
  const page = await c.newPage();
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(base + "/#/home");
  await page.locator('.v3-stat-grid[aria-busy="false"]').waitFor();
  expect(await page.evaluate(() => !!navigator.serviceWorker.controller)).toBe(
    true,
  );
  return { c, page };
}
async function api(page, path, body, method) {
  return page.evaluate(
    async ({ path, body, method }) => {
      const r = await fetch("/api" + path, {
        method: method || (body ? "POST" : "GET"),
        headers: body ? { "Content-Type": "application/json" } : {},
        body: body ? JSON.stringify(body) : undefined,
      });
      return { status: r.status, body: await r.json() };
    },
    { path, body, method },
  );
}
try {
  let { c, page } = await start();
  context = c;
  const status = await api(page, "/status");
  expect(status.body.storage).toBe("Browser IndexedDB");
  expect(status.body.ai).toBe("unavailable");
  check(
    "Service worker initializes real browser storage before UI; status is honest",
  );
  await page
    .getByLabel("Your idea", { exact: true })
    .fill("Hosted QA: my own idea");
  await page
    .getByRole("button", { name: "Start conversation", exact: true })
    .click();
  await expect(page).toHaveURL(/chat\//);
  await page
    .getByRole("button", { name: "Open in Create", exact: true })
    .click();
  await page
    .getByLabel("Document title", { exact: true })
    .fill("Hosted QA artifact");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved locally · revision 2")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("Document title", { exact: true })).toHaveValue(
    "Hosted QA artifact",
  );
  check(
    "Home → conversation → native Canvas → save revision → reload retains edit",
  );
  let items = (await api(page, "/items")).body;
  const doc = items.find((i) => i.title === "Hosted QA artifact");
  const edits = await Promise.all([
    api(
      page,
      "/items/" + doc.id,
      { ...doc, title: "Hosted QA concurrent A" },
      "PUT",
    ),
    api(
      page,
      "/items/" + doc.id,
      { ...doc, title: "Hosted QA concurrent B" },
      "PUT",
    ),
  ]);
  expect(edits.map((r) => r.status).sort()).toEqual([200, 409]);
  check(
    "Two simultaneous writes with one revision: one commits, stale write gets 409",
  );
  const wav = await page.evaluate(async () => {
    const b = new ArrayBuffer(48),
      v = new DataView(b);
    for (const [offset, s] of [
      [0, "RIFF"],
      [8, "WAVE"],
      [12, "fmt "],
      [36, "data"],
    ])
      for (let i = 0; i < s.length; i++)
        v.setUint8(offset + i, s.charCodeAt(i));
    v.setUint32(4, 40, true);
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, 8000, true);
    v.setUint32(28, 16000, true);
    v.setUint16(32, 2, true);
    v.setUint16(34, 16, true);
    v.setUint32(40, 4, true);
    v.setInt16(44, 1000, true);
    v.setInt16(46, -1000, true);
    const r = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "audio/wav", "X-Filename": "QA fixture WAV" },
      body: b,
    });
    const asset = await r.json(),
      data = await fetch(asset.url);
    return {
      status: r.status,
      asset,
      bytes: [...new Uint8Array(await data.arrayBuffer())],
    };
  });
  expect(wav.status).toBe(201);
  expect(wav.bytes.length).toBe(48);
  expect(wav.bytes[44]).not.toBe(0);
  check(
    "Actual binary WAV persists as Blob and is returned by stable /api/assets URL",
  );
  const invalidMedia = await page.evaluate(async () => {
    const r = await fetch("/api/assets", {
      method: "POST",
      headers: { "Content-Type": "image/png" },
      body: "not png",
    });
    return r.status;
  });
  expect(invalidMedia).toBe(400);
  check("Invalid media signature rejected");
  const agent = await api(page, "/agent/run", {
    prompt: "first source\nsecond source",
    mode: "local",
    tool: "outline",
  });
  expect(agent.body.item.data.text).toBe("1. first source\n2. second source");
  expect(agent.body.item.data.provenance).toBe("local-tool");
  const unavailable = await api(page, "/agent/run", {
    prompt: "question",
    mode: "connected",
    tool: "outline",
    fallback: false,
  });
  expect(unavailable.status).toBe(503);
  check(
    "Local Agent tool executes and saves; connected mode without fallback remains unavailable",
  );
  await api(page, "/items/" + doc.id + "/trash", {});
  expect(
    (await api(page, "/items")).body.find((i) => i.id === doc.id).deletedAt,
  ).toBeTruthy();
  await api(page, "/items/" + doc.id + "/trash", { restore: true });
  check("Trash and restore preserve stable identity");
  const backup = (await api(page, "/backup")).body;
  expect(backup.assets[0].base64.length).toBeGreaterThan(20);
  expect(backup.revisions.filter((i) => i.id === doc.id).length).toBe(3);
  await context.close();
  ({ c, page } = await start());
  context = c;
  expect((await api(page, "/items")).body).toEqual([]);
  const restored = await api(page, "/restore", backup);
  expect(restored.status).toBe(200);
  expect(restored.body.imported).toBe(backup.items.length);
  expect(
    (await api(page, "/items")).body.sort((a, b) => a.id.localeCompare(b.id)),
  ).toEqual(backup.items.sort((a, b) => a.id.localeCompare(b.id)));
  expect((await api(page, "/items/" + doc.id + "/revisions")).body.length).toBe(
    3,
  );
  expect(
    await page.evaluate(
      async (url) => (await (await fetch(url)).arrayBuffer()).byteLength,
      wav.asset.url,
    ),
  ).toBe(48);
  check(
    "Backup → empty browser context → restore: exact records/IDs, three revisions and media survive",
  );
  const broken = structuredClone(backup);
  broken.items[0].id = "../../invalid";
  expect((await api(page, "/restore", broken)).status).toBe(400);
  expect((await api(page, "/items")).body.length).toBe(backup.items.length);
  check("Invalid backup rejected without modifying stored records");
  const existing = structuredClone(backup);
  existing.items.find((i) => i.id === doc.id).title = "SHOULD NOT OVERWRITE";
  expect((await api(page, "/restore", existing)).body.imported).toBe(0);
  expect(
    (await api(page, "/items")).body.find((i) => i.id === doc.id).title,
  ).not.toBe("SHOULD NOT OVERWRITE");
  check("Repeated restore preserves existing edits");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(base + "/#/home");
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.v3-stat-grid[aria-busy="false"]').waitFor();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
    await page.screenshot({
      path: `${out}/hosted-home-${width}.png`,
      fullPage: true,
    });
    check("Hosted Home accessibility and layout", { width });
  }
  expect(errors).toEqual([]);
} finally {
  if (context) await context.close();
  const report = {
    timestamp: new Date().toISOString(),
    baseURL: base,
    browser: browser.version(),
    conditions:
      "Built browser edition on static Vite preview, isolated fresh Playwright contexts. IndexedDB/service-worker real interactions, synthetic binary WAV fixture, no cloud backend or live AI. Automated axe default Home states; not real-device or WCAG certification.",
    checks,
    errors,
  };
  writeFileSync(
    out + "/hosted-verification.json",
    JSON.stringify(report, null, 2),
  );
  console.log(JSON.stringify(report, null, 2));
  await browser.close();
}
