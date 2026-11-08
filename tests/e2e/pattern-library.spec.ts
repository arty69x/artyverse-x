import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import { patternIds, defaultPattern } from "../../shared/patterns";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (top !== window) return;
    localStorage.setItem("av-locale", "en");
    localStorage.setItem("av-motion", "Off");
  });
});
test("Ready layouts and source inventory are searchable, separate and do not create work by browsing", async ({
  page,
  request,
}) => {
  const before = (await (await request.get("/api/items")).json()).length;
  await page.goto("/#/patterns");
  await expect(page.locator(".pattern-grid>article")).toHaveCount(8);
  await page.getByRole("button", { name: /Reference inventory/ }).click();
  await expect(page.locator(".patterns-inventory article")).toHaveCount(60);
  await page.getByRole("searchbox").fill("Typewriter");
  await expect(page.locator(".patterns-inventory article")).toHaveCount(1);
  await page.reload();
  await expect(page.getByRole("searchbox")).toHaveValue("Typewriter");
  await page.getByRole("searchbox").fill("nothing-will-match-xyz");
  await page.getByRole("button", { name: "Clear filters" }).click();
  await expect(page.locator(".patterns-inventory article")).toHaveCount(60);
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export inventory" }).click();
  const file = await dl;
  const data = JSON.parse(readFileSync((await file.path())!, "utf8"));
  expect(data.items).toHaveLength(60);
  expect(
    data.items.every((x: any) => x.status.includes("Reference inventory")),
  ).toBe(true);
  expect((await (await request.get("/api/items")).json()).length).toBe(before);
});
test("Pattern drafts validate, survive reload and import through review without running imported code", async ({
  page,
}) => {
  await page.goto("/#/patterns/mosaic");
  await page.getByLabel("Brand", { exact: true }).fill("My actual studio");
  await page.getByLabel("Headline", { exact: true }).fill("");
  await expect(
    page.getByRole("button", { name: "Create in Studio" }),
  ).toBeDisabled();
  await page.reload();
  await expect(page.getByLabel("Headline", { exact: true })).toHaveValue("");
  const file = page.locator("input[type=file]");
  await file.setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({ ...defaultPattern("mosaic"), script: "alert(1)" }),
    ),
  });
  await expect(page.locator(".pattern-error")).toContainText(
    "Invalid pattern preset",
  );
  await expect(page.getByLabel("Brand", { exact: true })).toHaveValue(
    "My actual studio",
  );
  const imported = {
    ...defaultPattern("mosaic"),
    brand: "Reviewed import",
    heading: "A new composition",
  };
  await file.setInputFiles({
    name: "preset.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Brand", { exact: true })).toHaveValue(
    "My actual studio",
  );
  await file.setInputFiles({
    name: "preset.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(imported)),
  });
  await page.getByRole("button", { name: "Apply preset", exact: true }).click();
  await expect(page.getByLabel("Brand", { exact: true })).toHaveValue(
    "Reviewed import",
  );
  await expect(page.locator("iframe")).toHaveCount(0);
  await page.getByRole("button", { name: "Run preview" }).click();
  await expect(
    page
      .frameLocator("iframe")
      .getByRole("heading", { name: "A new composition", exact: true }),
  ).toBeVisible();
  await page
    .getByLabel("Headline", { exact: true })
    .fill("Edited after preview");
  await expect(page.locator("iframe")).toHaveCount(0);
});
test("All eight layouts render only on request and remain inside the existing opaque sandbox", async ({
  page,
}) => {
  for (const id of patternIds) {
    await page.goto("/#/patterns/" + id);
    await expect(page.locator("iframe")).toHaveCount(0);
    await page.getByRole("button", { name: "Run preview" }).click();
    await expect(page.locator("iframe")).toHaveAttribute(
      "sandbox",
      "allow-scripts",
    );
    await expect(page.frameLocator("iframe").locator("h1")).toBeVisible();
    const f = page.frames().find((f) => f.parentFrame());
    expect(
      await f!.evaluate(() => {
        try {
          return !!parent.document;
        } catch {
          return false;
        }
      }),
    ).toBe(false);
  }
});
test("Exported sample filtering, depth keyboard and chapter navigation have real effects", async ({
  page,
}) => {
  await page.goto("/#/patterns/focus");
  await page.getByRole("button", { name: "Run preview" }).click();
  let frame = page.frameLocator("iframe");
  await frame.getByRole("button", { name: "Motion", exact: true }).click();
  await expect(frame.locator(".work:visible")).toHaveCount(3);
  await frame.getByRole("searchbox").fill("no matches here");
  await expect(frame.locator("#empty")).toBeVisible();
  await frame.getByRole("searchbox").fill("");
  await frame
    .getByRole("button", { name: "View study", exact: false })
    .first()
    .click();
  await expect(frame.getByRole("dialog")).toBeVisible();
  await frame.getByRole("button", { name: "Close study" }).click();
  await page.goto("/#/patterns/depth");
  await page.getByRole("button", { name: "Run preview" }).click();
  frame = page.frameLocator("iframe");
  await frame.locator(".depth-rail").focus();
  await page.keyboard.press("End");
  await expect(frame.locator("#deck-index")).toHaveText("6 / 6");
  await page.keyboard.press("Home");
  await expect(frame.locator("#deck-index")).toHaveText("1 / 6");
  await page.goto("/#/patterns/chapters");
  await page.getByRole("button", { name: "Run preview" }).click();
  await page
    .frameLocator("iframe")
    .getByRole("link", { name: "Skip story" })
    .click();
  await expect(
    page.frameLocator("iframe").locator("#closing"),
  ).toBeInViewport();
});
test("Actual HTML download and saved Code Studio document preserve the selected layout", async ({
  page,
  request,
}) => {
  await page.goto("/#/patterns/catalog");
  await page.getByLabel("Brand", { exact: true }).fill("Saved collection");
  const dl = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download HTML" }).click();
  const f = await dl;
  const html = readFileSync((await f.path())!, "utf8");
  expect(html).toContain("Saved collection");
  expect(html).not.toMatch(/https?:\/\//);
  await page.getByRole("button", { name: "Create in Studio" }).click();
  await expect(page).toHaveURL(/#\/code\//);
  const id = page.url().split("/").pop();
  const saved = (await (await request.get("/api/items")).json()).find(
    (x: any) => x.id === id,
  );
  expect(saved.kind).toBe("code");
  expect(saved.data.html).toContain("pattern-catalog");
  await page.getByRole("button", { name: "Run preview", exact: true }).click();
  await expect(
    page.frameLocator("iframe").locator(".catalog-grid .work"),
  ).toHaveCount(6);
});
