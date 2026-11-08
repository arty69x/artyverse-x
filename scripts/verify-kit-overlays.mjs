import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:5320",
  out = "tests/evidence/component-upgrade",
  b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  c = await b.newContext({ viewport: { width: 390, height: 900 } });
await c.addInitScript(() => localStorage.setItem("av-motion", "Off"));
const p = await c.newPage(),
  cases = [];
async function audit(state) {
  const a = await new AxeBuilder({ page: p })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const result = {
    state,
    width: 390,
    violations: a.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
    overflow: await p.evaluate(
      () => document.documentElement.scrollWidth > innerWidth + 1,
    ),
  };
  cases.push(result);
  await p.screenshot({ path: `${out}/${state}-390.png` });
  console.log(JSON.stringify(result));
}
try {
  await p.goto(base + "/#/concept/builder");
  await p.locator(".ax-builder").waitFor();
  await p.evaluate(() => document.fonts.ready);
  await p.getByRole("button", { name: /Orbit desk lamp/ }).click();
  await audit("product-detail");
  await p.keyboard.press("Escape");
  await p.getByRole("button", { name: "Sample bag, 0 items" }).click();
  await audit("sample-bag");
  await p.keyboard.press("Escape");
  await p.getByRole("button", { name: /Afterhours edit/ }).click();
  await audit("preset-review");
  await p.keyboard.press("Escape");
  await p.getByRole("button", { name: "ทดสอบเสียงจริง", exact: true }).click();
  await audit("microphone-consent");
  await p.keyboard.press("Escape");
  await p.getByRole("tab", { name: "Code", exact: true }).click();
  await audit("code-panel");
  await p.getByRole("tab", { name: "Files", exact: true }).click();
  await audit("files-panel");
  await p.getByLabel("ชื่อแบรนด์", { exact: true }).fill("");
  await audit("invalid-draft");
  writeFileSync(
    out + "/overlay-checks.json",
    JSON.stringify({ timestamp: new Date().toISOString(), cases }, null, 2),
  );
  if (cases.some((x) => x.violations.length || x.overflow))
    throw Error("Overlay defects");
} finally {
  await b.close();
}
