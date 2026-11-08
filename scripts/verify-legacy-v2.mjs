import { chromium, expect } from "@playwright/test";
import { writeFileSync } from "node:fs";
const b = await chromium.launch({
  executablePath: "/usr/bin/chromium",
  args: ["--no-sandbox"],
});
const c = await b.newContext(),
  p = await c.newPage(),
  base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4315";
try {
  const project = await (
    await c.request.post(base + "/api/items", {
      data: {
        kind: "project",
        title: "Legacy compatibility project",
        data: { schemaVersion: 2, description: "fixture", color: "#D7E317" },
      },
    })
  ).json();
  const legacy = await (
    await c.request.post(base + "/api/items", {
      data: {
        kind: "workflow",
        title: "Legacy compatibility fixture",
        data: {
          source: "An existing idea\nAnother idea",
          action: "outline",
          result: "",
          projectId: project.id,
        },
      },
    })
  ).json();
  await p.goto(base + "/#/automate/" + legacy.id);
  await expect(p.getByLabel("Workflow source")).toHaveValue(
    "An existing idea\nAnother idea",
  );
  await p.getByRole("button", { name: "Validate & run", exact: true }).click();
  await expect(p.locator(".workflow-result")).toContainText(
    "1. An existing idea",
  );
  await p.getByRole("button", { name: "Save workflow", exact: true }).click();
  await expect(p.locator(".toast")).toContainText("Workflow saved");
  const rows = await (await c.request.get(base + "/api/items")).json(),
    saved = rows.find((i) => i.id === legacy.id);
  if (saved.revision !== 2 || saved.data.projectId !== project.id)
    throw Error("Legacy identity/project relationship lost");
  writeFileSync(
    "tests/evidence/v2/legacy-compatibility.json",
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        fixture: true,
        conditions:
          "Built V2 application; graph-less V1 payload, actual UI run/save, stable ID and project relationship",
        itemId: legacy.id,
        revision: saved.revision,
        projectPreserved: true,
        result: saved.data.result,
      },
      null,
      2,
    ),
  );
  console.log("Legacy compatibility passed");
} finally {
  await b.close();
}
