import { chromium, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4320",
  b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await c.addInitScript(() => {
  if(window.top!==window) return;
  localStorage.setItem("av-motion", "Off");
  localStorage.setItem("av-locale", "en");
});
const p = await c.newPage(),
  errors = [],
  checks = [];
p.on("pageerror", (e) => errors.push(e.message));
try {
  for (const screen of ["home", "copilot", "studio"]) {
    await p.goto(base + "/#/concept/" + screen);
    await p.locator(".cp-root").waitFor();
    await p.evaluate(() => document.fonts.ready);
    checks.push("Built browser edition renders " + screen);
  }
  const status = await p.evaluate(async () =>
    (await fetch("/api/status")).json(),
  );
  expect(status.storage).toBe("Browser IndexedDB");
  expect(await p.locator(".cp-frame-wrap iframe").count()).toBe(0);
  await p.getByRole("button", { name: "Run", exact: true }).click();
  await expect(p.locator(".cp-console")).toContainText("Preview ready");
  const denied = await p
    .frameLocator(".cp-frame-wrap iframe")
    .locator("body")
    .evaluate(() => {
      try {
        parent.document.body;
        return false;
      } catch {
        return true;
      }
    });
  expect(denied).toBe(true);
  checks.push(
    "Explicit Run creates isolated preview with real ready event; parent access denied",
  );
  await p
    .getByRole("button", { name: "เปิดต่อใน Studio จริง", exact: true })
    .click();
  await expect(p).toHaveURL(/#\/code\//);
  const id = p.url().split("/").at(-1),
    item = await p.evaluate(
      async (id) =>
        (await (await fetch("/api/items")).json()).find((i) => i.id === id),
      id,
    );
  expect(item.kind).toBe("code");
  expect(item.title).toBe("Concept studio exploration");
  await p.reload();
  await expect(p.getByLabel("Studio title")).toHaveValue(
    "Concept studio exploration",
  );
  checks.push(
    "Explicit handoff creates editable code document in IndexedDB and survives reload",
  );
  expect(errors).toEqual([]);
  writeFileSync(
    "tests/evidence/concept/built-browser-checks.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        base,
        browser: b.version(),
        checks,
        errors,
        conditions:
          "Built VITE_STORAGE_MODE=browser edition on isolated static preview. No live AI/auth/cloud credentials; not remote Vercel browser verification.",
      },
      null,
      2,
    ),
  );
  console.log({ checks, errors });
} finally {
  await b.close();
}
