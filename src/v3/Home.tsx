import { useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Plus,
  Play,
  Sparkles,
  Command,
  Mic,
  AudioLines,
  Workflow,
  Layers,
  Orbit,
  Code2,
  PenTool,
  BookOpen,
  MoveUp,
  MoveDown,
  RotateCcw,
  SlidersHorizontal,
  Folder,
  FileText,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { useStore, useT, useDraft } from "../core/store";
import { Button, Modal } from "../components/UI";
import type { Navigate } from "../App";
import { routeForItem } from "../../shared/routes";
import { Arcyca } from "./Mascot";
const portals = [
  {
    id: "create",
    title: ["Create Canvas", "ออกแบบบน Canvas"],
    description: [
      "Give your ideas a shape.",
      "เปลี่ยนความคิดให้เป็นองค์ประกอบที่แก้ไขได้",
    ],
    label: "01 / VISUAL DESIGN",
    icon: PenTool,
    style: "canvas",
  },
  {
    id: "code",
    title: ["Build something live.", "เขียนโค้ด เห็นผลทันที"],
    description: [
      "A real sandbox. Your next experiment.",
      "ทดลอง HTML, CSS และ JavaScript ใน sandbox",
    ],
    label: "02 / LIVE CODE",
    icon: Code2,
    style: "code",
  },
  {
    id: "sound",
    title: ["Find your frequency.", "ค้นหาความถี่ของคุณ"],
    description: [
      "Compose, play, and export real audio.",
      "สร้างลำดับเสียง เล่น และส่งออก WAV",
    ],
    label: "03 / SOUND LAB",
    icon: AudioLines,
    style: "sound",
  },
  {
    id: "automate",
    title: ["Connect the possibilities.", "เชื่อมทุกความเป็นไปได้"],
    description: [
      "From a brief to a working workflow.",
      "ต่อขั้นตอนจากไอเดียไปสู่ชิ้นงานจริง",
    ],
    label: "04 / NODE STUDIO",
    icon: Workflow,
    style: "nodes",
  },
  {
    id: "dynamics",
    title: ["Make it move.", "ให้ไอเดียมีชีวิต"],
    description: [
      "SVG physics. Touch, explore, create.",
      "ทดลองแรง การเคลื่อนไหว และฉาก SVG",
    ],
    label: "05 / DYNAMICS",
    icon: Orbit,
    style: "dynamics",
  },
  {
    id: "story",
    title: ["A story worth sharing.", "เล่าเรื่องที่อยากแบ่งปัน"],
    description: [
      "Scenes, scripts and your point of view.",
      "เรียบเรียงฉาก บทพูด และงานนำเสนอ",
    ],
    label: "06 / STORY STUDIO",
    icon: Layers,
    style: "story",
  },
];
function PortalArt({ type }: { type: string }) {
  if (type === "canvas")
    return (
      <div className="v3-art-canvas">
        <span>
          MAKE
          <br />
          IT <i>YOURS.</i>
        </span>
        <div />
        <small>AN EDITABLE WORLD</small>
      </div>
    );
  if (type === "code")
    return (
      <div className="v3-art-code">
        <span>
          <i>01</i> <b>const</b> universe = create();
        </span>
        <span>
          <i>02</i> universe.<em>imagine</em>();
        </span>
        <span>
          <i>03</i> universe.<em>make</em>('yours');
        </span>
        <div />
      </div>
    );
  if (type === "sound")
    return (
      <div className="v3-art-sound">
        {Array.from({ length: 30 }, (_, i) => (
          <i
            key={i}
            style={{
              height:
                12 +
                Math.abs(Math.sin(i * 0.8) * Math.cos(i * 0.31)) * 65 +
                "px",
            }}
          />
        ))}
      </div>
    );
  if (type === "nodes")
    return (
      <div className="v3-art-nodes">
        <span>INPUT</span>
        <i />
        <span>CREATE</span>
        <i />
        <span>OUTPUT</span>
      </div>
    );
  if (type === "dynamics")
    return (
      <div className="v3-art-dynamics">
        <div />
        <i />
        <span />
      </div>
    );
  return (
    <div className="v3-art-story">
      <span>01 / A NEW PERSPECTIVE</span>
      <strong>
        Make it
        <br />
        <em>mean something.</em>
      </strong>
      <div>
        <i />
        <i />
        <i />
      </div>
    </div>
  );
}
export function HomeV3({ go }: { go: Navigate }) {
  const s = useStore(),
    t = useT(),
    [draft, setDraft] = useDraft("home-composer", ""),
    [mode, setMode] = useState("notebook"),
    [busy, setBusy] = useState(false),
    [tour, setTour] = useState(false),
    [arranging, setArranging] = useState(false),
    [order, setOrder] = useState<string[]>(() => {
      try {
        const d = JSON.parse(
          localStorage.getItem("av-home-layout-v3") || "null",
        );
        return Array.isArray(d) &&
          d.length === 6 &&
          new Set(d).size === 6 &&
          d.every((id: string) => portals.some((p) => p.id === id))
          ? d
          : portals.map((p) => p.id);
      } catch {
        return portals.map((p) => p.id);
      }
    });
  const locale = s.locale === "th" ? 1 : 0,
    items = s.scopedItems.filter((i) => !i.deletedAt && i.kind !== "project"),
    recent = [...items]
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 4),
    stats = [
      [t("Saved creations", "ชิ้นงานที่บันทึก"), items.length, FileText],
      [
        t("Creative projects", "โปรเจกต์สร้างสรรค์"),
        s.items.filter((i) => !i.deletedAt && i.kind === "project").length,
        Folder,
      ],
      [
        t("Notes & ideas", "โน้ตและไอเดีย"),
        items.filter((i) => i.kind === "note" || i.kind === "conversation")
          .length,
        BookOpen,
      ],
      [
        t("Local executions", "การทำงานที่บันทึก"),
        items.filter((i) => i.kind === "agent-run").length,
        Workflow,
      ],
    ] as const;
  async function start() {
    if (!draft.trim() || busy) return;
    setBusy(true);
    try {
      if (mode === "agent") {
        localStorage.setItem("av-draft:v2:agent:prompt", JSON.stringify(draft));
        go("agents");
        return;
      }
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
  function reorder(i: number, d: number) {
    const next = [...order],
      j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setOrder(next);
    localStorage.setItem("av-home-layout-v3", JSON.stringify(next));
  }
  return (
    <div className="v3-home">
      <div className="v3-home-intro">
        <div>
          <span className="eyebrow">// YOUR CREATIVE OPERATING SYSTEM</span>
          <p>
            {t(
              "A little space for your next big thing.",
              "พื้นที่เล็ก ๆ สำหรับไอเดียที่ยิ่งใหญ่ของคุณ",
            )}
          </p>
        </div>
        <a href="#/projects" className="v3-text-link">
          {t("Open your projects", "เปิดโปรเจกต์ของคุณ")}{" "}
          <ArrowUpRight size={17} />
        </a>
      </div>
      <section className="v3-hero">
        <div className="v3-hero-grid" />
        <div className="v3-hero-copy">
          <span className="v3-live-label">
            <i />
            ARTIST × MULTIVERSE
          </span>
          <h1>
            {t("One artist.", "ทุกไอเดีย")}
            <br />
            <span>{t("Infinite", "เป็นไปได้")}</span>{" "}
            <em>{t("worlds.", "จริง.")}</em>
          </h1>
          <p>
            {t(
              "Think freely. Build boldly. Make it unmistakably yours.",
              "คิดอย่างอิสระ สร้างอย่างกล้าหาญ ให้ทุกชิ้นงานเป็นตัวคุณ",
            )}
            <br />
            {t(
              "Ideas, code, sound and motion. One connected studio.",
              "ไอเดีย โค้ด เสียง และการเคลื่อนไหว ในสตูดิโอเดียว",
            )}
          </p>
          <div className="v3-hero-actions">
            <Button variant="primary" onClick={() => go("create")}>
              <Plus size={18} />
              {t("Start creating", "เริ่มสร้างสรรค์")}
            </Button>
            <button className="v3-hero-tour" onClick={() => setTour(true)}>
              <Play size={15} />
              {t("Explore the process", "ดูขั้นตอนการทำงาน")}
            </button>
          </div>
        </div>
        <div className="v3-hero-character">
          <div className="v3-orbit-ring a" />
          <div className="v3-orbit-ring b" />
          <Arcyca />
          <span className="v3-floating-chip chip-one">
            <Sparkles size={15} />
            Your ideas. Amplified.
          </span>
          <span className="v3-floating-chip chip-two">
            <Command size={15} />
            Create without limits
          </span>
          <span className="v3-hero-caption">
            ARCYCA / YOUR CREATIVE COMPANION
          </span>
        </div>
        <div className="v3-hero-index">
          01 — THINK. CREATE. ANALYZE. HYPER-POLISH. DRIVE.
        </div>
      </section>
      <section
        className="v3-composer"
        aria-label={t("Start an idea", "เริ่มต้นไอเดีย")}
      >
        <div className="v3-composer-text">
          <img
            src="/assets/whisper-micro-white.svg"
            alt="Whisper assistant"
            width="26"
            height="26"
          />
          <label className="sr-only" htmlFor="v3-idea">
            {t("Your idea", "ไอเดียของคุณ")}
          </label>
          <textarea
            id="v3-idea"
            rows={1}
            placeholder={t(
              "What will you bring into the world?",
              "วันนี้คุณอยากสร้างอะไรให้เกิดขึ้นจริง?",
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
                void start();
              }
            }}
          />
        </div>
        <div className="v3-composer-actions">
          <select
            aria-label={t("Composer mode", "โหมดเริ่มต้น")}
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="notebook">{t("Idea notebook", "สมุดไอเดีย")}</option>
            <option value="agent">Agent Studio</option>
          </select>
          <button
            className="v3-send"
            aria-label={t("Start conversation", "เริ่มบทสนทนา")}
            disabled={!draft.trim() || busy}
            onClick={() => void start()}
          >
            <ArrowUp size={21} />
          </button>
        </div>
      </section>
      <div className="v3-stat-grid">
        {stats.map(([label, value, Icon], i) => (
          <a
            href={"#/" + ["library", "projects", "research", "agents"][i]}
            key={label}
          >
            <div>
              <span>{label}</span>
              <strong>{value.toLocaleString(s.locale)}</strong>
              <small>
                {t("From your saved work", "จากข้อมูลที่คุณบันทึก")}
              </small>
            </div>
            <Icon size={23} />
          </a>
        ))}
      </div>
      <section className="v3-section">
        <header className="v3-section-head">
          <div>
            <span className="eyebrow">// PICK A POSSIBILITY</span>
            <h2>
              {t("Your next", "เริ่มสิ่งใหม่")}{" "}
              <em>{t("great idea.", "ในแบบคุณ")}</em>
            </h2>
          </div>
          <button
            className="v3-text-link"
            aria-pressed={arranging}
            onClick={() => setArranging(!arranging)}
          >
            <SlidersHorizontal size={16} />
            {arranging
              ? t("Done arranging", "จัดเรียงเสร็จ")
              : t("Arrange your studio", "จัดเรียงสตูดิโอ")}
          </button>
        </header>
        <div className="v3-portal-grid">
          {order.map((id, i) => {
            const p = portals.find((p) => p.id === id)!;
            return (
              <article className={"v3-portal " + p.style} key={p.id}>
                {arranging && (
                  <div className="v3-reorder">
                    <Button
                      title={
                        t("Move earlier: ", "เลื่อนขึ้น: ") + p.title[locale]
                      }
                      disabled={i === 0}
                      onClick={() => reorder(i, -1)}
                    >
                      <MoveUp size={16} />
                    </Button>
                    <Button
                      title={t("Move later: ", "เลื่อนลง: ") + p.title[locale]}
                      disabled={i === order.length - 1}
                      onClick={() => reorder(i, 1)}
                    >
                      <MoveDown size={16} />
                    </Button>
                  </div>
                )}
                <a href={"#/" + p.id}>
                  <div className="v3-portal-top">
                    <span>{p.label}</span>
                    <p.icon size={19} />
                  </div>
                  <div aria-hidden="true">
                    <PortalArt type={p.style} />
                  </div>
                  <div className="v3-portal-bottom">
                    <div>
                      <h3>{p.title[locale]}</h3>
                      <p>{p.description[locale]}</p>
                    </div>
                    <span>
                      <ArrowUpRight size={19} />
                    </span>
                  </div>
                </a>
              </article>
            );
          })}
        </div>
        {arranging && (
          <div className="v3-arrange-help">
            <span>
              {t(
                "Your arrangement is saved in this browser.",
                "การจัดเรียงบันทึกไว้ในเบราว์เซอร์นี้",
              )}
            </span>
            <Button
              onClick={() => {
                const next = portals.map((p) => p.id);
                setOrder(next);
                localStorage.setItem("av-home-layout-v3", JSON.stringify(next));
              }}
            >
              <RotateCcw size={15} />
              {t("Reset arrangement", "คืนค่าการจัดเรียง")}
            </Button>
          </div>
        )}
      </section>
      <section className="v3-copilot-banner">
        <div>
          <span className="eyebrow">// NEXT GEN INTERVIEW WORKSPACE</span>
          <h2>
            Speak <em>smarter.</em>
          </h2>
          <p>
            {t(
              "Bring your evidence. Find your words. Practice with purpose.",
              "นำประสบการณ์จริงมาเรียบเรียงคำตอบ แล้วฝึกอย่างมีเป้าหมาย",
            )}
          </p>
          <a href="#/copilot">
            {t("Open Interview Copilot", "เปิด Interview Copilot")}
            <ArrowUpRight size={18} />
          </a>
        </div>
        <div className="v3-banner-steps">
          <span>
            <i>01</i>
            {t("Your question", "คำถามของคุณ")}
          </span>
          <span>
            <i>02</i>
            {t("Your evidence", "ประสบการณ์จริง")}
          </span>
          <span>
            <i>03</i>
            {t("Your answer", "คำตอบในแบบคุณ")}
          </span>
          <Mic size={45} />
        </div>
      </section>
      <section className="v3-section">
        <header className="v3-section-head">
          <div>
            <span className="eyebrow">// STILL IN YOUR ORBIT</span>
            <h2>
              {t("Pick up", "กลับมาทำ")}{" "}
              <em>{t("where you left off.", "งานของคุณต่อ")}</em>
            </h2>
          </div>
          <a href="#/library" className="v3-text-link">
            {t("View all work", "ดูงานทั้งหมด")}
            <ArrowUpRight size={17} />
          </a>
        </header>
        {recent.length ? (
          <div className="v3-recent-grid">
            {recent.map((i, n) => (
              <a key={i.id} href={"#/" + routeForItem(i) + "/" + i.id}>
                <div className={"v3-recent-cover cover-" + n}>
                  {i.kind === "document" ? (
                    <PenTool size={36} />
                  ) : i.kind === "code" ? (
                    <Code2 size={36} />
                  ) : i.kind === "composition" ? (
                    <AudioLines size={36} />
                  ) : (
                    <Folder size={36} />
                  )}
                  <span>{i.kind}</span>
                </div>
                <div className="v3-recent-info">
                  <div>
                    <h3>{i.title}</h3>
                    <small>
                      {new Date(i.updatedAt).toLocaleDateString(s.locale, {
                        month: "short",
                        day: "numeric",
                      })}{" "}
                      · {t("Revision", "รุ่นที่")} {i.revision}
                    </small>
                  </div>
                  <ArrowUpRight size={18} />
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="v3-recent-empty">
            <Folder size={32} />
            <div>
              <h3>
                {t(
                  "Your next creation belongs here.",
                  "พื้นที่นี้รอผลงานชิ้นแรกของคุณ",
                )}
              </h3>
              <p>
                {t(
                  "Save a canvas, a note, or a sound. Find it here next time.",
                  "บันทึกงานออกแบบ โน้ต หรือเสียง แล้วกลับมาทำต่อได้ที่นี่",
                )}
              </p>
            </div>
            <Button onClick={() => go("templates")}>
              {t("Explore templates", "สำรวจเทมเพลต")}
              <ArrowRight size={16} />
            </Button>
          </div>
        )}
      </section>
      <div className="v3-honesty">
        <ShieldCheck size={17} />
        <span>
          {t(
            "Real tools. Your saved work. Transparent connection status.",
            "เครื่องมือจริง งานที่คุณบันทึก และสถานะการเชื่อมต่อที่ตรวจสอบได้",
          )}
        </span>
        <a href="#/system">
          {t("System status", "สถานะระบบ")}
          <ArrowUpRight size={15} />
        </a>
      </div>
      {tour && (
        <Modal
          title={t(
            "One artist. A connected process.",
            "หนึ่งคนสร้างสรรค์ ทุกเครื่องมือเชื่อมกัน",
          )}
          onClose={() => setTour(false)}
        >
          <div className="v3-tour">
            {[
              ["THINK", "Capture an idea.", "บันทึกและจัดโครงสร้างไอเดีย"],
              [
                "CREATE",
                "Give it a shape.",
                "สร้างภาพ โค้ด เสียง หรือฉากเคลื่อนไหว",
              ],
              ["ANALYZE", "Look at the evidence.", "ตรวจข้อมูลและผลลัพธ์จริง"],
              [
                "HYPER-POLISH",
                "Make every detail count.",
                "เก็บรายละเอียดให้ชัดเจนและใช้งานได้",
              ],
              [
                "DRIVE",
                "Connect, save, and present.",
                "ต่อ workflow บันทึก และนำเสนอ",
              ],
            ].map(([a, b, c], i) => (
              <div key={a}>
                <span>0{i + 1}</span>
                <div>
                  <strong>{a}</strong>
                  <p>{s.locale === "th" ? c : b}</p>
                </div>
              </div>
            ))}
            <Button
              variant="primary"
              onClick={() => {
                setTour(false);
                go("projects");
              }}
            >
              {t("Create your first project", "เริ่มโปรเจกต์แรก")}
              <ArrowRight size={16} />
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
