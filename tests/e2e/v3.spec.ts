import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Thai-first dashboard, theme preference and system theme persist without changing saved artifacts", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "th");
  await expect(page.getByRole("heading", { name: /ทุกไอเดีย/ })).toBeVisible();
  await page.getByRole("button", { name: "เปลี่ยนธีม", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.goto("/#/settings");
  await page.getByLabel("การตั้งค่าธีม").selectOption("system");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("Command palette supports filtering, arrows, Enter and restores focus", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await page.goto("/");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  const combo = page.getByRole("combobox", {
    name: "Search workspaces and saved work",
  });
  await combo.fill("Sound Lab");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/sound/);
  await page.keyboard.press("Control+k");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("Home portal order can be changed with keyboard-accessible controls and survives reload", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await page.goto("/");
  await page.getByRole("button", { name: "Arrange your studio" }).click();
  await page
    .getByRole("button", { name: "Move earlier: Build something live." })
    .click();
  await expect(page.locator(".v3-portal-grid article").first()).toHaveClass(
    /code/,
  );
  await page.reload();
  await expect(page.locator(".v3-portal-grid article").first()).toHaveClass(
    /code/,
  );
});

test("Project rename, search, duplication and trash undo preserve the original project", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await page.goto("/#/projects");
  await page.getByRole("button", { name: "New project", exact: true }).click();
  await page.getByLabel("Project name").fill("Hyper polish project");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await page.getByPlaceholder("Search projects…").fill("Hyper polish");
  const card = page.locator(".v3-project-grid article").filter({
    has: page.getByRole("heading", {
      name: "Hyper polish project",
      exact: true,
    }),
  });
  await card.locator("summary").click();
  await card.getByRole("button", { name: "Rename / edit brief" }).click();
  await page.getByLabel("Project name").fill("Hyper polish renamed");
  await page.getByRole("button", { name: "Save project", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "Hyper polish renamed" }),
  ).toBeVisible();
  await page
    .locator(".v3-project-grid article")
    .filter({
      has: page.getByRole("heading", {
        name: "Hyper polish renamed",
        exact: true,
      }),
    })
    .locator("summary")
    .click();
  await page.getByRole("button", { name: "Duplicate project record" }).click();
  await expect(
    page.getByRole("heading", { name: "Hyper polish renamed — copy" }),
  ).toBeVisible();
  const original = page.locator(".v3-project-grid article").filter({
    has: page.getByRole("heading", {
      name: "Hyper polish renamed",
      exact: true,
    }),
  });
  await original.locator("summary").click();
  await original.getByRole("button", { name: "Move to Trash" }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Move to Trash" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hyper polish renamed", exact: true }),
  ).toHaveCount(0);
  await page
    .locator(".v3-undo-banner")
    .getByRole("button", { name: "Undo", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "Hyper polish renamed", exact: true }),
  ).toBeVisible();
});

test("Copilot → actual user evidence → editable outline → Question Bank → Practice → saved session", async ({
  page,
  request,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await request.post("/api/items", {
    data: {
      kind: "note",
      title: "My React evidence",
      data: {
        body: "I built my React portfolio with accessible components.",
        source: "User evidence fixture",
        tags: "react",
      },
    },
  });
  await page.goto("/#/copilot");
  await page
    .getByLabel("Transcript input")
    .fill("Describe your React project experience?");
  await page.getByRole("button", { name: "Add turn", exact: true }).click();
  await expect(page.getByLabel("Current interview question")).toHaveValue(
    "Describe your React project experience?",
  );
  await page.getByRole("checkbox", { name: /My React evidence/ }).check();
  await page.getByRole("button", { name: "Build local outline" }).click();
  const answer = page.getByLabel("Editable interview answer");
  await expect(answer).toContainText("I built my React portfolio");
  await expect(answer).toContainText("[Add your actual evidence]");
  await page
    .getByRole("button", { name: "Save question", exact: true })
    .click();
  await page.getByRole("button", { name: "Save session", exact: true }).click();
  await expect(page).toHaveURL(/copilot\//);
  const savedURL = page.url();
  await page.goto("/#/questions");
  await page
    .getByRole("button", { name: "Practice", exact: true })
    .first()
    .click();
  await expect(page.getByLabel("Current interview question")).toHaveValue(
    "Describe your React project experience?",
  );
  await page.goto(savedURL);
  await expect(page.getByLabel("Editable interview answer")).toContainText(
    "I built my React portfolio",
  );
  await page.goto("/#/home");
  await page
    .locator(".v3-recent-grid a")
    .filter({
      has: page.getByRole("heading", {
        name: "My interview session",
        exact: true,
      }),
    })
    .click();
  await expect(page).toHaveURL(/copilot\//);
  await page.goto("/#/library");
  await page.getByPlaceholder("Search your work…").fill("My interview session");
  await page
    .getByRole("heading", { name: "My interview session" })
    .getByRole("button")
    .click();
  await expect(page).toHaveURL(/copilot\//);
});

test("Marketplace starter preview creates a new editable document; no checkout is claimed", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await page.goto("/#/marketplace");
  await expect(
    page.getByText("Free local starters · no checkout"),
  ).toBeVisible();
  await page.getByRole("button", { name: "Preview starter" }).first().click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Create editable copy" })
    .click();
  await expect(page).toHaveURL(/create\//);
  await expect(page.getByLabel("Document title")).toHaveValue(
    "Signal / Editorial Kit",
  );
});

test("Design system has eleven live sections, real contrast pairs, native dialog and roving tabs", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await page.goto("/#/design-system");
  await expect(page.locator(".v3-design-board > section")).toHaveCount(11);
  await page.getByRole("tab", { name: "Overview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Details", exact: true }),
  ).toBeFocused();
  await expect(page.getByRole("tabpanel")).toContainText("Arrow keys");
  await page.getByRole("button", { name: "Open dialog", exact: true }).click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open dialog", exact: true }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Light", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.locator(".v3-contrast-table tbody tr")).toHaveCount(6);
});

test("Mobile navigation drawer, answer sheet, safe area and accessible focus work", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("navigation", { name: "Quick navigation" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "More workspaces" }).click();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: /Interview Copilot/ })
    .click();
  await expect(page).toHaveURL(/copilot/);
  await page.getByRole("button", { name: "Open answer workspace" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Open answer workspace" }),
  ).toBeFocused();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth + 1,
    ),
  ).toBe(true);
});

test("Keyboard tabs in code editor move selection without trapping focus", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem("av-locale", "en"));
  await page.goto("/#/code");
  await page.getByRole("tab", { name: "index.html" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("tab", { name: "styles.css" })).toBeFocused();
  await expect(page.getByRole("tab", { name: "styles.css" })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await expect(page.getByLabel("CSS source")).toBeVisible();
  await page.keyboard.press("End");
  await expect(page.getByRole("tab", { name: "script.js" })).toBeFocused();
});
