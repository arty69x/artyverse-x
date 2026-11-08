import { useUI } from "../v3/i18n";
import { rovingTabs } from "../v3/a11y";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  MousePointer2,
  Download,
  RotateCcw,
  Braces,
  Check,
  Smartphone,
  Monitor,
  ShieldCheck,
  WandSparkles,
  Undo2,
} from "lucide-react";
import { codeSchema, type CodeDocument } from "../../shared/v2/contracts";
import { starterCode, buildPreview, exportCode, localRepair } from "./sandbox";
import {
  useStudio,
  StudioHead,
  ErrorNotice,
  Missing,
  ToolNote,
} from "./shared";
import { Button, Modal } from "../components/UI";
import { download } from "../core/store";
export function CodeStudio({ id }: { id?: string }) {
  const ui = useUI();

  const st = useStudio<CodeDocument>(
      "code",
      id,
      starterCode,
      "Untitled live canvas",
    ),
    { value, setValue } = st,
    [tab, setTab] = useState<"html" | "css" | "js">("html"),
    [src, setSrc] = useState(""),
    [inspecting, setInspecting] = useState(false),
    [selection, setSelection] = useState<any>(null),
    [logs, setLogs] = useState<{ type: string; message: string }[]>([]),
    [device, setDevice] = useState("desktop"),
    [repair, setRepair] = useState<ReturnType<typeof localRepair> | null>(null),
    [checkpoint, setCheckpoint] = useState<CodeDocument | null>(null),
    [property, setProperty] = useState("color"),
    [propertyValue, setPropertyValue] = useState("#D7E317"),
    [ready, setReady] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null),
    nonce = useRef("");
  useEffect(() => {
    const listener = (event: MessageEvent) => {
      if (
        event.source !== frame.current?.contentWindow ||
        !event.data?.artyverse ||
        event.data.token !== nonce.current
      )
        return;
      const d = event.data;
      if (d.type === "ready") {
        setReady(true);
        frame.current?.contentWindow?.postMessage(
          { token: nonce.current, type: "inspect", enabled: inspecting },
          "*",
        );
      }
      if (
        d.type === "selection" &&
        typeof d.selector === "string" &&
        /^[\w\-:#(). >]+$/.test(d.selector) &&
        d.selector.length < 1000
      )
        setSelection(d);
      if (
        (d.type === "log" || d.type === "error") &&
        typeof d.message === "string"
      )
        setLogs((old) => [
          ...old.slice(-99),
          { type: d.type, message: d.message.slice(0, 3000) },
        ]);
    };
    window.addEventListener("message", listener);
    return () => window.removeEventListener("message", listener);
  }, [inspecting]);
  function run() {
    try {
      codeSchema.parse(value);
      nonce.current = crypto.randomUUID();
      setLogs([]);
      setSelection(null);
      setReady(false);
      setSrc(buildPreview(value, nonce.current));
      st.setError("");
    } catch (e) {
      st.setError(String(e));
    }
  }
  function inspect() {
    setInspecting((x) => !x);
    frame.current?.contentWindow?.postMessage(
      { token: nonce.current, type: "inspect", enabled: !inspecting },
      "*",
    );
  }
  function applyStyle() {
    if (
      !selection ||
      /[;{}<>]/.test(propertyValue) ||
      propertyValue.length > 500
    ) {
      st.setError(
        "Use one safe CSS property value without semicolons or markup.",
      );
      return;
    }
    frame.current?.contentWindow?.postMessage(
      { token: nonce.current, type: "style", property, value: propertyValue },
      "*",
    );
    setValue((v) => ({
      ...v,
      overrides: [
        ...v.overrides.filter(
          (o) => o.selector !== selection.selector || o.property !== property,
        ),
        { selector: selection.selector, property, value: propertyValue },
      ],
    }));
    st.s.toast("Style applied to preview and saved in the document draft.");
  }
  if (st.missing) return <Missing kind="Code document" />;
  return (
    <div className="v2-page v2-code-page">
      <StudioHead
        index="CREATE / LIVE-CODING STUDIO"
        title={st.title}
        onTitle={st.setTitle}
        description="Write, run, inspect and refine. Your code executes only inside an isolated preview after you press Run."
        onSave={() => void st.save()}
        busy={st.busy}
      >
        {st.importControl}
        <Button
          onClick={() =>
            download(
              st.title + ".html",
              exportCode(value, st.title),
              "text/html",
            )
          }
        >
          <Download size={15} />
          {ui("Export HTML")}
        </Button>
        <Button variant="primary" onClick={run}>
          <Play size={15} />
          {ui("Run preview")}
        </Button>
      </StudioHead>
      <div className="v2-code-toolbar">
        <div className="v2-file-tabs" role="tablist" onKeyDown={rovingTabs}>
          {(["html", "css", "js"] as const).map((k) => (
            <button
              role="tab"
              aria-selected={tab === k}
              tabIndex={tab === k ? 0 : -1}
              className={tab === k ? "selected" : ""}
              key={k}
              onClick={() => setTab(k)}
            >
              {k === "html"
                ? "index.html"
                : k === "css"
                  ? "styles.css"
                  : "script.js"}
            </button>
          ))}
        </div>
        <div className="button-row">
          <Button disabled={!ready} onClick={inspect}>
            <MousePointer2 size={15} />
            {inspecting ? "Inspecting: on" : "Inspect element"}
          </Button>
          <Button
            onClick={() =>
              setDevice(device === "desktop" ? "phone" : "desktop")
            }
          >
            {device === "desktop" ? (
              <Smartphone size={15} />
            ) : (
              <Monitor size={15} />
            )}
            {device === "desktop" ? "Phone" : "Desktop"}
          </Button>
          <Button
            onClick={() => {
              setRepair(localRepair(value));
            }}
          >
            <WandSparkles size={15} />
            {ui("Review local fixes")}
          </Button>
        </div>
      </div>
      <ErrorNotice message={st.error} />
      <div className="v2-code-layout">
        <section className="v2-source-pane">
          <label className="sr-only" htmlFor="code-source">
            {tab.toUpperCase()} source
          </label>
          <div className="v2-code-caption">
            <span>{tab.toUpperCase()} / EDITABLE SOURCE</span>
            <span>{value[tab].split("\n").length} lines</span>
          </div>
          <textarea
            id="code-source"
            aria-label={tab.toUpperCase() + " source"}
            spellCheck={false}
            value={value[tab]}
            onChange={(e) => setValue((v) => ({ ...v, [tab]: e.target.value }))}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const a = e.currentTarget.selectionStart,
                  b = e.currentTarget.selectionEnd;
                setValue((v) => ({
                  ...v,
                  [tab]: v[tab].slice(0, a) + "  " + v[tab].slice(b),
                }));
                const target = e.currentTarget;
                requestAnimationFrame(() => {
                  target.setSelectionRange(a + 2, a + 2);
                });
              }
            }}
          />
          <div className="v2-source-footer">
            <ShieldCheck size={13} />
            Preview scripts have no same-origin host access. Network fetches are
            blocked by CSP.
          </div>
        </section>
        <section className="v2-preview-pane">
          <div className="v2-code-caption">
            <span>
              LIVE PREVIEW / {device === "phone" ? "390 PX" : "RESPONSIVE"}
            </span>
            <span>{ready ? "Rendered" : "Press Run to render"}</span>
          </div>
          <div
            className={
              "v2-iframe-container " + (device === "phone" ? "phone" : "")
            }
          >
            {src ? (
              <iframe
                key={src}
                ref={frame}
                title="Sandboxed code preview"
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                srcDoc={src}
              />
            ) : (
              <div className="v2-preview-empty">
                <Braces size={42} />
                <h2>
                  Your next world
                  <br />
                  starts with a line.
                </h2>
                <p>
                  HTML, CSS and JavaScript. A real sandbox, a deliberate Run
                  action.
                </p>
                <Button variant="primary" onClick={run}>
                  {ui("Run the starter scene")}
                  <Play size={15} />
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
      <div className="v2-code-lower">
        <section className="v2-console">
          <span className="eyebrow">CONSOLE / ACTUAL PREVIEW EVENTS</span>
          {logs.length ? (
            logs.map((l, i) => (
              <pre className={l.type === "error" ? "error-text" : ""} key={i}>
                {l.type === "error" ? "ERROR" : "LOG"} / {l.message}
              </pre>
            ))
          ) : (
            <p>
              No events yet. Runtime errors and console messages appear here
              after execution.
            </p>
          )}
        </section>
        <section className="v2-css-inspector">
          <span className="eyebrow">VISUAL CSS INSPECTOR</span>
          {selection ? (
            <>
              <code>{selection.selector}</code>
              <p>
                {selection.tag} · {selection.text?.slice(0, 120)}
              </p>
              <div className="two-col">
                <label>
                  {ui("Property")}
                  <select
                    value={property}
                    onChange={(e) => setProperty(e.target.value)}
                  >
                    {[
                      "color",
                      "background-color",
                      "font-size",
                      "padding",
                      "border-radius",
                      "width",
                      "height",
                    ].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </label>
                <label>
                  {ui("Value")}
                  <input
                    aria-label={ui("CSS property value")}
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(e.target.value)}
                  />
                </label>
              </div>
              <Button onClick={applyStyle}>
                {ui("Apply property")}
                <Check size={15} />
              </Button>
            </>
          ) : (
            <p>
              Run the preview, enable Inspect, then select an element inside it.
            </p>
          )}
          {value.overrides.length > 0 && (
            <div className="v2-css-overrides">
              <span className="eyebrow">
                {value.overrides.length} SAVED OVERRIDES
              </span>
              {value.overrides.map((o, i) => (
                <code key={i}>
                  {o.selector} → {o.property}: {o.value}
                </code>
              ))}
              <Button
                onClick={() => {
                  setValue((v) => ({ ...v, overrides: [] }));
                  st.s.toast(
                    "Overrides cleared from draft. Run again to refresh the preview.",
                  );
                }}
              >
                Clear overrides
              </Button>
            </div>
          )}
        </section>
      </div>
      <ToolNote>
        Local fixes are deterministic CSS improvements with before/after review.
        AI auto-fix is not connected. Imported code never runs automatically;
        HTML exports contain your code and execute when you open them.
      </ToolNote>
      {repair && (
        <Modal wide title="Review local repair" onClose={() => setRepair(null)}>
          <p>
            {repair.changes.length
              ? repair.changes.join(" · ")
              : "No supported local repairs are needed."}
          </p>
          <div className="two-col">
            <div>
              <span className="eyebrow">BEFORE / CSS</span>
              <pre className="v2-diff before">{value.css}</pre>
            </div>
            <div>
              <span className="eyebrow">AFTER / CSS</span>
              <pre className="v2-diff after">{repair.code.css}</pre>
            </div>
          </div>
          <div className="modal-actions">
            <Button onClick={() => setRepair(null)}>Keep original</Button>
            <Button
              variant="primary"
              disabled={!repair.changes.length}
              onClick={() => {
                setCheckpoint(value);
                setValue(repair.code);
                setRepair(null);
              }}
            >
              Apply selected repair
            </Button>
          </div>
        </Modal>
      )}
      {checkpoint && (
        <div className="v2-checkpoint">
          <Undo2 size={15} />
          Repair checkpoint available
          <Button
            onClick={() => {
              setValue(checkpoint);
              setCheckpoint(null);
            }}
          >
            Undo repair
          </Button>
        </div>
      )}
    </div>
  );
}
