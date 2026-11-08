import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, writeFileSync } from "node:fs";
const f = "tests/evidence/v3/visual-audit.json",
  r = JSON.parse(readFileSync(f, "utf8"));
const b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  c = await b.newContext({ viewport: { width: 1440, height: 1000 } }),
  p = await c.newPage();
const cases = [];
try {
  for (const theme of ["dark", "light"]) {
    await p.addInitScript(() => localStorage.setItem("av-locale", "en"));
    await p.goto("http://127.0.0.1:4318/#/design");
    await p.evaluate((t) => localStorage.setItem("artyverse-theme", t), theme);
    await p.reload();
    await p.getByRole("tab", { name: "Motion Lab", exact: true }).click();
    await p.evaluate(() => document.fonts.ready);
    const a = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    if ((await p.locator("html").getAttribute("data-theme")) !== theme)
      throw Error("Wrong resolved theme");
    const item = {
      theme,
      route: "design/Motion Lab",
      checkedAt: new Date().toISOString(),
      violations: a.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    };
    cases.push(item);
    await p.screenshot({
      path: `tests/evidence/v3/motion-lab-${theme}-1440.png`,
      fullPage: true,
    });
  }
  r.motionLabCases = cases;
  r.motionFinalFollowupAt = new Date().toISOString();
  writeFileSync(f, JSON.stringify(r, null, 2));
  console.log(JSON.stringify(cases));
  if (cases.some((c) => c.violations.length))
    throw Error("Motion contrast failures");
} finally {
  await b.close();
}
