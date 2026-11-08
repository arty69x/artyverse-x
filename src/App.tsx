import { WorkspaceBoundary } from "./v3/Boundary";
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
import { Button } from "./components/UI";
import { Discover, Library, SettingsPage } from "./pages/Workspace";
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
import { kindRoutes } from "../shared/v2/contracts";
import { HomeV3 } from "./v3/Home";
import { Shell } from "./v3/Shell";
const Projects = lazy(() =>
  import("./v3/Projects").then((m) => ({ default: m.ProjectsV3 })),
);
const Agents = lazy(() =>
  import("./v2/Agents").then((m) => ({ default: m.Agents })),
);
const NodeStudio = lazy(() =>
  import("./v2/NodeStudio").then((m) => ({ default: m.NodeStudio })),
);
const CodeStudio = lazy(() =>
  import("./v2/CodeStudio").then((m) => ({ default: m.CodeStudio })),
);
const SoundLab = lazy(() =>
  import("./v2/SoundLab").then((m) => ({ default: m.SoundLab })),
);
const Dynamics = lazy(() =>
  import("./v2/Dynamics").then((m) => ({ default: m.Dynamics })),
);
const StoryStudio = lazy(() =>
  import("./v2/StoryStudio").then((m) => ({ default: m.StoryStudio })),
);
const SystemHub = lazy(() =>
  import("./v2/SystemHub").then((m) => ({ default: m.SystemHub })),
);
const Copilot = lazy(() =>
  import("./v3/Copilot").then((m) => ({ default: m.Copilot })),
);
const Analytics = lazy(() =>
  import("./v3/Platform").then((m) => ({ default: m.Analytics })),
);
const QuestionBank = lazy(() =>
  import("./v3/Platform").then((m) => ({ default: m.QuestionBank })),
);
const Marketplace = lazy(() =>
  import("./v3/Platform").then((m) => ({ default: m.Marketplace })),
);
const DesignBoard = lazy(() =>
  import("./v3/DesignBoard").then((m) => ({ default: m.DesignBoard })),
);
export const routes = [
  ["copilot", "Interview Copilot", "ผู้ช่วยสัมภาษณ์", Mic],
  ["practice", "Practice", "ฝึกสัมภาษณ์", MessageSquare],
  ["questions", "Question Bank", "คลังคำถาม", BookOpen],
  ["marketplace", "Marketplace", "ชุดงานสร้างสรรค์", LayoutTemplate],
  ["analytics", "Analytics", "ภาพรวมการใช้งาน", SlidersHorizontal],
  ["design-system", "Design System", "ระบบดีไซน์", SlidersHorizontal],
  ["home", "Home", "หน้าหลัก", Home],
  ["projects", "Projects", "โปรเจกต์", Folder],
  ["agents", "Agent Studio", "เอเจนต์", Zap],
  ["code", "Code Studio", "สตูดิโอโค้ด", Command],
  ["sound", "Sound Lab", "ห้องทดลองเสียง", Radio],
  ["dynamics", "Dynamics", "ไดนามิกส์", Compass],
  ["story", "Story Studio", "สตูดิโอเรื่องเล่า", LayoutTemplate],
  ["system", "System & costs", "ระบบและต้นทุน", SlidersHorizontal],
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
  const [path, setPath] = useState(location.hash.slice(1) || "/home");
  const parts = path.split("/").filter(Boolean),
    route =
      (
        {
          assets: "library",
          pipeline: "automate",
          canvas: "create",
          "live-code": "code",
          components: "design-system",
          overview: "home",
          inspector: "code",
        } as Record<string, string>
      )[parts[0]] ||
      parts[0] ||
      "home",
    id = parts[1];
  const go: Navigate = (r, i) => {
    location.hash = "/" + r + (i ? "/" + i : "");
  };
  useEffect(() => {
    const f = () => setPath(location.hash.slice(1) || "/home");
    window.addEventListener("hashchange", f);
    return () => window.removeEventListener("hashchange", f);
  }, []);
  useEffect(() => {
    document.documentElement.lang = s.locale;
    document.documentElement.dataset.motion = s.motion;
    document.title = `${routes.find((r) => r[0] === route)?.[1] || "Workspace"} · ARTYVERSE X`;
    document.getElementById("main")?.focus({ preventScroll: true });
  }, [route, s.locale, s.motion]);
  let page;
  switch (route) {
    case "copilot":
    case "practice":
      page = (
        <Copilot
          key={route + ":" + (id || "new")}
          practice={route === "practice"}
          go={go}
          id={id}
        />
      );
      break;
    case "questions":
      page = <QuestionBank key={id || "all"} go={go} id={id} />;
      break;
    case "marketplace":
      page = <Marketplace go={go} />;
      break;
    case "analytics":
      page = <Analytics />;
      break;
    case "design-system":
      page = <DesignBoard />;
      break;
    case "home":
      page = <HomeV3 go={go} />;
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
    case "projects":
      page = <Projects key={id || "all"} go={go} id={id} />;
      break;
    case "agents":
      page = <Agents key={id || "new"} id={id} go={go} />;
      break;
    case "code":
      page = <CodeStudio key={id || "new"} id={id} />;
      break;
    case "sound":
      page = <SoundLab key={id || "new"} id={id} />;
      break;
    case "dynamics":
      page = <Dynamics key={id || "new"} id={id} />;
      break;
    case "story":
      page = <StoryStudio key={id || "new"} id={id} />;
      break;
    case "system":
      page = <SystemHub />;
      break;
    case "automate":
      page =
        id && s.items.some((i) => i.id === id && !i.data.graph) ? (
          <Automate key={id} id={id} />
        ) : (
          <NodeStudio key={id || "new"} id={id} />
        );
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
      <Shell route={route} go={go}>
        <Suspense
          fallback={
            <div className="v3-loading" role="status">
              {t("Opening workspace…", "กำลังเปิดพื้นที่ทำงาน…")}
            </div>
          }
        >
          <WorkspaceBoundary key={route + ":" + (id || "")}>
            {page}
          </WorkspaceBoundary>
        </Suspense>
      </Shell>
    </MotionConfig>
  );
}
