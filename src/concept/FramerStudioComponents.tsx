import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, LayoutGroup, useInView } from "motion/react";
import {
  Monitor,
  Tablet,
  Smartphone,
  ArrowUpRight,
  ArrowRight,
  Play,
  Download,
  Code2,
  FileCode2,
  Layers,
  Check,
  ChevronRight,
  ChevronDown,
  ShoppingBag,
  Plus,
  Minus,
  RotateCcw,
  Undo2,
  Mic,
  MicOff,
  Sparkles,
  ShieldCheck,
  Copy,
  SlidersHorizontal,
  ExternalLink,
  CheckCircle2,
  Folder,
  Palette,
  X,
} from "lucide-react";
import {
  KitSwitch,
  KitTabs,
  KitTabsList,
  KitTabsTrigger,
  KitTabsContent,
} from "../components/kit/primitives";
import { usePreviewMotion } from "../components/kit/motion";
import { Modal } from "../components/UI";
import { useStore, useDraft, request, download } from "../core/store";
import { useSpectrum, type SpectrumMouth } from "../core/useSpectrum";
import { conceptMotion, conceptPalette } from "../../shared/concept";
import {
  storefrontSchema,
  storefrontDraftSchema,
  storefrontPresets,
  storefrontColors,
  storefrontCSS,
  sampleProducts,
  productCategories,
  productShapes,
  createStorefrontCode,
  type StorefrontConfig,
  type SampleProduct,
} from "../../shared/storefront";
import { exportCode } from "../v2/sandbox";
export const framerSpringTactile = conceptMotion.spring;
export const framerSmoothEase = conceptMotion.smooth;
export const containerStaggerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: conceptMotion.stagger, delayChildren: 0.05 },
  },
};
const staticVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0 } },
};
export const itemFadeUpVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: framerSpringTactile },
};
function Action({
  children,
  onClick,
  variant = "",
  disabled = false,
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  type?: "button" | "submit";
}) {
  const enabled = usePreviewMotion();
  return (
    <motion.button
      type={type}
      className={"ax-action " + variant}
      onClick={onClick}
      disabled={disabled}
      whileHover={enabled && !disabled ? { y: -2 } : undefined}
      whileTap={enabled && !disabled ? { y: 1, scale: 0.98 } : undefined}
      transition={framerSpringTactile}
    >
      {children}
    </motion.button>
  );
}
export function ProductArt({
  product,
}: {
  product: Pick<SampleProduct, "art">;
}) {
  return (
    <svg
      viewBox="0 0 300 300"
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: productShapes(product.art) }}
    />
  );
}
function SampleStorefront({
  config,
  onInfo,
}: {
  config: StorefrontConfig;
  onInfo: (s: string) => void;
}) {
  const [category, setCategory] = useState<string>("ทั้งหมด"),
    [detail, setDetail] = useState<SampleProduct | null>(null),
    [bag, setBag] = useState<Record<string, number>>({}),
    [showBag, setShowBag] = useState(false),
    collection = useRef<HTMLElement>(null);
  const products = sampleProducts.filter(
      (p) => category === "ทั้งหมด" || p.category === category,
    ),
    total = Object.values(bag).reduce((n, x) => n + x, 0),
    calm = !usePreviewMotion();
  return (
    <>
      <style>{storefrontCSS}</style>
      <div
        className="sf-store"
        data-accent={config.accent}
        aria-label="Local sample storefront"
      >
        {config.showBanner && (
          <div className="sf-announcement">{config.banner}</div>
        )}
        <header className="sf-shop-header">
          <strong>{config.brand || "YOUR BRAND"}</strong>
          <span>Objects. Stories. A different perspective.</span>
          <button
            onClick={() => setShowBag(true)}
            aria-label={"Sample bag, " + total + " items"}
          >
            <ShoppingBag size={15} />
            <span>Sample bag · {total}</span>
          </button>
        </header>
        <section className="sf-hero">
          <div className="sf-hero-copy">
            <span className="sf-overline">THE CONSIDERED COLLECTION</span>
            <h2 className="sf-headline">
              <span>{config.headline || "Your headline"}</span>
              <em>{config.highlight || "Your emphasis."}</em>
            </h2>
            <p>{config.description}</p>
            <button
              className="sf-shop-now"
              onClick={() =>
                collection.current?.scrollIntoView({
                  behavior: calm ? "auto" : "smooth",
                  block: "nearest",
                })
              }
            >
              สำรวจคอลเลกชัน{" "}
              <span>
                <ArrowUpRight size={15} />
              </span>
            </button>
          </div>
          <div className="sf-hero-art">
            <ProductArt product={{ art: "lamp" }} />
            <span>
              01 / ORBIT SERIES
              <br />
              DESIGN STUDY
            </span>
          </div>
        </section>
        <section className="sf-collection" ref={collection}>
          <div className="sf-collection-heading">
            <h2>
              Everyday, <strong>reimagined.</strong>
            </h2>
            <span>{products.length} objects · sample collection</span>
          </div>
          <div
            className="sf-categories"
            role="group"
            aria-label="Product categories"
          >
            {productCategories.map((cat) => (
              <button
                key={cat}
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="sf-product-grid">
            {products.map((product, i) => (
              <button
                className="sf-product"
                key={product.id}
                onClick={() => setDetail(product)}
              >
                <div
                  className="sf-product-art"
                  style={{ background: `var(--sf-${product.color})` }}
                >
                  <span className="sf-product-number">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <ProductArt product={product} />
                </div>
                <div className="sf-product-meta">
                  <strong>{product.name}</strong>
                  <span>
                    <ArrowUpRight size={15} />
                  </span>
                </div>
                <small>
                  ราคาตัวอย่าง ฿{product.price.toLocaleString("th-TH")}
                </small>
              </button>
            ))}
          </div>
        </section>
        <footer className="sf-sample-disclosure">
          ตัวอย่างหน้าร้าน · สินค้าและราคาเป็นข้อมูลสาธิต
          ไม่มีการชำระเงินหรือส่งคำสั่งซื้อ
        </footer>
      </div>
      {detail && (
        <Modal title={detail.name} onClose={() => setDetail(null)}>
          <div className="ax-product-detail">
            <div
              className="sf-store"
              style={{ background: `var(--sf-${detail.color})` }}
            >
              <ProductArt product={detail} />
            </div>
            <span className="cp-tag">SAMPLE PRODUCT / {detail.category}</span>
            <p>{detail.caption}</p>
            <strong>
              ราคาตัวอย่าง ฿{detail.price.toLocaleString("th-TH")}
            </strong>
            <Action
              variant="lime"
              onClick={() => {
                setBag((old) => ({
                  ...old,
                  [detail.id]: Math.min(99, (old[detail.id] || 0) + 1),
                }));
                onInfo("เพิ่มในถุงตัวอย่างแล้ว ไม่มีคำสั่งซื้อถูกส่ง");
              }}
            >
              <Plus size={16} />
              เพิ่มในถุงตัวอย่าง
            </Action>
            <p className="ax-fine">
              ข้อมูลสาธิตสำหรับประเมิน UI เท่านั้น ไม่ใช่สินค้าที่เปิดขาย
            </p>
          </div>
        </Modal>
      )}
      {showBag && (
        <Modal
          title={"Sample bag · " + total + " items"}
          onClose={() => setShowBag(false)}
        >
          <div className="ax-bag">
            {total === 0 ? (
              <p>
                ยังไม่มีสินค้าที่เลือก
                ลองเปิดรายละเอียดสินค้าเพื่อเพิ่มในถุงตัวอย่าง
              </p>
            ) : (
              sampleProducts
                .filter((p) => bag[p.id])
                .map((p) => (
                  <div key={p.id}>
                    <div>
                      <strong>{p.name}</strong>
                      <small>จำนวนที่เลือก {bag[p.id]}</small>
                    </div>
                    <button
                      aria-label={"Remove " + p.name}
                      onClick={() =>
                        setBag((old) => {
                          const next = { ...old };
                          delete next[p.id];
                          return next;
                        })
                      }
                    >
                      <X size={17} />
                    </button>
                  </div>
                ))
            )}
            <p className="ax-fine">
              ถุงนี้เก็บเฉพาะการเลือกใน preview ไม่ใช่คำสั่งซื้อ
              ไม่มีระบบชำระเงิน
            </p>
            <Action disabled={!total} onClick={() => setBag({})}>
              <RotateCcw size={15} />
              ล้างการเลือก
            </Action>
          </div>
        </Modal>
      )}
    </>
  );
}
export function FramerMascotRig({
  state = "Idle",
  visemeId = "viseme_sil",
  size = 100,
  paused = false,
}: {
  state?:
    "Idle" | "Listening" | "Thinking" | "Explaining" | "Success" | "Error";
  visemeId?: SpectrumMouth;
  size?: number;
  paused?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null),
    inView = useInView(ref, { amount: 0.1 }),
    enabled = usePreviewMotion() && inView && !paused,
    id = useId().replace(/:/g, "");
  const hue =
    state === "Listening"
      ? "var(--cp-cyan)"
      : state === "Thinking"
        ? "var(--cp-violet)"
        : state === "Success"
          ? "var(--cp-lime)"
          : state === "Error"
            ? "var(--cp-pink)"
            : "var(--cp-pink)";
  return (
    <div
      ref={ref}
      className="ax-mascot-rig"
      data-motion={enabled ? "full" : "off"}
      style={{ width: size, height: size }}
    >
      <motion.div
        aria-hidden="true"
        className="ax-rig-aura"
        style={{ background: hue }}
        animate={
          enabled
            ? { scale: [1, 1.12, 1], opacity: [0.1, 0.24, 0.1] }
            : { scale: 1, opacity: 0.1 }
        }
        transition={
          enabled
            ? { repeat: Infinity, duration: state === "Thinking" ? 2 : 4 }
            : { duration: 0 }
        }
      />
      <motion.svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={"Secondary mascot rig / " + state + " / " + visemeId}
        animate={
          enabled
            ? { y: [0, -3, 0], rotate: state === "Listening" ? [0, 2, 0] : 0 }
            : { y: 0, rotate: 0 }
        }
        transition={
          enabled
            ? { repeat: Infinity, duration: 4, ease: "easeInOut" }
            : { duration: 0 }
        }
      >
        <defs>
          <linearGradient id={id}>
            <stop stopColor="var(--cp-raised)" />
            <stop offset="1" stopColor="var(--cp-night)" />
          </linearGradient>
        </defs>
        <rect
          x="14"
          y="15"
          width="72"
          height="72"
          rx="25"
          fill={`url(#${id})`}
          stroke={hue}
          strokeWidth="2"
        />
        <rect
          x="21"
          y="25"
          width="58"
          height="50"
          rx="17"
          fill="var(--cp-night)"
        />
        <rect x="7" y="42" width="7" height="17" rx="3" fill="var(--cp-pink)" />
        <rect
          x="86"
          y="42"
          width="7"
          height="17"
          rx="3"
          fill="var(--cp-lime)"
        />
        <g fill={state === "Listening" ? "var(--cp-cyan)" : "var(--cp-lime)"}>
          <rect x="32" y="38" width="8" height="12" rx="4" />
          <rect x="60" y="38" width="8" height="12" rx="4" />
        </g>
        <motion.path
          d={
            visemeId === "viseme_aa"
              ? "M39 55Q50 72 61 55Z"
              : visemeId === "viseme_E"
                ? "M37 56Q50 65 63 56Z"
                : visemeId === "viseme_FF"
                  ? "M40 56H60V60H40Z"
                  : "M42 56Q50 62 58 56"
          }
          fill={visemeId === "viseme_sil" ? "none" : "var(--cp-pink)"}
          stroke="var(--cp-nightText)"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </motion.svg>
    </div>
  );
}
export function FramerComponentSuite({
  onInfo,
  workState = "Idle",
}: {
  onInfo: (s: string) => void;
  workState?: "Idle" | "Thinking" | "Success";
}) {
  const enabled = usePreviewMotion(),
    [motionOn, setMotionOn] = useState(true),
    [glow, setGlow] = useState(false),
    [count, setCount] = useState(0),
    [copied, setCopied] = useState(false),
    [permission, setPermission] = useState(false),
    audio = useSpectrum(),
    timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timeout.current), []);
  async function copy() {
    try {
      if (!navigator.clipboard) throw Error("Clipboard unavailable");
      await navigator.clipboard.writeText(
        JSON.stringify(
          { palette: conceptPalette, motion: conceptMotion },
          null,
          2,
        ),
      );
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      onInfo(String(e) + " — ใช้ Export tokens แทนได้");
    }
  }
  return (
    <section className="ax-component-suite" aria-labelledby="ax-suite-title">
      <div className="ax-suite-heading">
        <span className="cp-kicker">LIVE COMPONENT SYSTEM / REAL CONTROLS</span>
        <h2 id="ax-suite-title">
          Make it <span className="ax-marker">feel alive.</span>
        </h2>
        <p>น้ำหนักตัวอักษร สี และจังหวะการเคลื่อนไหวที่มีหน้าที่</p>
      </div>
      <motion.div
        className="ax-suite-grid"
        variants={enabled ? containerStaggerVariants : staticVariants}
        animate={enabled ? undefined : "visible"}
        initial={enabled ? "hidden" : false}
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.article
          variants={enabled ? itemFadeUpVariants : staticVariants}
          className="ax-component-card"
        >
          <div className="ax-card-top">
            <span>01 / TACTILE CONTROLS</span>
            <SlidersHorizontal size={17} />
          </div>
          <div className={"ax-button-specimen " + (glow ? "is-glowing" : "")}>
            <motion.button
              className="ax-action lime"
              whileHover={enabled && motionOn ? { y: -3 } : undefined}
              whileTap={enabled && motionOn ? { scale: 0.96, y: 1 } : undefined}
              transition={framerSpringTactile}
              onClick={() => setCount((n) => n + 1)}
            >
              ลอง interaction <ArrowUpRight size={17} />
            </motion.button>
            <Action variant="pink" onClick={() => void copy()}>
              {copied ? <Check size={16} /> : <Copy size={16} />}Copy tokens
            </Action>
          </div>
          <div className="ax-switch-row">
            <label htmlFor="ax-motion-toggle">
              Motion preview
              <small>
                {enabled
                  ? "เคลื่อนไหวเมื่อกดและโต้ตอบ"
                  : "OS/quality setting จำกัด motion อยู่"}
              </small>
            </label>
            <KitSwitch
              id="ax-motion-toggle"
              checked={motionOn}
              onCheckedChange={setMotionOn}
            />
          </div>
          <div className="ax-switch-row">
            <label htmlFor="ax-glow-toggle">
              Accent glow<small>ใช้เฉพาะจุดเด่นของตัวอย่างนี้</small>
            </label>
            <KitSwitch
              id="ax-glow-toggle"
              checked={glow}
              onCheckedChange={setGlow}
            />
          </div>
          <p className="ax-fine" role="status">
            กดปุ่มตัวอย่างแล้ว {count} ครั้ง · ข้อมูลเฉพาะใน preview
          </p>
        </motion.article>
        <motion.article
          variants={enabled ? itemFadeUpVariants : staticVariants}
          className="ax-component-card ax-type-specimen"
        >
          <div className="ax-card-top">
            <span>02 / TYPE & EMPHASIS</span>
            <Palette size={17} />
          </div>
          <h3>
            <strong>Bold ideas.</strong>
            <br />
            <span className="ax-editorial-underline">Clear expression.</span>
            <br />
            <span className="ax-marker">Make it yours.</span>
          </h3>
          <p>
            ใช้ตัวหนาสำหรับลำดับสายตา เส้นเน้นสำหรับคำสำคัญ
            และบล็อกสีเพื่อสร้างจุดเด่นที่พอดี
          </p>
          <div className="ax-palette">
            {(["lime", "pink", "violet", "cyan"] as const).map((color) => (
              <button
                key={color}
                aria-label={"Copy " + color + " token"}
                onClick={() => {
                  if (!navigator.clipboard) {
                    onInfo("Clipboard unavailable — ใช้ Export tokens แทนได้");
                    return;
                  }
                  void navigator.clipboard
                    .writeText(conceptPalette[color])
                    .then(() =>
                      onInfo(color + " " + conceptPalette[color] + " copied"),
                    )
                    .catch(() => onInfo("Clipboard unavailable"));
                }}
              >
                <i style={{ background: conceptPalette[color] }} />
                <span>{color}</span>
              </button>
            ))}
          </div>
          <Action
            onClick={() =>
              download(
                "artyverse-concept-tokens.json",
                JSON.stringify(
                  {
                    schemaVersion: 1,
                    palette: conceptPalette,
                    motion: conceptMotion,
                  },
                  null,
                  2,
                ),
              )
            }
          >
            <Download size={15} />
            Export tokens
          </Action>
        </motion.article>
        <motion.article
          variants={enabled ? itemFadeUpVariants : staticVariants}
          className="ax-component-card ax-rig-card"
        >
          <div className="ax-card-top">
            <span>03 / LIVING SVG RIG</span>
            <Mic size={17} />
          </div>
          <div className="ax-rig-stage">
            <FramerMascotRig
              state={
                audio.state === "active"
                  ? "Listening"
                  : audio.state === "error"
                    ? "Error"
                    : workState
              }
              visemeId={audio.viseme}
              size={135}
              paused={!motionOn}
            />
            <span>
              {audio.state === "active"
                ? "MICROPHONE ACTIVE"
                : audio.state === "permission"
                  ? "WAITING FOR PERMISSION"
                  : "MICROPHONE OFF"}
            </span>
          </div>
          <div
            className="ax-input-level"
            role="meter"
            aria-label="Actual microphone level"
            aria-valuemin={0}
            aria-valuemax={1}
            aria-valuenow={audio.amount}
          >
            <motion.i
              style={{ scaleX: audio.level, transformOrigin: "left" }}
            />
          </div>
          {audio.state === "active" ? (
            <Action variant="pink" onClick={audio.stop}>
              <MicOff size={16} />
              หยุดไมโครโฟน
            </Action>
          ) : (
            <Action
              disabled={audio.state === "permission"}
              onClick={() => setPermission(true)}
            >
              <Mic size={16} />
              ทดสอบเสียงจริง
            </Action>
          )}
          <p className="ax-fine">
            FFT 256 · energy-band estimate ไม่ใช่การรู้จำ phoneme หรือถอดเสียง{" "}
            {audio.sampleRate > 0 &&
              `· ${audio.sampleRate.toLocaleString()} Hz`}
          </p>
          {audio.error && (
            <p className="ax-inline-error" role="alert">
              {audio.error}
            </p>
          )}
        </motion.article>
      </motion.div>
      {permission && (
        <Modal
          title="เปิดไมโครโฟนเพื่อทดสอบ SVG rig"
          onClose={() => setPermission(false)}
        >
          <p>
            เสียงใช้แสดงระดับและประมาณรูปปากเฉพาะในเบราว์เซอร์ ไม่บันทึก
            ไม่ส่งเสียงไปบริการภายนอก และไม่มีการถอดเสียง
            ไมโครโฟนจะหยุดเมื่อออกจากหน้านี้หรือซ่อนแท็บ
          </p>
          <div className="ax-modal-actions">
            <Action onClick={() => setPermission(false)}>ยกเลิก</Action>
            <Action
              variant="lime"
              onClick={() => {
                setPermission(false);
                void audio.start();
              }}
            >
              เปิดไมโครโฟน
            </Action>
          </div>
        </Modal>
      )}
    </section>
  );
}
export function FramerStudioBuilder({
  onInfo,
}: {
  onInfo: (s: string) => void;
}) {
  const s = useStore(),
    enabled = usePreviewMotion(),
    group = useId(),
    viewportGroup = useId(),
    [config, setConfig] = useDraft<StorefrontConfig>(
      "concept:storefront-config",
      storefrontPresets.editorial,
      (value) => storefrontDraftSchema.safeParse(value).success,
    ),
    [tab, setTab] = useState("preview"),
    [viewport, setViewport] = useState<"desktop" | "tablet" | "mobile">(
      "desktop",
    ),
    [width, setWidth] = useState(0),
    [preset, setPreset] = useState<string | null>(null),
    [brief, setBrief] = useDraft("concept:builder-brief", ""),
    [briefResult, setBriefResult] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [saving, setSaving] = useState(false),
    [, updateUndo] = useState(0);
  const canvas = useRef<HTMLDivElement>(null),
    history = useRef<StorefrontConfig[]>([]),
    valueRef = useRef(config);
  valueRef.current = config;
  useEffect(() => {
    if (!canvas.current) return;
    const ro = new ResizeObserver(
      ([entry]) =>
        entry.contentRect.width > 0 &&
        setWidth(Math.floor(entry.contentRect.width)),
    );
    ro.observe(canvas.current);
    return () => ro.disconnect();
  }, []);
  const parsed = storefrontSchema.safeParse(config),
    valid = parsed.success,
    code = useMemo(
      () => (valid ? createStorefrontCode(config) : null),
      [config, valid],
    ),
    target = viewport === "desktop" ? width : viewport === "tablet" ? 768 : 390,
    effective = Math.min(target, width);
  function change(next: StorefrontConfig) {
    history.current = [
      ...history.current.slice(-39),
      structuredClone(valueRef.current),
    ];
    valueRef.current = next;
    setConfig(next);
    updateUndo((n) => n + 1);
  }
  function undo() {
    const prior = history.current.pop();
    if (prior) {
      valueRef.current = prior;
      setConfig(prior);
      updateUndo((n) => n + 1);
    }
  }
  async function formatBrief() {
    if (!brief.trim() || busy) return;
    setBusy(true);
    setError("");
    try {
      const data = await request("/agent/run", {
        prompt: brief,
        mode: "local",
        tool: "brief",
        projectId: s.activeProject || undefined,
      });
      setBriefResult(data.item.data.text);
      await s.refresh();
      onInfo(
        "จัด brief ด้วย local template และบันทึกผลแล้ว ไม่มี AI inference",
      );
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function openStudio() {
    if (!code || saving) return;
    setSaving(true);
    setError("");
    try {
      const item = await s.create(
        "code",
        config.brand + " · storefront draft",
        code,
      );
      location.hash = "/code/" + item.id;
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  }
  return (
    <div className="ax-builder">
      <header className="ax-builder-heading">
        <div>
          <span className="cp-kicker">ARTYVERSE / THE CREATIVE TOOLKIT</span>
          <h1>
            From <span className="ax-editorial-underline">a bold idea</span>
            <br />
            to <span className="ax-marker">something real.</span>
          </h1>
          <p>เลือกต้นแบบ ปรับให้เป็นคุณ แล้วเปิดต่อใน Studio ได้จริง</p>
        </div>
        <div className="ax-builder-heading-actions">
          <span className="cp-tag">
            <ShieldCheck size={14} />
            LOCAL TEMPLATE BUILDER
          </span>
          <Action disabled={!code || saving} onClick={() => void openStudio()}>
            <Code2 size={16} />
            {saving ? "กำลังบันทึก…" : "เปิดใน Code Studio"}
          </Action>
        </div>
      </header>
      <section className="ax-builder-shell" aria-label="Storefront builder">
        <header className="ax-builder-chrome">
          <div className="ax-chrome-title">
            <span className="ax-traffic" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <strong>PROJECT / STOREFRONT</strong>
          </div>
          <LayoutGroup id={viewportGroup}>
            <div
              className="ax-viewport-control"
              role="group"
              aria-label="Storefront viewport"
            >
              {(
                [
                  ["desktop", Monitor],
                  ["tablet", Tablet],
                  ["mobile", Smartphone],
                ] as const
              ).map(([device, Icon]) => (
                <button
                  key={device}
                  aria-label={device + " storefront viewport"}
                  aria-pressed={viewport === device}
                  onClick={() => setViewport(device)}
                >
                  {viewport === device && (
                    <motion.span
                      aria-hidden="true"
                      layoutId="viewport-highlight"
                      className="ax-viewport-highlight"
                      transition={
                        enabled ? framerSpringTactile : { duration: 0 }
                      }
                    />
                  )}
                  <Icon size={17} />
                </button>
              ))}
            </div>
          </LayoutGroup>
          <Action
            variant="lime"
            disabled={!code}
            onClick={() =>
              code &&
              download(
                "artyverse-storefront.html",
                exportCode(code, config.brand),
                "text/html",
              )
            }
          >
            <Download size={15} />
            Export HTML
          </Action>
        </header>
        <div className="ax-builder-grid">
          <aside className="ax-builder-inspector">
            <div className="ax-inspector-top">
              <span>
                <SlidersHorizontal size={17} />
                MAKE IT YOURS
              </span>
              <span className="ax-state-label">LOCAL / EDITABLE</span>
            </div>
            <div className="ax-preset-picker">
              <span className="cp-kicker">01 / START WITH A DIRECTION</span>
              <div>
                <button onClick={() => setPreset("editorial")}>
                  <span className="ax-preset-swatch editorial" />
                  <strong>Editorial objects</strong>
                  <small>Quiet / considered / lime</small>
                </button>
                <button onClick={() => setPreset("neon")}>
                  <span className="ax-preset-swatch neon" />
                  <strong>Afterhours edit</strong>
                  <small>Expressive / bold / pink</small>
                </button>
              </div>
            </div>
            <fieldset className="ax-config-fields">
              <legend>02 / YOUR WORDS, YOUR WORLD</legend>
              <label>
                ชื่อแบรนด์
                <input
                  value={config.brand}
                  maxLength={32}
                  aria-invalid={!config.brand.trim()}
                  aria-describedby={!valid ? "ax-config-error" : undefined}
                  onChange={(e) => change({ ...config, brand: e.target.value })}
                />
              </label>
              <label>
                หัวข้อหลัก
                <input
                  value={config.headline}
                  maxLength={70}
                  aria-invalid={!config.headline.trim()}
                  aria-describedby={!valid ? "ax-config-error" : undefined}
                  onChange={(e) =>
                    change({ ...config, headline: e.target.value })
                  }
                />
              </label>
              <label>
                คำเน้น
                <input
                  value={config.highlight}
                  maxLength={32}
                  aria-invalid={!config.highlight.trim()}
                  aria-describedby={!valid ? "ax-config-error" : undefined}
                  onChange={(e) =>
                    change({ ...config, highlight: e.target.value })
                  }
                />
              </label>
              <label>
                คำอธิบาย
                <textarea
                  value={config.description}
                  maxLength={240}
                  onChange={(e) =>
                    change({ ...config, description: e.target.value })
                  }
                />
              </label>
              <label>
                ข้อความแถบด้านบน
                <input
                  value={config.banner}
                  maxLength={90}
                  onChange={(e) =>
                    change({ ...config, banner: e.target.value })
                  }
                />
              </label>
              <div className="ax-switch-row">
                <label htmlFor="ax-announcement">แสดง announcement</label>
                <KitSwitch
                  id="ax-announcement"
                  checked={config.showBanner}
                  onCheckedChange={(showBanner) =>
                    change({ ...config, showBanner })
                  }
                />
              </div>
              <div
                className="ax-accent-picker"
                role="group"
                aria-label="Storefront accent"
              >
                {(["lime", "pink"] as const).map((color) => (
                  <button
                    key={color}
                    aria-pressed={config.accent === color}
                    onClick={() => change({ ...config, accent: color })}
                  >
                    <i style={{ background: conceptPalette[color] }} />
                    {color}
                    {config.accent === color && <Check size={13} />}
                  </button>
                ))}
              </div>
              <Action disabled={!history.current.length} onClick={undo}>
                <Undo2 size={15} />
                Undo draft change
              </Action>
              {!valid && (
                <p
                  id="ax-config-error"
                  className="ax-inline-error"
                  role="alert"
                >
                  กรอกชื่อแบรนด์ หัวข้อหลัก และคำเน้นก่อน export หรือเปิดใน
                  Studio
                </p>
              )}
            </fieldset>
            <form
              className="ax-brief-form"
              onSubmit={(e) => {
                e.preventDefault();
                void formatBrief();
              }}
            >
              <div>
                <Sparkles size={16} />
                <strong>STUDIO GUIDE</strong>
                <span>Local tool</span>
              </div>
              <label htmlFor="ax-builder-brief">
                เขียน brief เพื่อจัดโครงสร้างแบบ local
              </label>
              <textarea
                id="ax-builder-brief"
                value={brief}
                maxLength={24000}
                onChange={(e) => setBrief(e.target.value)}
                placeholder="ใครคือกลุ่มเป้าหมาย และอยากให้หน้าร้านสื่ออะไร…"
              />
              <Action type="submit" disabled={!brief.trim() || busy}>
                <ArrowRight size={16} />
                {busy ? "กำลังจัด brief…" : "จัดโครง brief และบันทึก"}
              </Action>
              <small>
                ใช้ text template ไม่ใช่ AI generation และไม่แก้หน้าร้านเอง
              </small>
              {briefResult && (
                <details>
                  <summary>ดูผลที่บันทึกจริง</summary>
                  <pre>{briefResult}</pre>
                </details>
              )}
              {error && (
                <p role="alert" className="ax-inline-error">
                  {error}
                </p>
              )}
            </form>
          </aside>
          <section className="ax-preview-workspace">
            <LayoutGroup id={group}>
              <KitTabs value={tab} onValueChange={setTab}>
                <div className="ax-preview-tabbar">
                  <KitTabsList aria-label="Builder panels">
                    {[
                      ["preview", "Preview", Monitor],
                      ["code", "Code", Code2],
                      ["files", "Files", FileCode2],
                    ].map(([key, label, Icon]) => {
                      const I = Icon as typeof Monitor;
                      return (
                        <KitTabsTrigger
                          value={key as string}
                          key={key as string}
                          active={tab === key}
                          calm={!enabled}
                        >
                          <I size={15} />
                          {label as string}
                        </KitTabsTrigger>
                      );
                    })}
                  </KitTabsList>
                  <span>
                    {effective}px / {viewport}
                  </span>
                </div>
                <KitTabsContent
                  value="preview"
                  forceMount
                  hidden={tab !== "preview"}
                >
                  <div className="ax-preview-scroll">
                    <div className="ax-preview-width" ref={canvas}>
                      <motion.div
                        className="ax-device-frame"
                        layout={enabled && tab === "preview"}
                        transition={
                          enabled ? framerSpringTactile : { duration: 0 }
                        }
                        style={{ width: width ? effective : "100%" }}
                      >
                        <SampleStorefront config={config} onInfo={onInfo} />
                      </motion.div>
                    </div>
                  </div>
                </KitTabsContent>
                <KitTabsContent value="code">
                  <div className="ax-code-output">
                    <div>
                      <span>GENERATED HTML / FROM YOUR DRAFT</span>
                      <small>แก้ผ่าน form หรือเปิดต่อใน Code Studio</small>
                    </div>
                    <label htmlFor="ax-generated-html">
                      Generated storefront HTML
                    </label>
                    <textarea
                      id="ax-generated-html"
                      readOnly
                      value={
                        code
                          ? exportCode(code, config.brand)
                          : "กรอกข้อมูลให้ครบก่อนสร้าง HTML"
                      }
                    />
                  </div>
                </KitTabsContent>
                <KitTabsContent value="files">
                  <div className="ax-files">
                    <h2>What’s in your export.</h2>
                    <p>
                      ไฟล์สร้างจาก draft ปัจจุบัน ไม่มี backend หรือ payment
                      integration แฝงอยู่
                    </p>
                    {[
                      ["index.html", "Standalone storefront", "text/html"],
                      [
                        "styles.css",
                        "Responsive storefront styles",
                        "text/css",
                      ],
                      [
                        "storefront.json",
                        "Versioned design configuration",
                        "application/json",
                      ],
                    ].map(([file, label, mime]) => (
                      <button
                        key={file}
                        disabled={!code}
                        onClick={() => {
                          if (code)
                            download(
                              file,
                              file === "index.html"
                                ? exportCode(code, config.brand)
                                : file === "styles.css"
                                  ? code.css
                                  : JSON.stringify(config, null, 2),
                              mime,
                            );
                        }}
                      >
                        <FileCode2 size={24} />
                        <span>
                          <strong>{file}</strong>
                          <small>{label}</small>
                        </span>
                        <Download size={17} />
                      </button>
                    ))}
                    <div className="ax-export-boundary">
                      <ShieldCheck size={20} />
                      <p>
                        สินค้าและราคาเป็นตัวอย่าง · ไม่มี checkout ·
                        ไม่สร้างบัญชีหรือเปิดบริการภายนอก
                      </p>
                    </div>
                  </div>
                </KitTabsContent>
              </KitTabs>
            </LayoutGroup>
          </section>
        </div>
        <footer className="ax-builder-status">
          <span>
            <i />
            Draft เก็บในเบราว์เซอร์นี้
          </span>
          <span>LOCAL PREVIEW · NO AI INFERENCE · NO CHECKOUT</span>
          <a href="#/design-system">
            Real Design System <ArrowUpRight size={13} />
          </a>
        </footer>
      </section>
      <FramerComponentSuite
        onInfo={onInfo}
        workState={busy ? "Thinking" : briefResult ? "Success" : "Idle"}
      />
      {preset && (
        <Modal
          title={
            "Preview template · " +
            (preset === "editorial" ? "Editorial objects" : "Afterhours edit")
          }
          onClose={() => setPreset(null)}
        >
          <div className="ax-preset-review">
            <span className="cp-tag">
              LOCAL TEMPLATE / PREVIEW BEFORE APPLY
            </span>
            <h2>
              {storefrontPresets[preset].headline}
              <br />
              <em>{storefrontPresets[preset].highlight}</em>
            </h2>
            <p>
              จะเปลี่ยนเฉพาะ draft ของ Builder นี้ งานที่บันทึกใน Library
              ไม่ถูกแก้ สามารถ Undo การเปลี่ยน draft ได้
            </p>
            <div className="ax-modal-actions">
              <Action onClick={() => setPreset(null)}>ยกเลิก</Action>
              <Action
                variant="lime"
                onClick={() => {
                  change(structuredClone(storefrontPresets[preset]));
                  setPreset(null);
                  onInfo("นำ template มาใช้กับ draft แล้ว");
                }}
              >
                Apply to draft
              </Action>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
