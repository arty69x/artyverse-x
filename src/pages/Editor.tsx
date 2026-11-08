import { useUI } from "../v3/i18n";
import { useState, useRef, useEffect } from "react";
import {
  Plus,
  Type,
  Square,
  Image,
  Undo2,
  Redo2,
  Copy,
  Trash2,
  ArrowUp,
  ArrowDown,
  Download,
  Save,
  Minus,
  Maximize,
  Play,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Layers,
  MousePointer2,
  Move,
} from "lucide-react";
import { useStore, useT, download, upload, request } from "../core/store";
import { Button, Empty, Modal } from "../components/UI";
import { defaultNodes, uid, nodeSchema } from "../../shared/schema";
import type { LayoutNode, Item } from "../../shared/schema";
import type { Navigate } from "../App";
function escape(s: string) {
  return s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c]!,
  );
}
export function svgDocument(nodes: LayoutNode[], width = 960, height = 540) {
  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xhtml="http://www.w3.org/1999/xhtml" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${nodes.map((n) => (n.type === "shape" ? `<rect x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" fill="${escape(n.color)}"/>` : n.type === "image" ? `<image x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}" href="${escape(n.asset || "")}" preserveAspectRatio="xMidYMid slice"/>` : `<foreignObject x="${n.x}" y="${n.y}" width="${n.w}" height="${n.h}"><xhtml:div style="font-family:Arial,sans-serif;font-size:${n.size}px;color:${escape(n.color)};line-height:1.12;white-space:pre-wrap;overflow-wrap:anywhere">${escape(n.text)}</xhtml:div></foreignObject>`)).join("")}</svg>`;
}
export function Editor({ id, go }: { id?: string; go: Navigate }) {
  const ui = useUI();

  const s = useStore(),
    t = useT(),
    original = s.items.find((i) => i.id === id && !i.deletedAt);
  const initial = () => {
    try {
      const d = localStorage.getItem("av-canvas-" + (id || "new"));
      if (!d) return null;
      const parsed = JSON.parse(d);
      if (
        typeof parsed.title !== "string" ||
        !Array.isArray(parsed.nodes) ||
        parsed.nodes.length > 300 ||
        parsed.nodes.some((n: any) => !nodeSchema.safeParse(n).success)
      )
        throw Error("Invalid browser draft");
      return {
        ...parsed,
        stale: !!original && parsed.baseRevision !== original.revision,
      };
    } catch {
      return null;
    }
  };
  const [cached] = useState(initial);
  const [current, setCurrent] = useState(original),
    [title, setTitle] = useState(
      (!cached?.stale && cached?.title) ||
        original?.title ||
        "Untitled creation",
    ),
    [nodes, setNodes] = useState<LayoutNode[]>(
      (!cached?.stale && cached?.nodes) ||
        original?.data.nodes ||
        defaultNodes(),
    ),
    [selection, setSelection] = useState<string | null>(null),
    [past, setPast] = useState<LayoutNode[][]>([]),
    [future, setFuture] = useState<LayoutNode[][]>([]),
    [zoom, setZoom] = useState(0.7),
    [fit, setFit] = useState(true),
    [error, setError] = useState(
      cached?.stale
        ? "A newer saved revision was loaded. Your previous browser draft is preserved; download it before leaving."
        : "",
    ),
    [dirty, setDirty] = useState(
      !!cached &&
        !cached.stale &&
        (JSON.stringify(cached.nodes) !==
          JSON.stringify(original?.data.nodes) ||
          cached.title !== original?.title),
    ),
    [busy, setBusy] = useState(false),
    [present, setPresent] = useState(false),
    [revisions, setRevisions] = useState<Item[] | null>(null),
    [inspector, setInspector] = useState(true),
    [pendingImport, setPendingImport] = useState<{
      title: string;
      nodes: LayoutNode[];
    } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null),
    drag = useRef<{
      id: string;
      x: number;
      y: number;
      ox: number;
      oy: number;
      before: LayoutNode[];
      resize?: boolean;
    } | null>(null),
    latest = useRef(nodes);
  latest.current = nodes;
  const width = original?.data.width || 960,
    height = original?.data.height || 540,
    node = nodes.find((n) => n.id === selection);
  useEffect(() => {
    if (!id && current) return;
    try {
      if (cached?.stale)
        localStorage.setItem(
          "av-recovered-canvas-" + id,
          JSON.stringify(cached),
        );
      localStorage.setItem(
        "av-canvas-" + (id || "new"),
        JSON.stringify({ title, nodes, baseRevision: current?.revision || 0 }),
      );
    } catch {
      setError("Browser draft storage is full. Save or export now.");
    }
  }, [nodes, title, id, current?.revision]);
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(() => {
      if (fit)
        setZoom(
          Math.min(
            1,
            Math.max(0.12, (el.clientWidth - 64) / width),
            (el.clientHeight - 80) / height,
          ),
        );
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [fit, width, height, inspector]);
  function commit(next: LayoutNode[]) {
    setPast((p) => [...p.slice(-49), structuredClone(nodes)]);
    setFuture([]);
    setNodes(next);
    setDirty(true);
  }
  function update(patch: Partial<LayoutNode>) {
    if (!node) return;
    commit(nodes.map((n) => (n.id === selection ? { ...n, ...patch } : n)));
  }
  function undo() {
    if (!past.length) return;
    setFuture((f) => [nodes, ...f]);
    setNodes(past[past.length - 1]);
    setPast((p) => p.slice(0, -1));
    setDirty(true);
  }
  function redo() {
    if (!future.length) return;
    setPast((p) => [...p, nodes]);
    setNodes(future[0]);
    setFuture((f) => f.slice(1));
    setDirty(true);
  }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement).matches(
          "input,textarea,select,[contenteditable]",
        )
      )
        return;
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        e.shiftKey ? redo() : undo();
      }
      if ((e.key === "Delete" || e.key === "Backspace") && selection) {
        e.preventDefault();
        commit(nodes.filter((n) => n.id !== selection));
        setSelection(null);
      }
      if (
        node &&
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
      ) {
        e.preventDefault();
        const d = e.shiftKey ? 10 : 1;
        update({
          x:
            node.x +
            (e.key === "ArrowRight" ? d : e.key === "ArrowLeft" ? -d : 0),
          y:
            node.y + (e.key === "ArrowDown" ? d : e.key === "ArrowUp" ? -d : 0),
        });
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [nodes, past, future, selection]);
  async function save() {
    setBusy(true);
    try {
      const validated = nodes.map((n) => nodeSchema.parse(n));
      const data = { ...current?.data, width, height, nodes: validated };
      const next = current
        ? await s.save({ ...current, title, data })
        : await s.create("document", title, data);
      setCurrent(next);
      setDirty(false);
      setError("");
      if (!id) {
        localStorage.removeItem("av-canvas-new");
        go("create", next.id);
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function exportSvg() {
    try {
      const exported = await Promise.all(
        nodes.map(async (n) => {
          if (n.type !== "image" || !n.asset) return n;
          const response = await fetch(n.asset);
          if (!response.ok) throw Error("Image could not be included");
          const blob = await response.blob();
          const asset = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(String(reader.result));
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
          return { ...n, asset };
        }),
      );
      download(
        title + ".svg",
        svgDocument(exported, width, height),
        "image/svg+xml",
      );
    } catch (e) {
      setError("Export failed: " + String(e));
    }
  }
  function add(type: "text" | "shape") {
    const n: LayoutNode = {
      id: uid(),
      type,
      text: type === "text" ? "Your next idea" : "",
      x: 100,
      y: 100,
      w: type === "text" ? 400 : 160,
      h: type === "text" ? 120 : 160,
      color: type === "text" ? "#F0F0F8" : "#CCFF00",
      size: 36,
    };
    commit([...nodes, n]);
    setSelection(n.id);
  }
  function pointerDown(e: React.PointerEvent, id: string, resize = false) {
    if (e.button !== 0) return;
    e.preventDefault();
    e.stopPropagation();
    const n = nodes.find((n) => n.id === id)!;
    setSelection(id);
    drag.current = {
      id,
      x: e.clientX,
      y: e.clientY,
      ox: resize ? n.w : n.x,
      oy: resize ? n.h : n.y,
      before: structuredClone(nodes),
      resize,
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }
  function pointerMove(e: React.PointerEvent) {
    const d = drag.current;
    if (!d) return;
    const dx = (e.clientX - d.x) / zoom,
      dy = (e.clientY - d.y) / zoom;
    setNodes((v) =>
      v.map((n) =>
        n.id === d.id
          ? {
              ...n,
              ...(d.resize
                ? {
                    w: Math.max(10, Math.round(d.ox + dx)),
                    h: Math.max(10, Math.round(d.oy + dy)),
                  }
                : { x: Math.round(d.ox + dx), y: Math.round(d.oy + dy) }),
            }
          : n,
      ),
    );
    setDirty(true);
  }
  function pointerUp() {
    if (drag.current) {
      setPast((p) => [...p.slice(-49), drag.current!.before]);
      setFuture([]);
      drag.current = null;
    }
  }
  function layerMove(delta: number) {
    const idx = nodes.findIndex((n) => n.id === selection),
      to = idx + delta;
    if (idx < 0 || to < 0 || to >= nodes.length) return;
    const next = [...nodes];
    [next[idx], next[to]] = [next[to], next[idx]];
    commit(next);
  }
  if (id && !original)
    return (
      <Empty
        title="Document not found"
        description="Check Library or restore the item from trash."
        action={
          <Button onClick={() => go("library")}>{ui("Open Library")}</Button>
        }
      />
    );
  return (
    <div className="editor">
      <header className="editor-header">
        <div>
          <span className="eyebrow">// CREATE STUDIO</span>
          <input
            className="document-title"
            aria-label={ui("Document title")}
            value={title}
            maxLength={180}
            onChange={(e) => {
              setTitle(e.target.value);
              setDirty(true);
            }}
          />
          <small className="muted">
            {dirty
              ? "Browser draft · unsaved changes"
              : `Saved locally · revision ${current?.revision || 1}`}
          </small>
        </div>
        <div className="button-row">
          <Button title={ui("Present")} onClick={() => setPresent(true)}>
            <Play size={15} />
            <span>{ui("Present")}</span>
          </Button>
          <Button title={ui("Export SVG")} onClick={() => void exportSvg()}>
            <Download size={15} />
            <span>{ui("Export SVG")}</span>
          </Button>
          <Button
            title={ui("Save")}
            variant="primary"
            disabled={busy || !title.trim()}
            onClick={() => void save()}
          >
            <Save size={15} />
            <span>{busy ? "Saving…" : "Save"}</span>
          </Button>
        </div>
      </header>
      <div className="editor-toolbar">
        <div className="button-row">
          <button
            className="icon-button"
            title="Select and drag nodes"
            aria-label="Clear selection"
            onClick={() => setSelection(null)}
          >
            <MousePointer2 size={17} />
          </button>
          <span className="separator" />
          <button
            className="icon-button"
            aria-label={ui("Add text")}
            onClick={() => add("text")}
          >
            <Type size={18} />
          </button>
          <button
            className="icon-button"
            aria-label={ui("Add shape")}
            onClick={() => add("shape")}
          >
            <Square size={18} />
          </button>
          <label className="icon-button file-button" title={ui("Add image")}>
            <Image size={18} />
            <input
              type="file"
              aria-label={ui("Add image")}
              accept="image/png,image/jpeg,image/webp"
              onChange={async (e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                try {
                  const a = await upload(f, f.name);
                  const n: LayoutNode = {
                    id: uid(),
                    type: "image",
                    text: "",
                    x: 100,
                    y: 100,
                    w: 360,
                    h: 240,
                    color: "#FFFFFF",
                    size: 36,
                    asset: a.url,
                  };
                  commit([...nodes, n]);
                  setSelection(n.id);
                } catch (e) {
                  setError(String(e));
                }
              }}
            />
          </label>
          <span className="separator" />
          <button
            className="icon-button"
            disabled={!past.length}
            aria-label={ui("Undo")}
            onClick={undo}
          >
            <Undo2 size={17} />
          </button>
          <button
            className="icon-button"
            disabled={!future.length}
            aria-label={ui("Redo")}
            onClick={redo}
          >
            <Redo2 size={17} />
          </button>
        </div>
        <div className="button-row">
          <button
            className="icon-button"
            aria-label="Zoom out"
            onClick={() => {
              setFit(false);
              setZoom((z) => Math.max(0.12, z - 0.1));
            }}
          >
            <Minus size={16} />
          </button>
          <span className="caption">{Math.round(zoom * 100)}%</span>
          <button
            className="icon-button"
            aria-label="Zoom in"
            onClick={() => {
              setFit(false);
              setZoom((z) => Math.min(2, z + 0.1));
            }}
          >
            <Plus size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Fit canvas"
            onClick={() => {
              setFit(true);
              if (stageRef.current)
                setZoom(
                  Math.min(
                    1,
                    (stageRef.current.clientWidth - 64) / width,
                    (stageRef.current.clientHeight - 80) / height,
                  ),
                );
            }}
          >
            <Maximize size={16} />
          </button>
          <Button title="Inspector" onClick={() => setInspector(!inspector)}>
            <Layers size={15} />
            <span>Inspector</span>
          </Button>
        </div>
      </div>
      {error && (
        <div role="alert" className="error-banner">
          {error}
          {cached?.stale && (
            <Button
              onClick={() =>
                download(
                  "recovered-draft.json",
                  JSON.stringify(
                    {
                      schemaVersion: 1,
                      title: cached.title,
                      width,
                      height,
                      nodes: cached.nodes,
                    },
                    null,
                    2,
                  ),
                )
              }
            >
              Download recovered draft
            </Button>
          )}
        </div>
      )}
      <div className={"editor-body " + (!inspector ? "no-inspector" : "")}>
        <aside className="layers-panel">
          <span className="eyebrow">
            LAYERS <small>{nodes.length}</small>
          </span>
          {[...nodes].reverse().map((n) => (
            <button
              key={n.id}
              className={selection === n.id ? "selected" : ""}
              onClick={() => setSelection(n.id)}
            >
              {n.type === "text" ? (
                <Type size={14} />
              ) : n.type === "shape" ? (
                <Square size={14} />
              ) : (
                <Image size={14} />
              )}
              <span>{n.type === "text" ? n.text.slice(0, 24) : n.type}</span>
            </button>
          ))}
        </aside>
        <div className="sr-only" role="document" aria-label={title}>
          {nodes
            .filter((n) => n.type === "text")
            .map((n) => (
              <p key={n.id}>{n.text}</p>
            ))}
        </div>
        <div
          ref={stageRef}
          aria-hidden="true"
          className="canvas-viewport"
          onClick={() => setSelection(null)}
        >
          <span className="canvas-label">
            {width} × {height} / DOCUMENT COORDINATES
          </span>
          <div
            className="canvas-reserve"
            style={{ width: width * zoom, height: height * zoom }}
          >
            <div
              className="canvas-document"
              style={{ width, height, transform: `scale(${zoom})` }}
            >
              {nodes.map((n) => (
                <div
                  key={n.id}
                  role="button"
                  tabIndex={-1}
                  aria-label={`${n.type}: ${n.text.slice(0, 60) || "element"}`}
                  className={
                    "canvas-node " + (selection === n.id ? "node-selected" : "")
                  }
                  style={{
                    left: n.x,
                    top: n.y,
                    width: n.w,
                    height: n.h,
                    fontSize: n.size,
                    color: n.color,
                    background: n.type === "shape" ? n.color : undefined,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelection(n.id);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") setSelection(n.id);
                  }}
                  onPointerDown={(e) => pointerDown(e, n.id)}
                  onPointerMove={pointerMove}
                  onPointerUp={pointerUp}
                  onPointerCancel={pointerUp}
                >
                  {n.type === "text" ? (
                    n.text
                  ) : n.type === "image" ? (
                    <img
                      src={n.asset}
                      alt={n.text || "User artwork"}
                      draggable={false}
                      onError={(e) => {
                        e.currentTarget.alt = "Image unavailable";
                      }}
                    />
                  ) : null}
                  {selection === n.id && (
                    <button
                      className="resize-handle"
                      aria-label="Resize selected node"
                      tabIndex={-1}
                      onPointerDown={(e) => pointerDown(e, n.id, true)}
                      onPointerMove={pointerMove}
                      onPointerUp={pointerUp}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <span className="canvas-help">
            {t(
              "Drag to move · Arrow keys for precision · Select a layer to edit",
              "ลากเพื่อย้าย · ปุ่มลูกศรเพื่อขยับ · เลือกเลเยอร์เพื่อแก้ไข",
            )}
          </span>
        </div>
        {inspector && (
          <aside className="inspector">
            <span className="eyebrow">
              {node ? "SELECTION / " + node.type.toUpperCase() : "DOCUMENT"}
            </span>
            {node ? (
              <>
                <div className="two-col">
                  {(["x", "y", "w", "h"] as const).map((k) => (
                    <label key={k}>
                      {k.toUpperCase()}
                      <input
                        type="number"
                        value={node[k]}
                        onChange={(e) => {
                          const v = Number(e.target.value);
                          if (Number.isFinite(v))
                            update({
                              [k]:
                                k === "w" || k === "h"
                                  ? Math.max(10, Math.min(4000, v))
                                  : Math.max(-4000, Math.min(4000, v)),
                            });
                        }}
                      />
                    </label>
                  ))}
                </div>
                {node.type === "text" && (
                  <>
                    <label>
                      Text
                      <textarea
                        aria-label={ui("Selected text content")}
                        rows={5}
                        value={node.text}
                        onChange={(e) => update({ text: e.target.value })}
                      />
                    </label>
                    <label>
                      {ui("Font size")}
                      <input
                        type="number"
                        min={8}
                        max={300}
                        value={node.size}
                        onChange={(e) =>
                          update({
                            size: Math.max(
                              8,
                              Math.min(300, Number(e.target.value)),
                            ),
                          })
                        }
                      />
                    </label>
                  </>
                )}
                {node.type !== "image" && (
                  <label className="setting-row">
                    {ui("Color")}
                    <input
                      type="color"
                      value={node.color}
                      onChange={(e) => update({ color: e.target.value })}
                    />
                  </label>
                )}
                <span className="eyebrow">ALIGN TO CANVAS</span>
                <div className="button-row">
                  <button
                    className="icon-button"
                    aria-label="Align left"
                    onClick={() => update({ x: 0 })}
                  >
                    <AlignLeft size={17} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Align center"
                    onClick={() => update({ x: (width - node.w) / 2 })}
                  >
                    <AlignCenter size={17} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Align right"
                    onClick={() => update({ x: width - node.w })}
                  >
                    <AlignRight size={17} />
                  </button>
                </div>
                <span className="eyebrow">LAYER ORDER</span>
                <div className="button-row">
                  <button
                    className="icon-button"
                    aria-label={ui("Bring forward")}
                    onClick={() => layerMove(1)}
                  >
                    <ArrowUp size={17} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={ui("Send backward")}
                    onClick={() => layerMove(-1)}
                  >
                    <ArrowDown size={17} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label="Duplicate node"
                    onClick={() => {
                      const n = {
                        ...node,
                        id: uid(),
                        x: node.x + 24,
                        y: node.y + 24,
                      };
                      commit([...nodes, n]);
                      setSelection(n.id);
                    }}
                  >
                    <Copy size={17} />
                  </button>
                  <button
                    className="icon-button"
                    aria-label={ui("Delete node")}
                    onClick={() => {
                      commit(nodes.filter((n) => n.id !== selection));
                      setSelection(null);
                    }}
                  >
                    <Trash2 size={17} />
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="muted">
                  Select an element on the canvas or in Layers to edit its
                  properties.
                </p>
                <div className="inspector-stat">
                  <span>Dimensions</span>
                  <strong>
                    {width} × {height}
                  </strong>
                </div>
                <div className="inspector-stat">
                  <span>Elements</span>
                  <strong>{nodes.length}</strong>
                </div>
                <div className="inspector-stat">
                  <span>Persistence</span>
                  <strong>Explicit save</strong>
                </div>
                <Button
                  onClick={() =>
                    download(
                      title + ".json",
                      JSON.stringify(
                        { schemaVersion: 1, title, width, height, nodes },
                        null,
                        2,
                      ),
                    )
                  }
                >
                  Export document JSON
                </Button>
                <label className="button file-button">
                  Import document
                  <input
                    type="file"
                    accept=".json"
                    onChange={async (e) => {
                      try {
                        const f = e.target.files?.[0];
                        if (!f) return;
                        if (f.size > 2000000) throw Error("Maximum 2 MB");
                        const d = JSON.parse(await f.text());
                        if (
                          d.schemaVersion !== 1 ||
                          !Array.isArray(d.nodes) ||
                          d.nodes.length > 300
                        )
                          throw Error("Invalid document");
                        const validated = d.nodes.map((n: any) =>
                          nodeSchema.parse(n),
                        );
                        if (
                          new Set(validated.map((n: LayoutNode) => n.id))
                            .size !== validated.length
                        )
                          throw Error("Duplicate node IDs");
                        if (d.width !== width || d.height !== height)
                          throw Error(
                            `This editor currently imports ${width} × ${height} documents. Other dimensions are not supported in this view.`,
                          );
                        setPendingImport({
                          title:
                            typeof d.title === "string"
                              ? d.title.slice(0, 180)
                              : "Imported document",
                          nodes: validated,
                        });
                      } catch (e) {
                        setError(String(e));
                      }
                    }}
                  />
                </label>
                {current && (
                  <Button
                    onClick={async () => {
                      try {
                        setRevisions(
                          await request("/items/" + current.id + "/revisions"),
                        );
                      } catch (e) {
                        setError(String(e));
                      }
                    }}
                  >
                    Revision history
                  </Button>
                )}
              </>
            )}
          </aside>
        )}
      </div>
      {pendingImport && (
        <Modal
          title="Preview document import"
          onClose={() => setPendingImport(null)}
        >
          <p>
            {pendingImport.title} · {pendingImport.nodes.length} layers ·{" "}
            {width} × {height}
          </p>
          <p>
            Replace the current browser draft. Saved work stays unchanged until
            you press Save. Undo can recover the previous nodes.
          </p>
          <Button
            variant="primary"
            onClick={() => {
              commit(pendingImport.nodes);
              setTitle(pendingImport.title);
              setPendingImport(null);
              s.toast("Imported as a browser draft. Save when ready.");
            }}
          >
            Apply to draft
          </Button>
        </Modal>
      )}
      {present && (
        <Modal wide title={title} onClose={() => setPresent(false)}>
          <div className="document-presentation">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              role="img"
              aria-label={title}
            >
              {nodes.map((n) =>
                n.type === "shape" ? (
                  <rect
                    key={n.id}
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    fill={n.color}
                  />
                ) : n.type === "image" ? (
                  <image
                    key={n.id}
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                    href={n.asset}
                  />
                ) : (
                  <foreignObject
                    key={n.id}
                    x={n.x}
                    y={n.y}
                    width={n.w}
                    height={n.h}
                  >
                    <div
                      style={{
                        fontSize: n.size,
                        color: n.color,
                        lineHeight: 1.12,
                        whiteSpace: "pre-wrap",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {n.text}
                    </div>
                  </foreignObject>
                ),
              )}
            </svg>
          </div>
          <div className="modal-actions">
            <Button onClick={() => void exportSvg()}>{ui("Export")}</Button>
            <Button
              onClick={() =>
                document.fullscreenElement
                  ? void document.exitFullscreen()
                  : void document.documentElement
                      .requestFullscreen?.()
                      .catch(() => s.toast("Fullscreen unavailable"))
              }
            >
              {ui("Fullscreen")}
            </Button>
          </div>
        </Modal>
      )}
      {revisions && (
        <Modal title="Saved revisions" onClose={() => setRevisions(null)}>
          {revisions.map((r) => (
            <div className="revision-row" key={r.revision}>
              <span>
                Revision {r.revision}
                <small>{new Date(r.updatedAt).toLocaleString()}</small>
              </span>
              <Button
                onClick={() => {
                  commit(r.data.nodes);
                  setTitle(r.title);
                  setRevisions(null);
                  s.toast(
                    "Revision loaded as a draft. Save to make a new revision.",
                  );
                }}
              >
                Load as draft
              </Button>
            </div>
          ))}
        </Modal>
      )}
    </div>
  );
}
