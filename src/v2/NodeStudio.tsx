import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Play,
  Square,
  Trash2,
  Link2,
  Download,
  ArrowUpRight,
  Unplug,
  Check,
} from "lucide-react";
import { Button } from "../components/UI";
import { defaultNodes } from "../../shared/schema";
import {
  freshGraph,
  graphNodeTypes,
  graphSchema,
  type Graph,
  type GraphNode,
} from "../../shared/v2/contracts";
import {
  validateGraph,
  executeGraph,
  type NodeResult,
} from "../../shared/v2/graph";
import {
  useStudio,
  StudioHead,
  Missing,
  ErrorNotice,
  ToolNote,
} from "./shared";
import { download } from "../core/store";
export function NodeStudio({ id }: { id?: string }) {
  const st = useStudio(
      "workflow",
      id,
      { graph: freshGraph(), result: "", execution: [] as NodeResult[] },
      "Untitled workflow",
    ),
    { s, value, setValue } = st;
  const graph: Graph =
    value.graph?.schemaVersion === 2 ? value.graph : freshGraph();
  const [selected, setSelected] = useState<string>(graph.nodes[0]?.id || ""),
    [newType, setNewType] = useState<GraphNode["type"]>("trim"),
    [from, setFrom] = useState(""),
    [to, setTo] = useState(""),
    [port, setPort] = useState<"out" | "true" | "false">("out"),
    [events, setEvents] = useState<NodeResult[]>(value.execution || []),
    [running, setRunning] = useState(false),
    [issues, setIssues] = useState<ReturnType<typeof validateGraph>>([]),
    [zoom, setZoom] = useState(0.8);
  const abort = useRef<AbortController | null>(null),
    drag = useRef<{
      id: string;
      x: number;
      y: number;
      ox: number;
      oy: number;
    } | null>(null),
    node = graph.nodes.find((n) => n.id === selected);
  useEffect(() => () => abort.current?.abort(), []);
  function change(g: Graph) {
    setValue((v) => ({ ...v, graph: g }));
    setIssues([]);
  }
  function update(config: Record<string, unknown>) {
    change({
      ...graph,
      nodes: graph.nodes.map((n) =>
        n.id === selected ? { ...n, config: { ...n.config, ...config } } : n,
      ),
    });
  }
  function add() {
    const n: GraphNode = {
      id: crypto.randomUUID(),
      type: newType,
      label:
        newType === "input"
          ? "Source text"
          : newType[0].toUpperCase() + newType.slice(1),
      x: 50 + (graph.nodes.length % 4) * 270,
      y: 90 + Math.floor(graph.nodes.length / 4) * 210,
      config:
        newType === "input"
          ? { text: "" }
          : newType === "replace"
            ? { find: "", replacement: "" }
            : {},
    };
    change({ ...graph, nodes: [...graph.nodes, n] });
    setSelected(n.id);
  }
  function connect() {
    if (!from || !to || from === to) {
      st.setError("Choose two different nodes.");
      return;
    }
    if (
      graph.edges.some((e) => e.from === from && e.to === to && e.port === port)
    ) {
      st.setError("This connection already exists.");
      return;
    }
    change({
      ...graph,
      edges: [...graph.edges, { id: crypto.randomUUID(), from, to, port }],
    });
    st.setError("");
  }
  async function run() {
    const found = validateGraph(graph);
    setIssues(found);
    if (found.length) return;
    setRunning(true);
    setEvents([]);
    st.setError("");
    abort.current = new AbortController();
    try {
      const results = await executeGraph(graph, {
        signal: abort.current.signal,
        onEvent: (r) =>
          setEvents((old) => [...old.filter((x) => x.id !== r.id), r]),
        agent: async (text, config) => {
          const response = await fetch("/api/agent/run", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            signal: abort.current!.signal,
            body: JSON.stringify({
              prompt: text,
              mode: config.mode === "connected" ? "connected" : "local",
              tool: config.tool || "outline",
              fallback: config.fallback !== false,
              cache: true,
              budgetUsd: Number(config.budgetUsd ?? 0.1),
              maxOutputTokens: 512,
              allowUnknownCost: false,
              projectId: s.activeProject || undefined,
            }),
          });
          const data = await response.json();
          await s.refresh();
          if (!response.ok) throw Error(data.error);
          return {
            text: data.item.data.text,
            runId: data.item.id,
            provenance: data.item.data.provenance,
          };
        },
        artifact: async (kind, title, text) => {
          const i = await s.create(
            kind,
            title,
            kind === "document"
              ? {
                  width: 960,
                  height: 540,
                  nodes: defaultNodes(text.slice(0, 500)),
                  sourceId: st.current?.id,
                }
              : {
                  body: text,
                  source: "Local node workflow",
                  tags: "workflow",
                  sourceId: st.current?.id,
                },
          );
          return i.id;
        },
      });
      setValue((v) => ({
        ...v,
        execution: results,
        result:
          results.filter((r) => r.state === "complete").at(-1)?.output || "",
      }));
      s.toast(
        "Local graph completed. Save this workflow to keep its execution record.",
      );
    } catch (e) {
      st.setError(
        abort.current.signal.aborted
          ? "Run cancelled. Completed artifacts are retained."
          : String(e),
      );
    } finally {
      setRunning(false);
      abort.current = null;
    }
  }
  if (st.missing) return <Missing kind="Workflow" />;
  return (
    <div className="v2-page v2-node-page">
      <StudioHead
        index="NODE STUDIO / LOCAL EXECUTION"
        title={st.title}
        onTitle={st.setTitle}
        description="Build a real graph. Connect inputs, transformations, branches and saved artifacts."
        onSave={() => void st.save()}
        busy={st.busy}
      >
        {st.importControl}
        <Button disabled={running} variant="primary" onClick={() => void run()}>
          <Play size={15} />
          Validate & run graph
        </Button>
        {running && (
          <Button onClick={() => abort.current?.abort()}>
            <Square size={15} />
            Cancel
          </Button>
        )}
      </StudioHead>
      <div className="v2-node-toolbar">
        <div className="button-row">
          <select
            aria-label="New node type"
            value={newType}
            onChange={(e) => setNewType(e.target.value as any)}
          >
            {graphNodeTypes.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <Button disabled={graph.nodes.length >= 100} onClick={add}>
            <Plus size={15} />
            Add node
          </Button>
          <Button
            onClick={() =>
              download(
                st.title + ".json",
                JSON.stringify(
                  { schemaVersion: 2, title: st.title, graph },
                  null,
                  2,
                ),
              )
            }
          >
            <Download size={15} />
            Export graph
          </Button>
        </div>
        <label className="v2-zoom">
          Canvas zoom
          <input
            aria-label="Graph zoom"
            type="range"
            min={0.35}
            max={1.2}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
          />
          <output>{Math.round(zoom * 100)}%</output>
        </label>
      </div>
      <ErrorNotice message={st.error} />
      {issues.length > 0 && (
        <div className="v2-error" role="alert">
          {issues.map((x, i) => (
            <button key={i} onClick={() => x.nodeId && setSelected(x.nodeId)}>
              {x.nodeId
                ? graph.nodes.find((n) => n.id === x.nodeId)?.label + ": "
                : ""}
              {x.message}
            </button>
          ))}
        </div>
      )}
      <div className="v2-node-layout">
        <div className="v2-graph-scroll">
          <div
            className="v2-graph-space"
            style={{
              width:
                Math.max(1160, ...graph.nodes.map((n) => n.x + 280)) * zoom,
              height:
                Math.max(520, ...graph.nodes.map((n) => n.y + 220)) * zoom,
            }}
          >
            <div
              className="v2-graph-world"
              style={{
                transform: `scale(${zoom})`,
                width: Math.max(1160, ...graph.nodes.map((n) => n.x + 280)),
                height: Math.max(520, ...graph.nodes.map((n) => n.y + 220)),
              }}
            >
              <svg
                className="v2-graph-wires"
                width="100%"
                height="100%"
                aria-hidden="true"
              >
                {graph.edges.map((e) => {
                  const a = graph.nodes.find((n) => n.id === e.from),
                    b = graph.nodes.find((n) => n.id === e.to);
                  if (!a || !b) return null;
                  return (
                    <path
                      key={e.id}
                      d={`M${a.x + 225} ${a.y + 70} C${a.x + 285} ${a.y + 70},${b.x - 70} ${b.y + 70},${b.x} ${b.y + 70}`}
                      fill="none"
                      stroke={e.port === "false" ? "#D4006A" : "#D7E317"}
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>
              {graph.nodes.map((n) => {
                const status = events.find((e) => e.id === n.id);
                return (
                  <article
                    className={
                      "v2-graph-node " +
                      (n.id === selected ? "is-selected" : "") +
                      " " +
                      (issues.some((e) => e.nodeId === n.id) ? "is-error" : "")
                    }
                    key={n.id}
                    style={{ left: n.x, top: n.y }}
                  >
                    <button
                      className="v2-node-grip"
                      aria-label={"Select and move " + n.label}
                      onClick={() => setSelected(n.id)}
                      onPointerDown={(e) => {
                        if (running) return;
                        setSelected(n.id);
                        drag.current = {
                          id: n.id,
                          x: e.clientX,
                          y: e.clientY,
                          ox: n.x,
                          oy: n.y,
                        };
                        e.currentTarget.setPointerCapture(e.pointerId);
                      }}
                      onPointerMove={(e) => {
                        const d = drag.current;
                        if (!d) return;
                        change({
                          ...graph,
                          nodes: graph.nodes.map((x) =>
                            x.id === d.id
                              ? {
                                  ...x,
                                  x: Math.min(
                                    5000,
                                    Math.max(
                                      0,
                                      Math.round(
                                        d.ox + (e.clientX - d.x) / zoom,
                                      ),
                                    ),
                                  ),
                                  y: Math.min(
                                    5000,
                                    Math.max(
                                      0,
                                      Math.round(
                                        d.oy + (e.clientY - d.y) / zoom,
                                      ),
                                    ),
                                  ),
                                }
                              : x,
                          ),
                        });
                      }}
                      onPointerUp={() => (drag.current = null)}
                      onPointerCancel={() => (drag.current = null)}
                    >
                      <span className="eyebrow">{n.type.toUpperCase()}</span>
                      <span>⠿</span>
                    </button>
                    <button
                      className="v2-node-label"
                      onClick={() => setSelected(n.id)}
                    >
                      {n.label}
                    </button>
                    <p>
                      {n.type === "input"
                        ? String(n.config.text || "Add your source text").slice(
                            0,
                            80,
                          )
                        : n.type === "document" || n.type === "note"
                          ? "Creates a real saved artifact"
                          : "Deterministic local operation"}
                    </p>
                    <span className="v2-node-state">
                      {status?.state || "Not run"}
                      {status?.state === "complete" && <Check size={12} />}
                    </span>
                    <i className="v2-port input" />
                    <i className="v2-port output" />
                  </article>
                );
              })}
            </div>
          </div>
        </div>
        <aside className="v2-node-inspector">
          <span className="eyebrow">SELECTED NODE</span>
          {node ? (
            <>
              <label>
                Label
                <input
                  value={node.label}
                  onChange={(e) =>
                    change({
                      ...graph,
                      nodes: graph.nodes.map((n) =>
                        n.id === node.id
                          ? { ...n, label: e.target.value.slice(0, 100) }
                          : n,
                      ),
                    })
                  }
                />
              </label>
              <div className="two-col">
                {(["x", "y"] as const).map((k) => (
                  <label key={k}>
                    {k.toUpperCase()}
                    <input
                      type="number"
                      min={0}
                      max={5000}
                      value={node[k]}
                      onChange={(e) =>
                        change({
                          ...graph,
                          nodes: graph.nodes.map((n) =>
                            n.id === node.id
                              ? {
                                  ...n,
                                  [k]: Math.min(
                                    5000,
                                    Math.max(0, Number(e.target.value)),
                                  ),
                                }
                              : n,
                          ),
                        })
                      }
                    />
                  </label>
                ))}
              </div>
              {node.type === "input" && (
                <label>
                  Source text
                  <textarea
                    aria-label="Node source text"
                    rows={6}
                    value={String(node.config.text || "")}
                    onChange={(e) => update({ text: e.target.value })}
                  />
                </label>
              )}
              {node.type === "agent" && (
                <>
                  <label>
                    Execution mode
                    <select
                      value={String(node.config.mode || "local")}
                      onChange={(e) => update({ mode: e.target.value })}
                    >
                      <option value="local">Local deterministic tool</option>
                      <option value="connected">
                        Connected provider with local fallback
                      </option>
                    </select>
                  </label>
                  <label>
                    Agent task
                    <select
                      value={String(node.config.tool || "outline")}
                      onChange={(e) => update({ tool: e.target.value })}
                    >
                      <option value="outline">Outline</option>
                      <option value="analyze">Text analysis</option>
                      <option value="brief">Brief structure</option>
                    </select>
                  </label>
                  <label>
                    Request budget / USD
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={Number(node.config.budgetUsd ?? 0.1)}
                      onChange={(e) =>
                        update({
                          budgetUsd: Math.min(
                            100,
                            Math.max(0, Number(e.target.value)),
                          ),
                        })
                      }
                    />
                  </label>
                  <p className="v2-caption">
                    Each step records provenance in Agent Studio. Unknown prices
                    block provider calls; local fallback is labeled.
                  </p>
                </>
              )}
              {node.type === "replace" && (
                <>
                  <label>
                    Find
                    <input
                      value={String(node.config.find || "")}
                      onChange={(e) => update({ find: e.target.value })}
                    />
                  </label>
                  <label>
                    Replace with
                    <input
                      value={String(node.config.replacement || "")}
                      onChange={(e) => update({ replacement: e.target.value })}
                    />
                  </label>
                </>
              )}
              {node.type === "branch" && (
                <label>
                  Contains text
                  <input
                    value={String(node.config.contains || "")}
                    onChange={(e) => update({ contains: e.target.value })}
                  />
                </label>
              )}
              {["document", "note"].includes(node.type) && (
                <label>
                  Artifact title
                  <input
                    value={String(node.config.title || "")}
                    onChange={(e) => update({ title: e.target.value })}
                  />
                </label>
              )}
              <Button
                disabled={running || graph.nodes.length === 1}
                onClick={() => {
                  change({
                    ...graph,
                    nodes: graph.nodes.filter((n) => n.id !== selected),
                    edges: graph.edges.filter(
                      (e) => e.from !== selected && e.to !== selected,
                    ),
                  });
                  setSelected(
                    graph.nodes.find((n) => n.id !== selected)?.id || "",
                  );
                }}
              >
                <Trash2 size={14} />
                Delete node
              </Button>
            </>
          ) : (
            <p>Select a node to configure it.</p>
          )}
          <div className="v2-inspector-divider" />
          <span className="eyebrow">CONNECTIONS</span>
          <label>
            From
            <select
              aria-label="Connection from"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            >
              <option value="">Select a node</option>
              {graph.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          <label>
            Output port
            <select
              value={port}
              onChange={(e) => setPort(e.target.value as any)}
            >
              <option value="out">out</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </label>
          <label>
            To
            <select
              aria-label="Connection to"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            >
              <option value="">Select a node</option>
              {graph.nodes.map((n) => (
                <option key={n.id} value={n.id}>
                  {n.label}
                </option>
              ))}
            </select>
          </label>
          <Button disabled={running} onClick={connect}>
            <Link2 size={14} />
            Connect nodes
          </Button>
          <div className="v2-edge-list">
            {graph.edges.map((e) => (
              <div key={e.id}>
                <span>
                  {graph.nodes.find((n) => n.id === e.from)?.label} →{" "}
                  {graph.nodes.find((n) => n.id === e.to)?.label}{" "}
                  <small>{e.port}</small>
                </span>
                <button
                  className="icon-button"
                  aria-label={"Remove connection " + e.id}
                  onClick={() =>
                    change({
                      ...graph,
                      edges: graph.edges.filter((x) => x.id !== e.id),
                    })
                  }
                >
                  <Unplug size={14} />
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>
      <section className="v2-graph-results">
        <span className="eyebrow">
          EXECUTION / {events.filter((e) => e.state === "complete").length} OF{" "}
          {graph.nodes.length} NODES COMPLETED
        </span>
        <div className="v2-execution-grid">
          {events.map((e) => (
            <article key={e.id}>
              <span className="state-badge">{e.state}</span>
              <h3>{graph.nodes.find((n) => n.id === e.id)?.label}</h3>
              <pre>{e.output || e.error || "No output"}</pre>
              {e.artifactId && (
                <a
                  className="text-button"
                  href={
                    "#/" +
                    (graph.nodes.find((n) => n.id === e.id)?.type === "document"
                      ? "create"
                      : "research") +
                    "/" +
                    e.artifactId
                  }
                >
                  Open saved artifact <ArrowUpRight size={14} />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
      <ToolNote>
        Runs while this view is open. Branches route actual results. External
        services and background schedules are unavailable. Existing V1 workflows
        open in compatibility mode when selected from Library.
      </ToolNote>
    </div>
  );
}
