import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFileSync } from "node:fs";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:5320",
  b = await chromium.launch({
    executablePath: "/usr/bin/chromium",
    args: ["--no-sandbox"],
  }),
  c = await b.newContext({ viewport: { width: 390, height: 844 } }),
  p = await c.newPage(),
  cases = [];
try {
  for (const screen of ["home", "studio"])
    for (const overlay of ["drawer", "search"]) {
      await p.goto(base + "/#/concept/" + screen);
      await p.locator(".cp-root").waitFor();
      if (overlay === "drawer")
        await p
          .getByRole("navigation", { name: "Mobile concept navigation" })
          .getByRole("button", { name: "Menu", exact: true })
          .click();
      else await p.keyboard.press("Control+k");
      await p.getByRole("dialog").waitFor();
      const a = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      cases.push({
        screen,
        overlay,
        width: 390,
        violations: a.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      });
      await p.screenshot({
        path: `tests/evidence/concept/${screen}-${overlay}-390.png`,
      });
      await p.keyboard.press("Escape");
    }
  writeFileSync(
    "tests/evidence/concept/overlay-checks.json",
    JSON.stringify({ timestamp: new Date().toISOString(), cases }, null, 2),
  );
  console.log(JSON.stringify(cases));
  if (cases.some((c) => c.violations.length))
    throw Error("Overlay audit failed");
} finally {
  await b.close();
}
