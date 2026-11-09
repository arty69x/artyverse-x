import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
});
test("Specialist directory preserves every destination and restores keyboard focus", async ({
  page,
}) => {
  await page.goto("/#/home");
  const trigger = page
    .locator(".v3-sidebar")
    .getByRole("button", { name: "All tools" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Your creative toolkit" });
  await expect(dialog.getByRole("link")).toHaveCount(19);
  await expect(
    dialog.getByRole("link", { name: "Question Bank", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
  await trigger.click();
  await dialog.getByRole("link", { name: "Sound Lab", exact: true }).click();
  await expect(page).toHaveURL(/#\/sound$/);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toHaveClass(/active/);
});
test("New editorial home preserves mobile keyboard workflows, both themes and reduced motion", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      name: "A little idea. An entirely new universe.",
    }),
  ).toBeVisible();
  await page
    .getByLabel("Your idea", { exact: true })
    .fill("An actual retained creative brief");
  await page.reload();
  await expect(page.getByLabel("Your idea", { exact: true })).toHaveValue(
    "An actual retained creative brief",
  );
  await page.getByRole("button", { name: "More workspaces" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "All tools" })
    .click();
  await expect(page.getByRole("dialog")).toHaveCount(1);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Toggle navigation", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "More workspaces" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "All tools" })
    .click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Research", exact: true })
    .click();
  await expect(page).toHaveURL(/research/);
  await page.goto("/");
  await page.setViewportSize({ width: 1440, height: 1000 });
  for (const theme of ["dark", "light"]) {
    await page.evaluate((t) => {
      localStorage.setItem("artyverse-theme", t);
    }, theme);
    await page.reload();
    const a = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(
      a.violations.map((x) => ({
        id: x.id,
        nodes: x.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  }
});
