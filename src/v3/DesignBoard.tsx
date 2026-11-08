import { useState } from "react";
import {
  Sun,
  Moon,
  Monitor,
  Plus,
  ArrowUpRight,
  Check,
  Copy,
  Command,
  Search,
  Layers,
  Mic,
  Code2,
  Settings,
  MousePointer2,
  Download,
  Sparkles,
  Play,
  Pause,
} from "lucide-react";
import { designSystem, contrastRatio } from "../../shared/design";
import { useTheme } from "./Theme";
import { useStore, useT, download } from "../core/store";
import { Button, Modal, PageHead } from "../components/UI";
import { Arcyca } from "./Mascot";
const sections = [
  "Color / สี",
  "Typography / ตัวอักษร",
  "Space / ระยะห่าง",
  "Material / พื้นผิว",
  "Iconography / ไอคอน",
  "Responsive / หน้าจอ",
  "Media / อัตราส่วน",
  "Components / ส่วนประกอบ",
  "Interaction / ปฏิสัมพันธ์",
  "Atmosphere / บรรยากาศ",
  "Workflow / ขั้นตอน",
];
export function DesignBoard() {
  const s = useStore(),
    t = useT(),
    theme = useTheme(),
    [dialog, setDialog] = useState(false),
    [tab, setTab] = useState(0),
    [text, setText] = useState("Creative power. Disciplined clarity."),
    [invalid, setInvalid] = useState(false),
    [paused, setPaused] = useState(false),
    [state, setState] = useState<
      "idle" | "listening" | "thinking" | "success" | "error"
    >("idle"),
    [hash, setHash] = useState(""),
    [busy, setBusy] = useState(false),
    [viewport, setViewport] = useState(390);
  const colors = designSystem.themes[theme.resolved],
    pairs = [
      ["Text / surface", colors.text, colors.surface],
      ["Muted / surface", colors.muted, colors.surface],
      ["Faint / surface", colors.faint, colors.surface],
      ["Accent label / accent", colors.onAccent, colors.accent],
      ["Focus / surface", colors.focus, colors.surface],
      ["Danger / surface", colors.danger, colors.surface],
    ];
  function heading(i: number, description: string) {
    return (
      <header className="v3-board-heading">
        <span>{String(i + 1).padStart(2, "0")}</span>
        <div>
          <h2>{sections[i]}</h2>
          <p>{description}</p>
        </div>
      </header>
    );
  }
  return (
    <div className="page v3-design-board">
      <PageHead
        index="THE LIVING DESIGN SYSTEM / V3"
        title={t("Clarity by design", "ออกแบบให้ชัดเจน")}
        description={t(
          "Real tokens. Real components. One system across every creative surface.",
          "tokens และ components ที่ใช้จริง ภาษาเดียวกันในทุกพื้นที่สร้างสรรค์",
        )}
        action={
          <Button
            onClick={() =>
              download(
                "ARTYVERSE-DESIGN-SYSTEM-V3.json",
                JSON.stringify(designSystem, null, 2),
              )
            }
          >
            <Download size={16} />
            {t("Export tokens", "ส่งออก tokens")}
          </Button>
        }
      />
      <div className="v3-board-nav">
        {sections.map((name, i) => (
          <a
            href={"#board-" + (i + 1)}
            key={name}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("board-" + (i + 1))?.scrollIntoView({
                behavior:
                  ["Off", "Calm"].includes(s.motion) ||
                  matchMedia("(prefers-reduced-motion:reduce)").matches
                    ? "instant"
                    : "smooth",
              });
            }}
          >
            {String(i + 1).padStart(2, "0")} {name.split(" / ")[0]}
          </a>
        ))}
      </div>
      <section id="board-1">
        {heading(
          0,
          t(
            "Brand primitives become semantic roles. Both themes use the same component contracts.",
            "สีแบรนด์ถูกแปลงเป็นบทบาทเชิงความหมาย ใช้ร่วมกันในทั้งสองธีม",
          ),
        )}
        <div className="v3-theme-controls">
          {(
            [
              ["dark", Moon, "Dark"],
              ["light", Sun, "Light"],
              ["system", Monitor, "System"],
            ] as const
          ).map(([value, Icon, label]) => (
            <button
              key={value}
              aria-pressed={theme.preference === value}
              onClick={() => theme.setTheme(value)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </div>
        <div className="v3-board-swatches">
          {Object.entries(designSystem.brand).map(([name, color]) => (
            <div key={name}>
              <i style={{ background: color }} />
              <strong>{name}</strong>
              <code>{color}</code>
            </div>
          ))}
        </div>
        <div className="v3-contrast-table">
          <table>
            <caption>
              {t(
                "Computed text contrast / current theme",
                "ค่า contrast ของข้อความที่คำนวณจากธีมปัจจุบัน",
              )}
            </caption>
            <thead>
              <tr>
                <th>{t("Pair", "คู่สี")}</th>
                <th>{t("Ratio", "อัตราส่วน")}</th>
                <th>AA / 4.5:1</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map(([name, a, b]) => (
                <tr key={name}>
                  <th>{name}</th>
                  <td>{contrastRatio(a, b).toFixed(2)}:1</td>
                  <td>
                    {contrastRatio(a, b) >= 4.5 ? (
                      <>
                        <Check size={15} /> {t("Pass", "ผ่าน")}
                      </>
                    ) : (
                      t("Requires review", "ต้องตรวจเพิ่ม")
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="v3-mini-note">
          {t(
            "Computed for opaque colors, normal text. This does not certify all gradients, states or WCAG conformance.",
            "คำนวณจากสีทึบสำหรับข้อความปกติ ไม่ใช่การรับรองทุก gradient, state หรือ WCAG ทั้งระบบ",
          )}
        </p>
      </section>
      <section id="board-2">
        {heading(
          1,
          t(
            "Syne headlines, DM Sans interface, Thai metrics and a clear mono rhythm.",
            "Syne สำหรับหัวข้อ DM Sans สำหรับ UI พร้อมฟอนต์ไทยและ mono ที่อ่านง่าย",
          ),
        )}
        <div className="v3-type-specimen">
          <h1>
            Creative power.
            <br />
            <em>Disciplined clarity.</em>
          </h1>
          <h2>พื้นที่สำหรับทุกความคิดสร้างสรรค์</h2>
          <p>
            ARTYVERSE = Artist × Multiverse. Your ideas, code, sound and stories
            belong together.
          </p>
          <code>const nextWorld = create(yourIdea);</code>
        </div>
        <div className="v3-type-scale">
          {[64, 48, 32, 24, 20, 18, 16, 14, 12].map((n) => (
            <div key={n}>
              <code>{n}px</code>
              <span
                style={{ fontSize: n > 32 ? "clamp(28px,4vw," + n + "px)" : n }}
              >
                Artyverse · สร้างสรรค์
              </span>
            </div>
          ))}
        </div>
      </section>
      <section id="board-3">
        {heading(
          2,
          t(
            "A shared rhythm, with documented viewport gutters.",
            "จังหวะระยะห่างร่วมกัน พร้อม gutter ที่กำหนดตามหน้าจอ",
          ),
        )}
        <div className="v3-space-demo">
          {designSystem.space.map((n) => (
            <div key={n}>
              <code>{n}</code>
              <i style={{ width: n }} />
            </div>
          ))}
        </div>
        <p className="v3-mini-note">
          {t(
            "15px mobile / 23px tablet / 32px desktop gutters are deliberate layout exceptions.",
            "gutter มือถือ 15px / tablet 23px / desktop 32px เป็นข้อยกเว้นที่กำหนดไว้โดยตั้งใจ",
          )}
        </p>
      </section>
      <section id="board-4">
        {heading(
          3,
          t(
            "A material has a job. Glass belongs to overlays, not every card.",
            "แต่ละพื้นผิวมีหน้าที่ glass ใช้เฉพาะ overlay และ preview ที่เหมาะสม",
          ),
        )}
        <div className="v3-material-grid">
          {Object.entries(designSystem.radius).map(([name, value]) => (
            <div key={name} style={{ borderRadius: Math.min(32, value) }}>
              <Layers size={22} />
              <strong>{name}</strong>
              <code>{value}px</code>
            </div>
          ))}
        </div>
      </section>
      <section id="board-5">
        {heading(
          4,
          t(
            "Consistent outline geometry and accessible names.",
            "รูปทรง outline ที่สม่ำเสมอ พร้อมชื่อที่เข้าถึงได้",
          ),
        )}
        <div className="v3-icon-demo">
          {[
            Plus,
            ArrowUpRight,
            Check,
            Copy,
            Command,
            Search,
            Layers,
            Mic,
            Code2,
            Settings,
            MousePointer2,
            Sparkles,
          ].map((Icon, i) => (
            <div key={i}>
              <Icon size={24} />
              <span>
                {
                  [
                    "Add",
                    "Open",
                    "Complete",
                    "Copy",
                    "Command",
                    "Search",
                    "Layers",
                    "Voice",
                    "Code",
                    "Settings",
                    "Select",
                    "Assistant",
                  ][i]
                }
              </span>
            </div>
          ))}
        </div>
      </section>
      <section id="board-6">
        {heading(
          5,
          t(
            "Layout responds to content, not a scaled-down desktop.",
            "ปรับองค์ประกอบตามเนื้อหา ไม่ใช่ย่อ desktop ให้เล็กลง",
          ),
        )}
        <label>
          {t("Preview container width", "ความกว้าง preview")}
          <input
            type="range"
            min={280}
            max={1100}
            step={10}
            value={viewport}
            onChange={(e) => setViewport(Number(e.target.value))}
          />
          <output>{viewport}px</output>
        </label>
        <div className="v3-layout-preview" style={{ maxWidth: viewport }}>
          <aside />
          <header />
          <div>
            {[1, 2, 3, 4].map((n) => (
              <i key={n}>{n}</i>
            ))}
          </div>
        </div>
        <div className="v3-breakpoint-list">
          {designSystem.layout.breakpoints.map((n) => (
            <code key={n}>≥ {n}px</code>
          ))}
        </div>
      </section>
      <section id="board-7">
        {heading(
          6,
          t(
            "Reserve space before media loads. Keep controls native.",
            "จองพื้นที่ก่อนโหลด media และใช้ controls จริง",
          ),
        )}
        <div className="v3-aspect-grid">
          {["16/9", "4/3", "1/1", "9/16", "3/4"].map((r) => (
            <div key={r}>
              <i style={{ aspectRatio: r }}>
                <Layers size={26} />
              </i>
              <code>{r.replace("/", " : ")}</code>
            </div>
          ))}
        </div>
      </section>
      <section id="board-8">
        {heading(
          7,
          t(
            "Shared anatomy, useful states, real interactions.",
            "ส่วนประกอบร่วมกัน พร้อมสถานะและปฏิสัมพันธ์ที่ใช้งานได้",
          ),
        )}
        <div className="v3-component-demo">
          <div className="button-row">
            <Button
              variant="primary"
              onClick={() =>
                s.toast(
                  t(
                    "Component preview: action completed",
                    "ตัวอย่าง component: กดปุ่มแล้ว",
                  ),
                )
              }
            >
              <Plus size={16} />
              {t("Primary action", "ปุ่มหลัก")}
            </Button>
            <Button onClick={() => setDialog(true)}>
              {t("Open dialog", "เปิด dialog")}
            </Button>
            <Button disabled>{t("Disabled", "ปิดใช้งาน")}</Button>
            <Button
              title={t("Copy specimen text", "คัดลอกข้อความตัวอย่าง")}
              onClick={() =>
                void navigator.clipboard
                  .writeText(text)
                  .then(() => s.toast(t("Copied", "คัดลอกแล้ว")))
                  .catch(() =>
                    s.toast(t("Clipboard unavailable", "คลิปบอร์ดไม่พร้อม")),
                  )
              }
            >
              <Copy size={17} />
            </Button>
          </div>
          <label>
            {t("Example field", "ฟิลด์ตัวอย่าง")}
            <input
              value={text}
              aria-invalid={invalid}
              aria-describedby="v3-board-helper"
              onChange={(e) => setText(e.target.value)}
            />
            <small id="v3-board-helper">
              {invalid
                ? t(
                    "Preview validation message. No data was submitted.",
                    "ข้อความ validation ตัวอย่าง ไม่มีการส่งข้อมูล",
                  )
                : t(
                    "Labels remain visible when the field is filled.",
                    "label ยังคงมองเห็นเมื่อกรอกข้อมูล",
                  )}
            </small>
          </label>
          <label className="v2-check">
            <input
              type="checkbox"
              checked={invalid}
              onChange={(e) => setInvalid(e.target.checked)}
            />
            {t("Preview invalid state", "ดูสถานะไม่ถูกต้อง")}
          </label>
          <div
            className="v3-demo-tabs"
            role="tablist"
            aria-label={t("Component preview tabs", "แท็บตัวอย่าง component")}
          >
            {["Overview", "Details", "History"].map((v, i) => (
              <button
                key={v}
                role="tab"
                id={"board-tab-" + i}
                aria-selected={tab === i}
                aria-controls="board-tab-panel"
                tabIndex={tab === i ? 0 : -1}
                onClick={() => setTab(i)}
                onKeyDown={(e) => {
                  const next =
                    e.key === "Home"
                      ? 0
                      : e.key === "End"
                        ? 2
                        : e.key === "ArrowRight"
                          ? (i + 1) % 3
                          : e.key === "ArrowLeft"
                            ? (i + 2) % 3
                            : -1;
                  if (next >= 0) {
                    e.preventDefault();
                    setTab(next);
                    document.getElementById("board-tab-" + next)?.focus();
                  }
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <div
            id="board-tab-panel"
            role="tabpanel"
            aria-labelledby={"board-tab-" + tab}
            tabIndex={0}
          >
            {
              [
                t(
                  "An interactive component specimen.",
                  "ตัวอย่าง component ที่โต้ตอบได้",
                ),
                t(
                  "Arrow keys move between tabs. Home and End jump to the first and last tab.",
                  "ใช้ลูกศรสลับแท็บ และ Home/End ไปแท็บแรกหรือสุดท้าย",
                ),
                t(
                  "This preview does not create user history.",
                  "ตัวอย่างนี้ไม่ได้สร้างประวัติงานผู้ใช้",
                ),
              ][tab]
            }
          </div>
        </div>
      </section>
      <section id="board-9">
        {heading(
          8,
          t(
            "Motion explains change. Loading reflects actual work.",
            "motion ช่วยอธิบายความเปลี่ยนแปลง loading ต้องตรงกับงานจริง",
          ),
        )}
        <div className="v3-motion-demo">
          <div className={paused ? "paused" : ""}>
            <span />
          </div>
          <div className="button-row">
            <Button onClick={() => setPaused(!paused)}>
              {paused ? <Play size={16} /> : <Pause size={16} />}
              {paused
                ? t("Play preview", "เล่นตัวอย่าง")
                : t("Pause preview", "หยุดตัวอย่าง")}
            </Button>
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const digest = await crypto.subtle.digest(
                    "SHA-256",
                    new TextEncoder().encode(text),
                  );
                  setHash(
                    Array.from(new Uint8Array(digest))
                      .map((x) => x.toString(16).padStart(2, "0"))
                      .join(""),
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              {busy
                ? t("Computing…", "กำลังคำนวณ…")
                : t("Compute SHA-256", "คำนวณ SHA-256")}
            </Button>
          </div>
          {hash && <code className="v3-hash-result">{hash}</code>}
          <p className="v3-mini-note">
            120 / 200 / 320 / 500 ms · OS reduced motion respected.
          </p>
        </div>
      </section>
      <section id="board-10">
        {heading(
          9,
          t(
            "ARCYCA anchors interaction; the content always comes first.",
            "ARCYCA ช่วยสร้างบุคลิก โดยให้เนื้อหาเป็นสิ่งสำคัญที่สุด",
          ),
        )}
        <div className="v3-mascot-demo">
          <Arcyca state={state} />
          <div>
            <span className="state-badge">
              {t("STATE PREVIEW", "ตัวอย่างสถานะ")}
            </span>
            <h3>{state}</h3>
            <div className="v3-theme-controls">
              {(
                ["idle", "listening", "thinking", "success", "error"] as const
              ).map((v) => (
                <button
                  key={v}
                  aria-pressed={v === state}
                  onClick={() => setState(v)}
                >
                  {v}
                </button>
              ))}
            </div>
            <p className="v3-mini-note">
              {t(
                "This specimen previews states; it does not start a microphone or provider request.",
                "เป็นตัวอย่างแสดงสถานะ ไม่ได้เริ่มไมโครโฟนหรือส่งคำขอ provider",
              )}
            </p>
            <a className="v3-text-link" href="#/dynamics">
              {t(
                "Explore physical SVG in Dynamics",
                "ทดลอง SVG physics ใน Dynamics",
              )}
              <ArrowUpRight size={17} />
            </a>
          </div>
        </div>
      </section>
      <section id="board-11">
        {heading(
          10,
          t(
            "One connected product, many creative workflows.",
            "หนึ่งผลิตภัณฑ์ หลายขั้นตอนสร้างสรรค์ที่เชื่อมกัน",
          ),
        )}
        <div className="v3-workflow-board">
          {[
            ["INPUT", "chat"],
            ["THINK", "agents"],
            ["CREATE", "create"],
            ["ANALYZE", "research"],
            ["HYPER-POLISH", "code"],
            ["DRIVE", "automate"],
          ].map(([label, r], i) => (
            <a href={"#/" + r} key={label}>
              <span>0{i + 1}</span>
              <strong>{label}</strong>
              <ArrowUpRight size={17} />
            </a>
          ))}
        </div>
        <p className="v3-mini-note">
          {t(
            "These are working workspace links. Pipeline completion is shown only by actual execution events inside Node Studio.",
            "เป็นลิงก์เข้าเครื่องมือจริง สถานะสำเร็จของ pipeline แสดงจาก execution events จริงใน Node Studio เท่านั้น",
          )}
        </p>
      </section>
      {dialog && (
        <Modal
          title={t("A shared dialog", "dialog ที่ใช้ร่วมกัน")}
          onClose={() => setDialog(false)}
        >
          <p>
            {t(
              "Focus stays inside this dialog. Escape closes it and restores the previous focus.",
              "focus อยู่ภายใน dialog กด Escape เพื่อปิดและกลับไปยังปุ่มเดิม",
            )}
          </p>
          <Button variant="primary" onClick={() => setDialog(false)}>
            {t("Done", "เสร็จแล้ว")}
          </Button>
        </Modal>
      )}
    </div>
  );
}
