import { browserEdition } from "../hosted/mode";
import { useUI } from "../v3/i18n";
import { applyAccent } from "../v3/accent";
import { useTheme } from "../v3/Theme";
import { kindRoutes, routeForItem } from "../../shared/routes";
import { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  ArrowUp,
  ArrowUpRight,
  Plus,
  Paperclip,
  MessageSquare,
  PenTool,
  BookOpen,
  Mic,
  Radio,
  Zap,
  ArrowRight,
  Folder,
  MoreHorizontal,
  Download,
  Copy,
  Trash2,
  RotateCcw,
  LayoutGrid,
  List,
  Play,
  Search,
  Check,
  Command,
} from "lucide-react";
import { useStore, useT, useDraft, download, request } from "../core/store";
import {
  Button,
  PageHead,
  Empty,
  Modal,
  Mascot,
  SearchBox,
} from "../components/UI";
import { defaultNodes, theme } from "../../shared/schema";
import type { Item } from "../../shared/schema";
import type { Navigate } from "../App";
export const portals = [
  {
    id: "chat",
    title: "Think it through",
    th: "คิดให้เป็นรูปเป็นร่าง",
    description: "A home for every conversation.",
    icon: MessageSquare,
    color: "lime",
    label: "CONVERSATIONS",
  },
  {
    id: "create",
    title: "Make something great",
    th: "สร้างสรรค์สิ่งใหม่",
    description: "From a blank canvas to your next big thing.",
    icon: PenTool,
    color: "violet",
    label: "CREATE STUDIO",
  },
  {
    id: "research",
    title: "Connect the dots",
    th: "เชื่อมโยงความคิด",
    description: "Collect sources. Find your own perspective.",
    icon: BookOpen,
    color: "cyan",
    label: "RESEARCH",
  },
  {
    id: "voice",
    title: "Give ideas a voice",
    th: "บันทึกเสียงไอเดีย",
    description: "Record, listen, and keep the good bits.",
    icon: Mic,
    color: "pink",
    label: "VOICE STUDIO",
  },
  {
    id: "live",
    title: "Own the moment",
    th: "นำเสนออย่างมั่นใจ",
    description: "Cue cards, a timer, and room to present.",
    icon: Radio,
    color: "orange",
    label: "LIVE & PRESENT",
  },
  {
    id: "automate",
    title: "Find your flow",
    th: "สร้างขั้นตอนการทำงาน",
    description: "Small local workflows. Less repetition.",
    icon: Zap,
    color: "blue",
    label: "AUTOMATE",
  },
];
const templateData = [
  {
    id: "manifesto",
    name: "The creative manifesto",
    category: "Presentation",
    color: "#CCFF00",
    subtitle: "A bold idea deserves a bold beginning.",
    text: "Make room\nfor the extraordinary.",
  },
  {
    id: "launch",
    name: "Something is coming",
    category: "Social",
    color: "#B9A3FF",
    subtitle: "A launch announcement with a point of view.",
    text: "A new\nperspective.",
  },
  {
    id: "research",
    name: "Notes from the future",
    category: "Editorial",
    color: "#8BD9E8",
    subtitle: "Turn your research into a visual story.",
    text: "Good questions.\nBetter possibilities.",
  },
  {
    id: "minimal",
    name: "Less, but better",
    category: "Presentation",
    color: "#F4B9A8",
    subtitle: "A quiet canvas for a clear message.",
    text: "Focus on\nwhat matters.",
  },
  {
    id: "poster",
    name: "After hours",
    category: "Poster",
    color: "#FC7058",
    subtitle: "A striking typographic poster.",
    text: "AFTER\nHOURS.",
  },
  {
    id: "blank",
    name: "Start with nothing",
    category: "Blank",
    color: "#E4E4E9",
    subtitle: "All the space you need.",
    text: "Your idea\nstarts here.",
  },
];
export function HomePage({ go }: { go: Navigate }) {
  const s = useStore(),
    t = useT();
  const [draft, setDraft] = useDraft("home-composer", ""),
    [demo, setDemo] = useState(false),
    [busy, setBusy] = useState(false);
  async function send() {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      const i = await s.create("conversation", draft.slice(0, 70), {
        messages: [
          {
            id: crypto.randomUUID(),
            role: "user",
            text: draft,
            createdAt: new Date().toISOString(),
          },
        ],
      });
      setDraft("");
      go("chat", i.id);
    } catch (e) {
      s.toast(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-universe" aria-hidden="true">
          <div className="starfield" />
          <div className="planet" />
          <svg className="orbit-line" viewBox="0 0 1000 500">
            <ellipse
              cx="500"
              cy="380"
              rx="460"
              ry="85"
              transform="rotate(-18 500 380)"
            />
          </svg>
        </div>
        <div className="hero-topline">
          <span className="eyebrow">
            <span className="tiny-star">✳</span>{" "}
            {t("A SPACE FOR WHAT’S NEXT", "พื้นที่สำหรับสิ่งที่เป็นไปได้")}
          </span>
          <span className="hero-coordinate">AVX—001 / YOUR UNIVERSE</span>
        </div>
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="hero-badge">
            <span className="status-dot" />
            {t("Your ideas. No limits.", "ทุกไอเดีย มีพื้นที่เติบโต")}
          </div>
          <h1>
            {t("Intelligence,", "ความคิดสร้างสรรค์")}
            <br />
            <span>{t("in motion.", "ที่เคลื่อนไปข้างหน้า")}</span>
          </h1>
          <p>
            {t(
              "A little spark. An entire universe of possibilities.",
              "จากประกายเล็ก ๆ สู่จักรวาลแห่งความเป็นไปได้",
            )}
            <br />
            {t(
              "Think, create, and bring your next big idea to life.",
              "คิด สร้าง และเปลี่ยนไอเดียให้เป็นชิ้นงาน",
            )}
          </p>
          <div className="home-composer">
            <label className="sr-only" htmlFor="home-prompt">
              {t("Your idea", "ไอเดียของคุณ")}
            </label>
            <textarea
              id="home-prompt"
              placeholder={t(
                "What’s on your mind? Let’s make something.",
                "คุณกำลังคิดอะไรอยู่? มาเริ่มสร้างกัน",
              )}
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
            <div className="composer-bottom">
              <span>
                <span className="composer-mark">✳</span>
                {t("Idea notebook", "สมุดบันทึกไอเดีย")}
                <small>{t("AI not connected", "ยังไม่เชื่อมต่อ AI")}</small>
              </span>
              <button
                className="send-button"
                disabled={!draft.trim() || busy}
                onClick={() => void send()}
                aria-label={t("Start conversation", "เริ่มบทสนทนา")}
              >
                <ArrowUp size={20} />
              </button>
            </div>
          </div>
          <div className="hero-links">
            <button onClick={() => go("templates")}>
              <Plus size={13} />
              {t("Start with a template", "เริ่มจากเทมเพลต")}
            </button>
            <span>·</span>
            <button onClick={() => setDemo(true)}>
              <Play size={13} />
              {t("Take a quick tour", "ดูวิธีใช้งาน")}
            </button>
          </div>
        </motion.div>
        <div className="hero-mascot">
          <span>{t("Let’s make it happen.", "มาสร้างสิ่งใหม่กัน")}</span>
          <Mascot />
        </div>
        <div className="hero-footnote">
          <span>
            THINK <i /> CREATE <i /> CONNECT
          </span>
          <span>
            {t("BUILT FOR YOUR NEXT CHAPTER", "สำหรับบทต่อไปของคุณ")} ↘
          </span>
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">// YOUR CREATIVE TOOLKIT</span>
            <h2>
              {t(
                "One space. Many possibilities.",
                "พื้นที่เดียว ทุกความเป็นไปได้",
              )}
            </h2>
          </div>
          <button className="text-button" onClick={() => go("explore")}>
            {t("Explore all", "สำรวจทั้งหมด")}
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="portal-grid">
          {portals.slice(0, 3).map((p, i) => (
            <button
              key={p.id}
              className={"portal " + p.color}
              onClick={() => go(p.id)}
            >
              <div className="portal-art" aria-hidden="true">
                <div className={"portal-geometry geometry-" + i} />
                <p.icon size={27} />
              </div>
              <span className="eyebrow">
                0{i + 1} / {p.label}
              </span>
              <h3>{s.locale === "th" ? p.th : p.title}</h3>
              <p>{p.description}</p>
              <ArrowUpRight className="portal-arrow" size={20} />
            </button>
          ))}
        </div>
      </section>
      <section className="home-section featured">
        <div className="section-heading">
          <div>
            <span className="eyebrow">// A LITTLE INSPIRATION</span>
            <h2>
              {t("The beginning of something.", "จุดเริ่มต้นของสิ่งใหม่")}
            </h2>
          </div>
          <button className="text-button" onClick={() => go("templates")}>
            {t("Browse templates", "ดูเทมเพลต")}
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="featured-grid">
          {templateData.slice(0, 3).map((p, i) => (
            <button
              className={"template-feature feature-" + i}
              key={p.id}
              onClick={() => go("templates")}
            >
              <div className="sample-label">TEMPLATE / SAMPLE</div>
              <div className="feature-art" style={{ color: p.color }}>
                <span>{p.text}</span>
                <div className="feature-orbit" />
              </div>
              <div className="feature-meta">
                <span>
                  {p.name}
                  <small>{p.category} · Editable canvas</small>
                </span>
                <ArrowUpRight size={18} />
              </div>
            </button>
          ))}
        </div>
      </section>
      {s.items.some((i) => !i.deletedAt) && (
        <section className="home-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">// PICK UP WHERE YOU LEFT OFF</span>
              <h2>{t("Still in your orbit.", "งานที่ยังอยู่ในวงโคจร")}</h2>
            </div>
            <Button onClick={() => go("library")}>
              {t("Your library", "คลังงาน")}
              <ArrowUpRight size={16} />
            </Button>
          </div>
          <div className="recent-list">
            {s.items
              .filter((i) => !i.deletedAt)
              .slice(0, 4)
              .map((i) => (
                <button key={i.id} onClick={() => openItem(i, go)}>
                  <Folder size={20} />
                  <span>
                    {i.title}
                    <small>
                      {i.kind} ·{" "}
                      {new Date(i.updatedAt).toLocaleDateString(s.locale)}
                    </small>
                  </span>
                  <ArrowUpRight size={17} />
                </button>
              ))}
          </div>
        </section>
      )}
      {demo && (
        <Modal
          title={t("From a spark to something real", "จากไอเดียสู่ชิ้นงาน")}
          onClose={() => setDemo(false)}
        >
          <div className="tour-steps">
            {[
              "1. Capture an idea in Conversations or Research.",
              "2. Send your text to Create and edit the canvas.",
              "3. Save to Library, export, or present your work.",
            ].map((x) => (
              <p key={x}>{x}</p>
            ))}
            <p className="integration-note">
              Local tools work now. AI inference, cloud sync, and external
              automation are not connected.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setDemo(false);
                go("create");
              }}
            >
              Open Create <ArrowUpRight size={16} />
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export function openItem(i: Item, go: Navigate) {
  go(routeForItem(i), i.id);
}
export function Discover({
  go,
  templates = false,
}: {
  go: Navigate;
  templates?: boolean;
}) {
  const s = useStore(),
    t = useT(),
    [q, setQ] = useState(""),
    [filter, setFilter] = useState("All"),
    [preview, setPreview] = useState<(typeof templateData)[number] | null>(
      null,
    ),
    [busy, setBusy] = useState(false);
  async function useTemplate() {
    if (!preview) return;
    setBusy(true);
    try {
      const nodes = defaultNodes(preview.text);
      nodes[1].color = preview.color;
      const item = await s.create("document", preview.name, {
        width: 960,
        height: 540,
        nodes,
        templateId: preview.id,
      });
      go("create", item.id);
    } catch (e) {
      s.toast(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page">
      <PageHead
        index={templates ? "START WITH A SPARK" : "FIND YOUR SPACE"}
        title={
          templates
            ? t("A head start for your ideas", "เริ่มต้นไอเดียได้เร็วขึ้น")
            : t("Explore your possibilities", "สำรวจความเป็นไปได้")
        }
        description={
          templates
            ? t(
                "Original, editable templates. Make one your own.",
                "เทมเพลตที่แก้ไขได้จริง เริ่มเป็นเอกสารใหม่เสมอ",
              )
            : t(
                "Different tools. One connected creative process.",
                "หลายเครื่องมือ ในกระบวนการสร้างสรรค์เดียวกัน",
              )
        }
      />
      <div className="filter-bar">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder={t("Find your starting point…", "ค้นหาจุดเริ่มต้น…")}
        />
        {templates && (
          <div className="tabs">
            {[
              "All",
              "Presentation",
              "Social",
              "Editorial",
              "Poster",
              "Blank",
            ].map((x) => (
              <button
                className={filter === x ? "selected" : ""}
                onClick={() => setFilter(x)}
                key={x}
              >
                {x}
              </button>
            ))}
          </div>
        )}
      </div>
      {templates ? (
        <div className="template-grid">
          {templateData
            .filter(
              (x) =>
                (filter === "All" || x.category === filter) &&
                (x.name + x.category).toLowerCase().includes(q.toLowerCase()),
            )
            .map((x, i) => (
              <button
                className={"template-feature feature-" + (i % 3)}
                key={x.id}
                onClick={() => setPreview(x)}
              >
                <span className="sample-label">EDITABLE TEMPLATE</span>
                <div className="feature-art" style={{ color: x.color }}>
                  <span>{x.text}</span>
                  <div className="feature-orbit" />
                </div>
                <div className="feature-meta">
                  <span>
                    {x.name}
                    <small>{x.category} · 960 × 540</small>
                  </span>
                  <ArrowUpRight size={18} />
                </div>
              </button>
            ))}
        </div>
      ) : (
        <div className="portal-grid explore-grid">
          {portals
            .filter((p) =>
              (p.title + p.description).toLowerCase().includes(q.toLowerCase()),
            )
            .map((p, i) => (
              <button
                className={"portal " + p.color}
                key={p.id}
                onClick={() => go(p.id)}
              >
                <div className="portal-art">
                  <div className={"portal-geometry geometry-" + (i % 3)} />
                  <p.icon size={30} />
                </div>
                <span className="eyebrow">{p.label}</span>
                <h2>{s.locale === "th" ? p.th : p.title}</h2>
                <p>{p.description}</p>
                <span className="text-button">
                  {t("Open workspace", "เปิดพื้นที่ทำงาน")}
                  <ArrowUpRight size={17} />
                </span>
              </button>
            ))}
        </div>
      )}
      {q && (
        <button
          className="text-button"
          onClick={() => {
            setQ("");
            setFilter("All");
          }}
        >
          Clear filters
        </button>
      )}
      {preview && (
        <Modal wide title={preview.name} onClose={() => setPreview(null)}>
          <div className="template-preview" style={{ color: preview.color }}>
            <span className="eyebrow">ARTYVERSE X / SAMPLE TEMPLATE</span>
            <h2>{preview.text}</h2>
            <span>{preview.subtitle}</span>
          </div>
          <div className="modal-actions">
            <span className="muted">Creates a new editable document.</span>
            <Button
              variant="primary"
              disabled={busy}
              onClick={() => void useTemplate()}
            >
              Use template <ArrowRight size={16} />
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
export function Library({ go }: { go: Navigate }) {
  const ui = useUI();

  const s = useStore(),
    t = useT(),
    [q, setQ] = useDraft("library-query", ""),
    [filter, setFilter] = useDraft("library-filter", "All"),
    [sort, setSort] = useDraft("library-sort", "recent"),
    [list, setList] = useDraft("library-list", false),
    [view, setView] = useState<Item | null>(null),
    [rename, setRename] = useState<Item | null>(null),
    [name, setName] = useState("");
  const items = s.scopedItems
    .filter(
      (i) =>
        (filter === "Trash" ? !!i.deletedAt : !i.deletedAt) &&
        (filter === "All" || filter === "Trash" || i.kind === filter) &&
        i.title.toLowerCase().includes(q.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "name"
        ? a.title.localeCompare(b.title)
        : b.updatedAt.localeCompare(a.updatedAt),
    );
  async function duplicate(i: Item) {
    try {
      await s.create(i.kind, i.title + " — copy", structuredClone(i.data));
      s.toast("Created a separate copy");
    } catch (e) {
      s.toast(String(e));
    }
  }
  return (
    <div className="page">
      <PageHead
        index="YOUR CREATIVE MEMORY"
        title={t("Everything, in your orbit", "ทุกอย่างในวงโคจรของคุณ")}
        description={t(
          "Your real work, saved locally. Ready for its next chapter.",
          "งานจริงของคุณ บันทึกในเครื่อง พร้อมกลับมาทำต่อ",
        )}
        action={
          <Button variant="primary" onClick={() => go("create")}>
            <Plus size={16} />
            {t("New creation", "สร้างงานใหม่")}
          </Button>
        }
      />
      <div className="filter-bar">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder={t("Search your work…", "ค้นหางานของคุณ…")}
        />
        <select
          aria-label="Filter by type"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {[
            "All",
            "document",
            "conversation",
            "note",
            "recording",
            "session",
            "workflow",
            "preset",
            "project",
            "code",
            "composition",
            "scene",
            "story",
            "agent-run",
            "Trash",
          ].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </select>
        <select
          aria-label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="recent">Recently updated</option>
          <option value="name">Name A–Z</option>
        </select>
        <button
          className="icon-button"
          aria-label={list ? "Show grid" : "Show list"}
          onClick={() => setList(!list)}
        >
          {list ? <LayoutGrid size={18} /> : <List size={18} />}
        </button>
      </div>
      {items.length ? (
        <div className={list ? "library-list" : "library-grid"}>
          {items.map((i) => (
            <article className="library-card" key={i.id}>
              <button
                className={"library-thumb kind-" + i.kind}
                onClick={() =>
                  i.kind === "recording" ? setView(i) : openItem(i, go)
                }
              >
                {i.kind === "document" ? (
                  <div className="mini-document">
                    {(i.data.nodes || [])
                      .filter((n: any) => n.type === "text")
                      .slice(0, 3)
                      .map((n: any) => (
                        <span key={n.id} style={{ color: n.color }}>
                          {n.text}
                        </span>
                      ))}
                  </div>
                ) : i.kind === "recording" ? (
                  <div className="audio-wave">▂▅▃▇▆▂▅▇▃▅▂▆</div>
                ) : (
                  <>
                    <span className="eyebrow">{i.kind.toUpperCase()}</span>
                    <span className="thumb-title">{i.title}</span>
                  </>
                )}
              </button>
              <div className="library-card-body">
                <h2>
                  <button
                    onClick={() =>
                      i.kind === "recording" ? setView(i) : openItem(i, go)
                    }
                  >
                    {i.title}
                  </button>
                </h2>
                <small>
                  {i.kind} ·{" "}
                  {new Date(i.updatedAt).toLocaleDateString(s.locale)} · v
                  {i.revision}
                </small>
                <div className="item-actions">
                  {i.deletedAt ? (
                    <Button onClick={() => void s.trash(i, true)}>
                      <RotateCcw size={14} />
                      {ui("Restore")}
                    </Button>
                  ) : (
                    <>
                      <button
                        className="icon-button"
                        title={ui("Rename")}
                        aria-label={"Rename " + i.title}
                        onClick={() => {
                          setRename(i);
                          setName(i.title);
                        }}
                      >
                        <PenTool size={15} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={"Duplicate " + i.title}
                        onClick={() => void duplicate(i)}
                      >
                        <Copy size={15} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={"Export " + i.title}
                        onClick={() =>
                          download(
                            i.title + ".json",
                            JSON.stringify(i, null, 2),
                          )
                        }
                      >
                        <Download size={15} />
                      </button>
                      <button
                        className="icon-button"
                        aria-label={"Trash " + i.title}
                        onClick={() => void s.trash(i)}
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title={
            q
              ? t("No work found", "ไม่พบงาน")
              : t(
                  "Your next idea belongs here",
                  "ไอเดียถัดไปของคุณจะอยู่ที่นี่",
                )
          }
          description={t(
            "Create something, save it, and come back whenever inspiration strikes.",
            "สร้างและบันทึกงาน แล้วกลับมาทำต่อได้ทุกเมื่อ",
          )}
          action={
            <Button onClick={() => go("templates")}>
              Explore templates <ArrowUpRight size={16} />
            </Button>
          }
        />
      )}
      {rename && (
        <Modal title="Rename item" onClose={() => setRename(null)}>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              try {
                await s.save({ ...rename, title: name });
                setRename(null);
              } catch (e) {
                s.toast(String(e));
              }
            }}
          >
            <label>
              Title
              <input
                autoFocus
                required
                maxLength={180}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <div className="modal-actions">
              <Button type="submit" variant="primary">
                Save title
              </Button>
            </div>
          </form>
        </Modal>
      )}
      {view && (
        <Modal title={view.title} onClose={() => setView(null)}>
          <audio controls src={view.data.url} />
          <p className="muted">
            {view.data.duration?.toFixed(1)} seconds · {view.data.mime}
          </p>
          <a className="button" href={view.data.url} download>
            Download recording
          </a>
        </Modal>
      )}
    </div>
  );
}
export function SettingsPage() {
  const ui = useUI();

  const appearance = useTheme();
  const s = useStore(),
    t = useT(),
    [status, setStatus] = useState<any>(null),
    [backup, setBackup] = useState<any>(null),
    [error, setError] = useState("");
  useEffect(() => {
    request("/status")
      .then(setStatus)
      .catch((e) => setError(String(e)));
  }, []);
  return (
    <div className="page narrow">
      <PageHead
        index="MAKE YOURSELF AT HOME"
        title={t("Your space. Your way", "พื้นที่ของคุณ ในแบบคุณ")}
        description={t(
          "Preferences, privacy, and the things that keep your work safe.",
          "ปรับการใช้งาน ความเป็นส่วนตัว และสำรองงาน",
        )}
      />
      <section className="settings-section">
        <h2>{t("Personal preferences", "การตั้งค่าส่วนตัว")}</h2>
        <label className="setting-row">
          <span>
            {t("Theme", "ธีม")}
            <small>
              {t(
                "Dark, light, or follow your system.",
                "มืด สว่าง หรือตามการตั้งค่าของเครื่อง",
              )}
            </small>
          </span>
          <select
            aria-label={t("Theme preference", "การตั้งค่าธีม")}
            value={appearance.preference}
            onChange={(e) => appearance.setTheme(e.target.value as any)}
          >
            <option value="dark">{t("Dark creative", "มืดสร้างสรรค์")}</option>
            <option value="light">{t("Light", "สว่าง")}</option>
            <option value="system">{t("System", "ตามระบบ")}</option>
          </select>
        </label>
        <label className="setting-row">
          <span>
            {t("Language", "ภาษา")}
            <small>Interface only. Your content stays unchanged.</small>
          </span>
          <select
            value={s.locale}
            onChange={(e) => s.setLocale(e.target.value as any)}
          >
            <option value="en">English</option>
            <option value="th">ภาษาไทย</option>
          </select>
        </label>
        <label className="setting-row">
          <span>
            {t("Motion quality", "ระดับการเคลื่อนไหว")}
            <small>OS reduced motion is always respected.</small>
          </span>
          <select
            value={s.motion}
            onChange={(e) => s.setMotion(e.target.value)}
          >
            {["Full", "Balanced", "Calm", "Off"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="setting-row">
          <span>
            {t("Accent color", "สีเน้น")}
            <small>Applied to interface controls.</small>
          </span>
          <input
            aria-label="Accent color"
            type="color"
            defaultValue={localStorage.getItem("av-accent") || "#CCFF00"}
            onChange={(e) => {
              applyAccent(e.target.value);
              localStorage.setItem("av-accent", e.target.value);
            }}
          />
        </label>
      </section>
      <section className="settings-section">
        <h2>{t("Storage & backup", "พื้นที่จัดเก็บและสำรองข้อมูล")}</h2>
        <p className="muted">
          {status
            ? `${status.storage} · ${(status.bytes / 1024).toFixed(1)} KB records (media excluded)`
            : "Checking local storage…"}
        </p>
        <p>
          {browserEdition
            ? t(
                "Items and media are stored in this browser’s IndexedDB. Export backups before clearing site data or changing browser. No cloud sync is active.",
                "งานและสื่อเก็บใน IndexedDB ของเบราว์เซอร์นี้ สำรองก่อนล้างข้อมูลหรือเปลี่ยนเบราว์เซอร์ ไม่มี cloud sync",
              )
            : "Items are stored on this machine’s local server. Browser drafts stay in this browser. No account or cloud sync is active."}
        </p>
        <div className="button-row">
          <Button
            onClick={async () => {
              try {
                download(
                  "artyverse-backup.json",
                  JSON.stringify(await request("/backup"), null, 2),
                );
              } catch (e) {
                setError(String(e));
              }
            }}
          >
            <Download size={16} />
            {ui("Download complete backup")}
          </Button>
          <label className="button file-button">
            {ui("Preview restore")}
            <input
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                try {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 100 * 1024 * 1024)
                    throw Error("Backup exceeds 100 MB import limit");
                  const b = JSON.parse(await f.text());
                  if (
                    b.schemaVersion !== 1 ||
                    !Array.isArray(b.items) ||
                    !Array.isArray(b.assets)
                  )
                    throw Error("Invalid backup");
                  setBackup(b);
                  setError("");
                } catch (e) {
                  setError(String(e));
                }
                e.target.value = "";
              }}
            />
          </label>
        </div>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </section>
      <section className="settings-section">
        <h2>{t("Integration status", "สถานะการเชื่อมต่อ")}</h2>
        {[
          [
            "AI providers",
            "Not connected · manual notes and local tools available",
          ],
          ["Cloud sync & accounts", "Unavailable · local backup available"],
          [
            "External automations & schedules",
            "Unavailable · local runs while this app is open",
          ],
          ["Microphone", "Requested only after you press Record"],
        ].map(([a, b]) => (
          <div className="setting-row" key={a}>
            <span>
              {a}
              <small>{b}</small>
            </span>
            <span className="state-badge">
              {a === "Microphone" ? "USER INITIATED" : "LOCAL / UNAVAILABLE"}
            </span>
          </div>
        ))}
      </section>
      <section className="settings-section">
        <h2>{ui("Keyboard shortcuts")}</h2>
        <p>
          <kbd>⌘ / Ctrl K</kbd> Search · <kbd>Escape</kbd> Close dialog ·{" "}
          <kbd>Ctrl Z</kbd> Editor undo · <kbd>Shift Enter</kbd> New line
        </p>
      </section>
      {backup && (
        <Modal title="Preview backup restore" onClose={() => setBackup(null)}>
          <p>
            {backup.items.length} items · {backup.assets.length} media files
          </p>
          <p>
            Merge by stable ID. Existing work is preserved. Download a backup
            first for your recovery point.
          </p>
          <Button
            variant="primary"
            onClick={async () => {
              try {
                const r = await request("/restore", backup);
                await s.refresh();
                s.toast(r.policy);
                setBackup(null);
              } catch (e) {
                setError(String(e));
                setBackup(null);
              }
            }}
          >
            {ui("Merge backup")}
          </Button>
        </Modal>
      )}
    </div>
  );
}
