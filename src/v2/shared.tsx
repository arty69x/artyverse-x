import { useRef, useState } from "react";
import type { Item } from "../../shared/schema";
import { useStore, useDraft } from "../core/store";
import { advancedSchemas, graphSchema } from "../../shared/v2/contracts";
import { Modal } from "../components/UI";
import { download } from "../core/store";
import { Button } from "../components/UI";
import {
  Save,
  Download,
  Plus,
  ArrowUpRight,
  Undo2,
  Redo2,
  Upload,
} from "lucide-react";
export function useStudio<T extends Record<string, any>>(
  kind: Item["kind"],
  id: string | undefined,
  initial: T,
  defaultTitle: string,
) {
  const s = useStore(),
    item = s.items.find((i) => i.id === id && i.kind === kind && !i.deletedAt),
    [current, setCurrent] = useState(item),
    [title, setTitle] = useDraft(
      "v2:" +
        kind +
        ":" +
        (id || "new") +
        (item ? ":r" + item.revision : "") +
        ":title",
      item?.title || defaultTitle,
    ),
    [value, setDraftValue] = useDraft<T>(
      "v2:" + kind + ":" + (id || "new") + (item ? ":r" + item.revision : ""),
      (item?.data as T) || initial,
      (candidate) =>
        kind === "workflow"
          ? graphSchema.safeParse(candidate?.graph).success
          : !!advancedSchemas[kind as keyof typeof advancedSchemas]?.safeParse(
              candidate,
            ).success,
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const pending = useRef(false),
    valueRef = useRef(value),
    past = useRef<T[]>([]),
    future = useRef<T[]>([]);
  const [, rerender] = useState(0);
  valueRef.current = value;
  function setValue(next: T | ((old: T) => T)) {
    const computed = typeof next === "function" ? next(valueRef.current) : next;
    past.current = [
      ...past.current.slice(-59),
      structuredClone(valueRef.current),
    ];
    future.current = [];
    valueRef.current = computed;
    setDraftValue(computed);
  }
  function undo() {
    const prev = past.current.pop();
    if (prev) {
      future.current.push(structuredClone(valueRef.current));
      valueRef.current = prev;
      setDraftValue(prev);
      rerender((x) => x + 1);
    }
  }
  function redo() {
    const next = future.current.pop();
    if (next) {
      past.current.push(structuredClone(valueRef.current));
      valueRef.current = next;
      setDraftValue(next);
      rerender((x) => x + 1);
    }
  }
  async function save(next: T = value) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    try {
      const saved = current
        ? await s.save({
            ...current,
            title: title.trim() || defaultTitle,
            data: { ...current.data, ...next },
          })
        : await s.create(kind, title.trim() || defaultTitle, next);
      setCurrent(saved);
      setError("");
      s.toast("Saved locally · revision " + saved.revision);
      if (!id)
        location.hash =
          "/" +
          (
            {
              workflow: "automate",
              code: "code",
              composition: "sound",
              scene: "dynamics",
              story: "story",
              project: "projects",
            } as Record<string, string>
          )[kind] +
          "/" +
          saved.id;
      return saved;
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      pending.current = false;
      setBusy(false);
    }
  }
  return {
    importControl: (
      <>
        <Button
          title="Undo studio change"
          disabled={!past.current.length}
          onClick={undo}
        >
          <Undo2 size={15} />
        </Button>
        <Button
          title="Redo studio change"
          disabled={!future.current.length}
          onClick={redo}
        >
          <Redo2 size={15} />
        </Button>
        <SourceImport
          kind={kind}
          value={value}
          title={title}
          onApply={setValue}
        />
      </>
    ),
    s,
    current,
    title,
    setTitle,
    value,
    setValue,
    busy,
    error,
    setError,
    save,
    missing: !!id && !item,
  };
}
export function StudioHead({
  index,
  title,
  onTitle,
  description,
  onSave,
  busy,
  children,
}: {
  index: string;
  title: string;
  onTitle: (s: string) => void;
  description: string;
  onSave?: () => void;
  busy?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <header className="v2-studio-head">
      <div className="min-w-0">
        <span className="eyebrow">// {index}</span>
        <input
          aria-label="Studio title"
          className="v2-title-input"
          value={title}
          onChange={(e) => onTitle(e.target.value)}
          maxLength={180}
        />
        <p>{description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {children}
        {onSave && (
          <Button variant="primary" disabled={busy} onClick={onSave}>
            <Save size={15} />
            {busy ? "Saving…" : "Save"}
          </Button>
        )}
      </div>
    </header>
  );
}
export function ErrorNotice({ message }: { message: string }) {
  return message ? (
    <p className="v2-error" role="alert">
      {message}
    </p>
  ) : null;
}
export function downloadBlob(name: string, blob: Blob) {
  const url = URL.createObjectURL(blob),
    a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export function Missing({ kind }: { kind: string }) {
  return (
    <section className="empty">
      <h1>{kind} not found</h1>
      <p>Check the Library or restore it from Trash.</p>
      <a className="button" href="#/library">
        Open Library <ArrowUpRight size={16} />
      </a>
    </section>
  );
}
export function ToolNote({ children }: { children: React.ReactNode }) {
  return <div className="v2-tool-note">{children}</div>;
}

function SourceImport({
  kind,
  value,
  title,
  onApply,
}: {
  kind: Item["kind"];
  value: any;
  title: string;
  onApply: (v: any) => void;
}) {
  const [preview, setPreview] = useState<any>(null),
    [error, setError] = useState("");
  return (
    <>
      <label className="button v2-import-button">
        <Upload size={15} />
        Import source
        <input
          className="sr-only"
          type="file"
          accept=".json,application/json"
          aria-label="Import studio source"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            e.target.value = "";
            if (!file) return;
            try {
              if (file.size > 2 * 1024 * 1024)
                throw Error("Source exceeds 2 MB");
              const raw = JSON.parse(await file.text());
              let parsed;
              if (kind === "workflow") {
                parsed = {
                  ...value,
                  graph: graphSchema.parse(raw.graph || raw),
                };
              } else {
                const schema =
                  advancedSchemas[kind as keyof typeof advancedSchemas];
                if (!schema) throw Error("Unsupported source type");
                parsed = schema.parse(raw.data || raw);
              }
              setPreview(parsed);
              setError("");
            } catch (err) {
              setError("Import rejected: " + String(err));
            }
          }}
        />
      </label>
      <Button
        title="Export editable source"
        onClick={() =>
          download(title + "-source.json", JSON.stringify(value, null, 2))
        }
      >
        <Download size={15} />
        Source JSON
      </Button>
      {error && (
        <span className="v2-error" role="alert">
          {error}
        </span>
      )}
      {preview && (
        <Modal title="Review imported source" onClose={() => setPreview(null)}>
          <p className="v2-caption">
            Validated {kind} source. Applying replaces the current draft and can
            be undone. Imported code does not execute until Run is pressed.
          </p>
          <pre className="v2-import-preview">
            {JSON.stringify(preview, null, 2).slice(0, 12000)}
          </pre>
          <Button
            variant="primary"
            onClick={() => {
              onApply(preview);
              setPreview(null);
            }}
          >
            Apply imported source
          </Button>
        </Modal>
      )}
    </>
  );
}
