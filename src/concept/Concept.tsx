import { motion } from "motion/react";
import {
  PreviewMotionProvider,
  usePreviewMotion,
} from "../components/kit/motion";
import { lazy, Suspense } from "react";
import { rovingTabs } from "../v3/a11y";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import {
  Home,
  Mic,
  MessageSquare,
  LayoutTemplate,
  BookOpen,
  ShoppingBag,
  Folder,
  Image,
  BarChart3,
  Users,
  Settings,
  Search,
  Bell,
  Plus,
  ArrowUpRight,
  ArrowRight,
  Play,
  ChevronDown,
  ChevronRight,
  Copy,
  Volume2,
  Check,
  ShieldCheck,
  Sparkles,
  Command,
  PanelLeft,
  Braces,
  Monitor,
  Smartphone,
  MousePointer2,
  Download,
  RotateCcw,
  FileCode2,
  Layers,
  Radio,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  X,
  Menu,
} from "lucide-react";
import { Arcyca } from "../v3/Mascot";
import { Modal } from "../components/UI";
import { download, useStore } from "../core/store";
import { buildPreview, exportCode, starterCode } from "../v2/sandbox";
import type { CodeDocument } from "../../shared/v2/contracts";
import {
  conceptPalette,
  conceptEvidence,
  conceptMotion,
} from "../../shared/concept";
import "./concept.css";
import "./studio-kit.css";
const FramerStudioBuilder = lazy(() =>
  import("./FramerStudioComponents").then((m) => ({
    default: m.FramerStudioBuilder,
  })),
);
type Screen = "home" | "copilot" | "studio" | "builder";
const vars = Object.fromEntries(
  Object.entries(conceptPalette).map(([key, value]) => ["--cp-" + key, value]),
) as CSSProperties;
function Tag({ children, kind = "" }: { children: ReactNode; kind?: string }) {
  return <span className={"cp-tag " + kind}>{children}</span>;
}
function Button({
  children,
  onClick,
  variant = "",
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
}) {
  const enabled = usePreviewMotion();
  return (
    <motion.button
      type="button"
      whileHover={enabled && !disabled ? { y: -1 } : undefined}
      whileTap={enabled && !disabled ? { scale: 0.98 } : undefined}
      transition={conceptMotion.spring}
      className={
        "cp-button " + (variant === "outline" ? "cp-outline" : variant)
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </motion.button>
  );
}
function Mark() {
  return (
    <svg viewBox="0 0 38 38" aria-hidden="true">
      <path d="M3 31 15 5h8l12 26H23l-3-8-4 8Z" fill="var(--cp-lime)" />
      <circle cx="32" cy="6" r="3" fill="var(--cp-pink)" />
      <path d="m17 15 3-7 3 7Z" fill="var(--cp-ink)" />
    </svg>
  );
}
const menu = [
  ["home", "Home", Home],
  ["copilot", "Interview Copilot", Mic],
  ["practice", "Practice", MessageSquare],
  ["chat", "AI Chat", Sparkles],
  ["templates", "Templates", LayoutTemplate],
  ["questions", "Question Bank", BookOpen],
  ["marketplace", "Marketplace", ShoppingBag],
  ["projects", "Projects", Folder],
  ["library", "Assets", Image],
  ["analytics", "Analytics", BarChart3],
] as const;
function ConceptFrame({ screen: raw }: { screen?: string }) {
  const screen: Screen =
      raw === "copilot" || raw === "studio" || raw === "builder" ? raw : "home",
    s = useStore(),
    [drawer, setDrawer] = useState(false),
    [info, setInfo] = useState(""),
    [search, setSearch] = useState(""),
    [searchOpen, setSearchOpen] = useState(false);
  useEffect(() => {
    setDrawer(false);
    document.title = "ARTYVERSE X · Prompt Pack Preview";
  }, [screen]);
  useEffect(() => {
    const shortcut = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (document.querySelector("dialog[open]")) return;
        setDrawer(false);
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", shortcut);
    return () => document.removeEventListener("keydown", shortcut);
  }, []);
  const nav = (
    <>
      <a
        className="cp-brand"
        aria-label="ARTYVERSE X preview home"
        href="#/concept/home"
      >
        <Mark />
        <span>
          ARTYVERSE<span className="cp-brand-x">X</span>
          <small>YOUR NEXT POSSIBILITY.</small>
        </span>
      </a>
      <div className="cp-workspace">
        <span className="cp-avatar">A</span>
        <div>
          Personal workspace<small>Design concept / ตัวอย่าง</small>
        </div>
      </div>
      <span className="cp-nav-label">WORKSPACE</span>
      <nav aria-label="Concept workspaces">
        {menu.map(([route, label, Icon]) => (
          <a
            key={route}
            aria-label={label}
            href={
              route === "home" || route === "copilot"
                ? "#/concept/" + route
                : route === "projects"
                  ? "#/concept/studio"
                  : "#/" + route
            }
            className={
              screen === route ||
              ((screen === "studio" || screen === "builder") &&
                route === "projects")
                ? "active"
                : ""
            }
            aria-current={
              screen === route ||
              ((screen === "studio" || screen === "builder") &&
                route === "projects")
                ? "page"
                : undefined
            }
          >
            <Icon size={18} />
            <span>{label}</span>
            {route === "copilot" && <b>NEW</b>}
          </a>
        ))}
      </nav>
      <div className="cp-side-bottom">
        <div className="cp-plan">
          <Sparkles size={18} />
          <strong>Make room for more.</strong>
          <p>ตัวอย่างหน้าจอ ไม่มีแผนชำระเงินหรือเครดิตจำลอง</p>
          <a href="#/settings">
            ดูสถานะบริการจริง <ArrowUpRight size={15} />
          </a>
        </div>
        <a href="#/settings">
          <Settings size={17} />
          Settings
        </a>
        <a href="#/home">
          <ArrowLeft size={17} />
          กลับ workspace จริง
        </a>
      </div>
    </>
  );
  return (
    <div
      className={
        "cp-root " +
        (screen === "studio" || screen === "builder" ? "cp-studio-theme" : "")
      }
      style={
        screen === "studio" || screen === "builder"
          ? ({
              ...vars,
              "--cp-paper": conceptPalette.night,
              "--cp-surface": conceptPalette.panel,
              "--cp-soft": conceptPalette.raised,
              "--cp-line": conceptPalette.nightLine,
              "--cp-ink": conceptPalette.nightText,
              "--cp-muted": conceptPalette.nightMuted,
              "--cp-pinkText": conceptPalette.pink,
            } as CSSProperties)
          : vars
      }
    >
      <div className="cp-preview-bar">
        <span>
          <i />
          DESIGN PREVIEW{" "}
          <span className="cp-preview-copy">
            / ข้อมูลตัวอย่าง · ไม่ใช่ AI inference
          </span>
        </span>
        <nav aria-label="Preview screens">
          {[
            ["home", "Home"],
            ["copilot", "Copilot"],
            ["studio", "Studio"],
            ["builder", "Builder"],
          ].map(([key, label]) => (
            <a
              key={key}
              href={"#/concept/" + key}
              aria-current={screen === key ? "page" : undefined}
            >
              {label}
            </a>
          ))}
        </nav>
        <a
          href="#/home"
          className="cp-preview-exit"
          aria-label="Exit concept preview"
        >
          <X size={17} />
        </a>
      </div>
      <a className="sr-only" href="#concept-main">
        Skip to content
      </a>
      <aside className="cp-sidebar">{nav}</aside>
      <div className="cp-body">
        <header className="cp-topbar">
          <button
            className="cp-mobile-menu"
            aria-label="Open preview navigation"
            onClick={() => setDrawer(true)}
          >
            <Menu size={22} />
          </button>
          <div className="cp-breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              {screen === "home"
                ? "Overview"
                : screen === "copilot"
                  ? "Live Conversation"
                  : screen === "builder"
                    ? "Storefront Builder"
                    : "Creative Studio"}
            </strong>
          </div>
          <button
            className="cp-search"
            aria-label="Search workspaces"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={17} />
            <span>ค้นหาพื้นที่ทำงาน</span>
            <kbd>⌘ K</kbd>
          </button>
          <div className="cp-top-actions">
            <button
              aria-label="Preview notifications"
              onClick={() =>
                setInfo(
                  "นี่คือ preview ไม่มีการแจ้งเตือนหรือกิจกรรมผู้ใช้งานจำลอง",
                )
              }
            >
              <Bell size={19} />
            </button>
            <a
              className="cp-avatar"
              href="#/settings"
              aria-label="Open actual settings"
            >
              A
            </a>
            <a className="cp-new" href="#/projects">
              <Plus size={17} />
              <span>สร้างใหม่</span>
            </a>
          </div>
        </header>
        <main id="concept-main" tabIndex={-1}>
          {screen === "home" ? (
            <HomeConcept />
          ) : screen === "copilot" ? (
            <CopilotConcept onInfo={setInfo} />
          ) : screen === "studio" ? (
            <StudioConcept onInfo={setInfo} />
          ) : (
            <Suspense
              fallback={<div className="v3-loading">Opening Builder…</div>}
            >
              <FramerStudioBuilder onInfo={setInfo} />
            </Suspense>
          )}
        </main>
        <footer className="cp-footer">
          <span>
            ARTYVERSE X <i /> Creative power. Disciplined clarity.
          </span>
          <a href="#/design-system">
            Explore the real Design System <ArrowUpRight size={13} />
          </a>
        </footer>
      </div>
      <nav className="cp-bottom-nav" aria-label="Mobile concept navigation">
        <a
          href="#/concept/home"
          aria-current={screen === "home" ? "page" : undefined}
        >
          <Home size={19} />
          <span>Home</span>
        </a>
        <a
          href="#/concept/copilot"
          aria-current={screen === "copilot" ? "page" : undefined}
        >
          <Mic size={19} />
          <span>Copilot</span>
        </a>
        <a
          href="#/concept/studio"
          aria-current={screen === "studio" ? "page" : undefined}
        >
          <Braces size={19} />
          <span>Studio</span>
        </a>
        <a
          href="#/concept/builder"
          aria-current={screen === "builder" ? "page" : undefined}
        >
          <ShoppingBag size={19} />
          <span>Builder</span>
        </a>
        <button onClick={() => setDrawer(true)}>
          <Menu size={19} />
          <span>Menu</span>
        </button>
      </nav>
      {drawer && (
        <Modal title="Preview navigation" onClose={() => setDrawer(false)}>
          <div className="cp-drawer">{nav}</div>
        </Modal>
      )}
      {searchOpen && (
        <Modal
          title="ค้นหาพื้นที่ทำงานจริง"
          onClose={() => setSearchOpen(false)}
        >
          <label>
            ชื่อพื้นที่ทำงาน
            <input
              autoFocus
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
          <div className="cp-search-results">
            {menu
              .filter(([, label]) =>
                label.toLowerCase().includes(search.toLowerCase()),
              )
              .map(([route, label, Icon]) => (
                <a href={"#/" + route} key={route}>
                  <Icon size={18} />
                  {label}
                  <ArrowUpRight size={15} />
                </a>
              ))}
          </div>
          {!menu.some(([, label]) =>
            label.toLowerCase().includes(search.toLowerCase()),
          ) && <p>ไม่พบพื้นที่ทำงาน ลองใช้คำอื่น</p>}
        </Modal>
      )}
      {info && (
        <div className="cp-toast" role="status">
          <CheckCircle2 size={18} />
          <span>{info}</span>
          <button
            onClick={() => setInfo("")}
            aria-label="Dismiss preview message"
          >
            <X size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
function PortalArt({ type }: { type: number }) {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 260 135" aria-hidden="true">
      <defs>
        <linearGradient id={id} x2="1" y2="1">
          <stop stopColor="var(--cp-violet)" />
          <stop offset="1" stopColor="var(--cp-cyan)" />
        </linearGradient>
      </defs>
      {type === 0 ? (
        <>
          <rect
            x="36"
            y="18"
            width="185"
            height="104"
            rx="10"
            fill="var(--cp-soft)"
            stroke="var(--cp-line)"
          />
          <rect
            x="48"
            y="30"
            width="80"
            height="80"
            rx="5"
            fill="var(--cp-lime)"
          />
          <path d="m48 110 43-57 37 57" fill="var(--cp-ink)" />
          <path
            d="M141 45h61M141 59h48M141 74h55"
            stroke="var(--cp-muted)"
            strokeWidth="5"
          />
          <circle cx="199" cy="104" r="18" fill="var(--cp-pink)" />
        </>
      ) : type === 1 ? (
        <>
          <rect
            x="26"
            y="24"
            width="178"
            height="96"
            rx="10"
            fill="var(--cp-ink)"
          />
          <path
            d="M42 53h91M42 67h55M42 81h112"
            stroke="var(--cp-cyan)"
            strokeWidth="5"
          />
          <rect
            x="132"
            y="8"
            width="97"
            height="78"
            rx="9"
            fill={`url(#${id})`}
          />
          <path
            d="m161 34-9 9 9 9m36-18 9 9-9 9m-19-25-7 31"
            fill="none"
            stroke="var(--cp-surface)"
            strokeWidth="3"
          />
        </>
      ) : type === 2 ? (
        <>
          <ellipse cx="132" cy="72" rx="78" ry="44" fill="var(--cp-soft)" />
          <circle cx="115" cy="67" r="38" fill="var(--cp-violet)" />
          <path d="M154 37 191 97h-74Z" fill="var(--cp-lime)" />
          <circle cx="84" cy="96" r="19" fill="var(--cp-pink)" />
        </>
      ) : (
        <>
          <rect
            x="53"
            y="27"
            width="66"
            height="80"
            rx="8"
            transform="rotate(-13 85 67)"
            fill="var(--cp-violet)"
          />
          <rect
            x="126"
            y="20"
            width="66"
            height="90"
            rx="8"
            transform="rotate(11 155 67)"
            fill="var(--cp-lime)"
          />
          <path
            d="m139 58 8 9 20-21"
            fill="none"
            stroke="var(--cp-ink)"
            strokeWidth="5"
          />
          <circle cx="210" cy="94" r="12" fill="var(--cp-pink)" />
        </>
      )}
    </svg>
  );
}
function HomeConcept() {
  return (
    <div className="cp-dashboard">
      <div className="cp-page-intro">
        <div>
          <span className="cp-kicker">YOUR CREATIVE OPERATING SYSTEM</span>
          <h1>
            พื้นที่สำหรับทุก
            <strong className="ax-editorial-underline">ความเป็นไปได้</strong>
            <span aria-hidden="true">
              <Sparkles size={22} />
            </span>
          </h1>
        </div>
        <Tag>CONCEPT 01 / LIGHT</Tag>
      </div>
      <div className="cp-home-hero">
        <section className="cp-hero-copy">
          <span className="cp-kicker">
            <i /> NEXT GEN INTERVIEW COPILOT
          </span>
          <h2>
            <strong className="cp-bold-word">Speak</strong>
            <br />
            <em>Smarter.</em>
          </h2>
          <p>
            ทุกคำตอบ เริ่มจากตัวตนของคุณ
            <br />
            คิดชัด พูดอย่างมั่นใจ พร้อมไปได้ไกลกว่าเดิม
          </p>
          <div className="cp-hero-actions">
            <a className="cp-button lime" href="#/concept/copilot">
              ลองหน้าจอ Copilot <ArrowUpRight size={17} />
            </a>
            <a className="cp-button cp-outline" href="#/concept/copilot">
              <Play size={15} />
              ดูตัวอย่างการทำงาน
            </a>
          </div>
          <div className="cp-proof">
            <span>
              <ShieldCheck size={14} />
              Evidence-first
            </span>
            <span>
              <Check size={14} />
              Thai-first
            </span>
            <span>✳ Made for your next move</span>
          </div>
        </section>
        <div className="cp-hero-character">
          <div className="cp-orbit orbit-one" />
          <div className="cp-orbit orbit-two" />
          <div className="cp-mascot-halo" />
          <Arcyca label="ARCYCA skater concept" />
          <span className="cp-floating one">
            <Sparkles size={16} />
            AI Analysis
          </span>
          <span className="cp-floating two">
            <Radio size={16} />
            Real-time <small>concept</small>
          </span>
          <span className="cp-floating three">
            <Layers size={16} />
            Your Context
          </span>
          <span className="cp-floating four">
            <ArrowUpRight size={16} />
            Better Answer
          </span>
          <div className="cp-character-caption">
            ARCYCA / YOUR CREATIVE COMPANION
          </div>
        </div>
        <aside className="cp-key-features">
          <span className="cp-kicker">KEY FEATURES</span>
          {[
            ["01", "Live Conversation", "ฟัง เข้าใจ และจับประเด็น"],
            ["02", "Grounded Answer", "คำตอบที่มีหลักฐานรองรับ"],
            ["03", "Your Evidence", "เรื่องราวที่เป็นคุณจริง ๆ"],
            ["04", "Practice Mode", "ฝึกให้พร้อมก่อนวันจริง"],
          ].map(([no, title, desc]) => (
            <a href={no === "04" ? "#/practice" : "#/concept/copilot"} key={no}>
              <small>{no}</small>
              <div>
                <strong>{title}</strong>
                <span>{desc}</span>
              </div>
              <ArrowUpRight size={15} />
            </a>
          ))}
          <span className="cp-feature-foot">
            THINK → CREATE → ANALYZE → DRIVE
          </span>
        </aside>
      </div>
      <div className="cp-home-secondary">
        <a className="cp-promo cp-promo-lime" href="#/concept/builder">
          <span>IDEA → SOMETHING REAL</span>
          <h3>
            Turn your next
            <br />
            “what if” into <em>what’s next.</em>
          </h3>
          <div>
            สร้าง ทดลอง และปรับแต่งใน Creative Studio
            <ArrowUpRight size={22} />
          </div>
          <span className="cp-promo-star" aria-hidden="true">
            ✳
          </span>
        </a>
        <div className="cp-stats">
          <div className="cp-section-top">
            <span className="cp-kicker">YOUR PROGRESS, AT A GLANCE</span>
            <Tag>ข้อมูลตัวอย่าง</Tag>
          </div>
          {[
            ["12", "Practice sessions", "ครั้งที่คุณกล้าลอง"],
            ["24", "Saved stories", "เรื่องราวที่เตรียมไว้"],
            ["08", "Creative projects", "ไอเดียที่ได้ลงมือทำ"],
          ].map(([value, title, sub]) => (
            <article key={title}>
              <strong>
                {value}
                <span>
                  <ArrowUpRight size={17} />
                </span>
              </strong>
              <div>
                {title}
                <small>{sub}</small>
              </div>
            </article>
          ))}
        </div>
      </div>
      <section className="cp-tools">
        <div className="cp-section-top">
          <div>
            <span className="cp-kicker">
              ONE WORKSPACE. MANY POSSIBILITIES.
            </span>
            <h2>คิดให้ไกล แล้วลงมือสร้าง.</h2>
          </div>
          <a href="#/explore">
            สำรวจเครื่องมือทั้งหมด <ArrowUpRight size={16} />
          </a>
        </div>
        <div className="cp-tool-grid">
          {[
            [
              "AI Website Builder",
              "จากไอเดียสู่เว็บไซต์ที่แก้ไขได้",
              "#/concept/builder",
            ],
            ["Templates", "เริ่มต้นด้วยโครงสร้างที่ดี", "#/templates"],
            ["Marketplace", "วัตถุดิบสำหรับงานชิ้นต่อไป", "#/marketplace"],
            ["Your projects", "กลับไปต่อยอดงานที่บันทึกไว้", "#/projects"],
          ].map(([title, desc, href], i) => (
            <a href={href} key={title}>
              <PortalArt type={i} />
              <div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <ArrowUpRight size={18} />
              </div>
            </a>
          ))}
        </div>
      </section>
      <section className="cp-project-strip">
        <span className="cp-kicker">START SOMETHING OF YOUR OWN</span>
        <h2>Your next great thing starts here.</h2>
        <p>
          ภาพทั้งหมดคือแนวคิดหน้าจอ ไม่ได้สร้างประวัติงานตัวอย่างลงในบัญชีของคุณ
        </p>
        <a className="cp-button" href="#/projects">
          <Plus size={17} />
          เปิด Projects จริง
        </a>
      </section>
    </div>
  );
}
const sampleQuestion =
  "เล่าให้ฟังหน่อยว่าคุณออกแบบโครงสร้างโปรเจกต์ React อย่างไร?";
const answers: Record<string, string> = {
  "Full Answer":
    "ฉันแยกส่วนแสดงผลออกจากข้อมูล เพื่อให้ปรับหน้าจอและพัฒนาตรรกะของระบบต่อได้เป็นส่วน ๆ โดยใช้ React และ TypeScript ในโปรเจกต์จัดการงานสร้างสรรค์ [1]\n\nฉันตรวจเส้นทางสำคัญตั้งแต่สร้างงาน แก้ไข บันทึก จนถึงเปิดงานซ้ำ เพื่อยืนยันว่าการทำงานต่อเนื่องและข้อมูลไม่หาย [1]\n\nผลลัพธ์เชิงตัวเลข: [ใส่ข้อมูลจริง]",
  "Key Points":
    "01  แยก UI ออกจากข้อมูล [1]\n02  ใช้ React และ TypeScript [1]\n03  ตรวจเส้นทางสร้าง → แก้ไข → บันทึก → เปิดซ้ำ [1]\n04  ตัวเลขผลลัพธ์: [ใส่ข้อมูลจริง]",
  STAR: "S — พัฒนาเว็บแอปจัดการงานสร้างสรรค์ [1]\nT — [ใส่ข้อมูลจริง: เป้าหมายและบทบาท]\nA — แยก UI ออกจากข้อมูล ใช้ React/TypeScript และทดสอบเส้นทางสำคัญ [1]\nR — [ใส่ข้อมูลจริง: ผลลัพธ์ที่ตรวจสอบได้]",
  Short:
    "ฉันใช้ React และ TypeScript โดยแยก UI ออกจากข้อมูล และทดสอบเส้นทางสร้าง แก้ไข บันทึก และเปิดงานซ้ำ [1]",
};
function CopilotConcept({ onInfo }: { onInfo: (s: string) => void }) {
  const [format, setFormat] = useState("Full Answer"),
    [tone, setTone] = useState("Professional"),
    [turns, setTurns] = useState([
      { speaker: "Interviewer", text: sampleQuestion },
      { speaker: "You", text: "ขออธิบายจากตัวอย่างโปรเจกต์ที่ฉันทำจริงนะคะ" },
    ]),
    [text, setText] = useState(""),
    [speaker, setSpeaker] = useState("You"),
    [showEvidence, setEvidence] = useState(false),
    [speaking, setSpeaking] = useState(false);
  useEffect(
    () => () => {
      if ("speechSynthesis" in window) speechSynthesis.cancel();
    },
    [],
  );
  const answer =
    format === "Full Answer" && tone === "Concise"
      ? answers.Short
      : format === "Full Answer" && tone === "Executive"
        ? answers["Key Points"]
        : format === "Full Answer" && tone === "Friendly"
          ? "ขอเล่าจากโปรเจกต์ที่ฉันลงมือทำจริงนะคะ\n\n" + answers[format]
          : answers[format];
  function read() {
    if (!("speechSynthesis" in window)) {
      onInfo("เบราว์เซอร์นี้ไม่รองรับ Read Aloud");
      return;
    }
    speechSynthesis.cancel();
    if (speaking) {
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(answer);
    utterance.lang = "th-TH";
    utterance.onend = utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  }
  return (
    <div className="cp-copilot">
      <div className="cp-page-intro">
        <div>
          <span className="cp-kicker">
            YOUR VOICE. YOUR STORY. YOUR NEXT CHAPTER.
          </span>
          <h1>
            Live conversation
            <span aria-hidden="true">
              <Sparkles size={22} />
            </span>
          </h1>
          <p>มองภาพรวมของบทสนทนา พร้อมเรียบเรียงคำตอบจากหลักฐานของคุณ</p>
        </div>
        <Tag>ตัวอย่างเตรียมไว้ · MIC OFF</Tag>
      </div>
      <div
        className="cp-pipeline"
        role="region"
        tabIndex={0}
        aria-label="Pipeline stages — preview only"
      >
        {[
          "Voice Input",
          "Speech to Text",
          "Question Detection",
          "Context Matching",
          "Answer Generation",
          "Presentation",
        ].map((label, i) => (
          <div key={label}>
            <span>{String(i + 1).padStart(2, "0")}</span>
            {label}
            {i < 5 && <ChevronRight size={14} />}
          </div>
        ))}
      </div>
      <div className="cp-live-grid">
        <section className="cp-transcript cp-panel">
          <div className="cp-panel-title">
            <span>
              <Radio size={18} />
              Live Conversation
            </span>
            <Tag>ตัวอย่าง</Tag>
          </div>
          <div className="cp-wave-section">
            <div
              className="cp-wave"
              role="img"
              aria-label="Decorative waveform from sample data"
            >
              {Array.from({ length: 47 }, (_, i) => (
                <i key={i} style={{ height: 8 + ((i * 17 + 13) % 42) }} />
              ))}
            </div>
            <div>
              <span>
                <i />
                SAMPLE TRANSCRIPT
              </span>
              <strong>00:00</strong>
            </div>
            <small>ไมโครโฟนปิด · ไม่มีการบันทึกหรือถอดเสียงอยู่</small>
          </div>
          <div className="cp-transcript-head">
            TRANSCRIPT <span>TH / EN</span>
          </div>
          <div className="cp-turns">
            {turns.map((turn, i) => (
              <article key={i}>
                <span
                  className={
                    "cp-speaker " + (turn.speaker === "You" ? "you" : "")
                  }
                >
                  {turn.speaker === "You" ? "Y" : "I"}
                </span>
                <div>
                  <header>
                    <strong>{turn.speaker}</strong>
                    <small>ตัวอย่าง {String(i + 1).padStart(2, "0")}</small>
                  </header>
                  <p>{turn.text}</p>
                </div>
              </article>
            ))}
          </div>
          <form
            className="cp-turn-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) {
                setTurns([...turns, { speaker, text: text.trim() }]);
                setText("");
              }
            }}
          >
            <label htmlFor="cp-turn">ทดลองเพิ่มข้อความด้วยตัวเอง</label>
            <textarea
              id="cp-turn"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="พิมพ์ข้อความที่ต้องการทดลอง…"
            />
            <div>
              <select
                aria-label="Sample speaker"
                value={speaker}
                onChange={(e) => setSpeaker(e.target.value)}
              >
                <option>You</option>
                <option>Interviewer</option>
              </select>
              <button
                className="cp-button"
                type="submit"
                disabled={!text.trim()}
              >
                เพิ่มข้อความ <Plus size={16} />
              </button>
            </div>
          </form>
          <div className="cp-mic-dock">
            <span>
              TH <ChevronDown size={12} />
            </span>
            <a
              href="#/copilot"
              className="cp-mic"
              aria-label="Open actual microphone workspace"
            >
              <Mic size={25} />
            </a>
            <span>
              เปิด Copilot จริง <ArrowUpRight size={14} />
            </span>
          </div>
        </section>
        <div className="cp-context-column">
          <section className="cp-question cp-panel">
            <div className="cp-panel-title">
              <span>Detected question</span>
              <span className="cp-index">01 / CONTEXT</span>
            </div>
            <div className="cp-question-mark">“</div>
            <h2>{sampleQuestion}</h2>
            <div className="cp-tags">
              <Tag>React</Tag>
              <Tag>Architecture</Tag>
              <Tag>Project story</Tag>
            </div>
            <p className="cp-caption">
              คำถามตัวอย่างที่เตรียมไว้ ไม่ใช่ผลการตรวจจับจากเสียง
            </p>
          </section>
          <section className="cp-evidence cp-panel">
            <div className="cp-panel-title">
              <span>
                <BookOpen size={17} />
                Your Evidence
              </span>
              <Tag>1 source</Tag>
            </div>
            <div className="cp-evidence-document">
              <span className="cp-document-icon">
                <FileCode2 size={22} />
              </span>
              <div>
                <strong>Creative workspace</strong>
                <small>{conceptEvidence.label}</small>
              </div>
              <CheckCircle2 size={16} />
            </div>
            <p>React · TypeScript · User workflows</p>
            <Button
              variant="outline"
              onClick={() => setEvidence(!showEvidence)}
            >
              {showEvidence ? "ซ่อนหลักฐาน" : "อ่านหลักฐานตัวอย่าง"}
              <ChevronDown size={15} />
            </Button>
            {showEvidence && <blockquote>{conceptEvidence.body}</blockquote>}
          </section>
          <div className="cp-context-note">
            <ShieldCheck size={22} />
            <p>
              <strong>Say what’s true.</strong>ข้อมูลที่ไม่มีในหลักฐานจะแสดงเป็น
              [ใส่ข้อมูลจริง] ไม่สร้างตัวเลขหรือประวัติขึ้นเอง
            </p>
          </div>
        </div>
        <section className="cp-answer cp-panel">
          <div className="cp-panel-title">
            <span>
              <Sparkles size={18} />
              Suggested Answer
            </span>
            <Tag>ตัวอย่างเตรียมไว้</Tag>
          </div>
          <div className="cp-answer-controls">
            <label>
              Tone
              <select
                aria-label="Tone"
                value={tone}
                onChange={(e) => setTone(e.target.value)}
              >
                <option>Professional</option>
                <option>Friendly</option>
                <option>Concise</option>
                <option>Executive</option>
              </select>
            </label>
            <small>โทนของตัวอย่างที่เตรียมไว้</small>
          </div>
          <div
            className="cp-format-tabs"
            role="tablist"
            aria-label="Sample answer format"
            onKeyDown={rovingTabs}
          >
            {Object.keys(answers).map((f) => (
              <button
                key={f}
                role="tab"
                aria-selected={format === f}
                tabIndex={format === f ? 0 : -1}
                aria-controls="cp-answer-content"
                id={"cp-format-" + f.replaceAll(" ", "-")}
                onClick={() => setFormat(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div
            className="cp-answer-content"
            id="cp-answer-content"
            role="tabpanel"
            aria-labelledby={"cp-format-" + format.replaceAll(" ", "-")}
          >
            <span className="cp-kicker">A CLEARER WAY TO TELL YOUR STORY</span>
            <h2>
              {tone === "Friendly"
                ? "เริ่มจากเรื่องที่เป็นคุณ."
                : "คำตอบที่ดี เริ่มจากของจริง."}
            </h2>
            {answer.split("\n\n").map((p, i) => (
              <div className="cp-answer-paragraph" key={i}>
                <span>{String(i + 1).padStart(2, "0")}</span>
                <p>
                  {p
                    .split(/(React|TypeScript)/g)
                    .map((part, j) =>
                      part === "React" || part === "TypeScript" ? (
                        <mark key={j}>{part}</mark>
                      ) : (
                        part
                      ),
                    )}
                </p>
              </div>
            ))}
            <div className="cp-needs-check">
              <ShieldCheck size={17} />
              <span>ตรวจและเติมข้อมูลจริงก่อนนำไปใช้</span>
            </div>
          </div>
          <footer className="cp-answer-actions">
            <Button onClick={read}>
              <Volume2 size={16} />
              {speaking ? "หยุดอ่าน" : "Read aloud"}
            </Button>
            <Button
              onClick={() => {
                if (!navigator.clipboard) {
                  onInfo(
                    "เบราว์เซอร์นี้ไม่อนุญาต clipboard โปรดเลือกข้อความแล้วคัดลอกด้วยตนเอง",
                  );
                  return;
                }
                void navigator.clipboard
                  .writeText(answer)
                  .then(() => onInfo("คัดลอกข้อความตัวอย่างแล้ว"))
                  .catch(() =>
                    onInfo(
                      "คัดลอกไม่สำเร็จ โปรดเลือกข้อความแล้วคัดลอกด้วยตนเอง",
                    ),
                  );
              }}
            >
              <Copy size={16} />
              Copy
            </Button>
            <a href="#/copilot" aria-label="Open actual Copilot">
              <ArrowUpRight size={20} />
            </a>
          </footer>
          <div className="cp-answer-footnote">
            PREVIEW / STATIC ANSWER · NO AI INFERENCE
          </div>
        </section>
      </div>
    </div>
  );
}
function StudioConcept({ onInfo }: { onInfo: (s: string) => void }) {
  const s = useStore(),
    [code, setCode] = useState<CodeDocument>({
      ...starterCode,
      html: starterCode.html.replace("LIVE CODE", "CREATIVE STUDIO"),
    }),
    [tab, setTab] = useState<"html" | "css" | "js">("html"),
    [nonce, setNonce] = useState(() => crypto.randomUUID()),
    [src, setSrc] = useState(""),
    [mobile, setMobile] = useState(false),
    [logs, setLogs] = useState<string[]>([]),
    [busy, setBusy] = useState(false);
  const frame = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    const receive = (e: MessageEvent) => {
      if (
        e.source !== frame.current?.contentWindow ||
        e.origin !== "null" ||
        !e.data?.artyverse ||
        e.data.token !== nonce
      )
        return;
      if (["error", "log", "ready"].includes(e.data.type))
        setLogs((old) => [
          ...old.slice(-19),
          e.data.type === "ready"
            ? "Preview ready · isolated sandbox"
            : String(e.data.message || "").slice(0, 1000),
        ]);
    };
    window.addEventListener("message", receive);
    return () => window.removeEventListener("message", receive);
  }, [nonce]);
  async function open() {
    setBusy(true);
    try {
      const item = await s.create("code", "Concept studio exploration", code);
      location.hash = "/code/" + item.id;
    } catch (e) {
      onInfo(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="cp-studio">
      <div className="cp-studio-header">
        <div>
          <span className="cp-kicker">PROJECT / CONCEPT PLAYGROUND</span>
          <h1>
            Build something <em>extraordinary.</em>
          </h1>
          <p>พื้นที่ทดลองโค้ดจริง ในแนวคิด Cyber Studio</p>
        </div>
        <div>
          <a className="cp-button cp-outline" href="#/concept/home">
            <ArrowLeft size={16} />
            Overview
          </a>
          <Button variant="lime" disabled={busy} onClick={() => void open()}>
            <Folder size={16} />
            {busy ? "กำลังสร้าง…" : "เปิดต่อใน Studio จริง"}
          </Button>
        </div>
      </div>
      <div className="cp-studio-workbench">
        <aside className="cp-file-tree">
          <div className="cp-panel-title">
            <span>
              <Folder size={15} />
              EXPLORER
            </span>
          </div>
          <span className="cp-tree-root">
            <ChevronDown size={12} />
            concept-playground
          </span>
          {(["html", "css", "js"] as const).map((key) => (
            <button
              onClick={() => setTab(key)}
              className={tab === key ? "selected" : ""}
              key={key}
            >
              <FileCode2 size={15} />
              {key === "html"
                ? "index.html"
                : key === "css"
                  ? "styles.css"
                  : "script.js"}
            </button>
          ))}
          <div className="cp-file-note">
            <ShieldCheck size={19} />
            <p>
              รันโค้ดเมื่อกด Run เท่านั้น
              <br />
              sandbox="allow-scripts"
              <br />
              ไม่มีสิทธิ์อ่าน parent DOM
            </p>
          </div>
        </aside>
        <section className="cp-code-pane">
          <div
            className="cp-code-tabs"
            role="tablist"
            aria-label="Concept code files"
            onKeyDown={rovingTabs}
          >
            {(["html", "css", "js"] as const).map((k) => (
              <button
                key={k}
                role="tab"
                aria-selected={tab === k}
                tabIndex={tab === k ? 0 : -1}
                id={"cp-code-" + k}
                aria-controls="cp-code-source"
                onClick={() => setTab(k)}
              >
                <Braces size={14} />
                {k.toUpperCase()}
                {tab === k && <i />}
              </button>
            ))}
          </div>
          <div className="cp-code-crumb">
            concept-playground <ChevronRight size={12} />
            {tab === "html"
              ? "index.html"
              : tab === "css"
                ? "styles.css"
                : "script.js"}
          </div>
          <label className="sr-only" htmlFor="cp-code-source">
            Concept source {tab}
          </label>
          <textarea
            id="cp-code-source"
            value={code[tab]}
            onChange={(e) => setCode({ ...code, [tab]: e.target.value })}
            spellCheck={false}
          />
          <footer>
            <span>{code[tab].split("\n").length} lines</span>
            <span>UTF-8 · Editable sample</span>
          </footer>
        </section>
        <section className="cp-studio-preview">
          <header>
            <span>
              <Monitor size={16} />
              LIVE PREVIEW
            </span>
            <div>
              <button
                aria-label="Desktop preview"
                aria-pressed={!mobile}
                onClick={() => setMobile(false)}
              >
                <Monitor size={16} />
              </button>
              <button
                aria-label="Mobile preview"
                aria-pressed={mobile}
                onClick={() => setMobile(true)}
              >
                <Smartphone size={16} />
              </button>
              <Button
                variant="lime"
                onClick={() => {
                  const token = crypto.randomUUID();
                  setNonce(token);
                  setLogs(["Run requested by you"]);
                  setSrc(buildPreview(code, token));
                }}
              >
                <Play size={14} />
                Run
              </Button>
            </div>
          </header>
          <div className={"cp-frame-wrap " + (mobile ? "mobile" : "")}>
            {src ? (
              <iframe
                ref={frame}
                title="Concept isolated code preview"
                srcDoc={src}
                sandbox="allow-scripts"
              />
            ) : (
              <div className="cp-preview-standby">
                <div className="cp-standby-orbit">
                  <Command size={34} />
                </div>
                <span className="cp-kicker">YOUR CODE. YOUR CANVAS.</span>
                <h2>
                  A little code.
                  <br />
                  Infinite possibility.
                </h2>
                <p>
                  แก้ไข HTML, CSS หรือ JavaScript
                  <br />
                  แล้วกด Run เพื่อดูผลจริง
                </p>
                <span className="cp-standby-label">
                  PREVIEW PAUSED / NO CODE EXECUTED
                </span>
              </div>
            )}
          </div>
        </section>
        <aside className="cp-studio-inspector">
          <div className="cp-panel-title">
            <span>
              <Layers size={15} />
              INSPECTOR
            </span>
          </div>
          <span className="cp-kicker">PREVIEW SETTINGS</span>
          <label>
            Device
            <select
              value={mobile ? "mobile" : "desktop"}
              onChange={(e) => setMobile(e.target.value === "mobile")}
            >
              <option value="desktop">Desktop / fluid</option>
              <option value="mobile">Mobile / 360px</option>
            </select>
          </label>
          <div className="cp-sandbox-status">
            <ShieldCheck size={18} />
            <span>
              Opaque origin<small>Network blocked by CSP</small>
            </span>
          </div>
          <span className="cp-kicker">WORKSPACE ACTIONS</span>
          <Button
            onClick={() =>
              download(
                "artyverse-concept.html",
                exportCode(code, "ARTYVERSE Concept"),
                "text/html",
              )
            }
          >
            <Download size={15} />
            Export HTML
          </Button>
          <Button
            onClick={() => {
              setCode(structuredClone(starterCode));
              setSrc("");
              setLogs([]);
            }}
          >
            <RotateCcw size={15} />
            Reset sample
          </Button>
          <a className="cp-inspector-link" href="#/code">
            <MousePointer2 size={15} />
            ใช้ Visual Inspector ตัวจริง <ArrowUpRight size={14} />
          </a>
          <div className="cp-assistant-card">
            <Arcyca label="ARCYCA studio assistant" />
            <strong>Your creative co-pilot.</strong>
            <p>
              AI auto-fix และ multi-user collaboration ยังไม่เชื่อมใน preview
              นี้
            </p>
          </div>
        </aside>
      </div>
      <div className="cp-console">
        <header>
          <span>TERMINAL / ACTIVITY</span>
          <Tag>ACTUAL PREVIEW EVENTS</Tag>
        </header>
        {logs.length ? (
          logs.map((line, i) => (
            <p key={i}>
              <ChevronRight size={12} />
              {line}
            </p>
          ))
        ) : (
          <p>
            <span className="cp-console-dot" />
            พร้อมทดลอง · ยังไม่มีการ execute โค้ด
          </p>
        )}
      </div>
      <div className="cp-studio-status">
        <span>
          <ShieldCheck size={13} />
          Isolated sandbox
        </span>
        <span>LOCAL PREVIEW · NO CLOUD SESSION · NO AI INFERENCE</span>
        <span>ARTYVERSE X / STUDIO</span>
      </div>
    </div>
  );
}

export function Concept(props: { screen?: string }) {
  return (
    <PreviewMotionProvider>
      <ConceptFrame {...props} />
    </PreviewMotionProvider>
  );
}
