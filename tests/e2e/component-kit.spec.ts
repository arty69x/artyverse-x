import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (top !== window) return;
    localStorage.setItem("av-locale", "en");
  });
});
test("Builder draft survives reload, validates required content and applies reviewed presets with undo", async ({
  page,
  request,
}) => {
  const count = (await (await request.get("/api/items")).json()).length;
  await page.goto("/#/concept/builder");
  await page.getByLabel("ชื่อแบรนด์", { exact: true }).fill("My actual studio");
  await page
    .getByLabel("หัวข้อหลัก", { exact: true })
    .fill("A calmer everyday");
  await expect(page.locator(".sf-shop-header>strong")).toHaveText(
    "My actual studio",
  );
  await page.reload();
  await expect(page.getByLabel("ชื่อแบรนด์", { exact: true })).toHaveValue(
    "My actual studio",
  );
  await page.getByRole("button", { name: /Afterhours edit/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "ยกเลิก", exact: true }).click();
  await expect(page.getByLabel("ชื่อแบรนด์", { exact: true })).toHaveValue(
    "My actual studio",
  );
  await page.getByRole("button", { name: /Afterhours edit/ }).click();
  await page
    .getByRole("button", { name: "Apply to draft", exact: true })
    .click();
  await expect(page.locator(".sf-shop-header>strong")).toHaveText(
    "AFTERHOURS / EDIT",
  );
  await page
    .getByRole("button", { name: "Undo draft change", exact: true })
    .click();
  await expect(page.locator(".sf-shop-header>strong")).toHaveText(
    "My actual studio",
  );
  await page.getByLabel("ชื่อแบรนด์", { exact: true }).fill("");
  await expect(
    page.getByRole("button", { name: "Export HTML", exact: true }),
  ).toBeDisabled();
  await expect(page.locator("#ax-config-error")).toBeVisible();
  await page.reload();
  await expect(page.getByLabel("ชื่อแบรนด์", { exact: true })).toHaveValue("");
  expect((await (await request.get("/api/items")).json()).length).toBe(count);
});
test("Responsive Motion viewport, Radix keyboard tabs and shopping selection retain their state", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/#/concept/builder");
  await page
    .getByRole("button", { name: "mobile storefront viewport", exact: true })
    .click();
  await expect
    .poll(() =>
      page
        .locator(".ax-device-frame")
        .evaluate((el) => el.getBoundingClientRect().width),
    )
    .toBeLessThanOrEqual(391);
  await page
    .getByRole("group", { name: "Product categories" })
    .getByRole("button", { name: "แฟชั่น", exact: true })
    .click();
  await expect(page.locator(".sf-product-grid>.sf-product")).toHaveCount(1);
  await page.getByRole("button", { name: /Everyday form tote/ }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page
    .getByRole("button", { name: "เพิ่มในถุงตัวอย่าง", exact: true })
    .click();
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Sample bag, 1 items" }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Preview", exact: true }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Code", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.getByLabel("Generated storefront HTML")).toHaveValue(
    /OBJECT \/ STUDIO/,
  );
  await page.getByRole("tab", { name: "Files", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "What’s in your export." }),
  ).toBeVisible();
  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  await expect(
    page
      .getByRole("group", { name: "Product categories" })
      .getByRole("button", { name: "แฟชั่น", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(
    page.getByRole("button", { name: "Sample bag, 1 items" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Sample bag, 1 items" }).click();
  await page
    .getByRole("button", { name: "Remove Everyday form tote", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toContainText("ไม่มีระบบชำระเงิน");
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Sample bag, 0 items" }),
  ).toBeVisible();
});
test("Real HTML export and saved Studio handoff preserve a functional, isolated storefront", async ({
  page,
}) => {
  await page.goto("/#/concept/builder");
  await page.getByLabel("ชื่อแบรนด์", { exact: true }).fill("A genuine draft");
  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export HTML", exact: true }).click();
  const download = await downloadPromise;
  const source = readFileSync((await download.path())!, "utf8");
  expect(source).toContain("A genuine draft");
  expect(source).toContain('data-filter="แฟชั่น"');
  expect(source).not.toMatch(/<script\s+src/);
  await page
    .getByRole("button", { name: "เปิดใน Code Studio", exact: true })
    .click();
  await expect(page).toHaveURL(/#\/code\//);
  await expect(page.getByLabel("Studio title")).toHaveValue(
    "A genuine draft · storefront draft",
  );
  await page.getByRole("button", { name: "Run preview", exact: true }).click();
  const frame = page.frameLocator('iframe[title="Sandboxed code preview"]');
  await expect(
    frame.getByRole("heading", { name: /Objects for/ }),
  ).toBeVisible();
  await frame.getByRole("button", { name: "แฟชั่น", exact: true }).click();
  await expect(frame.locator(".sf-product:not([hidden])")).toHaveCount(1);
  const blocked = await frame.locator("body").evaluate(() => {
    try {
      parent.document.body;
      return false;
    } catch {
      return true;
    }
  });
  expect(blocked).toBe(true);
});
test("Radix switches change real preview settings; local brief result has honest saved provenance", async ({
  page,
  request,
}) => {
  await page.goto("/#/concept/builder");
  const banner = page.locator(".sf-announcement");
  await expect(banner).toBeVisible();
  await page.locator("#ax-announcement").focus();
  await page.keyboard.press("Space");
  await expect(banner).toHaveCount(0);
  await page.locator("#ax-glow-toggle").focus();
  await page.keyboard.press("Space");
  await expect(page.locator(".ax-button-specimen")).toHaveClass(/is-glowing/);
  await page
    .getByRole("button", { name: "ลอง interaction", exact: true })
    .click();
  await expect(
    page.getByRole("status").filter({ hasText: "กดปุ่มตัวอย่างแล้ว" }),
  ).toContainText("1 ครั้ง");
  await page
    .getByLabel("เขียน brief เพื่อจัดโครงสร้างแบบ local")
    .fill("Actual user brief for a quieter creative shop");
  await page
    .getByRole("button", { name: "จัดโครง brief และบันทึก", exact: true })
    .click();
  await page.getByText("ดูผลที่บันทึกจริง", { exact: true }).click();
  await expect(page.locator(".ax-brief-form pre")).toContainText(
    "Actual user brief",
  );
  const records = await (await request.get("/api/items")).json();
  const run = records.find(
    (i: any) =>
      i.kind === "agent-run" &&
      i.data.prompt === "Actual user brief for a quieter creative shop",
  );
  expect(run?.data.provenance).toBe("local-tool");
  expect(run?.data.text).toContain("No AI inference was used");
});
test("Microphone rig is gesture-only and releases real synthetic tracks and AudioContexts on stop and navigation", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["microphone"]);
  await page.addInitScript(() => {
    if (top !== window) return;
    const w = window as any;
    w.__micCalls = 0;
    w.__tracks = [];
    w.__contexts = [];
    const original = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices,
    );
    navigator.mediaDevices.getUserMedia = async (options) => {
      w.__micCalls++;
      const s = await original(options);
      w.__tracks.push(...s.getTracks());
      return s;
    };
    const Native = window.AudioContext;
    window.AudioContext = class extends Native {
      constructor(...args: any[]) {
        super(...args);
        w.__contexts.push(this);
      }
    } as any;
  });
  await page.goto("/#/concept/builder");
  expect(await page.evaluate(() => (window as any).__micCalls)).toBe(0);
  await page
    .getByRole("button", { name: "ทดสอบเสียงจริง", exact: true })
    .click();
  expect(await page.evaluate(() => (window as any).__micCalls)).toBe(0);
  await page.getByRole("button", { name: "เปิดไมโครโฟน", exact: true }).click();
  await expect(page.locator(".ax-rig-stage")).toContainText(
    "MICROPHONE ACTIVE",
  );
  expect(
    await page.evaluate(() =>
      (window as any).__tracks.some(
        (t: MediaStreamTrack) => t.readyState === "live",
      ),
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "หยุดไมโครโฟน", exact: true }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as any).__tracks.every(
            (t: MediaStreamTrack) => t.readyState === "ended",
          ) &&
          (window as any).__contexts.every(
            (c: AudioContext) => c.state === "closed",
          ),
      ),
    )
    .toBe(true);
  await page
    .getByRole("button", { name: "ทดสอบเสียงจริง", exact: true })
    .click();
  await page.getByRole("button", { name: "เปิดไมโครโฟน", exact: true }).click();
  await expect(page.locator(".ax-rig-stage")).toContainText(
    "MICROPHONE ACTIVE",
  );
  await page
    .getByRole("navigation", { name: "Preview screens" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as any).__tracks.every(
            (t: MediaStreamTrack) => t.readyState === "ended",
          ) &&
          (window as any).__contexts.every(
            (c: AudioContext) => c.state === "closed",
          ),
      ),
    )
    .toBe(true);
});
test("Permission denial is recoverable and reduced-motion keeps the live rig static", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addInitScript(() => {
    if (top !== window) return;
    navigator.mediaDevices.getUserMedia = async () => {
      throw new DOMException("Microphone denied by test", "NotAllowedError");
    };
  });
  await page.goto("/#/concept/builder");
  await page
    .getByRole("button", { name: "ทดสอบเสียงจริง", exact: true })
    .click();
  await page.getByRole("button", { name: "เปิดไมโครโฟน", exact: true }).click();
  await expect(page.locator('.ax-rig-card [role="alert"]')).toContainText(
    "Microphone denied",
  );
  await expect(page.locator(".ax-mascot-rig")).toHaveAttribute(
    "data-motion",
    "off",
  );
  const before = await page
    .locator(".ax-mascot-rig>svg")
    .evaluate((el) => getComputedStyle(el).transform);
  await page.waitForTimeout(300);
  expect(
    await page
      .locator(".ax-mascot-rig>svg")
      .evaluate((el) => getComputedStyle(el).transform),
  ).toBe(before);
  await expect(
    page.getByRole("button", { name: "ทดสอบเสียงจริง", exact: true }),
  ).toBeEnabled();
});
