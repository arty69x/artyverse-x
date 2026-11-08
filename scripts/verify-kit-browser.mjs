import { chromium, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4324",
  b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
await c.addInitScript(() => {
  if (top !== window) return;
  localStorage.setItem("av-locale", "en");
  localStorage.setItem("av-motion", "Off");
});
const p = await c.newPage(),
  errors = [],
  checks = [];
p.on("pageerror", (e) => errors.push(e.message));
try {
  await p.goto(base + "/#/concept/builder");
  await p.locator(".ax-builder").waitFor();
  const status = await p.evaluate(
    async () => await (await fetch("/api/status")).json(),
  );
  expect(status.storage).toBe("Browser IndexedDB");
  checks.push("Built browser edition runs the actual IndexedDB adapter");
  await p
    .getByLabel("ชื่อแบรนด์", { exact: true })
    .fill("Hosted toolkit fixture");
  await expect(p.locator(".sf-shop-header>strong")).toHaveText(
    "Hosted toolkit fixture",
  );
  await p.reload();
  await expect(p.getByLabel("ชื่อแบรนด์", { exact: true })).toHaveValue(
    "Hosted toolkit fixture",
  );
  checks.push("Form edits affect native storefront and survive reload");
  await p
    .getByLabel("เขียน brief เพื่อจัดโครงสร้างแบบ local")
    .fill("Hosted actual template brief");
  await p
    .getByRole("button", { name: "จัดโครง brief และบันทึก", exact: true })
    .click();
  await expect(p.getByText("ดูผลที่บันทึกจริง", { exact: true })).toBeVisible();
  const run = await p.evaluate(async () =>
    (await (await fetch("/api/items")).json()).find(
      (i) => i.kind === "agent-run",
    ),
  );
  expect(run.data.provenance).toBe("local-tool");
  checks.push(
    "Local brief saves a real browser agent-run with explicit provenance",
  );
  await p
    .getByRole("button", { name: "เปิดใน Code Studio", exact: true })
    .click();
  await expect(p).toHaveURL(/#\/code\//);
  await p.reload();
  await expect(p.getByLabel("Studio title")).toHaveValue(
    "Hosted toolkit fixture · storefront draft",
  );
  await p.getByRole("button", { name: "Run preview", exact: true }).click();
  const frame = p.frameLocator('iframe[title="Sandboxed code preview"]');
  await expect(
    frame.getByRole("heading", { name: /Objects for/ }),
  ).toBeVisible();
  await frame.getByRole("button", { name: "แฟชั่น", exact: true }).click();
  await expect(frame.locator(".sf-product:not([hidden])")).toHaveCount(1);
  checks.push(
    "Saved storefront reopens and runs functional exported code in the opaque-origin sandbox",
  );
  expect(errors).toEqual([]);
  writeFileSync(
    "tests/evidence/component-upgrade/built-browser-checks.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        base,
        browser: b.version(),
        checks,
        errors,
        conditions:
          "Built browser edition on isolated static preview. Not production Vercel browser interaction. No live provider or payment service used.",
      },
      null,
      2,
    ),
  );
  console.log({ checks, errors });
} finally {
  await b.close();
}
