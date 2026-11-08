import {
  ArrowUpRight,
  Code2,
  Layers,
  AudioLines,
  Workflow,
  ScanLine,
  FolderOpen,
  ShieldCheck,
  Lightbulb,
  ChartNoAxesCombined,
} from "lucide-react";
import type { Navigate } from "../App";
import { useT } from "../core/store";
const tools = [
  ["chat", "AI Chat", "บทสนทนา", ScanLine, "cyan"],
  ["code", "Live Code", "เขียนโค้ด", Code2, "pink"],
  ["automate", "Pipeline", "เชื่อมขั้นตอน", Workflow, "violet"],
  ["create", "Canvas", "ออกแบบ", Layers, "lime"],
  ["sound", "Audio Synth", "สร้างเสียง", AudioLines, "pink"],
  ["builder", "Site Builder", "สร้างเว็บไซต์", Code2, "violet"],
] as const;
export function StudioLaunchpad({ go }: { go: Navigate }) {
  const t = useT();
  return (
    <section
      className="recon-launchpad"
      aria-label={t("Connected studio", "เครื่องมือสตูดิโอ")}
    >
      <div className="recon-launch-head">
        <div>
          <span className="eyebrow">// 01 — YOUR CREATIVE TOOLCHAIN</span>
          <h2>
            {t("One studio.", "หนึ่งสตูดิโอ")}{" "}
            <em>{t("Every possibility.", "ทุกความเป็นไปได้")}</em>
          </h2>
        </div>
        <button onClick={() => go("projects")}>
          {t("Open projects", "เปิดโปรเจกต์")}
          <ArrowUpRight size={18} />
        </button>
      </div>
      <div className="recon-flow">
        {[
          [
            "research",
            "01",
            "EXTRACT",
            t("Collect notes & references", "รวบรวมโน้ตและแหล่งข้อมูล"),
          ],
          [
            "builder",
            "02",
            "COMPOSE",
            t("Build an editable experience", "สร้างงานที่แก้ไขต่อได้"),
          ],
          [
            "library",
            "03",
            "SHIP",
            t("Find, export & share your files", "ค้นหาและส่งออกไฟล์งาน"),
          ],
        ].map(([route, n, title, desc]) => (
          <button key={route} onClick={() => go(route)}>
            <span>{n}</span>
            <div>
              <strong>
                {title}
                <ArrowUpRight size={17} />
              </strong>
              <small>{desc}</small>
            </div>
          </button>
        ))}
      </div>
      <div className="recon-toolstrip">
        {tools.map(([route, en, th, Icon, color]) => (
          <button
            key={route}
            className={"recon-tool " + color}
            onClick={() => go(route)}
          >
            <Icon size={25} />
            <strong>{t(en, th)}</strong>
            <ArrowUpRight size={14} />
          </button>
        ))}
      </div>
      <div className="recon-values">
        {[
          [Lightbulb, "Creativity", "ความคิดสร้างสรรค์"],
          [ShieldCheck, "Transparency", "ความโปร่งใส"],
          [ChartNoAxesCombined, "Measurable results", "ผลลัพธ์ที่วัดได้"],
        ].map(([Icon, en, th]) => {
          const I = Icon as typeof FolderOpen;
          return (
            <span key={en as string}>
              <I size={17} />
              {t(en as string, th as string)}
            </span>
          );
        })}
      </div>
    </section>
  );
}
