import type { Express, Request, Response } from "express";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import type { DatabaseSync } from "node:sqlite";
const inputSchema = z.object({
  prompt: z.string().trim().min(1).max(24000),
  mode: z.enum(["local", "connected"]),
  tool: z.enum(["outline", "analyze", "brief"]).default("outline"),
  maxOutputTokens: z.number().int().min(32).max(4096).default(512),
  budgetUsd: z.number().min(0).max(100).default(0.1),
  allowUnknownCost: z.boolean().default(false),
  fallback: z.boolean().default(true),
  cache: z.boolean().default(true),
  projectId: z.string().uuid().optional(),
});
export function registerAgent(app: Express, db: DatabaseSync) {
  const inflight = new Map<string, AbortController>(),
    cache = new Map<string, { text: string; model: string; usage: any }>();
  const key = process.env.ARTYVERSE_AI_KEY,
    model = process.env.ARTYVERSE_AI_MODEL;
  const connected = !!key && !!model;
  const inputRate = Number(process.env.ARTYVERSE_AI_INPUT_USD_PER_MILLION),
    outputRate = Number(process.env.ARTYVERSE_AI_OUTPUT_USD_PER_MILLION);
  const priced =
    Number.isFinite(inputRate) &&
    Number.isFinite(outputRate) &&
    inputRate >= 0 &&
    outputRate >= 0;
  const base = process.env.ARTYVERSE_AI_BASE_URL || "https://api.openai.com/v1";
  app.get("/api/agent/status", (_req, res) =>
    res.json({
      provider: connected ? "configured" : "unavailable",
      model: connected ? model : null,
      pricing: priced
        ? { inputPerMillion: inputRate, outputPerMillion: outputRate }
        : null,
      localTools: ["outline", "analyze", "brief"],
      cachedResponses: cache.size,
      externalActions: "unavailable",
    }),
  );
  app.post("/api/agent/cancel/:id", (req, res) => {
    const controller = inflight.get(String(req.params.id));
    if (controller) controller.abort();
    res.json({ cancelled: !!controller });
  });
  app.post("/api/agent/run", async (req: Request, res: Response) => {
    const parsed = inputSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Invalid agent request" });
      return;
    }
    const input = parsed.data,
      id =
        typeof req.headers["x-request-id"] === "string" &&
        /^[a-z0-9-]{36}$/.test(req.headers["x-request-id"])
          ? req.headers["x-request-id"]
          : randomUUID(),
      began = Date.now(),
      controller = new AbortController();
    if (
      inflight.has(id) ||
      db.prepare("SELECT id FROM items WHERE id=?").get(id)
    ) {
      res
        .status(409)
        .json({ error: "Request ID already used. Start a new run." });
      return;
    }
    inflight.set(id, controller);
    const timeout = setTimeout(() => controller.abort(), 60000);
    let provenance = "local-tool",
      text = "",
      usage: any = null,
      costUsd: number | null = null,
      cached = false,
      attemptedProvider = false,
      fallbackReason: string | null = null,
      usedModel: string | null = null;
    const estimatedInputTokens = Buffer.byteLength(input.prompt, "utf8") + 128,
      estimatedCost = priced
        ? (estimatedInputTokens * inputRate +
            input.maxOutputTokens * outputRate) /
          1e6
        : null;
    const local = () => {
      const lines = input.prompt
        .split(/\n+/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (input.tool === "outline")
        return lines.map((s, i) => `${i + 1}. ${s}`).join("\n");
      if (input.tool === "analyze") {
        const words = Array.from(
          new Intl.Segmenter(undefined, { granularity: "word" }).segment(
            input.prompt,
          ),
        ).filter((x) => x.isWordLike);
        return JSON.stringify(
          {
            method: "Local text statistics, not AI inference",
            words: words.length,
            graphemes: Array.from(
              new Intl.Segmenter(undefined, {
                granularity: "grapheme",
              }).segment(input.prompt),
            ).length,
            lines: lines.length,
            uniqueWords: new Set(
              words.map((x) => x.segment.toLocaleLowerCase()),
            ).size,
          },
          null,
          2,
        );
      }
      return `# Working brief\n\n## Source material\n${input.prompt}\n\n## Decisions to make\n- Intended audience\n- Desired outcome\n- Constraints\n- Evidence for completion\n\nLocal structure template. No AI inference was used.`;
    };
    const persist = (status: string, error?: string) => {
      const now = new Date().toISOString();
      const item = {
        id,
        schemaVersion: 1,
        kind: "agent-run",
        title: input.prompt.slice(0, 100),
        revision: 1,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        data: {
          schemaVersion: 2,
          prompt: input.prompt,
          text,
          tool: input.tool,
          provenance,
          status,
          error,
          model: usedModel,
          usage,
          costUsd,
          cached,
          fallbackReason,
          elapsedMs: Date.now() - began,
          estimatedInputTokens,
          estimateMethod:
            "UTF-8 byte-count allowance including system overhead; not a tokenizer or billing guarantee",
          estimatedCostUsd: estimatedCost,
          projectId: input.projectId,
        },
      };
      const json = JSON.stringify(item);
      db.prepare("INSERT INTO items VALUES(?,?)").run(id, json);
      db.prepare("INSERT INTO revisions VALUES(?,?,?)").run(id, 1, json);
      return item;
    };
    res.on("close", () => {
      if (!res.writableEnded) controller.abort();
    });
    try {
      if (input.mode === "connected") {
        if (!connected) throw Error("AI provider is not configured");
        if (estimatedCost === null && !input.allowUnknownCost)
          throw Error(
            "Price is unknown. Enable unknown-cost execution explicitly or configure rates.",
          );
        if (estimatedCost !== null && estimatedCost > input.budgetUsd)
          throw Error(
            "Estimated request cost exceeds this budget; no provider request sent",
          );
        const hash = createHash("sha256")
          .update(
            model +
              "\n" +
              input.maxOutputTokens +
              "\n" +
              input.tool +
              "\n" +
              input.prompt,
          )
          .digest("hex");
        const existing = input.cache ? cache.get(hash) : null;
        if (existing) {
          ({ text, usage } = existing);
          usedModel = existing.model;
          cached = true;
          costUsd = 0;
          provenance = "provider-cache";
        } else {
          attemptedProvider = true;
          const response = await fetch(
            base.replace(/\/$/, "") + "/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: "Bearer " + key,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model,
                messages: [
                  {
                    role: "system",
                    content:
                      "You are ARTYVERSE. Be creative, transparent about uncertainty, and support claims with evidence. The requested task is " +
                      input.tool +
                      ".",
                  },
                  { role: "user", content: input.prompt },
                ],
                max_tokens: input.maxOutputTokens,
              }),
              signal: controller.signal,
            },
          );
          if (!response.ok)
            throw Error(
              "Provider request failed (HTTP " + response.status + ")",
            );
          const data: any = await response.json();
          text = data.choices?.[0]?.message?.content;
          if (typeof text !== "string")
            throw Error("Provider returned no text");
          usage = data.usage || null;
          usedModel = data.model || model!;
          costUsd =
            priced &&
            typeof usage?.prompt_tokens === "number" &&
            typeof usage?.completion_tokens === "number"
              ? (usage.prompt_tokens * inputRate +
                  usage.completion_tokens * outputRate) /
                1e6
              : null;
          provenance = "provider";
          if (input.cache) {
            if (cache.size >= 50) cache.delete(cache.keys().next().value!);
            cache.set(hash, { text, usage, model: usedModel! });
          }
        }
      } else {
        text = local();
        costUsd = 0;
      }
      controller.signal.throwIfAborted();
      const item = persist("complete");
      res.json({ id, item });
    } catch (e) {
      const message = controller.signal.aborted
        ? "Request cancelled or timed out"
        : e instanceof Error
          ? e.message
          : "Request failed";
      if (
        input.mode === "connected" &&
        input.fallback &&
        !controller.signal.aborted
      ) {
        fallbackReason = message;
        provenance = "local-fallback";
        usedModel = null;
        usage = null;
        costUsd = attemptedProvider ? null : 0;
        text = local();
        const item = persist("complete");
        res.json({ id, item });
      } else {
        const item = persist(
          controller.signal.aborted ? "cancelled" : "error",
          message,
        );
        if (!res.headersSent)
          res
            .status(controller.signal.aborted ? 408 : 503)
            .json({ error: message, id, item });
      }
    } finally {
      clearTimeout(timeout);
      inflight.delete(id);
    }
  });
}
