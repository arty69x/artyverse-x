import { useUI } from "../v3/i18n";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Square,
  ArrowUpRight,
  Download,
  Copy,
  ShieldCheck,
  Workflow,
  Coins,
  Braces,
  CheckCircle2,
} from "lucide-react";
import { useStore, useDraft, request, download } from "../core/store";
import { Button, PageHead } from "../components/UI";
import { defaultNodes } from "../../shared/schema";
import { ErrorNotice, ToolNote } from "./shared";
import type { Item } from "../../shared/schema";
import type { Navigate } from "../App";
export function Agents({ go, id }: { go: Navigate; id?: string }) {
  const ui = useUI();

  const s = useStore(),
    [prompt, setPrompt] = useDraft("v2:agent:prompt", ""),
    [mode, setMode] = useState("local"),
    [tool, setTool] = useState("outline"),
    [fallback, setFallback] = useState(true),
    [cache, setCache] = useState(true),
    [budget, setBudget] = useState(0.1),
    [limit, setLimit] = useState(512),
    [unknown, setUnknown] = useState(false),
    [status, setStatus] = useState<any>(null),
    [run, setRun] = useState<Item | null>(
      () => s.items.find((i) => i.id === id) || null,
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const controller = useRef<AbortController | null>(null),
    runId = useRef("");
  useEffect(() => {
    request("/agent/status")
      .then(setStatus)
      .catch((e) => setError(String(e)));
    return () => controller.current?.abort();
  }, []);
  const history = s.scopedItems
    .filter((i) => i.kind === "agent-run" && !i.deletedAt)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  async function execute() {
    if (busy || !prompt.trim()) return;
    setBusy(true);
    setError("");
    controller.current = new AbortController();
    runId.current = crypto.randomUUID();
    try {
      const response = await fetch("/api/agent/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Request-Id": runId.current,
        },
        body: JSON.stringify({
          prompt,
          mode,
          tool,
          fallback,
          cache,
          budgetUsd: budget,
          maxOutputTokens: limit,
          allowUnknownCost: unknown,
          projectId: s.activeProject || undefined,
        }),
        signal: controller.current.signal,
      });
      const data = await response.json();
      if (data.item) setRun(data.item);
      await s.refresh();
      if (!response.ok) throw Error(data.error);
      setStatus(await request("/agent/status"));
    } catch (e) {
      setError(
        e instanceof DOMException && e.name === "AbortError"
          ? "Request cancelled. No simulated response was substituted."
          : String(e),
      );
    } finally {
      setBusy(false);
      controller.current = null;
    }
  }
  async function artifact() {
    if (!run?.data.text) return;
    try {
      const item = await s.create("document", run.title, {
        width: 960,
        height: 540,
        nodes: defaultNodes(String(run.data.text).slice(0, 400)),
        sourceId: run.id,
      });
      go("create", item.id);
    } catch (e) {
      setError(String(e));
    }
  }
  const estimate = status?.pricing
    ? ((new TextEncoder().encode(prompt).length + 128) *
        status.pricing.inputPerMillion +
        limit * status.pricing.outputPerMillion) /
      1e6
    : null;
  return (
    <div className="page v2-page">
      <PageHead
        index="THINK / ANALYZE / DRIVE"
        title={ui("Agent Studio")}
        description="Local tools first. Connected intelligence when configured. Every result shows its source, usage and cost boundary."
      />
      <div className="v2-agent-layout">
        <section className="v2-agent-input">
          <div className="v2-panel-heading">
            <span className="eyebrow">01 / YOUR INTENT</span>
            <span className="state-badge">
              {mode === "local"
                ? "LOCAL ENGINE"
                : status?.provider === "configured"
                  ? "SERVER PROVIDER"
                  : "NOT CONNECTED"}
            </span>
          </div>
          <label className="v2-prompt-label">
            {ui("What are you working on?")}
            <textarea
              aria-label="Agent prompt"
              rows={10}
              maxLength={24000}
              placeholder="A question, source material, or a creative brief…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </label>
          <div className="two-col">
            <label>
              {ui("Execution mode")}
              <select value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="local">{ui("Local deterministic tools")}</option>
                <option value="connected">{ui("Connected provider")}</option>
              </select>
            </label>
            <label>
              {ui("Task")}
              <select value={tool} onChange={(e) => setTool(e.target.value)}>
                <option value="outline">{ui("Structure an outline")}</option>
                <option value="analyze">{ui("Analyze text")}</option>
                <option value="brief">{ui("Build a brief structure")}</option>
              </select>
            </label>
          </div>
          <div className="v2-policy">
            <span className="eyebrow">COST & FALLBACK POLICY</span>
            <div className="two-col">
              <label>
                {ui("Request budget / USD")}
                <input
                  aria-label="Request budget"
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  value={budget}
                  onChange={(e) =>
                    setBudget(
                      Math.min(100, Math.max(0, Number(e.target.value))),
                    )
                  }
                />
              </label>
              <label>
                {ui("Output token cap")}
                <input
                  type="number"
                  min={32}
                  max={4096}
                  step={32}
                  value={limit}
                  onChange={(e) =>
                    setLimit(
                      Math.max(32, Math.min(4096, Number(e.target.value))),
                    )
                  }
                />
              </label>
            </div>
            <label className="v2-check">
              <input
                type="checkbox"
                checked={fallback}
                onChange={(e) => setFallback(e.target.checked)}
              />
              {ui("Use clearly labeled local fallback if provider fails")}
            </label>
            <label className="v2-check">
              <input
                type="checkbox"
                checked={cache}
                onChange={(e) => setCache(e.target.checked)}
              />
              {ui("Reuse identical responses from this server session")}
            </label>
            {mode === "connected" && estimate === null && (
              <label className="v2-check">
                <input
                  type="checkbox"
                  checked={unknown}
                  onChange={(e) => setUnknown(e.target.checked)}
                />
                {ui("I accept that provider price is unknown")}
              </label>
            )}
            <p className="v2-caption">
              {mode === "local"
                ? "No provider request. This local tool has no API charge."
                : estimate === null
                  ? "Cost estimate unavailable. Configure actual rates server-side."
                  : `Estimated request cost: $${estimate.toFixed(6)}. Byte-count allowance, not a tokenizer or a billing guarantee.`}
            </p>
          </div>
          <div className="button-row">
            <Button
              variant="primary"
              disabled={busy || !prompt.trim()}
              onClick={() => void execute()}
            >
              <Play size={15} />
              {busy ? "Executing…" : "Run agent task"}
            </Button>
            {busy && (
              <Button
                onClick={() => {
                  void request("/agent/cancel/" + runId.current, {});
                  controller.current?.abort();
                }}
              >
                <Square size={15} />
                {ui("Cancel")}
              </Button>
            )}
          </div>
          <ErrorNotice message={error} />
        </section>
        <section className="v2-agent-output">
          <div className="v2-panel-heading">
            <span className="eyebrow">02 / RESULT & EVIDENCE</span>
            {run && (
              <span className="state-badge">
                {String(run.data.provenance).toUpperCase()}
              </span>
            )}
          </div>
          {run ? (
            <>
              <h2>{run.title}</h2>
              {run.data.fallbackReason && (
                <ToolNote>
                  Local fallback was used: {run.data.fallbackReason}. This
                  output is a deterministic tool result, not AI inference.
                </ToolNote>
              )}
              <pre className="v2-agent-result">
                {run.data.text || run.data.error || "No output."}
              </pre>
              <div className="v2-result-metadata">
                <span>
                  {ui("Duration")}
                  <strong>{run.data.elapsedMs} ms</strong>
                </span>
                <span>
                  {ui("Provider cost")}
                  <strong>
                    {run.data.costUsd === null
                      ? "Unknown"
                      : "$" + Number(run.data.costUsd).toFixed(6)}
                  </strong>
                </span>
                <span>
                  {ui("Tokens")}
                  <strong>
                    {run.data.usage?.total_tokens ?? "Not used / unknown"}
                  </strong>
                </span>
                <span>
                  {ui("API call avoided")}
                  <strong>{run.data.cached ? "Yes · cache hit" : "No"}</strong>
                </span>
              </div>
              <div className="button-row">
                <Button
                  disabled={!run.data.text}
                  onClick={() => void artifact()}
                >
                  {ui("Open in Create")}
                  <ArrowUpRight size={15} />
                </Button>
                <Button
                  onClick={() =>
                    download("agent-result.json", JSON.stringify(run, null, 2))
                  }
                >
                  <Download size={15} />
                  {ui("Export run")}
                </Button>
                <Button
                  onClick={() =>
                    void navigator.clipboard
                      .writeText(run.data.text || "")
                      .then(() => s.toast("Copied"))
                      .catch(() => s.toast("Clipboard unavailable"))
                  }
                >
                  <Copy size={15} />
                  {ui("Copy")}
                </Button>
              </div>
            </>
          ) : (
            <div className="v2-agent-empty">
              <Workflow size={38} />
              <h2>Intent → action → evidence.</h2>
              <p>
                Run a local tool or a configured provider. No generated answer
                or progress is simulated.
              </p>
              <div className="v2-agent-principles">
                <span>
                  <ShieldCheck size={16} />
                  {ui("Transparent source")}
                </span>
                <span>
                  <Coins size={16} />
                  {ui("Bounded requests")}
                </span>
                <span>
                  <Braces size={16} />
                  {ui("Real tool outputs")}
                </span>
              </div>
            </div>
          )}
          <div className="v2-run-history">
            <span className="eyebrow">
              RECENT EXECUTIONS / {history.length}
            </span>
            {history.slice(0, 8).map((i) => (
              <button key={i.id} onClick={() => setRun(i)}>
                <span>
                  {i.title}
                  <small>
                    {i.data.provenance} · {i.data.status}
                  </small>
                </span>
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
