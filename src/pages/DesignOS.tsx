import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Save,
  Download,
  Plus,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Check,
  Copy,
} from "lucide-react";
import { useStore, useT, download } from "../core/store";
import { Button, PageHead, SearchBox, Modal } from "../components/UI";
import { ScrollReveal } from "../components/ScrollReveal";
import { Kinetic } from "../components/Kinetic";
import { paths } from "../core/geometry";
import { theme } from "../../shared/schema";
import type { Navigate } from "../App";
const categories = [
  "Text Reveal",
  "Kinetic Typography",
  "Spatial Carousel",
  "Cinematic Carousel",
  "Media Corridor",
  "SVG Motion",
  "Card Interaction",
  "Scene Transition",
];
const effects = [
  "Blur Reveal",
  "Color Morph",
  "Scramble",
  "Typewriter",
  "Kerning Tighten",
  "Chromatic Aberration",
  "Classic Scroll Mask",
];
const defaults = {
  radius: 380,
  arc: 70,
  curve: 12,
  perspective: 1200,
  depth: 80,
  cardWidth: 240,
  cardHeight: 300,
  corner: 16,
  blur: 2,
  opacity: 0.5,
  focusScale: 1.08,
  speed: 1,
  momentum: 0.8,
  tilt: 8,
};
const ranges: Record<string, [number, number, number, string]> = {
  radius: [100, 1000, 10, "px"],
  arc: [10, 160, 1, "deg"],
  curve: [0, 45, 1, "deg"],
  perspective: [400, 2400, 50, "px"],
  depth: [0, 300, 10, "px"],
  cardWidth: [120, 600, 10, "px"],
  cardHeight: [120, 720, 10, "px"],
  corner: [0, 48, 1, "px"],
  blur: [0, 12, 0.5, "px"],
  opacity: [0.1, 1, 0.05, ""],
  focusScale: [1, 1.4, 0.01, "×"],
  speed: [0.2, 3, 0.1, "×"],
  momentum: [0, 1, 0.05, ""],
  tilt: [0, 25, 1, "deg"],
};
export function DesignOS({ go }: { go: Navigate }) {
  const s = useStore(),
    t = useT(),
    [tab, setTab] = useState("Overview");
  return (
    <div className="page design-page">
      <PageHead
        index="THE SYSTEM BEHIND THE SPARK"
        title="Design OS"
        description={t(
          "One visual language. A workbench to make it yours.",
          "ภาษาออกแบบเดียวกัน พร้อมพื้นที่ปรับแต่งและทดลอง",
        )}
      />
      <div className="design-tabs" role="tablist">
        {[
          "Overview",
          "Tokens",
          "Components",
          "Layout Studio",
          "Motion Lab",
          "Verification",
          "Export",
          "Advanced Files",
        ].map((x) => (
          <button
            role="tab"
            aria-selected={tab === x}
            className={tab === x ? "selected" : ""}
            key={x}
            onClick={() => setTab(x)}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "Overview" ? (
        <>
          <div className="design-intro">
            <span className="eyebrow">ARTYVERSE X / DESIGN SYSTEM 1.0</span>
            <h2>
              Less noise.
              <br />
              <span className="accent">More possibility.</span>
            </h2>
            <p>
              Deep black. Electric light. Purposeful motion.
              <br />A visual system that gives your work room to breathe.
            </p>
            <div className="button-row">
              <Button onClick={() => setTab("Tokens")}>
                Explore foundations <ArrowUpRight size={16} />
              </Button>
              <Button onClick={() => setTab("Motion Lab")}>
                Enter Motion Lab <ArrowUpRight size={16} />
              </Button>
            </div>
            <div className="system-orbit" aria-hidden="true">
              <span>✳</span>
            </div>
          </div>
          <div className="metrics-row">
            {[
              ["3", "Token layers"],
              ["8", "Motion categories"],
              ["16", "Kinetic geometries"],
              ["TH / EN", "Language foundation"],
            ].map(([n, label]) => (
              <div key={label}>
                <strong>{n}</strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </>
      ) : tab === "Tokens" ? (
        <Tokens />
      ) : tab === "Motion Lab" ? (
        <MotionLab />
      ) : tab === "Components" ? (
        <Registry />
      ) : tab === "Layout Studio" ? (
        <div className="empty">
          <h2>One editor. One document model.</h2>
          <p>
            Layout Studio uses the same editor core as Create. Every document
            stays editable across the system.
          </p>
          <Button variant="primary" onClick={() => go("create")}>
            Open shared editor <ArrowUpRight size={16} />
          </Button>
        </div>
      ) : tab === "Advanced Files" ? (
        <VirtualFiles />
      ) : tab === "Verification" ? (
        <div className="control-surface">
          <span className="eyebrow">EVIDENCE / HONEST SCOPE</span>
          <h2>Verification is recorded outside the runtime.</h2>
          <p>
            Read VERIFICATION_REPORT.md in the source for the exact revision,
            browser, viewports, workflow results, and limitations. This screen
            does not manufacture a verification score.
          </p>
          <div className="setting-row">
            <span>Local storage</span>
            <span className="state-badge">SQLITE + BROWSER DRAFTS</span>
          </div>
          <div className="setting-row">
            <span>External AI / cloud / scheduler</span>
            <span className="state-badge">NOT CONNECTED</span>
          </div>
        </div>
      ) : (
        <div className="control-surface">
          <h2>Export the system</h2>
          <p>
            Design tokens and presets are data only. Imports never execute code.
          </p>
          <div className="button-row">
            <Button
              onClick={() =>
                download("DESIGN_TOKENS.json", JSON.stringify(theme, null, 2))
              }
            >
              <Download size={16} />
              Design tokens
            </Button>
            <Button
              onClick={() =>
                download(
                  "motion-presets.json",
                  JSON.stringify(
                    {
                      schemaVersion: 1,
                      presets: s.items.filter(
                        (i) => i.kind === "preset" && !i.deletedAt,
                      ),
                    },
                    null,
                    2,
                  ),
                )
              }
            >
              <Download size={16} />
              Saved motion presets
            </Button>
          </div>
          <p>
            For a complete project and media backup, use Settings → Download
            complete backup.
          </p>
        </div>
      )}
    </div>
  );
}
function Tokens() {
  const s = useStore(),
    [preview, setPreview] = useState(theme.primitive.accent),
    [applied, setApplied] = useState(
      localStorage.getItem("av-accent") || theme.primitive.accent,
    ),
    [previous, setPrevious] = useState<string | null>(null),
    [error, setError] = useState("");
  function apply(color: string) {
    setPrevious(applied);
    setApplied(color);
    document.documentElement.style.setProperty("--accent", color);
    localStorage.setItem("av-accent", color);
    s.toast("Accent applied to interface components");
  }
  function lum(hex: string) {
    const a = hex
      .slice(1)
      .match(/.{2}/g)!
      .map((x) => parseInt(x, 16) / 255)
      .map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4));
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  const ratio = (lum(preview) + 0.05) / (lum("#060608") + 0.05);
  return (
    <div className="tokens-layout">
      <section className="control-surface">
        <span className="eyebrow">PRIMITIVE → SEMANTIC → COMPONENT</span>
        <h2>Foundations with a purpose.</h2>
        <div className="swatch-grid">
          {Object.entries(theme.primitive).map(([key, color]) => (
            <div className="swatch" key={key}>
              <div style={{ background: color }} />
              <strong>{key}</strong>
              <code>{color}</code>
            </div>
          ))}
        </div>
        <h3>Space / px</h3>
        <div className="space-scale">
          {theme.space.map((n) => (
            <div key={n}>
              <i style={{ width: n }} />
              <span>{n}</span>
            </div>
          ))}
        </div>
        <h3>Typography</h3>
        <h2 className="type-specimen">A universe of ideas.</h2>
        <p>Space Grotesk · DM Sans · Noto Sans Thai</p>
        <p>พื้นที่สำหรับความคิดสร้างสรรค์ — ตัวอักษรไทยที่อ่านได้ชัดเจน</p>
      </section>
      <aside className="control-surface">
        <span className="eyebrow">THEME PREVIEW</span>
        <h2>Your accent, your orbit.</h2>
        <label>
          Accent color
          <input
            type="color"
            value={preview}
            onChange={(e) => setPreview(e.target.value)}
          />
        </label>
        <div
          className="token-preview"
          style={{ "--accent": preview } as React.CSSProperties}
        >
          <span className="eyebrow">PREVIEW ONLY</span>
          <h3>A little spark.</h3>
          <button
            className="button primary"
            onClick={() => s.toast("Preview button — theme not applied yet")}
          >
            An intentional action ↗
          </button>
          <p style={{ color: preview }}>Accent on background</p>
        </div>
        <p className="caption">
          Solid contrast on #060608: {ratio.toFixed(2)}:1. This pair alone does
          not certify accessibility.
        </p>
        <div className="button-row">
          <Button variant="primary" onClick={() => apply(preview)}>
            Apply to interface
          </Button>
          <Button onClick={() => setPreview(theme.primitive.accent)}>
            Reset preview
          </Button>
          <Button
            disabled={!previous}
            onClick={() => {
              if (previous) {
                const next = previous;
                setPrevious(applied);
                setApplied(next);
                setPreview(next);
                document.documentElement.style.setProperty("--accent", next);
                localStorage.setItem("av-accent", next);
              }
            }}
          >
            Undo apply
          </Button>
          <Button
            onClick={() =>
              download(
                "theme-preset.json",
                JSON.stringify({
                  schemaVersion: 1,
                  type: "theme",
                  accent: preview,
                }),
              )
            }
          >
            Export
          </Button>
          <label className="button file-button">
            Import preview
            <input
              type="file"
              accept=".json"
              onChange={async (e) => {
                try {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  if (f.size > 10000) throw Error("Maximum 10 KB");
                  const d = JSON.parse(await f.text());
                  if (
                    d.schemaVersion !== 1 ||
                    d.type !== "theme" ||
                    !/^#[0-9a-f]{6}$/i.test(d.accent)
                  )
                    throw Error("Invalid theme preset");
                  setPreview(d.accent);
                  setError("");
                } catch (e) {
                  setError(String(e));
                }
              }}
            />
          </label>
        </div>
        {error && (
          <p className="error-text" role="alert">
            {error}
          </p>
        )}
      </aside>
    </div>
  );
}
function TextEffect({
  text,
  effect,
  playing,
  duration,
  intensity,
  run,
}: {
  text: string;
  effect: number;
  playing: boolean;
  duration: number;
  intensity: number;
  run: number;
}) {
  const reduced = useReducedMotion(),
    [display, setDisplay] = useState(text);
  useEffect(() => {
    setDisplay(text);
    if (reduced || !playing || ![2, 3].includes(effect)) return;
    const graphemes = Array.from(
      new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(text),
      (s) => s.segment,
    );
    const start = performance.now();
    const timer = setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / (duration * 1000));
      const count = Math.floor(p * graphemes.length);
      setDisplay(
        graphemes
          .map((g, i) =>
            i < count ? g : effect === 3 ? "" : /\s/.test(g) ? g : "·",
          )
          .join(""),
      );
      if (p === 1) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [text, effect, playing, duration, run, reduced]);
  const start =
    effect === 0
      ? { filter: `blur(${intensity * 2}px)`, opacity: 0.2, y: 20 }
      : effect === 4
        ? {
            letterSpacing: /[\u0e00-\u0e7f]/.test(text)
              ? "0em"
              : `${intensity * 0.025}em`,
            opacity: Math.max(0.2, 0.85 - intensity * 0.08),
          }
        : effect === 1
          ? { color: "#9B43FF" }
          : effect === 5
            ? {
                textShadow: `${intensity}px 0 #43E6FF, -${intensity}px 0 #D847ED`,
              }
            : {};
  return (
    <motion.h2
      key={run + "-" + effect}
      className="text-effect"
      initial={playing && !reduced ? start : false}
      animate={
        playing
          ? {
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              letterSpacing: "0em",
              color: "#CCFF00",
              textShadow: "0px 0 transparent",
            }
          : start
      }
      transition={{ duration: reduced ? 0 : duration }}
    >
      {display}
      {effect === 3 && playing && <span className="type-caret">|</span>}
    </motion.h2>
  );
}
function MotionLab() {
  const s = useStore(),
    [category, setCategory] = useState("Kinetic Typography"),
    [text, setText] = useState("ARTYVERSE X"),
    [path, setPath] = useState(0),
    [speed, setSpeed] = useState(1),
    [size, setSize] = useState(32),
    [echo, setEcho] = useState(1),
    [color, setColor] = useState("#CCFF00"),
    [paused, setPaused] = useState(false),
    [effect, setEffect] = useState(0),
    [revealDirection, setRevealDirection] = useState("Bottom → Top"),
    [revealSoftness, setRevealSoftness] = useState(18),
    [duration, setDuration] = useState(1.5),
    [intensity, setIntensity] = useState(4),
    [run, setRun] = useState(0),
    [device, setDevice] = useState("Desktop"),
    [calm, setCalm] = useState(false),
    [controls, setControls] = useState(defaults),
    [geometry, setGeometry] = useState("Arc"),
    [presetName, setPresetName] = useState("My motion preset"),
    [error, setError] = useState(""),
    [imported, setImported] = useState<any>(null);
  const data = () => ({
    schemaVersion: 1,
    type: "motion",
    category,
    text,
    path,
    speed,
    size,
    echo,
    color,
    effect,
    revealDirection,
    revealSoftness,
    duration,
    intensity,
    controls,
    geometry,
    compatibleTargets:
      category === "Scene Transition"
        ? ["motion-preview", "story-scene"]
        : ["motion-preview"],
  });
  function apply(d: any) {
    setCategory(d.category);
    setText(d.text);
    setPath(d.path);
    setSpeed(d.speed);
    setSize(d.size);
    setEcho(d.echo);
    setColor(d.color);
    setEffect(d.effect);
    setRevealDirection(d.revealDirection || "Bottom → Top");
    setRevealSoftness(d.revealSoftness || 18);
    setDuration(d.duration);
    setIntensity(d.intensity);
    setControls(d.controls);
    setGeometry(d.geometry);
    setRun((r) => r + 1);
  }
  function validate(d: any) {
    if (
      d.schemaVersion !== 1 ||
      d.type !== "motion" ||
      !categories.includes(d.category) ||
      typeof d.text !== "string" ||
      d.text.length > 200 ||
      !Number.isInteger(d.path) ||
      d.path < 0 ||
      d.path > 15 ||
      !Number.isInteger(d.effect) ||
      d.effect < 0 ||
      d.effect > 6 ||
      !/^#[0-9a-f]{6}$/i.test(d.color) ||
      !["Arc", "Circular"].includes(d.geometry)
    )
      throw Error("Invalid preset identity");
    for (const [k, min, max] of [
      ["speed", 0.2, 3],
      ["size", 12, 72],
      ["echo", 1, 4],
      ["duration", 0.2, 5],
      ["intensity", 0, 10],
    ] as const)
      if (
        typeof d[k] !== "number" ||
        !Number.isFinite(d[k]) ||
        d[k] < min ||
        d[k] > max
      )
        throw Error("Invalid " + k);
    for (const [k, [min, max]] of Object.entries(ranges))
      if (
        typeof d.controls?.[k] !== "number" ||
        d.controls[k] < min ||
        d.controls[k] > max
      )
        throw Error("Invalid control " + k);
    if (
      d.revealDirection &&
      ![
        "Bottom → Top",
        "Top → Bottom",
        "Left → Right",
        "Right → Left",
      ].includes(d.revealDirection)
    )
      throw Error("Invalid reveal direction");
    if (
      d.revealSoftness !== undefined &&
      (typeof d.revealSoftness !== "number" ||
        d.revealSoftness < 1 ||
        d.revealSoftness > 40)
    )
      throw Error("Invalid mask softness");
    return d;
  }
  return (
    <div className="motion-lab">
      <div className="motion-categories">
        {categories.map((c, i) => (
          <button
            key={c}
            className={category === c ? "selected" : ""}
            onClick={() => setCategory(c)}
          >
            <span>0{i + 1}</span>
            {c}
          </button>
        ))}
      </div>
      <div className="motion-workspace">
        <div className="motion-top">
          <span className="eyebrow">
            LIVE PREVIEW / {category.toUpperCase()}
          </span>
          <select
            aria-label="Device preview"
            value={device}
            onChange={(e) => setDevice(e.target.value)}
          >
            {["Desktop", "Tablet", "Phone"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </div>
        <div
          className={
            "motion-stage " +
            (device === "Phone"
              ? "phone-preview"
              : device === "Tablet"
                ? "tablet-preview"
                : "")
          }
          style={{ "--duration": duration + "s" } as React.CSSProperties}
        >
          {category === "Kinetic Typography" ? (
            <Kinetic
              key={run}
              text={text}
              path={path}
              speed={speed}
              size={size}
              color={color}
              echo={echo}
              paused={paused}
              quality={calm ? "Calm" : s.motion}
            />
          ) : category === "Text Reveal" ? (
            effect === 6 ? (
              <ScrollReveal
                key={run}
                text={text}
                direction={revealDirection}
                softness={revealSoftness}
                calm={calm || s.motion === "Off"}
              />
            ) : (
              <TextEffect
                text={text}
                effect={effect}
                playing={!paused && !calm && s.motion !== "Off"}
                duration={duration}
                intensity={intensity}
                run={run}
              />
            )
          ) : category === "Spatial Carousel" ? (
            <Spatial key={run} controls={controls} geometry={geometry} />
          ) : category === "Cinematic Carousel" ? (
            <Cinematic
              key={run}
              paused={paused || calm || s.motion === "Off"}
            />
          ) : category === "Media Corridor" ? (
            <Corridor key={run} calm={calm || s.motion === "Off"} />
          ) : category === "SVG Motion" ? (
            <VectorMotion
              key={run}
              paused={paused || calm || s.motion === "Off"}
              speed={speed}
              color={color}
            />
          ) : category === "Card Interaction" ? (
            <motion.button
              className="motion-demo-card"
              whileHover={
                calm
                  ? {}
                  : { rotateX: -intensity, rotateY: intensity, scale: 1.03 }
              }
              whileTap={{ scale: 0.98 }}
              onClick={() => s.toast("Card selected")}
            >
              <span className="eyebrow">INTERACTION STUDY</span>
              <span className="accent">✳</span>
              <h2>A little perspective.</h2>
              <p>Hover, focus, or tap. An actual button with a clear action.</p>
            </motion.button>
          ) : (
            <motion.div
              key={run}
              className="motion-demo-card"
              initial={calm ? false : { opacity: 0, x: 50, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: calm ? 0 : duration }}
            >
              <span className="eyebrow">SCENE TRANSITION</span>
              <h2>{text}</h2>
              <Button onClick={() => setRun((r) => r + 1)}>Next scene →</Button>
            </motion.div>
          )}
        </div>
        <div className="playback-bar">
          <div className="button-row">
            {![
              "Spatial Carousel",
              "Media Corridor",
              "Card Interaction",
              "Scene Transition",
            ].includes(category) && (
              <Button onClick={() => setPaused(!paused)}>
                {paused ? <Play size={15} /> : <Pause size={15} />}
                {paused ? "Play" : "Pause"}
              </Button>
            )}
            <Button
              onClick={() => {
                setRun((r) => r + 1);
                setPaused(false);
              }}
            >
              <RotateCcw size={15} />
              Replay
            </Button>
            <Button
              onClick={() => {
                apply({
                  ...data(),
                  text: "ARTYVERSE X",
                  path: 0,
                  speed: 1,
                  size: 32,
                  echo: 1,
                  color: "#CCFF00",
                  effect: 0,
                  duration: 1.5,
                  intensity: 4,
                  controls: defaults,
                });
                setPaused(false);
              }}
            >
              Reset
            </Button>
          </div>
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={calm}
              onChange={(e) => setCalm(e.target.checked)}
            />
            Reduced motion preview
          </label>
        </div>
        <section className="preset-section">
          <span className="eyebrow">YOUR PRESETS / PREVIEW BEFORE APPLY</span>
          <div className="button-row">
            <input
              aria-label="Preset name"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
            />
            <Button
              onClick={async () => {
                try {
                  await s.create(
                    "preset",
                    presetName || "Motion preset",
                    data(),
                  );
                  s.toast("Preset saved — compatible with Motion Lab preview");
                } catch (e) {
                  setError(String(e));
                }
              }}
            >
              <Save size={15} />
              Save preset
            </Button>
            <Button
              title="Export preset"
              onClick={() =>
                download("motion-preset.json", JSON.stringify(data(), null, 2))
              }
            >
              <Download size={15} />
            </Button>
            <label className="button file-button">
              Import
              <input
                type="file"
                accept=".json"
                onChange={async (e) => {
                  try {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    if (f.size > 50000) throw Error("Maximum 50 KB");
                    setImported(validate(JSON.parse(await f.text())));
                    setError("");
                  } catch (e) {
                    setError(String(e));
                  }
                }}
              />
            </label>
          </div>
          <div className="preset-list">
            {s.items
              .filter((i) => i.kind === "preset" && !i.deletedAt)
              .map((i) => (
                <div key={i.id}>
                  <button
                    onClick={() => {
                      try {
                        apply(validate(i.data));
                      } catch (e) {
                        setError(String(e));
                      }
                    }}
                  >
                    {i.title}
                    <small>{i.data.category}</small>
                  </button>
                  <button
                    className="icon-button"
                    aria-label={"Duplicate " + i.title}
                    onClick={() =>
                      void s.create("preset", i.title + " copy", i.data)
                    }
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ))}
          </div>
          {error && (
            <p className="error-text" role="alert">
              {error}
            </p>
          )}
        </section>
      </div>
      <aside className="motion-inspector">
        <span className="eyebrow">CONTEXTUAL INSPECTOR</span>
        {category === "Kinetic Typography" ? (
          <>
            <label>
              Text
              <input
                aria-label="Kinetic text"
                maxLength={200}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
            <label>
              Geometry
              <select
                aria-label="Kinetic geometry"
                value={path}
                onChange={(e) => setPath(Number(e.target.value))}
              >
                {paths.map((p, i) => (
                  <option key={p} value={i}>
                    {String(i + 1).padStart(2, "0")} / {p}
                  </option>
                ))}
              </select>
            </label>
            <Range
              label="Speed"
              value={speed}
              min={0.2}
              max={3}
              step={0.1}
              unit="×"
              change={setSpeed}
            />
            <Range
              label="Font size"
              value={size}
              min={12}
              max={72}
              unit="px"
              change={setSize}
            />
            <Range
              label="Echo count"
              value={echo}
              min={1}
              max={4}
              change={setEcho}
            />
            <label>
              Color
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          </>
        ) : category === "Text Reveal" ? (
          <>
            <label>
              Text
              <textarea
                maxLength={200}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </label>
            <label>
              Effect
              <select
                value={effect}
                onChange={(e) => setEffect(Number(e.target.value))}
              >
                {effects.map((e, i) => (
                  <option key={e} value={i}>
                    {e}
                  </option>
                ))}
              </select>
            </label>
            {effect === 6 && (
              <>
                <label>
                  Reveal direction
                  <select
                    value={revealDirection}
                    onChange={(e) => setRevealDirection(e.target.value)}
                  >
                    {[
                      "Bottom → Top",
                      "Top → Bottom",
                      "Left → Right",
                      "Right → Left",
                    ].map((d) => (
                      <option key={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <Range
                  label="Mask softness"
                  min={1}
                  max={40}
                  value={revealSoftness}
                  unit="%"
                  change={setRevealSoftness}
                />
              </>
            )}
            {effect !== 6 && (
              <>
                <Range
                  label="Duration"
                  value={duration}
                  min={0.2}
                  max={5}
                  step={0.1}
                  unit="s"
                  change={setDuration}
                />
                {[0, 4, 5].includes(effect) && (
                  <Range
                    label="Intensity"
                    value={intensity}
                    min={0}
                    max={10}
                    change={setIntensity}
                  />
                )}
              </>
            )}
            <p className="muted">
              Scramble and typewriter segment text by grapheme. Motion is a
              presentation effect, not AI streaming.
            </p>
          </>
        ) : category === "Spatial Carousel" ? (
          <>
            <label>
              Geometry
              <select
                value={geometry}
                onChange={(e) => setGeometry(e.target.value)}
              >
                <option>Arc</option>
                <option>Circular</option>
              </select>
            </label>
            {Object.entries(controls).map(([key, v]) => (
              <Range
                key={key}
                label={key}
                value={v}
                min={ranges[key][0]}
                max={ranges[key][1]}
                step={ranges[key][2]}
                unit={ranges[key][3]}
                change={(n) => setControls((c) => ({ ...c, [key]: n }))}
              />
            ))}
          </>
        ) : category === "SVG Motion" ? (
          <>
            <Range
              label="Speed"
              value={speed}
              min={0.2}
              max={3}
              step={0.1}
              unit="×"
              change={setSpeed}
            />
            <label>
              Stroke color
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </label>
          </>
        ) : (
          <>
            <p className="muted">
              Use the stage controls to navigate this {category.toLowerCase()}{" "}
              study.
            </p>
            {category === "Scene Transition" && (
              <Range
                label="Duration"
                value={duration}
                min={0.2}
                max={5}
                step={0.1}
                unit="s"
                change={setDuration}
              />
            )}
            {category === "Card Interaction" && (
              <Range
                label="Tilt intensity"
                value={intensity}
                min={0}
                max={10}
                unit="deg"
                change={setIntensity}
              />
            )}
          </>
        )}
        <div className="integration-note">
          Target compatibility: Motion Lab previews. Applying these settings to
          document scenes is not yet available.
        </div>
      </aside>
      {imported && (
        <Modal
          title="Preview imported preset"
          onClose={() => setImported(null)}
        >
          <p>
            {imported.category} · {imported.text}
          </p>
          <p>Validated data only. No imported code is executed.</p>
          <Button
            variant="primary"
            onClick={() => {
              apply(imported);
              setImported(null);
            }}
          >
            Apply to preview
          </Button>
        </Modal>
      )}
    </div>
  );
}
function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  change,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  change: (n: number) => void;
}) {
  return (
    <label className="range-control">
      <span>
        {label}
        <output>
          {Number(value.toFixed(2))} {unit}
        </output>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => change(Number(e.target.value))}
      />
    </label>
  );
}
function Spatial({
  controls: c,
  geometry,
}: {
  controls: typeof defaults;
  geometry: string;
}) {
  const [index, setIndex] = useState(2),
    [detail, setDetail] = useState<number | null>(null),
    start = useRef({ x: 0, time: 0 }),
    [width, setWidth] = useState(600),
    ref = useRef<HTMLDivElement>(null);
  const labels = [
    "A new perspective",
    "The space between",
    "A little wonder",
    "Quiet confidence",
    "Into the unknown",
  ];
  useEffect(() => {
    if (!ref.current) return;
    const o = new ResizeObserver((e) => setWidth(e[0].contentRect.width));
    o.observe(ref.current);
    return () => o.disconnect();
  }, []);
  function next(n: number) {
    setIndex(Math.max(0, Math.min(4, n)));
  }
  return (
    <div className="spatial-wrap" ref={ref}>
      <div
        className="spatial-stage"
        tabIndex={0}
        role="region"
        aria-label="Spatial carousel. Arrow keys navigate. Home and End jump."
        style={{ perspective: c.perspective }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next(index + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            next(index - 1);
          }
          if (e.key === "Home") {
            e.preventDefault();
            next(0);
          }
          if (e.key === "End") {
            e.preventDefault();
            next(4);
          }
        }}
        onPointerDown={(e) => {
          start.current = { x: e.clientX, time: performance.now() };
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={(e) => {
          const dx = e.clientX - start.current.x,
            velocity = dx / Math.max(1, performance.now() - start.current.time);
          if (Math.abs(dx) + Math.abs(velocity) * c.momentum * 100 > 40)
            next(index + (dx < 0 ? 1 : -1));
        }}
      >
        {labels.map((title, i) => {
          const d = i - index,
            angle = (((d * c.arc) / 4) * Math.PI) / 180,
            cw = Math.min(c.cardWidth, width * 0.6),
            x =
              geometry === "Circular"
                ? Math.sin(angle) * c.radius
                : d * Math.min(cw * 0.7, c.radius * 0.45),
            z =
              geometry === "Circular"
                ? (Math.cos(angle) - 1) * c.radius
                : -Math.abs(d) * c.depth;
          return (
            <div
              className={"spatial-card spatial-color-" + i}
              key={title}
              aria-hidden={i !== index}
              style={{
                width: cw,
                height: Math.min(c.cardHeight, 330),
                borderRadius: c.corner,
                transform: `translate(-50%,-50%) translateX(${x}px) translateZ(${z}px) rotateY(${-d * c.curve}deg) rotateZ(${(d * c.tilt) / 5}deg) scale(${d === 0 ? c.focusScale : 1})`,
                opacity: d === 0 ? 1 : c.opacity,
                filter: d === 0 ? "none" : `blur(${c.blur}px)`,
                zIndex: 10 - Math.abs(d),
                transitionDuration: 0.4 / c.speed + "s",
              }}
            >
              <span className="eyebrow">SCENE / 0{i + 1}</span>
              <span className="spatial-shape">✳</span>
              <h3>{title}</h3>
              {i === index && (
                <Button onClick={() => setDetail(i)}>Open scene ↗</Button>
              )}
            </div>
          );
        })}
      </div>
      <div className="carousel-controls">
        <button
          className="icon-button"
          aria-label="Previous card"
          disabled={index === 0}
          onClick={() => next(index - 1)}
        >
          <ChevronLeft />
        </button>
        <span>{index + 1} / 5</span>
        <button
          className="icon-button"
          aria-label="Next card"
          disabled={index === 4}
          onClick={() => next(index + 1)}
        >
          <ChevronRight />
        </button>
      </div>
      {detail !== null && (
        <Modal title={labels[detail]} onClose={() => setDetail(null)}>
          <p>
            Labeled sample scene {detail + 1}. This carousel is an interactive
            motion study.
          </p>
        </Modal>
      )}
    </div>
  );
}
function Cinematic({ paused }: { paused: boolean }) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0),
    [auto, setAuto] = useState(false);
  useEffect(() => {
    if (!auto || paused || reduced) return;
    const t = setInterval(() => setI((x) => (x + 1) % 3), 5000);
    return () => clearInterval(t);
  }, [auto, paused, reduced]);
  return (
    <div className={"cinematic scene-" + i}>
      <span className="eyebrow">ART DIRECTION / SAMPLE SCENE 0{i + 1}</span>
      <div className="cinematic-orb" />
      <h2>
        {
          [
            "Intelligence,\nin motion.",
            "Give your ideas\nsome space.",
            "A new world\nstarts with you.",
          ][i]
        }
      </h2>
      <p>
        {
          [
            "A little spark. An entire universe of possibilities.",
            "Less noise. More room for what matters.",
            "Make something that only you could make.",
          ][i]
        }
      </p>
      <div className="carousel-controls">
        <Button disabled={i === 0} onClick={() => setI(i - 1)}>
          ←
        </Button>
        <span>{i + 1} / 3</span>
        <Button disabled={i === 2} onClick={() => setI(i + 1)}>
          →
        </Button>
        <Button onClick={() => setAuto(!auto)}>
          {auto ? "Stop autoplay" : "Enable autoplay"}
        </Button>
      </div>
    </div>
  );
}
function Corridor({ calm }: { calm: boolean }) {
  const [progress, setProgress] = useState(0),
    ref = useRef<HTMLDivElement>(null);
  return (
    <div
      className="corridor"
      ref={ref}
      onScroll={(e) => {
        const el = e.currentTarget;
        setProgress(
          el.scrollTop / Math.max(1, el.scrollHeight - el.clientHeight),
        );
      }}
    >
      <div className="corridor-status">
        SCROLL TO EXPLORE / {Math.round(progress * 100)}%
        <button
          onClick={() =>
            ref.current?.scrollTo({
              top: ref.current.scrollHeight,
              behavior: calm ? "instant" : "smooth",
            })
          }
        >
          Skip to end ↓
        </button>
      </div>
      <div className="corridor-track">
        {[
          "Enter the possibilities.",
          "Walk through your ideas.",
          "Make room for the big picture.",
        ].map((x, i) => (
          <section
            key={x}
            className={"corridor-scene scene-" + i}
            style={
              calm
                ? {}
                : { transform: `perspective(800px) rotateY(${(i - 1) * 5}deg)` }
            }
          >
            <span className="eyebrow">SAMPLE SCENE / 0{i + 1}</span>
            <div className="cinematic-orb" />
            <h2>{x}</h2>
            <p>
              Native scrolling. No scroll trap. Every scene stays accessible.
            </p>
          </section>
        ))}
      </div>
    </div>
  );
}
function VectorMotion({
  paused,
  speed,
  color,
}: {
  paused: boolean;
  speed: number;
  color: string;
}) {
  return (
    <svg
      className="vector-demo"
      viewBox="0 0 600 400"
      role="img"
      aria-label="Animated orbital vector"
    >
      <g
        style={{
          transformOrigin: "300px 200px",
          animation: `orbit-spin ${20 / speed}s linear infinite`,
          animationPlayState: paused ? "paused" : "running",
        }}
      >
        <ellipse
          cx="300"
          cy="200"
          rx="220"
          ry="80"
          stroke={color}
          fill="none"
        />
        <ellipse
          cx="300"
          cy="200"
          rx="220"
          ry="80"
          transform="rotate(60 300 200)"
          stroke={color}
          opacity=".4"
          fill="none"
        />
        <ellipse
          cx="300"
          cy="200"
          rx="220"
          ry="80"
          transform="rotate(120 300 200)"
          stroke={color}
          opacity=".2"
          fill="none"
        />
        <circle cx="520" cy="200" r="9" fill={color} />
      </g>
      <text x="300" y="216" textAnchor="middle" fill={color} fontSize="54">
        ✳
      </text>
    </svg>
  );
}
const registry = [
  ["Shell", "Global navigation, active routes, responsive drawer"],
  ["Composer", "Multiline, IME safe submission, draft persistence"],
  ["Button", "Primary / secondary / danger / disabled / focus"],
  ["Dialog", "Native modal, Escape, focus restoration"],
  ["Search", "Live query, saved-work results"],
  ["PortalCard", "Six workspace families"],
  ["ArtifactCard", "Editable sample template preview"],
  ["EditorialNote", "Sources, tags, selection transfer"],
  ["MediaFrame", "Recording playback and downloads"],
  ["WorkflowNode", "Validation, connections, output"],
  ["ControlSurface", "Settings and contextual inspector"],
  ["Canvas", "Selection, drag, resize, keyboard, history"],
  ["KineticStage", "16 geometries, DPR budget, offscreen pause"],
  ["SpatialCarousel", "Arc / circular, swipe, keyboard, 14 controls"],
  ["Notification", "Live-region feedback and dismissal"],
];
function Registry() {
  const [q, setQ] = useState(""),
    [count, setCount] = useState(0);
  return (
    <div>
      <div className="filter-bar">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder="Search implemented component families…"
        />
        <span className="muted">
          {registry.length} families listed here · source inventory 151 names ≠
          verified components
        </span>
      </div>
      <div className="registry-grid">
        {registry
          .filter((r) => r.join(" ").toLowerCase().includes(q.toLowerCase()))
          .map(([name, purpose]) => (
            <article className="control-surface" key={name}>
              <span className="eyebrow">IMPLEMENTED / FAMILY</span>
              <h2>{name}</h2>
              <p>{purpose}</p>
              <small>
                Implementation: src/components, src/pages · verification
                evidence in report.
              </small>
              {name === "Button" && (
                <div className="button-row">
                  <Button variant="primary" onClick={() => setCount(count + 1)}>
                    Pressed {count} times
                  </Button>
                  <Button disabled>Disabled</Button>
                </div>
              )}
            </article>
          ))}
      </div>
    </div>
  );
}
function VirtualFiles() {
  const [file, setFile] = useState("tokens.json"),
    [content, setContent] = useState(
      () =>
        localStorage.getItem("av-virtual-file") ||
        JSON.stringify(theme, null, 2),
    ),
    [proposed, setProposed] = useState(""),
    [checkpoint, setCheckpoint] = useState(""),
    [review, setReview] = useState(false),
    [error, setError] = useState("");
  function preview() {
    try {
      if (!/^[a-z0-9_-]+\.json$/i.test(file))
        throw Error("Use a simple relative JSON filename");
      if (proposed.length > 100000) throw Error("Maximum 100 KB");
      JSON.parse(proposed);
      setReview(true);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <div className="control-surface">
      <span className="eyebrow">
        BROWSER-LOCAL VIRTUAL FILE / NO CODE EXECUTION
      </span>
      <h2>Review a change before it becomes your draft.</h2>
      <label>
        Virtual filename
        <input value={file} onChange={(e) => setFile(e.target.value)} />
      </label>
      <div className="two-col">
        <label>
          Current content
          <textarea rows={15} readOnly value={content} />
        </label>
        <label>
          Proposed replacement
          <textarea
            rows={15}
            value={proposed}
            onChange={(e) => setProposed(e.target.value)}
          />
        </label>
      </div>
      <div className="button-row">
        <Button onClick={preview}>Validate & review diff</Button>
        <Button
          disabled={!checkpoint}
          onClick={() => {
            setContent(checkpoint);
            localStorage.setItem("av-virtual-file", checkpoint);
            setCheckpoint("");
          }}
        >
          Restore checkpoint
        </Button>
        <Button onClick={() => download(file, content)}>
          Export virtual file
        </Button>
      </div>
      {error && (
        <p className="error-text" role="alert">
          {error}
        </p>
      )}
      {review && (
        <Modal wide title="Review replacement" onClose={() => setReview(false)}>
          <p>
            This replaces the whole virtual JSON file. It does not modify
            repository files or apply design tokens.
          </p>
          <div className="two-col">
            <pre className="diff-before">{content}</pre>
            <pre className="diff-after">{proposed}</pre>
          </div>
          <Button
            variant="primary"
            onClick={() => {
              setCheckpoint(content);
              setContent(proposed);
              localStorage.setItem("av-virtual-file", proposed);
              setReview(false);
            }}
          >
            Apply selected file & checkpoint
          </Button>
        </Modal>
      )}
    </div>
  );
}
