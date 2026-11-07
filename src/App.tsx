import { useEffect, useState, lazy, Suspense } from "react";
import { MotionConfig } from "motion/react";
import {
  Home,
  MessageSquare,
  Compass,
  LayoutTemplate,
  PenTool,
  BookOpen,
  Mic,
  Radio,
  Zap,
  Folder,
  Settings,
  SlidersHorizontal,
  Search,
  Menu,
  ArrowUpRight,
  Command,
  Plus,
  X,
} from "lucide-react";
import { useStore, useT } from "./core/store";
import { Button, Modal, SearchBox, Mascot } from "./components/UI";
import { HomePage, Discover, Library, SettingsPage } from "./pages/Workspace";
const Chat = lazy(() =>
  import("./pages/Workflows").then((m) => ({ default: m.Chat })),
);
const Research = lazy(() =>
  import("./pages/Workflows").then((m) => ({ default: m.Research })),
);
const Live = lazy(() =>
  import("./pages/Workflows").then((m) => ({ default: m.Live })),
);
const Automate = lazy(() =>
  import("./pages/Workflows").then((m) => ({ default: m.Automate })),
);
const Editor = lazy(() =>
  import("./pages/Editor").then((m) => ({ default: m.Editor })),
);
const Voice = lazy(() =>
  import("./pages/Voice").then((m) => ({ default: m.Voice })),
);
const DesignOS = lazy(() =>
  import("./pages/DesignOS").then((m) => ({ default: m.DesignOS })),
);
export const routes = [
  ["home", "Home", "หน้าหลัก", Home],
  ["chat", "Conversations", "บทสนทนา", MessageSquare],
  ["explore", "Explore", "สำรวจ", Compass],
  ["templates", "Templates", "เทมเพลต", LayoutTemplate],
  ["create", "Create", "สร้างสรรค์", PenTool],
  ["research", "Research", "ค้นคว้า", BookOpen],
  ["voice", "Voice studio", "สตูดิโอเสียง", Mic],
  ["live", "Live & present", "นำเสนอสด", Radio],
  ["automate", "Automate", "อัตโนมัติ", Zap],
  ["library", "Your library", "คลังงาน", Folder],
  ["design", "Design OS", "ระบบออกแบบ", SlidersHorizontal],
  ["settings", "Settings", "ตั้งค่า", Settings],
] as const;
export type Navigate = (route: string, id?: string) => void;
export function App() {
  const s = useStore(),
    t = useT();
  const [path, setPath] = useState(location.hash.slice(1) || "/home"),
    [menu, setMenu] = useState(false),
    [command, setCommand] = useState(false),
    [q, setQ] = useState("");
  const parts = path.split("/").filter(Boolean),
    route = parts[0] || "home",
    id = parts[1];
  const go: Navigate = (r, i) => {
    location.hash = "/" + r + (i ? "/" + i : "");
    setMenu(false);
  };
  useEffect(() => {
    const f = () => setPath(location.hash.slice(1) || "/home");
    window.addEventListener("hashchange", f);
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommand((x) => !x);
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", k);
    return () => {
      window.removeEventListener("hashchange", f);
      window.removeEventListener("keydown", k);
    };
  }, []);
  useEffect(() => {
    document.documentElement.lang = s.locale;
    document.documentElement.dataset.motion = s.motion;
    document.title = `${routes.find((r) => r[0] === route)?.[1] || "Workspace"} · ARTYVERSE X`;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [route, s.locale, s.motion]);
  let page;
  switch (route) {
    case "home":
      page = <HomePage go={go} />;
      break;
    case "explore":
    case "templates":
      page = <Discover go={go} templates={route === "templates"} />;
      break;
    case "chat":
      page = <Chat key={id || "new"} id={id} go={go} />;
      break;
    case "create":
      page = <Editor key={id || "new"} id={id} go={go} />;
      break;
    case "research":
      page = <Research key={id || "new"} id={id} go={go} />;
      break;
    case "voice":
      page = <Voice />;
      break;
    case "live":
      page = <Live key={id || "new"} id={id} />;
      break;
    case "automate":
      page = <Automate key={id || "new"} id={id} />;
      break;
    case "library":
      page = <Library go={go} />;
      break;
    case "design":
      page = <DesignOS go={go} />;
      break;
    case "settings":
      page = <SettingsPage />;
      break;
    default:
      page = (
        <div className="empty">
          <h1>{t("This orbit is uncharted", "ไม่พบหน้านี้")}</h1>
          <Button onClick={() => go("home")}>Home</Button>
        </div>
      );
  }
  return (
    <MotionConfig
      reducedMotion={
        s.motion === "Off" || s.motion === "Calm" ? "always" : "user"
      }
    >
      <a
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
        className="skip-link"
      >
        {t("Skip to workspace", "ข้ามไปพื้นที่ทำงาน")}
      </a>
      <div className="app">
        <aside
          className={"sidebar " + (menu ? "open" : "")}
          id="main-navigation"
          aria-label={t("Main navigation", "เมนูหลัก")}
        >
          <a className="brand" href="#/home">
            <span className="brand-symbol">✳</span>
            <span>
              artyverse<span className="accent"> x</span>
              <small>YOUR CREATIVE UNIVERSE</small>
            </span>
          </a>
          <button className="workspace-switch" onClick={() => go("library")}>
            <span className="avatar">A</span>
            <span>
              {t("Personal workspace", "พื้นที่ส่วนตัว")}
              <small>{t("LOCAL WORKSPACE", "บันทึกในเครื่อง")}</small>
            </span>
            <ArrowUpRight size={15} />
          </button>
          <button className="sidebar-search" onClick={() => setCommand(true)}>
            <Search size={16} />
            {t("Search anything", "ค้นหาทั้งหมด")}
            <kbd>⌘ K</kbd>
          </button>
          <div className="nav-label">{t("WORKSPACE", "พื้นที่ทำงาน")}</div>
          <nav>
            {routes.slice(0, 10).map(([key, en, th, Icon], i) => (
              <a
                key={key}
                className={route === key ? "active" : ""}
                href={"#/" + key}
                aria-current={route === key ? "page" : undefined}
                onClick={() => setMenu(false)}
              >
                <Icon size={18} />
                <span>{s.locale === "th" ? th : en}</span>
                {i === 4 && <span className="nav-dot" />}
              </a>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="nav-label">
              {t("MAKE IT YOURS", "ปรับให้เป็นคุณ")}
            </div>
            <nav>
              {routes.slice(10).map(([key, en, th, Icon]) => (
                <a
                  key={key}
                  className={route === key ? "active" : ""}
                  href={"#/" + key}
                >
                  <Icon size={18} />
                  {s.locale === "th" ? th : en}
                </a>
              ))}
            </nav>
            <div className="local-status">
              <span className="status-dot" />
              <span>
                {t("Your ideas stay here", "ไอเดียเก็บไว้ที่นี่")}
                <small>
                  {t(
                    "Local storage · No cloud sync",
                    "ข้อมูลในเครื่อง · ไม่ซิงก์คลาวด์",
                  )}
                </small>
              </span>
            </div>
          </div>
        </aside>
        {menu && (
          <button
            className="nav-scrim"
            aria-label="Close navigation"
            onClick={() => setMenu(false)}
          />
        )}
        <div className="main-shell">
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="icon-button mobile-toggle"
                onClick={() => setMenu(!menu)}
                aria-label="Toggle navigation"
                aria-controls="main-navigation"
                aria-expanded={menu}
              >
                <Menu />
              </button>
              <span className="breadcrumb">
                {t("Workspace", "พื้นที่ทำงาน")}
                <span>/</span>
                <strong>
                  {routes.find((r) => r[0] === route)?.[
                    s.locale === "th" ? 2 : 1
                  ] || route}
                </strong>
              </span>
            </div>
            <div className="topbar-actions">
              <span className="local-pill">
                <span className="status-dot" />
                {t("LOCAL MODE", "โหมดในเครื่อง")}
              </span>
              <button
                className="icon-button"
                onClick={() => setCommand(true)}
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                className="language-button"
                onClick={() => s.setLocale(s.locale === "en" ? "th" : "en")}
              >
                {s.locale === "en" ? "EN" : "TH"}
              </button>
              <span className="avatar small">A</span>
            </div>
          </header>
          <main id="main" tabIndex={-1}>
            {s.error ? (
              <div className="error-banner" role="alert">
                {s.error}
                <Button onClick={() => void s.refresh()}>Retry</Button>
              </div>
            ) : s.loading ? (
              <div className="empty" role="status">
                {t("Opening your universe…", "กำลังเปิดพื้นที่ทำงาน…")}
              </div>
            ) : (
              <Suspense
                fallback={
                  <div className="empty" role="status">
                    Opening workspace…
                  </div>
                }
              >
                {page}
              </Suspense>
            )}
          </main>
          <footer className="app-footer">
            <span>
              ARTYVERSE X <span className="muted">/</span>{" "}
              {t(
                "A little space for your next big thing.",
                "พื้นที่เล็ก ๆ สำหรับไอเดียที่ยิ่งใหญ่",
              )}
            </span>
            <span>
              LOCAL FIRST <span className="accent">↗</span>
            </span>
          </footer>
        </div>
      </div>
      {s.notice && (
        <div className="toast" role="status">
          {s.notice}
          <button
            className="icon-button"
            aria-label="Dismiss notification"
            onClick={() => s.toast("")}
          >
            <X size={16} />
          </button>
        </div>
      )}
      {command && (
        <Modal
          title={t("Find your next move", "ค้นหาสิ่งที่ต้องการ")}
          onClose={() => setCommand(false)}
        >
          <SearchBox
            value={q}
            onChange={setQ}
            placeholder={t(
              "Search workspaces and saved work…",
              "ค้นหาพื้นที่และงานที่บันทึก…",
            )}
          />
          <div className="command-results">
            <span className="eyebrow">WORKSPACES</span>
            {routes
              .filter((r) =>
                (r[1] + r[2]).toLowerCase().includes(q.toLowerCase()),
              )
              .map(([r, en, th, Icon]) => (
                <button
                  key={r}
                  onClick={() => {
                    go(r);
                    setCommand(false);
                  }}
                >
                  <Icon size={18} />
                  {s.locale === "th" ? th : en}
                  <ArrowUpRight size={15} />
                </button>
              ))}
            <span className="eyebrow">SAVED WORK</span>
            {s.items
              .filter(
                (i) =>
                  !i.deletedAt &&
                  i.title.toLowerCase().includes(q.toLowerCase()),
              )
              .slice(0, 8)
              .map((i) => (
                <button
                  key={i.id}
                  onClick={() => {
                    go(
                      {
                        document: "create",
                        conversation: "chat",
                        note: "research",
                        session: "live",
                        workflow: "automate",
                        recording: "library",
                        preset: "design",
                      }[i.kind],
                      i.id,
                    );
                    setCommand(false);
                  }}
                >
                  {i.title}
                  <small>{i.kind}</small>
                </button>
              ))}
          </div>
        </Modal>
      )}
    </MotionConfig>
  );
}
