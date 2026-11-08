import { test, expect } from "@playwright/test";
test("Concept screens are labeled samples, use scoped themes and leave saved work unchanged", async ({
  page,
  request,
}) => {
  const before = await (await request.get("/api/items")).json();
  await page.goto("/#/concept/home");
  await expect(page.getByRole("heading", { name: /Speak/ })).toBeVisible();
  await expect(page.locator(".cp-preview-bar")).toContainText("ข้อมูลตัวอย่าง");
  await page
    .getByRole("navigation", { name: "Preview screens" })
    .getByRole("link", { name: "Copilot", exact: true })
    .click();
  await expect(page.locator(".cp-wave-section")).toContainText("ไมโครโฟนปิด");
  await page
    .getByRole("navigation", { name: "Preview screens" })
    .getByRole("link", { name: "Studio", exact: true })
    .click();
  expect(
    await page
      .locator(".cp-root")
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(5, 8, 13)");
  const after = await (await request.get("/api/items")).json();
  expect(after).toEqual(before);
});
test("Sample transcript, format keyboard, evidence and tone controls have real local effects", async ({
  page,
}) => {
  await page.goto("/#/concept/copilot");
  await page
    .getByLabel("ทดลองเพิ่มข้อความด้วยตัวเอง")
    .fill("ข้อความที่ผู้ใช้พิมพ์จริง");
  await page.getByRole("button", { name: "เพิ่มข้อความ", exact: true }).click();
  await expect(page.locator(".cp-turns")).toContainText(
    "ข้อความที่ผู้ใช้พิมพ์จริง",
  );
  await page.getByRole("button", { name: "อ่านหลักฐานตัวอย่าง" }).click();
  await expect(page.locator(".cp-evidence blockquote")).toContainText(
    "React และ TypeScript",
  );
  await page.getByRole("tab", { name: "Full Answer", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Key Points", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("01  แยก UI");
  await page.getByRole("tab", { name: "Full Answer", exact: true }).click();
  await page.getByLabel("Tone", { exact: true }).selectOption("Concise");
  await expect(page.getByRole("tabpanel")).toContainText(
    "ฉันใช้ React และ TypeScript",
  );
  await expect(page.locator(".cp-wave-section strong")).toHaveText("00:00");
});
test("Concept Studio runs only on request, captures actual events, blocks parent DOM and transfers editable source", async ({
  page,
  request,
}) => {
  await page.goto("/#/concept/studio");
  await expect(page.locator(".cp-frame-wrap iframe")).toHaveCount(0);
  await page.getByRole("tab", { name: "JS", exact: true }).click();
  await page
    .getByLabel("Concept source js")
    .fill(
      "try { parent.document.body; console.log('BAD parent read') } catch { console.log('PASS parent blocked') }",
    );
  await page.getByRole("button", { name: "Run", exact: true }).click();
  await expect(page.locator(".cp-console")).toContainText(
    "PASS parent blocked",
  );
  await expect(page.locator(".cp-console")).not.toContainText(
    "BAD parent read",
  );
  await expect(page.locator(".cp-frame-wrap iframe")).toHaveAttribute(
    "sandbox",
    "allow-scripts",
  );
  const frame = page.frameLocator(".cp-frame-wrap iframe");
  await expect(frame.getByRole("heading", { name: /Make room/ })).toBeVisible();
  await page
    .getByRole("button", { name: "Mobile preview", exact: true })
    .click();
  await expect(page.locator(".cp-frame-wrap")).toHaveClass(/mobile/);
  await page
    .getByRole("button", { name: "เปิดต่อใน Studio จริง", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/code\//);
  const id = page.url().split("/").at(-1);
  const items = await (await request.get("/api/items")).json();
  expect(items.find((i: any) => i.id === id)?.data.js).toContain(
    "PASS parent blocked",
  );
});
test("Mobile concept navigation, drawer and command search keep focus and route correctly", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/#/concept/home");
  await page
    .getByRole("navigation", { name: "Mobile concept navigation" })
    .getByRole("button", { name: "Menu", exact: true })
    .click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await page.goto("/#/concept/studio");
  await page
    .getByRole("navigation", { name: "Mobile concept navigation" })
    .getByRole("button", { name: "Menu", exact: true })
    .click();
  await expect(page.getByRole("dialog").locator(".cp-brand")).toHaveCSS(
    "color",
    "rgb(237, 242, 250)",
  );
  await page.keyboard.press("Escape");
  await page.keyboard.press("Control+k");
  await page.getByLabel("ชื่อพื้นที่ทำงาน").fill("Templates");
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Templates", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/templates/);
});
