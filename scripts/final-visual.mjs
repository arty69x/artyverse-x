import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, writeFileSync } from "node:fs";
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const context = await b.newContext();
const p = await context.newPage();
const result = JSON.parse(
  readFileSync("tests/evidence/visual-audit.json", "utf8"),
);
for (const width of [390, 1440]) {
  await p.setViewportSize({ width, height: 1000 });
  for (const route of ["home", "templates", "create"]) {
    await p.goto("http://localhost:5173/#/" + route);
    await p.waitForTimeout(1000);
    const axe = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const item = {
      route,
      width,
      overflow: await p.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      ),
      violations: axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      recheckedAt: new Date().toISOString(),
    };
    const index = result.cases.findIndex(
      (c) => c.route === route && c.width === width,
    );
    result.cases[index] = item;
    await p.screenshot({
      path: `tests/evidence/${route}-${width}.png`,
      fullPage: true,
    });
  }
}
await p.setViewportSize({ width: 390, height: 844 });
await p.goto("http://localhost:5173/#/home");
await p.getByRole("button", { name: "EN", exact: true }).click();
await p.waitForTimeout(1000);
await p.screenshot({
  path: "tests/evidence/home-thai-390.png",
  fullPage: true,
});
result.thaiHome = {
  viewport: 390,
  overflow: await p.evaluate(
    () => document.documentElement.scrollWidth > innerWidth + 1,
  ),
  scope: "Thai Home and navigation, not complete localization",
};
result.finalVisualTimestamp = new Date().toISOString();
writeFileSync(
  "tests/evidence/visual-audit.json",
  JSON.stringify(result, null, 2),
);
console.log(
  JSON.stringify({
    rechecks: 6,
    violations: result.cases.filter((c) => c.violations?.length),
    overflow: result.cases.filter((c) => c.overflow),
    thaiHome: result.thaiHome,
  }),
);
await b.close();
