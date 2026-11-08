import { test, expect } from "@playwright/test";
import { readFileSync } from "node:fs";
import AxeBuilder from "@axe-core/playwright";

test("Project → code source → saved revision → scoped Library → reopen", async ({
  page,
}) => {
  await page.goto("/#/projects");
  await page.getByRole("button", { name: "New project", exact: true }).click();
  await page.getByLabel("Project name").fill("V2 project evidence");
  await page
    .getByRole("button", { name: "Create project", exact: true })
    .click();
  await expect(
    page.getByRole("heading", { name: "V2 project evidence" }),
  ).toBeVisible();
  await page.goto("/#/code");
  await page.getByLabel("Studio title").fill("V2 scoped code");
  await page
    .getByLabel("HTML source")
    .fill("<main><h1>Artist × Multiverse</h1></main>");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/code\//);
  await page.goto("/#/library");
  await page.getByPlaceholder("Search your work…").fill("V2 scoped code");
  await page
    .getByRole("heading", { name: "V2 scoped code" })
    .getByRole("button")
    .click();
  await expect(page.getByLabel("HTML source")).toHaveValue(
    "<main><h1>Artist × Multiverse</h1></main>",
  );
  await page.reload();
  await expect(page.getByLabel("Studio title")).toHaveValue("V2 scoped code");
});

test("Code sandbox executes on Run, denies parent access, and persists visual CSS edits", async ({
  page,
}) => {
  await page.goto("/#/code");
  await expect(page.getByTitle("Sandboxed code preview")).toHaveCount(0);
  await page.getByRole("button", { name: "Run preview", exact: true }).click();
  const frame = page.frameLocator("iframe");
  await frame.getByRole("button", { name: "A little spark" }).click();
  await expect(frame.locator("em")).toHaveText("possibility.");
  await expect(page.locator(".v2-console")).toContainText("A real interaction");
  await page.getByRole("button", { name: /Inspect/ }).click();
  await frame.locator("h1").click();
  await expect(page.locator(".v2-css-inspector")).toContainText("h1");
  await page.getByLabel("CSS property value").fill("#ff0000");
  await page.getByRole("button", { name: "Apply property" }).click();
  await expect(frame.locator("h1")).toHaveCSS("color", "rgb(255, 0, 0)");
  await page.getByRole("tab", { name: "script.js", exact: true }).click();
  await page
    .getByLabel("JS source")
    .fill(
      "try { console.log(parent.document.title) } catch(e) { console.log('PARENT_ACCESS_DENIED') }",
    );
  await page.getByRole("button", { name: "Run preview", exact: true }).click();
  await expect(page.locator(".v2-console")).toContainText(
    "PARENT_ACCESS_DENIED",
  );
});

test("Source import is validated and reviewed; undo/redo restore the document", async ({
  page,
}) => {
  await page.goto("/#/code");
  const original = await page.getByLabel("HTML source").inputValue();
  await page.getByLabel("Import studio source").setInputFiles({
    name: "source.json",
    mimeType: "application/json",
    buffer: Buffer.from(
      JSON.stringify({
        schemaVersion: 2,
        html: "<h1>Imported source</h1>",
        css: "body { color: white; }",
        js: "",
        overrides: [],
      }),
    ),
  });
  await expect(page.getByRole("dialog")).toContainText("Imported source");
  await expect(page.getByTitle("Sandboxed code preview")).toHaveCount(0);
  await page.getByRole("button", { name: "Apply imported source" }).click();
  await expect(page.getByLabel("HTML source")).toHaveValue(
    "<h1>Imported source</h1>",
  );
  await page.getByRole("button", { name: "Undo studio change" }).click();
  await expect(page.getByLabel("HTML source")).toHaveValue(original);
  await page.getByRole("button", { name: "Redo studio change" }).click();
  await expect(page.getByLabel("HTML source")).toHaveValue(
    "<h1>Imported source</h1>",
  );
  await page.getByLabel("Import studio source").setInputFiles({
    name: "bad.json",
    mimeType: "application/json",
    buffer: Buffer.from('{"schemaVersion":2,"html":123}'),
  });
  await expect(page.getByRole("alert")).toContainText("Import rejected");
});

test("Local agent and unavailable-provider fallback have honest provenance and retained artifacts", async ({
  page,
  request,
}) => {
  await page.goto("/#/agents");
  await page
    .getByLabel("Agent prompt")
    .fill("First original idea\nSecond original idea");
  await page.getByRole("button", { name: "Run agent task" }).click();
  await expect(page.locator(".v2-agent-output")).toContainText("LOCAL-TOOL");
  await expect(page.locator(".v2-agent-result")).toContainText(
    "1. First original idea",
  );
  await page
    .getByRole("button", { name: "Open in Create", exact: true })
    .click();
  await expect(page).toHaveURL(/create\//);
  const result = await request.post("/api/agent/run", {
    data: {
      prompt: "Unavailable provider evidence",
      mode: "connected",
      fallback: true,
    },
  });
  expect(result.ok()).toBeTruthy();
  const run = (await result.json()).item;
  expect(run.data.provenance).toBe("local-fallback");
  expect(run.data.fallbackReason).toContain("not configured");
  const failed = await request.post("/api/agent/run", {
    data: { prompt: "No hidden fallback", mode: "connected", fallback: false },
  });
  expect(failed.status()).toBe(503);
  expect((await failed.json()).item.data.status).toBe("error");
});

test("Graph connections reject cycles and save executed artifacts", async ({
  page,
}) => {
  await page.goto("/#/automate");
  await page.getByLabel("Node source text").fill("An original graph idea");
  await page.getByRole("button", { name: "Validate & run graph" }).click();
  await expect(page.locator(".v2-graph-results")).toContainText(
    "4 OF 4 NODES COMPLETED",
  );
  await expect(
    page.getByRole("link", { name: "Open saved artifact" }),
  ).toBeVisible();
  await page
    .getByLabel("Connection from")
    .selectOption({ label: "Review the result" });
  await page.getByLabel("Connection to").selectOption({ label: "Your brief" });
  await page.getByRole("button", { name: "Connect nodes" }).click();
  await page.getByRole("button", { name: "Validate & run graph" }).click();
  await expect(page.getByRole("alert")).toContainText("cycle");
});

test("Sound synthesis exports nonzero PCM WAV, saves playable audio, and closes AudioContext", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const Native = window.AudioContext;
    (window as any).__audio = [];
    window.AudioContext = class extends Native {
      constructor(...a: any[]) {
        super(...a);
        (window as any).__audio.push(this);
      }
    } as typeof AudioContext;
  });
  await page.goto("/#/sound");
  await page
    .getByRole("button", { name: "Play sequence", exact: true })
    .click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => (window as any).__audio.at(-1)?.state))
    .toBe("running");
  const pending = page.waitForEvent("download");
  await page.getByRole("button", { name: "Export WAV", exact: true }).click();
  const file = await pending,
    bytes = readFileSync((await file.path())!);
  expect(bytes.toString("ascii", 0, 4)).toBe("RIFF");
  expect(bytes.readUInt32LE(24)).toBe(44100);
  expect(bytes.subarray(44).some((b) => b !== 0)).toBeTruthy();
  await page.getByRole("button", { name: "Render to Library" }).click();
  await expect(page.getByRole("status").last()).toContainText(
    "Rendered audio saved",
  );
  await page.getByRole("link", { name: "Home", exact: true }).click();
  await expect
    .poll(() => page.evaluate(() => (window as any).__audio.at(-1)?.state))
    .toBe("closed");
});

test("Dynamics parameters save and restore; sensor starts only on request", async ({
  page,
}) => {
  await page.goto("/#/dynamics");
  await page.getByLabel("Studio title").fill("Physics evidence");
  await expect(page.locator(".v2-sensor")).toContainText("off");
  await page.getByRole("button", { name: "Add body" }).click();
  await expect(page.locator(".v2-body-list button")).toHaveCount(4);
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/dynamics\//);
  await page.reload();
  await expect(page.locator(".v2-body-list button")).toHaveCount(4);
  await page.getByRole("button", { name: "Delete selected body" }).click();
  await expect(page.locator(".v2-body-list button")).toHaveCount(3);
  await page.getByRole("button", { name: "Undo studio change" }).click();
  await expect(page.locator(".v2-body-list button")).toHaveCount(4);
});

test("Story scripts, timeline, linked documents and presentation share saved sources", async ({
  page,
  request,
}) => {
  const doc = await request.post("/api/items", {
    data: {
      kind: "document",
      title: "Linked story art",
      data: { width: 960, height: 540, nodes: [] },
    },
  });
  const item = await doc.json();
  await page.goto("/#/story");
  await page
    .getByLabel("Scene title", { exact: true })
    .fill("Our opening scene");
  await page.getByLabel("Speaker script").fill("Real editable speaker notes");
  await page.getByLabel("Linked document").selectOption(item.id);
  await page.getByRole("button", { name: "Add scene", exact: true }).click();
  await page
    .getByLabel("Scene title", { exact: true })
    .fill("Our second scene");
  await page.getByRole("button", { name: "Present story" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toContainText("Our second scene");
  await dialog.getByRole("button", { name: "← Previous" }).click();
  await expect(
    dialog.getByRole("img", { name: "Linked story art" }),
  ).toBeVisible();
  await dialog.getByRole("button", { name: "Exit presentation" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/story\//);
  await page.reload();
  await expect(page.locator(".v2-scene-list")).toContainText(
    "Our second scene",
  );
});

test("New workspaces render without page overflow or runtime errors across six widths", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (const width of [320, 390, 768, 1024, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1000 });
    for (const route of [
      "projects",
      "agents",
      "code",
      "sound",
      "dynamics",
      "story",
      "automate",
      "system",
    ]) {
      await page.goto("/#/" + route);
      await page.getByRole("main").waitFor();
      await page.waitForTimeout(160);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
        route + " at " + width,
      ).toBe(true);
    }
  }
  expect(errors).toEqual([]);
});

test("New workbench controls pass automated WCAG checks in static states", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of [
    "projects",
    "agents",
    "code",
    "sound",
    "dynamics",
    "story",
    "automate",
    "system",
  ]) {
    await page.goto("/#/" + route);
    await page.waitForTimeout(250);
    const r = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      r.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => n.target),
      })),
      route,
    ).toEqual([]);
  }
});

test("Provider adapter contract: priced fixture response, cache, budget block, failure fallback and cancellation", async ({
  request,
}) => {
  const { createServer } = await import("node:http"),
    { spawn } = await import("node:child_process"),
    { mkdtempSync } = await import("node:fs"),
    { tmpdir } = await import("node:os"),
    { join } = await import("node:path");
  let calls = 0;
  const fixture = createServer(async (req, res) => {
    let body = "";
    for await (const chunk of req) body += chunk;
    calls++;
    const data = JSON.parse(body),
      text = data.messages.at(-1).content;
    if (text.includes("FAIL")) {
      res.writeHead(429);
      res.end("{}");
      return;
    }
    if (text.includes("SLOW")) {
      setTimeout(() => {
        if (!res.destroyed) {
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              choices: [{ message: { content: "delayed fixture" } }],
            }),
          );
        }
      }, 2000);
      return;
    }
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        model: "contract-test-fixture",
        choices: [{ message: { content: "Fixture result: " + text } }],
        usage: { prompt_tokens: 12, completion_tokens: 8, total_tokens: 20 },
      }),
    );
  });
  await new Promise<void>((r) => fixture.listen(0, "127.0.0.1", r));
  const address = fixture.address() as any;
  const child = spawn(
    process.execPath,
    ["--experimental-strip-types", "server/index.ts"],
    {
      env: {
        ...process.env,
        PORT: "4316",
        ARTYVERSE_DATA_DIR: mkdtempSync(join(tmpdir(), "av-v2-provider-")),
        ARTYVERSE_AI_KEY: "local-test-fixture-only",
        ARTYVERSE_AI_MODEL: "contract-test-fixture",
        ARTYVERSE_AI_BASE_URL: `http://127.0.0.1:${address.port}`,
        ARTYVERSE_AI_INPUT_USD_PER_MILLION: "1",
        ARTYVERSE_AI_OUTPUT_USD_PER_MILLION: "2",
      },
      stdio: "ignore",
    },
  );
  try {
    await expect
      .poll(async () => {
        try {
          return (
            await request.get("http://127.0.0.1:4316/api/agent/status")
          ).status();
        } catch {
          return 0;
        }
      })
      .toBe(200);
    const url = "http://127.0.0.1:4316/api/agent/run",
      base = {
        mode: "connected",
        tool: "outline",
        fallback: true,
        cache: true,
        budgetUsd: 1,
      };
    const a = (
      await (
        await request.post(url, { data: { ...base, prompt: "priced fixture" } })
      ).json()
    ).item;
    expect(a.data.provenance).toBe("provider");
    expect(a.data.costUsd).toBeCloseTo(0.000028);
    const b = (
      await (
        await request.post(url, { data: { ...base, prompt: "priced fixture" } })
      ).json()
    ).item;
    expect(b.data.provenance).toBe("provider-cache");
    expect(b.data.costUsd).toBe(0);
    expect(calls).toBe(1);
    const budget = (
      await (
        await request.post(url, {
          data: { ...base, prompt: "budget block", budgetUsd: 0 },
        })
      ).json()
    ).item;
    expect(budget.data.provenance).toBe("local-fallback");
    expect(calls).toBe(1);
    const fail = (
      await (
        await request.post(url, { data: { ...base, prompt: "FAIL provider" } })
      ).json()
    ).item;
    expect(fail.data.provenance).toBe("local-fallback");
    expect(fail.data.costUsd).toBeNull();
    const runId = crypto.randomUUID(),
      pending = request.post(url, {
        headers: { "X-Request-Id": runId },
        data: { ...base, prompt: "SLOW provider", cache: false },
      });
    await expect.poll(() => calls).toBe(3);
    await request.post("http://127.0.0.1:4316/api/agent/cancel/" + runId, {
      data: {},
    });
    const cancelled = await pending;
    expect(cancelled.status()).toBe(408);
    expect((await cancelled.json()).item.data.status).toBe("cancelled");
  } finally {
    child.kill();
    fixture.closeAllConnections();
    await new Promise<void>((r) => fixture.close(() => r()));
  }
});

test("Multi-step local agent graph records two independent runs and a saved note", async ({
  page,
  request,
}) => {
  const before = (await (await request.get("/api/items")).json()).filter(
    (i: any) => i.kind === "agent-run",
  ).length;
  const nodes = [
    {
      id: "in",
      type: "input",
      label: "Brief",
      x: 40,
      y: 90,
      config: { text: "สร้างสรรค์\nโปร่งใส" },
    },
    {
      id: "outline",
      type: "agent",
      label: "Structure",
      x: 300,
      y: 90,
      config: { tool: "outline", mode: "local" },
    },
    {
      id: "analysis",
      type: "agent",
      label: "Analyze",
      x: 560,
      y: 90,
      config: { tool: "analyze", mode: "local" },
    },
    {
      id: "note",
      type: "note",
      label: "Save evidence",
      x: 820,
      y: 90,
      config: { title: "Multi-step evidence note" },
    },
  ];
  const graph = {
    schemaVersion: 2,
    nodes,
    edges: [
      ["in", "outline"],
      ["outline", "analysis"],
      ["analysis", "note"],
    ].map(([from, to], i) => ({ id: "edge" + i, from, to, port: "out" })),
  };
  await page.goto("/#/automate");
  await page
    .getByLabel("Import studio source")
    .setInputFiles({
      name: "pipeline.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(graph)),
    });
  await page.getByRole("button", { name: "Apply imported source" }).click();
  await page.getByRole("button", { name: "Validate & run graph" }).click();
  await expect(page.locator(".v2-graph-results")).toContainText(
    "4 OF 4 NODES COMPLETED",
  );
  const records = await (await request.get("/api/items")).json();
  expect(records.filter((i: any) => i.kind === "agent-run").length).toBe(
    before + 2,
  );
  const note = records.find((i: any) => i.title === "Multi-step evidence note");
  expect(note.data.body).toContain("Local text statistics, not AI inference");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page).toHaveURL(/automate\//);
  await page.reload();
  await expect(page.locator(".v2-graph-results")).toContainText(
    "4 OF 4 NODES COMPLETED",
  );
});

test("Corrupt advanced draft recovers safely and wrong-kind deep link shows missing state", async ({
  page,
  request,
}) => {
  await page.addInitScript(() =>
    localStorage.setItem(
      "av-draft:v2:code:new",
      JSON.stringify({ broken: true }),
    ),
  );
  await page.goto("/#/code");
  await expect(page.getByLabel("HTML source")).toContainText("Make room");
  expect(
    await page.evaluate(() => localStorage.getItem("av-recovery:v2:code:new")),
  ).toContain("broken");
  const item = await (
    await request.post("/api/items", {
      data: {
        kind: "note",
        title: "Wrong-kind record",
        data: { body: "Preserved" },
      },
    })
  ).json();
  await page.goto("/#/code/" + item.id);
  await expect(
    page.getByRole("heading", { name: "Code document not found" }),
  ).toBeVisible();
});
