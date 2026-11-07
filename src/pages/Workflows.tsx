import { useEffect, useState, useRef } from "react";
import {
  Plus,
  ArrowUp,
  ArrowUpRight,
  Copy,
  Save,
  FileText,
  Trash2,
  Play,
  Pause,
  Square,
  Download,
  RotateCcw,
} from "lucide-react";
import { useStore, useT, useDraft, download } from "../core/store";
import { Button, PageHead, Empty, Mascot, Modal } from "../components/UI";
import {
  defaultNodes,
  runWorkflow,
  validateWorkflow,
} from "../../shared/schema";
import type { Item, Message } from "../../shared/schema";
import type { Navigate } from "../App";
export function Chat({ id, go }: { id?: string; go: Navigate }) {
  const s = useStore(),
    t = useT(),
    item = s.items.find((i) => i.id === id && !i.deletedAt),
    [draft, setDraft] = useDraft("chat-" + (id || "new"), ""),
    [messages, setMessages] = useState<Message[]>(item?.data.messages || []),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [attachments, setAttachments] = useState<{ name: string; text: string }[]>(
      [],
    );
  async function send() {
    if (!draft.trim() || busy) return;
    setBusy(true);
    const text =
      draft +
      (attachments.length
        ? "\n\n" +
          attachments
            .map((a) => `[Attachment: ${a.name}]\n${a.text}`)
            .join("\n\n")
        : "");
    const next = [
      ...messages,
      {
        id: crypto.randomUUID(),
        role: "user" as const,
        text,
        createdAt: new Date().toISOString(),
      },
    ];
    try {
      if (item) {
        await s.save({ ...item, data: { ...item.data, messages: next } });
        setMessages(next);
        setDraft("");
        setAttachments([]);
      } else {
        const i = await s.create("conversation", draft.slice(0, 70), {
          messages: next,
        });
        setDraft("");
        go("chat", i.id);
      }
      setError("");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function artifact(text: string) {
    try {
      const i = await s.create(
        "document",
        "From conversation: " + (item?.title || "New idea"),
        {
          width: 960,
          height: 540,
          nodes: defaultNodes(text.slice(0, 250)),
          sourceId: item?.id,
        },
      );
      go("create", i.id);
    } catch (e) {
      s.toast(String(e));
    }
  }
  if (id && !item)
    return (
      <Empty
        title="Conversation not found"
        description="It may be in the trash. Your other conversations are still in Library."
        action={<Button onClick={() => go("library")}>Open Library</Button>}
      />
    );
  return (
    <div className="chat-layout">
      <aside className="conversation-list">
        <Button onClick={() => go("chat")}>
          <Plus size={16} />
          {t("New conversation", "บทสนทนาใหม่")}
        </Button>
        <div className="nav-label">
          {t("YOUR CONVERSATIONS", "บทสนทนาของคุณ")}
        </div>
        {s.items
          .filter((i) => i.kind === "conversation" && !i.deletedAt)
          .map((i) => (
            <button
              className={i.id === id ? "selected" : ""}
              key={i.id}
              onClick={() => go("chat", i.id)}
            >
              {i.title}
              <small>
                {new Date(i.updatedAt).toLocaleDateString(s.locale)}
              </small>
            </button>
          ))}
      </aside>
      <section className="chat-main">
        <header className="workspace-title">
          <div>
            <span className="eyebrow">// CONVERSATIONS</span>
            <h1>
              {item?.title ||
                t("A space to think out loud", "พื้นที่สำหรับทุกความคิด")}
            </h1>
          </div>
          <span className="state-badge">
            {t("MANUAL NOTEBOOK", "สมุดบันทึกด้วยตนเอง")}
          </span>
        </header>
        <div className="chat-messages">
          {!messages.length ? (
            <div className="chat-welcome">
              <Mascot />
              <h2>{t("What’s taking shape?", "มีไอเดียอะไรอยู่ในใจ?")}</h2>
              <p>
                {t(
                  "Capture an idea, keep the context, and turn it into something.",
                  "บันทึกไอเดีย เก็บบริบท แล้วเปลี่ยนเป็นชิ้นงาน",
                )}
              </p>
              <div className="suggestion-grid">
                {[
                  "A launch campaign",
                  "An idea worth exploring",
                  "A presentation outline",
                ].map((x) => (
                  <button key={x} onClick={() => setDraft(x)}>
                    {x}
                    <ArrowUpRight size={15} />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <article className="message" key={m.id}>
                <div className="message-author">
                  <span className="avatar small">A</span>
                  <strong>
                    {m.role === "user"
                      ? t("You", "คุณ")
                      : t("Your note", "บันทึกของคุณ")}
                  </strong>
                  <time>
                    {new Date(m.createdAt).toLocaleTimeString(s.locale, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                <div className="message-content">{m.text}</div>
                <div className="message-actions">
                  <button
                    onClick={() =>
                      void navigator.clipboard
                        .writeText(m.text)
                        .then(() => s.toast("Copied"))
                        .catch(() => s.toast("Clipboard unavailable"))
                    }
                  >
                    <Copy size={13} />
                    Copy
                  </button>
                  <button onClick={() => setDraft(m.text)}>
                    Edit as new message
                  </button>
                  <button onClick={() => void artifact(m.text)}>
                    <ArrowUpRight size={13} />
                    Open in Create
                  </button>
                </div>
              </article>
            ))
          )}
          <div className="integration-note">
            <span className="status-dot neutral" />
            {t(
              "AI is not connected. Messages are saved as your own notes; no generated response is being simulated.",
              "ยังไม่เชื่อมต่อ AI ข้อความจะบันทึกเป็นบันทึกของคุณ ไม่มีการจำลองคำตอบ AI",
            )}
          </div>
        </div>
        <div className="chat-composer">
          <textarea
            aria-label={t("Message", "ข้อความ")}
            placeholder={t("Keep the thought going…", "บันทึกความคิดต่อ…")}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                !e.nativeEvent.isComposing
              ) {
                e.preventDefault();
                void send();
              }
            }}
          />
          {attachments.map((a, i) => (
            <button
              className="attachment-chip"
              key={a.name}
              onClick={() => setAttachments((x) => x.filter((_, j) => j !== i))}
            >
              {a.name} ×
            </button>
          ))}
          <div className="composer-bottom">
            <label className="text-button file-button">
              <Plus size={17} />
              {t("Attach text", "แนบข้อความ")}
              <input
                type="file"
                accept=".txt,.md,.csv"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (f) {
                    if (f.size > 100000)
                      s.toast("Text attachments: maximum 100 KB");
                    else
                      setAttachments((x) => [...x, { name: f.name, text: "" }]);
                    if (f.size <= 100000) {
                      const text = await f.text();
                      setAttachments((x) =>
                        x.map((a) => (a.name === f.name ? { ...a, text } : a)),
                      );
                    }
                  }
                  e.target.value = "";
                }}
              />
            </label>
            <span className="muted caption">Shift + Enter ↵</span>
            <button
              className="send-button"
              disabled={!draft.trim() || busy}
              onClick={() => void send()}
              aria-label="Send message"
            >
              <ArrowUp size={19} />
            </button>
          </div>
          {error && (
            <p role="alert" className="error-text">
              {error} · Your input is preserved. Try again.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
export function Research({ id, go }: { id?: string; go: Navigate }) {
  const s = useStore(),
    t = useT(),
    item = s.items.find((i) => i.id === id && !i.deletedAt),
    [title, setTitle] = useDraft(
      "research-title-" + (id || "new"),
      item?.title || "",
    ),
    [body, setBody] = useDraft(
      "research-body-" + (id || "new"),
      item?.data.body || "",
    ),
    [source, setSource] = useDraft(
      "research-source-" + (id || "new"),
      item?.data.source || "",
    ),
    [tags, setTags] = useDraft(
      "research-tags-" + (id || "new"),
      item?.data.tags || "",
    ),
    [selected, setSelected] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save() {
    setBusy(true);
    try {
      const data = { body, source, tags };
      if (item)
        await s.save({ ...item, title: title || "Untitled research", data });
      else {
        const i = await s.create("note", title || "Untitled research", data);
        go("research", i.id);
      }
      setError("");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function sendTo(target: string) {
    try {
      const text = selected || body;
      if (!text.trim()) return;
      const i = await s.create(
        target === "create" ? "document" : "conversation",
        title || "Research material",
        target === "create"
          ? {
              width: 960,
              height: 540,
              nodes: defaultNodes(text.slice(0, 300)),
              sourceId: item?.id,
            }
          : {
              messages: [
                {
                  id: crypto.randomUUID(),
                  role: "note",
                  text,
                  createdAt: new Date().toISOString(),
                },
              ],
              sourceId: item?.id,
            },
      );
      go(target, i.id);
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <div className="page">
      <PageHead
        index="COLLECT / CONNECT / UNDERSTAND"
        title={t("Room for a deeper thought", "พื้นที่สำหรับความคิดที่ลึกขึ้น")}
        description={t(
          "Keep the source. Develop your perspective. Make connections.",
          "เก็บแหล่งข้อมูล พัฒนาความคิด และเชื่อมโยงสิ่งที่ค้นพบ",
        )}
        action={
          <Button variant="primary" onClick={() => void save()} disabled={busy}>
            <Save size={16} />
            {t("Save note", "บันทึกโน้ต")}
          </Button>
        }
      />
      <div className="research-layout">
        <aside className="research-notes">
          <Button onClick={() => go("research")}>
            <Plus size={16} />
            New note
          </Button>
          {s.items
            .filter((i) => i.kind === "note" && !i.deletedAt)
            .map((i) => (
              <button
                key={i.id}
                className={id === i.id ? "selected" : ""}
                onClick={() => go("research", i.id)}
              >
                <FileText size={16} />
                <span>
                  {i.title}
                  <small>{i.data.tags || "Research note"}</small>
                </span>
              </button>
            ))}
        </aside>
        <div className="note-editor">
          <label className="sr-only" htmlFor="note-title">
            Note title
          </label>
          <input
            id="note-title"
            className="title-input"
            placeholder={t("Give this thought a name…", "ตั้งชื่อความคิดนี้…")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="two-col">
            <label>
              {t("Source URL / record", "ลิงก์หรือแหล่งข้อมูล")}
              <input
                placeholder="https://… or a source reference"
                value={source}
                onChange={(e) => setSource(e.target.value)}
              />
            </label>
            <label>
              {t("Tags", "แท็ก")}
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ideas, launch, research"
              />
            </label>
          </div>
          <textarea
            className="research-body"
            aria-label="Research note content"
            placeholder={t(
              "Start collecting your thoughts. Select text to send just that part to Create or Conversations.",
              "เริ่มบันทึกความคิด เลือกข้อความเพื่อส่งเฉพาะส่วนนั้นไปสร้างงาน",
            )}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onSelect={(e) => {
              const el = e.currentTarget;
              setSelected(el.value.slice(el.selectionStart, el.selectionEnd));
            }}
          />
          <div className="note-toolbar">
            <span className="muted">
              {selected
                ? `${selected.length} characters selected`
                : "Your own notes · browser draft kept"}
            </span>
            <Button disabled={!body.trim()} onClick={() => void sendTo("chat")}>
              To Conversations
            </Button>
            <Button
              disabled={!body.trim()}
              onClick={() => void sendTo("create")}
            >
              To Create <ArrowUpRight size={15} />
            </Button>
            <button
              className="icon-button"
              aria-label="Export note"
              onClick={() =>
                download(
                  (title || "note") + ".md",
                  `# ${title}\n\nSource: ${source}\nTags: ${tags}\n\n${body}`,
                  "text/markdown",
                )
              }
            >
              <Download size={17} />
            </button>
          </div>
          {error && (
            <p role="alert" className="error-text">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
export function Live({ id }: { id?: string }) {
  const s = useStore(),
    t = useT(),
    initial = s.items.find((i) => i.id === id),
    [current, setCurrent] = useState(initial),
    [title, setTitle] = useDraft(
      "live-title-" + (id || "new"),
      initial?.title || "My live session",
    ),
    [notes, setNotes] = useDraft(
      "live-notes-" + (id || "new"),
      initial?.data.notes || "",
    ),
    [cards, setCards] = useDraft(
      "live-cards-" + (id || "new"),
      initial?.data.cards || "Opening thought\nThe main idea\nWhat comes next",
    ),
    [elapsed, setElapsed] = useDraft(
      "live-elapsed-" + (id || "new"),
      initial?.data.elapsed || 0,
    ),
    [running, setRunning] = useState(false),
    [present, setPresent] = useState(false),
    [index, setIndex] = useState(0);
  const start = useRef(0),
    base = useRef(0),
    cue = cards.split("\n").filter(Boolean);
  useEffect(() => {
    if (!running) return;
    start.current = Date.now();
    base.current = elapsed;
    const timer = setInterval(
      () => setElapsed(base.current + (Date.now() - start.current) / 1000),
      200,
    );
    return () => clearInterval(timer);
  }, [running]);
  useEffect(() => {
    if (!present) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPresent(false);
      if (e.key === "ArrowRight")
        setIndex((i) => Math.min(cue.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [present, cue.length]);
  async function save() {
    try {
      const data = { notes, cards, elapsed };
      setCurrent(
        current
          ? await s.save({ ...current, title, data })
          : await s.create("session", title, data),
      );
      s.toast("Session saved to Library");
    } catch (e) {
      s.toast(String(e));
    }
  }
  return (
    <div className="page">
      <PageHead
        index="BE HERE / BE HEARD"
        title={t("Your moment, on cue", "ทุกช่วงเวลา พร้อมนำเสนอ")}
        description={t(
          "Notes, cue cards, and a clear head. You take it from here.",
          "บันทึก คิวการนำเสนอ และเวลา เพื่อให้คุณพร้อม",
        )}
        action={
          <Button variant="primary" onClick={() => void save()}>
            <Save size={16} />
            Save session
          </Button>
        }
      />
      <div className="live-grid">
        <section className="control-surface">
          <label>
            Session title
            <input value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <div className="session-timer" role="timer">
            {Math.floor(elapsed / 60)
              .toString()
              .padStart(2, "0")}
            <span>:</span>
            {Math.floor(elapsed % 60)
              .toString()
              .padStart(2, "0")}
          </div>
          <div className="button-row">
            <Button variant="primary" onClick={() => setRunning(!running)}>
              {running ? <Pause size={16} /> : <Play size={16} />}
              {running ? "Pause" : elapsed ? "Resume" : "Start"}
            </Button>
            <Button
              onClick={() => {
                setRunning(false);
                void save();
              }}
            >
              <Square size={15} />
              Finish & save
            </Button>
            <Button
              onClick={() => {
                setRunning(false);
                setElapsed(0);
              }}
            >
              <RotateCcw size={15} />
              Reset timer
            </Button>
          </div>
          <p className="muted">
            Timer runs only while this view is open. Draft time is recoverable.
          </p>
          <label>
            Session notes
            <textarea
              rows={8}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </label>
        </section>
        <section className="control-surface">
          <span className="eyebrow">// YOUR THROUGHLINE</span>
          <h2>Cue cards</h2>
          <label>
            One card per line
            <textarea
              rows={8}
              value={cards}
              onChange={(e) => setCards(e.target.value)}
            />
          </label>
          <div className="cue-preview">
            {cue.map((c: string, i: number) => (
              <button
                key={i}
                onClick={() => {
                  setIndex(i);
                  setPresent(true);
                }}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                {c}
                <ArrowUpRight size={15} />
              </button>
            ))}
          </div>
          <Button
            disabled={!cue.length}
            onClick={() => {
              setIndex(0);
              setPresent(true);
            }}
          >
            Present cue cards <ArrowUpRight size={16} />
          </Button>
        </section>
      </div>
      {present && (
        <Modal
          wide
          title={`${title} / ${index + 1} of ${cue.length}`}
          onClose={() => setPresent(false)}
        >
          <div className="presentation-scene">
            <span className="eyebrow">ARTYVERSE X / LIVE</span>
            <h2>{cue[index]}</h2>
            <span>
              {Math.floor(elapsed / 60)}:
              {Math.floor(elapsed % 60)
                .toString()
                .padStart(2, "0")}
            </span>
          </div>
          <div className="modal-actions">
            <Button disabled={index === 0} onClick={() => setIndex(index - 1)}>
              Previous
            </Button>
            <Button
              disabled={index >= cue.length - 1}
              onClick={() => setIndex(index + 1)}
            >
              Next →
            </Button>
            <Button
              onClick={() => {
                if (!document.fullscreenElement)
                  void document.documentElement
                    .requestFullscreen?.()
                    .catch(() => s.toast("Fullscreen unavailable"));
                else void document.exitFullscreen();
              }}
            >
              Fullscreen
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export function Automate({ id }: { id?: string }) {
  const s = useStore(),
    t = useT(),
    initial = s.items.find((i) => i.id === id),
    [current, setCurrent] = useState(initial),
    [title, setTitle] = useDraft(
      "workflow-title-" + (id || "new"),
      initial?.title || "My local workflow",
    ),
    [source, setSource] = useDraft(
      "workflow-source-" + (id || "new"),
      initial?.data.source || "",
    ),
    [action, setAction] = useDraft(
      "workflow-action-" + (id || "new"),
      initial?.data.action || "outline",
    ),
    [result, setResult] = useState(initial?.data.result || ""),
    [errors, setErrors] = useState<string[]>([]),
    [runAt, setRunAt] = useState(initial?.data.runAt || "");
  async function save() {
    try {
      const data = { source, action, result, runAt };
      setCurrent(
        current
          ? await s.save({ ...current, title, data })
          : await s.create("workflow", title, data),
      );
      s.toast("Workflow saved to Library");
    } catch (e) {
      s.toast(String(e));
    }
  }
  function run() {
    const e = validateWorkflow({ source, action });
    setErrors(e);
    if (e.length) return;
    setResult(runWorkflow({ source, action }));
    setRunAt(new Date().toISOString());
  }
  return (
    <div className="page">
      <PageHead
        index="LESS REPETITION / MORE CREATION"
        title={t("Make room for the good work", "ให้เวลากับงานที่สำคัญ")}
        description={t(
          "Build a simple local flow. Know exactly what happens.",
          "สร้างขั้นตอนในเครื่อง และเห็นชัดเจนว่าทำอะไร",
        )}
        action={
          <Button variant="primary" onClick={() => void save()}>
            <Save size={16} />
            Save workflow
          </Button>
        }
      />
      <div className="workflow-toolbar">
        <label>
          Workflow name
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <span className="state-badge">LOCAL RUN / MANUAL TRIGGER</span>
        <Button variant="primary" onClick={run}>
          <Play size={16} />
          Validate & run
        </Button>
      </div>
      <div className="workflow-board">
        <div className={"workflow-node " + (errors.length ? "node-error" : "")}>
          <span className="eyebrow">01 / INPUT</span>
          <h2>Text source</h2>
          <p>Your text. No external requests.</p>
          <textarea
            aria-label="Workflow source"
            rows={8}
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste your source text…"
          />
          <span className="node-port" />
        </div>
        <div className="workflow-connector" aria-label="Connected to action">
          →
        </div>
        <div className="workflow-node">
          <span className="eyebrow">02 / TRANSFORM</span>
          <h2>Local action</h2>
          <p>A deterministic text operation.</p>
          <label>
            Action
            <select value={action} onChange={(e) => setAction(e.target.value)}>
              <option value="outline">Lines → numbered outline</option>
              <option value="uppercase">Convert to uppercase</option>
              <option value="word-count">Count words & graphemes</option>
            </select>
          </label>
          <div className="node-action-icon">✳</div>
          <span className="node-port" />
        </div>
        <div className="workflow-connector">→</div>
        <div className="workflow-node">
          <span className="eyebrow">03 / OUTPUT</span>
          <h2>Execution result</h2>
          <p>
            {runAt
              ? new Date(runAt).toLocaleString(s.locale)
              : "Waiting for your first run."}
          </p>
          <pre className="workflow-result">
            {result || "Your result will appear here."}
          </pre>
          {result && (
            <Button
              onClick={() => download(title + ".txt", result, "text/plain")}
            >
              <Download size={15} />
              Export result
            </Button>
          )}
        </div>
      </div>
      {errors.map((e) => (
        <p key={e} role="alert" className="error-text">
          Input node: {e}
        </p>
      ))}
      <div className="integration-note">
        Local playback runs here while you use the app. External actions,
        schedules, and background execution require a connected backend and are
        unavailable.
      </div>
      <section className="settings-section">
        <h2>Saved workflows</h2>
        <div className="recent-list">
          {s.items
            .filter((i) => i.kind === "workflow" && !i.deletedAt)
            .map((i) => (
              <a className="button" key={i.id} href={"#/automate/" + i.id}>
                {i.title}
                <ArrowUpRight size={15} />
              </a>
            ))}
        </div>
      </section>
    </div>
  );
}
