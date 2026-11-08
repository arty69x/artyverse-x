import { useId, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUp,
  ArrowUpRight,
  Plus,
  Play,
  Code2,
  AudioLines,
  Workflow,
  Layers,
  PenTool,
  Orbit,
  BookOpen,
  ShieldCheck,
  ArrowRight,
  Mic,
  Folder,
} from "lucide-react";
import { useStore, useT, useDraft } from "../core/store";
import { Button, Modal, Mascot } from "../components/UI";
import { kindRoutes } from "../../shared/v2/contracts";
import type { Navigate } from "../App";
function Universe() {
  const id = useId().replace(/:/g, ""),
    ref = useRef<HTMLDivElement>(null),
    reduce = useReducedMotion();
  return (
    <div
      className="v2-universe"
      ref={ref}
      onPointerMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        ref.current?.style.setProperty(
          "--rx",
          `${((e.clientY - r.top - r.height / 2) / r.height) * 8}deg`,
        );
        ref.current?.style.setProperty(
          "--ry",
          `${((e.clientX - r.left - r.width / 2) / r.width) * -10}deg`,
        );
      }}
      onPointerLeave={() => {
        ref.current?.style.setProperty("--rx", "0deg");
        ref.current?.style.setProperty("--ry", "0deg");
      }}
    >
      <div className="v2-universe-grid" />
      <div className="v2-orbital-object">
        <svg viewBox="0 0 500 500" aria-hidden="true">
          <defs>
            <radialGradient id={id + "sphere"} cx="30%" cy="20%">
              <stop stopColor="#8A9B49" />
              <stop offset=".3" stopColor="#394227" />
              <stop offset=".7" stopColor="#101713" />
              <stop offset="1" stopColor="#060A0C" />
            </radialGradient>
            <linearGradient id={id + "orbit"} x2="1" y2="1">
              <stop stopColor="#D7E317" />
              <stop offset=".5" stopColor="#43E6FF" />
              <stop offset="1" stopColor="#9B43FF" />
            </linearGradient>
          </defs>
          <circle
            cx="250"
            cy="250"
            r="139"
            fill={`url(#${id}sphere)`}
            stroke="#B4C768"
            strokeWidth=".8"
          />
          <ellipse
            cx="250"
            cy="250"
            rx="224"
            ry="73"
            transform="rotate(-28 250 250)"
            fill="none"
            stroke={`url(#${id}orbit)`}
            strokeWidth="1.1"
          />
          <ellipse
            cx="250"
            cy="250"
            rx="211"
            ry="82"
            transform="rotate(56 250 250)"
            fill="none"
            stroke="#A8B7B5"
            strokeOpacity=".25"
            strokeWidth=".6"
          />
          <circle cx="446" cy="145" r="5" fill="#D4006A" />
          <path
            d="M94 385h70M130 350v70M361 76h22"
            stroke="#D7E317"
            strokeWidth=".7"
            strokeOpacity=".45"
          />
        </svg>
      </div>
      <span className="v2-universe-label">
        ARTIST × MULTIVERSE
        <br />
        <b>A WORLD OF YOUR OWN.</b>
      </span>
      <div className="v2-universe-companion">
        <Mascot calm={!!reduce} />
        <span>Arty / your creative companion</span>
      </div>
    </div>
  );
}
export function HomeV2({ go }: { go: Navigate }) {
  const s = useStore(),
    t = useT(),
    [draft, setDraft] = useDraft("home-composer", ""),
    [mode, setMode] = useState("notebook"),
    [busy, setBusy] = useState(false),
    [tour, setTour] = useState(false);
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
  const recent = s.scopedItems
    .filter((i) => !i.deletedAt && i.kind !== "project")
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, 4);
  return (
    <div className="v2-home">
      <section className="v2-home-hero">
        <div className="v2-hero-copy">
          <span className="eyebrow">
            <i /> THE ARTIST’S MULTIVERSE / V2
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
          >
            {t("One artist.", "ศิลปินหนึ่งคน")}
            <br />
            <strong>{t("Infinite worlds.", "โลกสร้างสรรค์ไร้ขีดจำกัด")}</strong>
          </motion.h1>
          <p className="v2-hero-description">
            {t(
              "Think freely. Build boldly. Make it unmistakably yours.",
              "คิดอย่างอิสระ สร้างอย่างกล้าหาญ ให้ผลงานเป็นตัวคุณ",
            )}
            <br />
            {t(
              "Ideas, code, sound and motion — in one connected studio.",
              "ไอเดีย โค้ด เสียง และการเคลื่อนไหว ในสตูดิโอเดียว",
            )}
          </p>
          <div className="v2-home-composer">
            <label className="sr-only" htmlFor="v2-home-prompt">
              {t("Your idea", "ไอเดียของคุณ")}
            </label>
            <textarea
              id="v2-home-prompt"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t(
                "What will you bring into the world?",
                "วันนี้คุณอยากสร้างโลกแบบไหน?",
              )}
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
            <div className="v2-composer-bar">
              <div className="v2-whisper-label">
                <img
                  src="/assets/whisper-micro-white.svg"
                  width="22"
                  height="22"
                  alt="Whisper"
                />
                <select
                  aria-label="Composer mode"
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                >
                  <option value="notebook">
                    {t("Idea notebook", "สมุดไอเดีย")}
                  </option>
                  <option value="agent">Agent Studio</option>
                </select>
              </div>
              <span>
                {mode === "notebook"
                  ? t("Your own words", "บันทึกด้วยข้อความของคุณ")
                  : t(
                      "Local tools + optional provider",
                      "เครื่องมือในเครื่อง + provider ที่ตั้งค่า",
                    )}
              </span>
              <button
                className="v2-send"
                aria-label={t("Start conversation", "เริ่มบทสนทนา")}
                disabled={busy || !draft.trim()}
                onClick={() => void start()}
              >
                <ArrowUp size={19} />
              </button>
            </div>
          </div>
          <div className="v2-hero-actions">
            <button onClick={() => go("templates")}>
              <Plus size={13} />
              {t("Start from a template", "เริ่มจากเทมเพลต")}
            </button>
            <button onClick={() => setTour(true)}>
              <Play size={12} />
              {t("Explore the process", "ดูขั้นตอนการทำงาน")}
            </button>
          </div>
        </div>
        <Universe />
      </section>
      <div className="v2-pillar-strip">
        {["THINK", "CREATE", "ANALYZE", "HYPER-POLISH", "DRIVE"].map((p, i) => (
          <button
            key={p}
            onClick={() =>
              go(["agents", "create", "research", "code", "automate"][i])
            }
          >
            <span>0{i + 1}</span>
            {p}
            <ArrowUpRight size={13} />
          </button>
        ))}
      </div>
      <section className="v2-toolkit">
        <div className="v2-section-title">
          <div>
            <span className="eyebrow">// A STUDIO, NOT A STACK OF TABS</span>
            <h2>
              {t("Make room for", "ให้พื้นที่กับ")}{" "}
              <strong>{t("what’s next.", "สิ่งที่เป็นไปได้")}</strong>
            </h2>
          </div>
          <button className="text-button" onClick={() => go("explore")}>
            {t("All workspaces", "ทุกพื้นที่ทำงาน")}
            <ArrowUpRight size={16} />
          </button>
        </div>
        <div className="v2-bento">
          <button
            className="v2-bento-card v2-bento-canvas"
            onClick={() => go("create")}
          >
            <div className="v2-card-top">
              <span className="eyebrow">01 / CREATE CANVAS</span>
              <PenTool size={18} />
            </div>
            <div className="v2-canvas-art" aria-hidden="true">
              <div className="v2-art-grid" />
              <span>
                Make room
                <br />
                for <em>possibility.</em>
              </span>
              <div className="v2-art-orbit" />
              <small>STARTER COMPOSITION / EDITABLE</small>
            </div>
            <div className="v2-card-bottom">
              <div>
                <h3>{t("Give ideas a shape.", "เปลี่ยนไอเดียให้เป็นรูป")}</h3>
                <p>
                  {t(
                    "Real layers. Your composition. An editable source.",
                    "เลเยอร์จริง องค์ประกอบของคุณ และต้นฉบับที่แก้ต่อได้",
                  )}
                </p>
              </div>
              <ArrowUpRight size={21} />
            </div>
          </button>
          <button
            className="v2-bento-card v2-bento-code"
            onClick={() => go("code")}
          >
            <div className="v2-card-top">
              <span className="eyebrow">02 / CODE STUDIO</span>
              <Code2 size={20} />
            </div>
            <div className="v2-code-art" aria-hidden="true">
              <span>
                <i>01</i>
                <b>const</b> world = create();
              </span>
              <span>
                <i>02</i>world.<em>imagine</em>('what if?');
              </span>
              <span>
                <i>03</i>world.<em>make</em>('something yours');
              </span>
              <div className="v2-mini-orb" />
            </div>
            <div className="v2-card-bottom">
              <div>
                <h3>
                  {t("A little code. A new world.", "โค้ดเล็กน้อย โลกใบใหม่")}
                </h3>
                <p>Sandbox preview · visual CSS inspector</p>
              </div>
              <ArrowUpRight size={20} />
            </div>
          </button>
          <button
            className="v2-bento-card v2-bento-sound"
            onClick={() => go("sound")}
          >
            <div className="v2-card-top">
              <span className="eyebrow">03 / SOUND LAB</span>
              <AudioLines size={20} />
            </div>
            <div className="v2-wave-art" aria-hidden="true">
              {Array.from({ length: 34 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height:
                      10 +
                      Math.abs(Math.sin(i * 0.7) * Math.sin(i * 0.2)) * 65 +
                      "px",
                  }}
                />
              ))}
            </div>
            <div className="v2-card-bottom">
              <div>
                <h3>{t("Find your frequency.", "ค้นหาความถี่ของคุณ")}</h3>
                <p>Procedural synth · sequencer · real WAV export</p>
              </div>
              <ArrowUpRight size={20} />
            </div>
          </button>
          <button
            className="v2-bento-card v2-bento-nodes"
            onClick={() => go("automate")}
          >
            <div className="v2-card-top">
              <span className="eyebrow">04 / NODE STUDIO</span>
              <Workflow size={20} />
            </div>
            <div className="v2-nodes-art" aria-hidden="true">
              <span>INPUT</span>
              <i />
              <span>TRANSFORM</span>
              <i />
              <span>ARTIFACT</span>
            </div>
            <div className="v2-card-bottom">
              <div>
                <h3>
                  {t("Connect the possibilities.", "เชื่อมทุกความเป็นไปได้")}
                </h3>
                <p>Editable graphs · validation · local execution</p>
              </div>
              <ArrowUpRight size={20} />
            </div>
          </button>
          <button
            className="v2-bento-card v2-bento-dynamics"
            onClick={() => go("dynamics")}
          >
            <div className="v2-card-top">
              <span className="eyebrow">05 / DYNAMICS</span>
              <Orbit size={20} />
            </div>
            <div className="v2-dynamics-art" aria-hidden="true">
              <div />
              <span />
              <i />
            </div>
            <div className="v2-card-bottom">
              <div>
                <h3>
                  {t(
                    "Intelligence, in motion.",
                    "ความคิดสร้างสรรค์ที่เคลื่อนไหว",
                  )}
                </h3>
                <p>Physical SVG · gestures · optional WebGL</p>
              </div>
              <ArrowUpRight size={20} />
            </div>
          </button>
          <button
            className="v2-bento-card v2-bento-story"
            onClick={() => go("story")}
          >
            <div className="v2-card-top">
              <span className="eyebrow">06 / STORY STUDIO</span>
              <Layers size={20} />
            </div>
            <div className="v2-story-art" aria-hidden="true">
              <i>01</i>
              <span>
                A beginning.
                <br />
                <b>A point of view.</b>
              </span>
              <div>
                <em />
                <em />
                <em />
              </div>
            </div>
            <div className="v2-card-bottom">
              <div>
                <h3>
                  {t("Make it mean something.", "เล่าเรื่องให้มีความหมาย")}
                </h3>
                <p>Scripts · scenes · timing · presentation</p>
              </div>
              <ArrowUpRight size={20} />
            </div>
          </button>
        </div>
      </section>
      <section className="v2-trust-line">
        <span>
          <ShieldCheck size={17} />
          Transparent tools. Real artifacts.
        </span>
        <p>
          {t(
            "Local tools work now. AI and external services show their actual connection status.",
            "เครื่องมือในเครื่องใช้งานได้ ส่วน AI และบริการภายนอกแสดงสถานะการเชื่อมต่อตามจริง",
          )}
        </p>
        <a href="#/system">
          Capability & cost overview <ArrowUpRight size={14} />
        </a>
      </section>
      {recent.length > 0 && (
        <section className="v2-home-recent">
          <div className="v2-section-title">
            <div>
              <span className="eyebrow">// STILL IN YOUR ORBIT</span>
              <h2>
                {t("Continue", "กลับมาทำ")}{" "}
                <strong>{t("your work.", "งานของคุณ")}</strong>
              </h2>
            </div>
            <button className="text-button" onClick={() => go("library")}>
              {t("Open Library", "เปิดคลังงาน")}
              <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="recent-list">
            {recent.map((i) => (
              <button
                key={i.id}
                onClick={() => go(kindRoutes[i.kind] || "library", i.id)}
              >
                <Folder size={18} />
                <span>
                  {i.title}
                  <small>
                    {i.kind} ·{" "}
                    {new Date(i.updatedAt).toLocaleDateString(s.locale)}
                  </small>
                </span>
                <ArrowUpRight size={16} />
              </button>
            ))}
          </div>
        </section>
      )}
      {tour && (
        <Modal
          title="One artist. A connected process."
          onClose={() => setTour(false)}
        >
          <div className="v2-tour">
            <p>
              <b>Think.</b> Capture an idea in Conversations or run a
              transparent tool in Agent Studio.
            </p>
            <p>
              <b>Create.</b> Build a canvas, a sandboxed web scene, a sound or a
              physical world.
            </p>
            <p>
              <b>Analyze & polish.</b> Inspect the source, review changes, and
              test the result.
            </p>
            <p>
              <b>Drive.</b> Connect a node graph, save real artifacts, and
              present your story.
            </p>
            <Button
              variant="primary"
              onClick={() => {
                setTour(false);
                go("projects");
              }}
            >
              Create your first project <ArrowRight size={15} />
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
