import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync, writeFileSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4318",
  file = "tests/evidence/v3/visual-audit.json",
  report = JSON.parse(readFileSync(file, "utf8")),
  b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  });
const c = await b.newContext({ viewport: { width: 1440, height: 1000 } }),
  p = await c.newPage(),
  errors = [];
p.on("pageerror", (e) => errors.push(e.message));
const followup = [];
try {
  await p.goto(base);
  for (const theme of ["dark", "light"]) {
    await p.evaluate((t) => {
      localStorage.setItem("artyverse-theme", t);
      localStorage.setItem("av-locale", "en");
    }, theme);
    await p.reload();
    await p.evaluate(() => document.fonts.ready);
    for (const original of report.cases.filter((x) => x.theme === theme)) {
      await p.goto(base + "/#/" + original.route);
      await p.getByRole("main").waitFor();
      await p.waitForTimeout(180);
      const a = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const result = {
        theme,
        route: original.route,
        viewport: 1440,
        violations: a.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
        overflow: await p.evaluate(
          () => document.documentElement.scrollWidth > innerWidth + 1,
        ),
        checkedAt: new Date().toISOString(),
      };
      report.cases[report.cases.indexOf(original)] = result;
      if (result.violations.length || result.overflow)
        console.log("FINDING", JSON.stringify(result));
      if (
        ["home", "copilot", "projects", "code", "sound"].includes(
          original.route,
        )
      )
        await p.screenshot({
          path: `tests/evidence/v3/${original.route}-${theme}-1440.png`,
          fullPage: true,
        });
    }
    await p.goto(base + "/#/design");
    await p.getByRole("tab", { name: "Motion Lab", exact: true }).click();
    await p.waitForTimeout(200);
    const a = await new AxeBuilder({ page: p })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const result = {
      theme,
      route: "design/Motion Lab",
      violations: a.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    };
    followup.push(result);
    if (result.violations.length)
      console.log("MOTION FINDING", JSON.stringify(result));
    await p.screenshot({
      path: `tests/evidence/v3/motion-lab-${theme}-1440.png`,
      fullPage: true,
    });
  }
  report.followupAt = new Date().toISOString();
  report.followupConditions =
    "Final semantic contrast corrections: reran all 50 desktop theme cases plus Motion Lab in both themes; original 135 font-loaded responsive cases retained because layout contracts unchanged.";
  report.motionLabCases = followup;
  report.errors = [...report.errors, ...errors];
  writeFileSync(file, JSON.stringify(report, null, 2));
  console.log(
    JSON.stringify(
      {
        cases: report.cases.length,
        failures: report.cases.filter((x) => x.violations.length || x.overflow),
        motionLabCases: followup,
        errors,
      },
      null,
      2,
    ),
  );
  if (
    report.cases.some((x) => x.violations.length || x.overflow) ||
    followup.some((x) => x.violations.length) ||
    errors.length
  )
    throw Error("Followup audit defects");
} finally {
  await b.close();
}
