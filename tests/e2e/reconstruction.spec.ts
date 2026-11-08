import { test, expect } from "@playwright/test";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
});
test("Unified Extract Compose Ship entry points navigate to actual workspaces", async ({
  page,
}) => {
  await page.goto("/#/home");
  await expect(
    page.getByRole("heading", { name: "EXTRACT. COMPOSE. SHIP." }),
  ).toBeVisible();
  await page.locator(".recon-flow button").nth(0).click();
  await expect(page).toHaveURL(/#\/research/);
  await page.goto("/#/home");
  await page.locator(".recon-flow button").nth(1).click();
  await expect(page).toHaveURL(/#\/builder/);
  await expect(page.locator(".v3-sidebar")).toBeVisible();
  await expect(page.locator(".ax-builder")).toBeVisible();
  await page
    .getByLabel("ชื่อแบรนด์", { exact: true })
    .fill("Unified actual draft");
  await page.reload();
  await expect(page.getByLabel("ชื่อแบรนด์", { exact: true })).toHaveValue(
    "Unified actual draft",
  );
  await page.goto("/#/home");
  await page.locator(".recon-flow button").nth(2).click();
  await expect(page).toHaveURL(/#\/library/);
});
test("Brand board uses native vector lockups and canonical tokens", async ({
  page,
}) => {
  await page.goto("/#/design-system");
  await expect(page.locator(".recon-brand-lockup")).toContainText("ARTYVERSE");
  await expect(page.locator(".recon-appmark svg")).toHaveCount(3);
  await page.setViewportSize({ width: 320, height: 900 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});
