import { spawn } from "node:child_process";
import { mkdtempSync, rmSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test("Home → conversation → Create → save → Library → reopen", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByLabel("Your idea", { exact: true })
    .fill("Journey evidence: design a calmer creative studio");
  await page
    .getByRole("button", { name: "Start conversation", exact: true })
    .click();
  await expect(page).toHaveURL(/chat\//);
  await expect(page.getByText("AI is not connected. Messages")).toBeVisible();
  await page
    .getByRole("button", { name: "Open in Create", exact: true })
    .click();
  await expect(page).toHaveURL(/create\//);
  await page
    .getByLabel("Document title", { exact: true })
    .fill("Journey artifact");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByText("Saved locally · revision 2")).toBeVisible();
  await page.goto("/#/library");
  await page.getByPlaceholder("Search your work…").fill("Journey artifact");
  await expect(
    page.getByRole("heading", { name: "Journey artifact" }),
  ).toBeVisible();
  await page
    .getByRole("heading", { name: "Journey artifact" })
    .getByRole("button")
    .click();
  await expect(page.getByLabel("Document title", { exact: true })).toHaveValue(
    "Journey artifact",
  );
  await page.reload();
  await expect(page.getByLabel("Document title", { exact: true })).toHaveValue(
    "Journey artifact",
  );
});
test("Template creates a new document; editor undo and SVG export work", async ({
  page,
}) => {
  await page.goto("/#/templates");
  await page.getByRole("button", { name: /The creative manifesto/ }).click();
  await page.getByRole("button", { name: "Use template" }).click();
  await expect(page).toHaveURL(/create\//);
  await page.getByRole("button", { name: "Add text", exact: true }).click();
  await page
    .getByLabel("Selected text content", { exact: true })
    .fill("Original Thai idea: สร้างสรรค์");
  await page.getByRole("button", { name: "Undo", exact: true }).click();
  await expect(
    page.getByLabel("Selected text content", { exact: true }),
  ).toHaveValue("Your next idea");
  await page.getByRole("button", { name: "Redo", exact: true }).click();
  await expect(
    page.getByLabel("Selected text content", { exact: true }),
  ).toHaveValue("Original Thai idea: สร้างสรรค์");
  const wait = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export SVG" }).click();
  expect((await wait).suggestedFilename()).toMatch(/\.svg$/);
});
test("Research drafts survive navigation and selected material creates document", async ({
  page,
}) => {
  await page.goto("/#/research");
  await page.getByLabel("Note title", { exact: true }).fill("Evidence note");
  await page
    .getByLabel("Research note content")
    .fill("This is original research.\nSecond observation.");
  await page.goto("/#/home");
  await page.goto("/#/research");
  await expect(page.getByLabel("Research note content")).toContainText(
    "This is original research.",
  );
  await page.getByRole("button", { name: "Save note" }).click();
  await expect(page).toHaveURL(/research\//);
  await page.getByRole("button", { name: "To Create", exact: true }).click();
  await expect(page).toHaveURL(/create\//);
  await expect(
    page
      .locator(".canvas-node")
      .filter({ hasText: "This is original research" }),
  ).toBeVisible();
});
test("Local workflow validates, runs and saves a reproducible result", async ({
  page,
}) => {
  await page.goto("/#/automate");
  await page.getByRole("button", { name: "Validate & run" }).click();
  await expect(page.getByRole("alert")).toContainText("Add source text");
  await page.getByLabel("Node source text").fill("First idea\nSecond idea");
  await page.getByRole("button", { name: "Validate & run" }).click();
  await expect(page.locator(".v2-graph-results")).toContainText(
    "1. First idea\n2. Second idea",
  );
  await page.getByRole("button", { name: "Save", exact:true }).click();
  await expect(page.locator(".toast")).toContainText("Saved locally");
});
test("Motion geometry, preset round trip and reduced motion", async ({
  page,
}) => {
  await page.goto("/#/design");
  await page.getByRole("tab", { name: "Motion Lab", exact: true }).click();
  await page.getByLabel("Kinetic geometry", { exact: true }).selectOption("15");
  await page.getByLabel("Kinetic text", { exact: true }).fill("ทดสอบความคิด");
  await page.getByLabel("Reduced motion preview").check();
  await page.getByLabel("Preset name").fill("Test constellation");
  await page.getByRole("button", { name: "Save preset", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Test constellation Kinetic Typography" }),
  ).toBeVisible();
  const presetDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "Export preset", exact: true })
    .click();
  const preset = JSON.parse(
    readFileSync((await (await presetDownload).path())!, "utf8"),
  );
  expect(preset.text).toBe("ทดสอบความคิด");
  await page.getByLabel("Kinetic geometry", { exact: true }).selectOption("0");
  await page.locator(".preset-section input[type=file]").setInputFiles({
    name: "roundtrip.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(preset)),
  });
  await expect(page.getByRole("dialog")).toContainText("Validated data only");
  await page
    .getByRole("button", { name: "Apply to preview", exact: true })
    .click();
  await expect(
    page.getByLabel("Kinetic geometry", { exact: true }),
  ).toHaveValue("15");
  await page.getByRole("button", { name: /03.*Spatial Carousel/ }).click();
  await page.getByRole("button", { name: "Next card" }).click();
  await expect(page.locator(".carousel-controls")).toContainText("4 / 5");
  await page.getByRole("region", { name: /Spatial carousel/ }).focus();
  await page.keyboard.press("Home");
  await expect(page.locator(".carousel-controls")).toContainText("1 / 5");
});
test("API revision conflicts, trash restore, backup validation and origins", async ({
  request,
}) => {
  const create = await request.post("http://127.0.0.1:4312/api/items", {
    data: { title: "API evidence", kind: "note", data: { body: "original" } },
  });
  expect(create.status()).toBe(201);
  const item = await create.json();
  const update = await request.put(
    `http://127.0.0.1:4312/api/items/${item.id}`,
    { data: { ...item, title: "API revision" } },
  );
  expect(update.status()).toBe(200);
  const stale = await request.put(
    `http://127.0.0.1:4312/api/items/${item.id}`,
    { data: item },
  );
  expect(stale.status()).toBe(409);
  const trash = await request.post(
    `http://127.0.0.1:4312/api/items/${item.id}/trash`,
    { data: {} },
  );
  expect((await trash.json()).deletedAt).toBeTruthy();
  const restore = await request.post(
    `http://127.0.0.1:4312/api/items/${item.id}/trash`,
    { data: { restore: true } },
  );
  expect((await restore.json()).deletedAt).toBeNull();
  expect(
    (
      await request.post("http://127.0.0.1:4312/api/restore", {
        data: { schemaVersion: 99, items: [], assets: [] },
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("http://127.0.0.1:4312/api/items", {
        headers: { origin: "https://evil.example" },
        data: item,
      })
    ).status(),
  ).toBe(403);
});
test("No page overflow at target widths and main routes render without runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      "home",
      "templates",
      "create",
      "research",
      "voice",
      "live",
      "automate",
      "library",
      "settings",
      "design",
    ]) {
      await page.goto("/#/" + route);
      await page.waitForTimeout(300);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        `${route} at ${width}`,
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});
test("Home semantics, dialog keyboard and reduced-motion visibility", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "One artist. Infinite worlds." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    results.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("Synthetic microphone → stop → playback → save → Library; tracks stop", async ({
  page,
  context,
}) => {
  await page.addInitScript(() => {
    const original = navigator.mediaDevices.getUserMedia.bind(
      navigator.mediaDevices,
    );
    navigator.mediaDevices.getUserMedia = async (c) => {
      const stream = await original(c);
      (window as any).__avTestTracks = stream.getTracks();
      return stream;
    };
  });
  await context.grantPermissions(["microphone"]);
  await page.goto("/#/voice");
  await page.getByRole("button", { name: "Start recording" }).click();
  await expect(page.getByText("● RECORDING LIVE AUDIO")).toBeVisible();
  await page.waitForTimeout(1200);
  await page.getByRole("button", { name: "Stop recording" }).click();
  await expect(page.locator("audio")).toBeVisible();
  expect(
    await page.evaluate(() =>
      (window as any).__avTestTracks.every(
        (t: MediaStreamTrack) => t.readyState === "ended",
      ),
    ),
  ).toBe(true);
  await page.getByLabel("Recording title").fill("Synthetic microphone test");
  await page.getByRole("button", { name: "Save to Library" }).click();
  await expect(page.getByRole("status")).toContainText("Recording saved");
  await page.goto("/#/library");
  await page
    .getByPlaceholder("Search your work…")
    .fill("Synthetic microphone test");
  await expect(
    page.getByRole("heading", { name: "Synthetic microphone test" }),
  ).toBeVisible();
});
test("Live timer pause, cue presentation and session save", async ({
  page,
}) => {
  await page.goto("/#/live");
  await page.getByRole("button", { name: "Start", exact: true }).click();
  await page.waitForTimeout(1100);
  await page.getByRole("button", { name: "Pause", exact: true }).click();
  const paused = await page.getByRole("timer").textContent();
  await page.waitForTimeout(1100);
  expect(await page.getByRole("timer").textContent()).toBe(paused);
  await page.getByRole("button", { name: "Present cue cards" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("heading", { name: "The main idea", exact: true }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await page.getByRole("button", { name: "Save session", exact: true }).click();
  await expect(page.getByRole("status")).toContainText("Session saved");
});
test("Backup round trip into an empty second database preserves documents, revisions and media", async ({
  request,
}) => {
  const backup = await (
    await request.get("http://127.0.0.1:4312/api/backup")
  ).json();
  expect(backup.assets.length).toBeGreaterThan(0);
  const temp = mkdtempSync(join(tmpdir(), "artyverse-restore-test-"));
  const server = spawn(
    process.execPath,
    ["--experimental-strip-types", "server/index.ts"],
    {
      env: { ...process.env, PORT: "4313", ARTYVERSE_DATA_DIR: temp },
      stdio: "ignore",
    },
  );
  try {
    let ready = false;
    for (let i = 0; i < 30; i++) {
      try {
        const r = await request.get("http://127.0.0.1:4313/api/status");
        if (r.ok()) {
          ready = true;
          break;
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 100));
    }
    expect(ready).toBe(true);
    expect(
      await (await request.get("http://127.0.0.1:4313/api/items")).json(),
    ).toEqual([]);
    const restore = await request.post("http://127.0.0.1:4313/api/restore", {
      data: backup,
    });
    expect(restore.status()).toBe(200);
    const after = await (
      await request.get("http://127.0.0.1:4313/api/backup")
    ).json();
    expect(after.items).toEqual(backup.items);
    expect(after.assets).toEqual(backup.assets);
    expect(after.revisions).toEqual(backup.revisions);
    const media = await request.get(
      "http://127.0.0.1:4313/api/assets/" + backup.assets[0].id,
    );
    expect((await media.body()).toString("base64")).toBe(
      backup.assets[0].base64,
    );
    const bad = structuredClone(backup);
    bad.items[0].data.nodes = "not an array";
    expect(
      (
        await request.post("http://127.0.0.1:4313/api/restore", { data: bad })
      ).status(),
    ).toBe(400);
    expect(
      (await (await request.get("http://127.0.0.1:4313/api/items")).json())
        .length,
    ).toBe(backup.items.length);
  } finally {
    server.kill();
    await new Promise<void>((resolve) => server.once("exit", () => resolve()));
    rmSync(temp, { recursive: true, force: true });
  }
});

test("Document JSON export → validate → preview → apply → save round trip", async ({
  page,
}) => {
  await page.goto("/#/create");
  await page
    .getByRole("button", { name: "Clear selection", exact: true })
    .click();
  const exporting = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export document JSON" }).click();
  const doc = JSON.parse(
    readFileSync((await (await exporting).path())!, "utf8"),
  );
  expect(doc.nodes).toHaveLength(4);
  doc.title = "Import roundtrip";
  doc.nodes[2].text = "Imported idea: ทดสอบ";
  await page.locator(".inspector input[type=file]").setInputFiles({
    name: "document.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(doc)),
  });
  await expect(page.getByRole("dialog")).toContainText(
    "Replace the current browser draft",
  );
  await expect(page.getByLabel("Document title")).not.toHaveValue(
    "Import roundtrip",
  );
  await page.getByRole("button", { name: "Apply to draft" }).click();
  await expect(page.getByLabel("Document title")).toHaveValue(
    "Import roundtrip",
  );
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/create\//);
  await page.reload();
  await expect(
    page.locator(".canvas-node").filter({ hasText: "Imported idea: ทดสอบ" }),
  ).toBeVisible();
});
test("Motion Lab controls have accessible names", async ({ page }) => {
  await page.goto("/#/design");
  await page.getByRole("tab", { name: "Motion Lab", exact: true }).click();
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
});

test("Newer saved revision wins over stale browser cache without losing the draft", async ({
  page,
  request,
}) => {
  await page.goto("/#/create");
  await page.getByLabel("Document title").fill("Draft revision evidence");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/create\//);
  const id = page.url().split("/").at(-1);
  await page.getByLabel("Document title").fill("Unsaved browser thought");
  await page.waitForTimeout(150);
  const item = (
    await (await request.get("http://127.0.0.1:4312/api/items")).json()
  ).find((i: any) => i.id === id);
  expect(item).toBeTruthy();
  expect(
    (
      await request.put("http://127.0.0.1:4312/api/items/" + id, {
        data: { ...item, title: "Newer saved title" },
      })
    ).status(),
  ).toBe(200);
  await page.reload();
  await expect(page.getByLabel("Document title")).toHaveValue(
    "Newer saved title",
  );
  const recover = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download recovered draft" }).click();
  const recovered = JSON.parse(
    readFileSync((await (await recover).path())!, "utf8"),
  );
  expect(recovered.title).toBe("Unsaved browser thought");
});
