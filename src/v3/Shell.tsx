import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Home,
  Folder,
  Plus,
  Library,
  Menu,
  Search,
  Sun,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowUpRight,
  X,
  ArrowLeft,
  ArrowRight,
  Command,
  Sparkles,
  Check,
  Monitor,
  ChevronDown,
} from "lucide-react";
import { routes, type Navigate } from "../App";
import { useStore, useT } from "../core/store";
import { kindRoutes, routeForItem } from "../../shared/routes";
import { Modal, Button } from "../components/UI";
import { useTheme } from "./Theme";
const groups = [
  {
    en: "THINK & CONNECT",
    th: "คิดและเชื่อมโยง",
    keys: ["copilot", "practice", "chat", "research", "agents"],
  },
  {
    en: "MAKE SOMETHING",
    th: "พื้นที่สร้างสรรค์",
    keys: ["create", "code", "sound", "dynamics", "story", "templates"],
  },
  {
    en: "YOUR WORKSPACE",
    th: "จัดการงานของคุณ",
    keys: ["home", "projects", "library", "automate", "voice", "live"],
  },
  {
    en: "DISCOVER",
    th: "ค้นพบสิ่งใหม่",
    keys: ["explore", "marketplace", "analytics"],
  },
  {
    en: "DESIGN & SYSTEM",
    th: "ออกแบบและตั้งค่า",
    keys: ["design-system", "design", "system", "settings"],
  },
];
export function Shell({
  route,
  go,
  children,
}: {
  route: string;
  go: Navigate;
  children: ReactNode;
}) {
  const s = useStore(),
    t = useT(),
    theme = useTheme(),
    [menu, setMenu] = useState(false),
    [command, setCommand] = useState(false),
    [create, setCreate] = useState(false),
    [query, setQuery] = useState(""),
    [index, setIndex] = useState(0),
    [compact, setCompact] = useState(
      () => localStorage.getItem("av-nav-compact") === "true",
    );
  const menuTrigger = useRef<HTMLButtonElement>(null),
    searchInput = useRef<HTMLInputElement>(null),
    scrollPositions = useRef(new Map<string, number>()),
    previous = useRef(route);
  const title =
      routes.find((r) => r[0] === route)?.[s.locale === "th" ? 2 : 1] || route,
    project = s.items.find((i) => i.id === s.activeProject && !i.deletedAt);
  useEffect(() => {
    const f = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommand((v) => !v);
      }
      if (e.key === "Escape") setMenu(false);
    };
    window.addEventListener("keydown", f);
    return () => window.removeEventListener("keydown", f);
  }, []);
  useEffect(() => {
    setMenu(false);
    const old = previous.current;
    scrollPositions.current.set(old, window.scrollY);
    previous.current = route;
    requestAnimationFrame(() =>
      window.scrollTo({
        top: scrollPositions.current.get(route) || 0,
        behavior: "instant",
      }),
    );
  }, [route]);
  const workspaceResults = routes
    .filter((r) => (r[1] + r[2]).toLowerCase().includes(query.toLowerCase()))
    .map((r) => ({
      id: r[0],
      label: s.locale === "th" ? r[2] : r[1],
      type: t("Workspace", "พื้นที่ทำงาน"),
      run: () => go(r[0]),
    }));
  const savedResults = s.scopedItems
    .filter(
      (i) =>
        !i.deletedAt && i.title.toLowerCase().includes(query.toLowerCase()),
    )
    .slice(0, 8)
    .map((i) => ({
      id: i.id,
      label: i.title,
      type: i.kind,
      run: () => go(routeForItem(i), i.id),
    }));
  const results = [...workspaceResults, ...savedResults];
  useEffect(() => setIndex(0), [query]);
  useEffect(() => {
    if (command) requestAnimationFrame(() => searchInput.current?.focus());
  }, [command]);
  useEffect(() => {
    if (command)
      document
        .getElementById("command-" + index)
        ?.scrollIntoView({ block: "nearest" });
  }, [index, command]);
  function navigate(r: string) {
    go(r);
    setMenu(false);
  }
  function navigation() {
    return (
      <>
        <a className="v3-brand" href="#/home" aria-label="ARTYVERSE X Home">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <path
              d="M5 31 17 6h6l12 25h-8l-3-7h-9l-3 7Zm13-14h3l-1.5-4Z"
              fill="currentColor"
            />
            <circle cx="33" cy="7" r="3" className="v3-brand-dot" />
          </svg>
          <span>
            ARTYVERSE<b>X</b>
            <small>ARTIST × MULTIVERSE</small>
          </span>
        </a>
        <button
          className="workspace-switch"
          onClick={() => navigate("projects")}
        >
          <span className="avatar">{project?.title.slice(0, 1) || "A"}</span>
          <span>
            {project?.title || t("Personal universe", "จักรวาลของคุณ")}
            <small>{t("LOCAL WORKSPACE", "บันทึกในเครื่อง")}</small>
          </span>
          <ChevronDown size={15} />
        </button>
        <button
          className="sidebar-search"
          onClick={() => {
            setMenu(false);
            setCommand(true);
          }}
        >
          <Search size={17} />
          <span>{t("Search anything", "ค้นหาทั้งหมด")}</span>
          <kbd>⌘ K</kbd>
        </button>
        <div className="v3-nav-groups">
          {groups.map((g) => (
            <div key={g.en}>
              <div className="nav-label">{s.locale === "th" ? g.th : g.en}</div>
              <nav aria-label={s.locale === "th" ? g.th : g.en}>
                {g.keys.map((key) => {
                  const r = routes.find((r) => r[0] === key);
                  if (!r) return null;
                  const Icon = r[3];
                  return (
                    <a
                      key={key}
                      href={"#/" + key}
                      className={route === key ? "active" : ""}
                      title={s.locale === "th" ? r[2] : r[1]}
                      aria-current={route === key ? "page" : undefined}
                      onClick={() => setMenu(false)}
                    >
                      <Icon size={19} />
                      <span>{s.locale === "th" ? r[2] : r[1]}</span>
                      {key === "copilot" && <i className="v3-nav-new">NEW</i>}
                    </a>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
        <div className="v3-sidebar-note">
          <span className="status-dot" />
          <div>
            {t("A space that stays yours.", "พื้นที่ที่เป็นของคุณ")}
            <small>
              {t(
                "Local tools · Your saved work",
                "เครื่องมือ local · งานที่คุณบันทึก",
              )}
            </small>
          </div>
        </div>
      </>
    );
  }
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          document.getElementById("main")?.focus();
        }}
      >
        {t("Skip to workspace", "ข้ามไปพื้นที่ทำงาน")}
      </a>
      <div className={"app v3-app " + (compact ? "is-compact" : "")}>
        <aside
          className="sidebar v3-sidebar"
          aria-label={t("Main navigation", "เมนูหลัก")}
        >
          {navigation()}
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <div className="topbar-left">
              <button
                className="icon-button v3-menu-trigger"
                ref={menuTrigger}
                aria-label={t("Toggle navigation", "เปิดเมนู")}
                aria-expanded={menu}
                onClick={() => setMenu(true)}
              >
                <Menu size={21} />
              </button>
              <button
                className="icon-button v3-collapse"
                title={t("Collapse navigation", "ย่อเมนู")}
                aria-label={t("Collapse navigation", "ย่อเมนู")}
                onClick={() => {
                  setCompact(!compact);
                  localStorage.setItem("av-nav-compact", String(!compact));
                }}
              >
                {compact ? (
                  <PanelLeftOpen size={19} />
                ) : (
                  <PanelLeftClose size={19} />
                )}
              </button>
              <div className="v3-history">
                <button
                  className="icon-button"
                  aria-label={t("Go back", "ย้อนกลับ")}
                  onClick={() => history.back()}
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  className="icon-button"
                  aria-label={t("Go forward", "ไปข้างหน้า")}
                  onClick={() => history.forward()}
                >
                  <ArrowRight size={16} />
                </button>
              </div>
              <div className="breadcrumb">
                <span>{t("Workspace", "พื้นที่ทำงาน")}</span>
                <span>/</span>
                <strong>{title}</strong>
              </div>
            </div>
            <div className="topbar-actions">
              <button
                className="v3-top-search"
                aria-label={t("Search","ค้นหา")}
                onClick={() => setCommand(true)}
              >
                <Search size={17} />
                <span>{t("Search", "ค้นหา")}</span>
                <kbd>⌘ K</kbd>
              </button>
              <button
                className="icon-button"
                aria-label={t("Toggle theme", "เปลี่ยนธีม")}
                title={
                  theme.resolved === "dark"
                    ? t("Switch to light", "เปลี่ยนเป็นธีมสว่าง")
                    : t("Switch to dark", "เปลี่ยนเป็นธีมมืด")
                }
                onClick={() =>
                  theme.setTheme(theme.resolved === "dark" ? "light" : "dark")
                }
              >
                {theme.resolved === "dark" ? (
                  <Sun size={19} />
                ) : (
                  <Moon size={19} />
                )}
              </button>
              <button
                className="language-button"
                aria-label={(s.locale==="en"?"EN":"TH")+" · "+t("Change language", "เปลี่ยนภาษา")}
                onClick={() => s.setLocale(s.locale === "en" ? "th" : "en")}
              >
                {s.locale === "en" ? "EN" : "TH"}
              </button>
              <button
                className="v3-create-button"
                aria-label={t("Create new","สร้างใหม่")}
                onClick={() => setCreate(true)}
              >
                <Plus size={18} />
                <span>{t("Create new", "สร้างใหม่")}</span>
              </button>
            </div>
          </header>
          <main id="main" tabIndex={-1} data-route={route}>
            {s.error ? (
              <div className="v3-system-error" role="alert">
                <h1>
                  {t(
                    "Your workspace needs a connection",
                    "เชื่อมต่อพื้นที่ทำงานอีกครั้ง",
                  )}
                </h1>
                <p>{s.error}</p>
                <Button variant="primary" onClick={() => void s.refresh()}>
                  {t("Retry connection", "ลองเชื่อมต่อใหม่")}
                </Button>
                <p>
                  {t(
                    "Saved server records remain on the machine running the API.",
                    "ข้อมูลที่บันทึกยังอยู่ในเครื่องที่รัน API",
                  )}
                </p>
              </div>
            ) : s.loading ? (
              <div className="v3-loading" role="status">
                <span className="v3-loading-orbit" />
                {t(
                  "Opening your creative universe…",
                  "กำลังเปิดจักรวาลสร้างสรรค์…",
                )}
              </div>
            ) : (
              children
            )}
          </main>
          <footer className="app-footer">
            <span>
              ARTYVERSE <b>X</b> <span className="muted">/</span>{" "}
              {t(
                "Creative power. Disciplined clarity.",
                "พลังสร้างสรรค์ที่ชัดเจน",
              )}
            </span>
            <span>
              <i className="status-dot" />
              {t("Saved on this server", "บันทึกบนเซิร์ฟเวอร์นี้")} ·{" "}
              {theme.resolved.toUpperCase()}
            </span>
          </footer>
        </div>
      </div>
      <nav
        className="v3-bottom-nav"
        aria-label={t("Quick navigation", "เมนูด่วน")}
      >
        {[
          ["home", "Home", "หน้าหลัก", Home],
          ["projects", "Projects", "โปรเจกต์", Folder],
          ["create", "Create", "สร้าง", Plus],
          ["library", "Library", "คลังงาน", Library],
        ].map(([r, en, th, Icon]: any) => (
          <a
            key={r}
            href={"#/" + r}
            aria-current={route === r ? "page" : undefined}
            className={
              (route === r ? "active " : "") +
              (r === "create" ? "v3-bottom-create" : "")
            }
          >
            <Icon size={21} />
            <span>{s.locale === "th" ? th : en}</span>
          </a>
        ))}
        <button
          aria-label={t("More workspaces", "พื้นที่ทำงานเพิ่มเติม")}
          onClick={() => setMenu(true)}
        >
          <Menu size={21} />
          <span>{t("More", "เพิ่มเติม")}</span>
        </button>
      </nav>
      {menu && (
        <Modal
          title={t("Your creative universe", "จักรวาลสร้างสรรค์ของคุณ")}
          onClose={() => setMenu(false)}
        >
          <div className="v3-drawer">{navigation()}</div>
        </Modal>
      )}
      {command && (
        <Modal
          title={t("Find your next move", "ค้นหาสิ่งที่ต้องการ")}
          onClose={() => setCommand(false)}
        >
          <div className="v3-command-input">
            <Search size={22} />
            <input
              ref={searchInput}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label={t(
                "Search workspaces and saved work",
                "ค้นหาพื้นที่และงานที่บันทึก",
              )}
              placeholder={t("Where do you want to go?", "อยากไปทำอะไรต่อ?")}
              role="combobox"
              aria-expanded="true"
              aria-controls="v3-command-results"
              aria-activedescendant={
                results[index] ? "command-" + index : undefined
              }
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setIndex((i) => Math.min(results.length - 1, i + 1));
                }
                if (e.key === "ArrowUp") {
                  e.preventDefault();
                  setIndex((i) => Math.max(0, i - 1));
                }
                if (e.key === "Enter" && results[index]) {
                  e.preventDefault();
                  results[index].run();
                  setCommand(false);
                }
              }}
            />
            <kbd>ESC</kbd>
          </div>
          <div
            className="command-results"
            role="listbox"
            id="v3-command-results"
            aria-label={t("Search results", "ผลการค้นหา")}
          >
            {results.length ? (
              results.map((r, i) => (
                <div
                  key={r.id}
                  id={"command-" + i}
                  role="option"
                  aria-selected={i === index}
                  className={
                    "v3-command-option " + (i === index ? "selected" : "")
                  }
                  onMouseEnter={() => setIndex(i)}
                  onClick={() => {
                    r.run();
                    setCommand(false);
                  }}
                >
                  <span>
                    {r.label}
                    <small>{r.type}</small>
                  </span>
                  <ArrowUpRight size={16} />
                </div>
              ))
            ) : (
              <div className="empty">
                <h2>{t("No results yet", "ไม่พบผลลัพธ์")}</h2>
                <p>
                  {t(
                    "Try another name or workspace.",
                    "ลองชื่อหรือพื้นที่ทำงานอื่น",
                  )}
                </p>
              </div>
            )}
          </div>
          <div className="v3-command-help">
            ↑ ↓ {t("Navigate", "เลือก")} · ↵ {t("Open", "เปิด")} · Esc{" "}
            {t("Close", "ปิด")}
          </div>
        </Modal>
      )}
      {create && (
        <Modal
          title={t("What would you like to create?", "วันนี้อยากสร้างอะไร?")}
          onClose={() => setCreate(false)}
        >
          <div className="v3-create-grid">
            {[
              "projects",
              "create",
              "code",
              "sound",
              "dynamics",
              "story",
              "research",
              "automate",
            ].map((key) => {
              const r = routes.find((r) => r[0] === key)!;
              const Icon = r[3];
              return (
                <button
                  key={key}
                  onClick={() => {
                    go(key);
                    setCreate(false);
                  }}
                >
                  <Icon size={24} />
                  <span>{s.locale === "th" ? r[2] : r[1]}</span>
                  <ArrowUpRight size={17} />
                </button>
              );
            })}
          </div>
        </Modal>
      )}
      {s.notice && (
        <div className="toast" role="status">
          <Check size={18} />
          <span>{s.notice}</span>
          <button
            className="icon-button"
            aria-label={t("Dismiss notification", "ปิดการแจ้งเตือน")}
            onClick={() => s.toast("")}
          >
            <X size={17} />
          </button>
        </div>
      )}
    </>
  );
}
