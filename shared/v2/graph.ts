import { graphSchema, type Graph, type GraphNode } from "./contracts.ts";
export type GraphIssue = { nodeId?: string; message: string };
export function validateGraph(graph: Graph): GraphIssue[] {
  const parsed = graphSchema.safeParse(graph);
  if (!parsed.success) return [{ message: "Invalid graph schema" }];
  const issues: GraphIssue[] = [],
    ids = new Set(graph.nodes.map((n) => n.id));
  if (ids.size !== graph.nodes.length)
    issues.push({ message: "Node IDs must be unique" });
  for (const e of graph.edges) {
    if (!ids.has(e.from) || !ids.has(e.to))
      issues.push({ message: "A connection references a missing node" });
    if (e.from === e.to)
      issues.push({
        nodeId: e.from,
        message: "A node cannot connect to itself",
      });
    if (
      e.port !== "out" &&
      graph.nodes.find((n) => n.id === e.from)?.type !== "branch"
    )
      issues.push({
        nodeId: e.from,
        message: "Only branch nodes have true/false ports",
      });
  }
  for (const n of graph.nodes) {
    if (n.type === "input" && !String(n.config.text || "").trim())
      issues.push({ nodeId: n.id, message: "Add source text" });
    if (n.type !== "input" && !graph.edges.some((e) => e.to === n.id))
      issues.push({ nodeId: n.id, message: "Connect an input to this node" });
    if (n.type === "replace" && !String(n.config.find || ""))
      issues.push({ nodeId: n.id, message: "Set the text to find" });
  }
  try {
    orderGraph(graph);
  } catch {
    issues.push({ message: "Graph contains a cycle. Remove a connection." });
  }
  return issues;
}
export function orderGraph(g: Graph): GraphNode[] {
  const result: GraphNode[] = [],
    seen = new Set<string>(),
    visiting = new Set<string>();
  function visit(n: GraphNode) {
    if (visiting.has(n.id)) throw Error("cycle");
    if (seen.has(n.id)) return;
    visiting.add(n.id);
    for (const e of g.edges.filter((e) => e.to === n.id)) {
      const p = g.nodes.find((x) => x.id === e.from);
      if (p) visit(p);
    }
    visiting.delete(n.id);
    seen.add(n.id);
    result.push(n);
  }
  g.nodes.forEach(visit);
  return result;
}
export type NodeResult = {
  id: string;
  state: "running" | "complete" | "skipped" | "error";
  output: string;
  at: string;
  artifactId?: string;
  agentRunId?: string;
  provenance?: string;
  error?: string;
};
export async function executeGraph(
  g: Graph,
  options: {
    signal: AbortSignal;
    onEvent: (r: NodeResult) => void;
    agent?: (
      text: string,
      config: Record<string, unknown>,
    ) => Promise<{ text: string; runId: string; provenance: string }>;
    artifact: (
      kind: "note" | "document",
      title: string,
      text: string,
    ) => Promise<string>;
  },
): Promise<NodeResult[]> {
  const issues = validateGraph(g);
  if (issues.length) throw Error(issues.map((x) => x.message).join("; "));
  const results = new Map<string, NodeResult>(),
    branches = new Map<string, boolean>();
  for (const n of orderGraph(g)) {
    options.signal.throwIfAborted();
    const incoming = g.edges.filter((e) => e.to === n.id),
      active = incoming.filter((e) => {
        const p = results.get(e.from);
        if (!p || p.state !== "complete") return false;
        return (
          e.port === "out" ||
          (e.port === "true" ? branches.get(e.from) : !branches.get(e.from))
        );
      });
    if (n.type !== "input" && !active.length) {
      const r: NodeResult = {
        id: n.id,
        state: "skipped",
        output: "",
        at: new Date().toISOString(),
      };
      results.set(n.id, r);
      options.onEvent(r);
      continue;
    }
    const input = active.map((e) => results.get(e.from)!.output).join("\n");
    options.onEvent({
      id: n.id,
      state: "running",
      output: "",
      at: new Date().toISOString(),
    });
    try {
      let output = input,
        artifactId: string | undefined,
        agentRunId: string | undefined,
        provenance: string | undefined;
      switch (n.type) {
        case "input":
          output = String(n.config.text);
          break;
        case "trim":
          output = input.trim();
          break;
        case "uppercase":
          output = input.toLocaleUpperCase();
          break;
        case "outline":
          output = input
            .split(/\n+/)
            .filter((x) => x.trim())
            .map((x, i) => `${i + 1}. ${x.trim()}`)
            .join("\n");
          break;
        case "count":
          output = JSON.stringify(
            {
              words: Array.from(
                new Intl.Segmenter(undefined, { granularity: "word" }).segment(
                  input,
                ),
              ).filter((x) => x.isWordLike).length,
              graphemes: Array.from(
                new Intl.Segmenter(undefined, {
                  granularity: "grapheme",
                }).segment(input),
              ).length,
            },
            null,
            2,
          );
          break;
        case "replace":
          output = input
            .split(String(n.config.find))
            .join(String(n.config.replacement || ""));
          break;
        case "branch":
          branches.set(n.id, input.includes(String(n.config.contains || "")));
          break;
        case "agent": {
          if (!options.agent) throw Error("Agent adapter unavailable");
          const result = await options.agent(input, n.config);
          output = result.text;
          agentRunId = result.runId;
          provenance = result.provenance;
          break;
        }
        case "note":
        case "document":
          artifactId = await options.artifact(
            n.type,
            String(n.config.title || n.label),
            input,
          );
          break;
      }
      options.signal.throwIfAborted();
      const r: NodeResult = {
        id: n.id,
        state: "complete",
        output,
        at: new Date().toISOString(),
        artifactId,
        agentRunId,
        provenance,
      };
      results.set(n.id, r);
      options.onEvent(r);
    } catch (e) {
      const r: NodeResult = {
        id: n.id,
        state: "error",
        output: "",
        at: new Date().toISOString(),
        error: e instanceof Error ? e.message : String(e),
      };
      options.onEvent(r);
      throw e;
    }
  }
  return [...results.values()];
}
