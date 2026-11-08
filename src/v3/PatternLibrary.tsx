import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  ArrowLeft,
  Download,
  Play,
  Plus,
  Upload,
  Search,
  RotateCcw,
  Monitor,
  Smartphone,
  X,
} from "lucide-react";
import {
  patternRecipes,
  patternIds,
  patternStyles,
  patternConfigSchema,
  patternDraftSchema,
  defaultPattern,
  createPatternCode,
  type PatternConfig,
} from "../../shared/patterns";
import catalog from "../../shared/reference-catalog.json";
import { useStore, useT, useDraft, download } from "../core/store";
import { Button, Modal } from "../components/UI";
import { buildPreview, exportCode } from "../v2/sandbox";
import type { Navigate } from "../App";
import "./patterns.css";
export function PatternArt({ id }: { id: string }) {
  return (
    <div className={"pattern-art art-" + id} aria-hidden="true">
      <span>ARTYVERSE / DESIGN STUDY</span>
      <div className="pa-shapes">
        <i />
        <i />
        <i />
      </div>
      <strong>
        {id === "statement" ? (
          <>
            MAKE
            <br />
            <em>IT MATTER.</em>
          </>
        ) : id === "chapters" ? (
          <>
            01 <em>→</em> 02
            <br />A NEW CHAPTER.
          </>
        ) : id === "catalog" ? (
          <>
            COLLECT.
            <br />
            <em>CONNECT.</em>
          </>
        ) : id === "depth" ? (
          <>
            A DIFFERENT
            <br />
            <em>DIMENSION.</em>
          </>
        ) : (
          <>
            A NEW
            <br />
            <em>PERSPECTIVE.</em>
          </>
        )}
      </strong>
      <small>ORIGINAL EDITABLE LAYOUT</small>
    </div>
  );
}
export function PatternLibrary({ go, id }: { go: Navigate; id?: string }) {
  const t = useT(),
    [view, setView] = useDraft(
      "pattern-library:view",
      { query: "", category: "All", inventory: false },
      (v) =>
        v &&
        typeof v.query === "string" &&
        typeof v.category === "string" &&
        typeof v.inventory === "boolean",
    );
  if (id) {
    if (!patternIds.includes(id as any))
      return (
        <div className="page">
          <h1>{t("Pattern not found", "ไม่พบแพตเทิร์นนี้")}</h1>
          <Button onClick={() => go("patterns")}>
            {t("Back to collection", "กลับสู่คอลเลกชัน")}
          </Button>
        </div>
      );
    return (
      <PatternDetail key={id} id={id as (typeof patternIds)[number]} go={go} />
    );
  }
  const filtered = patternRecipes.filter(
    (p) =>
      (view.category === "All" || p.category === view.category) &&
      (p.name + p.th + p.description)
        .toLowerCase()
        .includes(view.query.toLowerCase()),
  );
  const references = catalog.filter(
    (p) =>
      (view.category === "All" || p.category === view.category) &&
      (p.name + p.category).toLowerCase().includes(view.query.toLowerCase()),
  );
  const categories = view.inventory
    ? [...new Set(catalog.map((p) => p.category))]
    : ["Editorial", "Layout", "Motion", "Typography", "Collection"];
  return (
    <div className="page patterns-page">
      <header className="patterns-lead">
        <div>
          <span className="eyebrow">// THE PRESENTATION COLLECTION</span>
          <h1>
            <span>{t("A different", "เปลี่ยนมุมมอง")}</span>
            <br />
            <strong>{t("point of view.", "สร้างสิ่งใหม่")}</strong>
            <i aria-hidden="true">
              <ArrowUpRight strokeWidth={1.5} />
            </i>
          </h1>
        </div>
        <div>
          <p>
            {t(
              "The content is yours. The composition is a new beginning.",
              "เนื้อหาเป็นของคุณ การจัดวางคือจุดเริ่มต้นใหม่",
            )}
          </p>
          <span>
            {t(
              "8 original editable layouts · 6 styles",
              "8 layout ที่แก้ไขได้ · 6 สไตล์",
            )}
          </span>
        </div>
      </header>
      <div className="patterns-toolbar">
        <div className="patterns-switch">
          <button
            aria-pressed={!view.inventory}
            onClick={() =>
              setView({ ...view, inventory: false, category: "All" })
            }
          >
            {t("Ready to create", "พร้อมเริ่มสร้าง")} <b>08</b>
          </button>
          <button
            aria-pressed={view.inventory}
            onClick={() =>
              setView({ ...view, inventory: true, category: "All" })
            }
          >
            {t("Reference inventory", "รายการอ้างอิง")} <b>{catalog.length}</b>
          </button>
        </div>
        <label className="patterns-search">
          <Search size={16} />
          <span className="sr-only">
            {t("Search patterns", "ค้นหาแพตเทิร์น")}
          </span>
          <input
            type="search"
            value={view.query}
            placeholder={t("Find a different direction…", "ค้นหาทิศทางใหม่…")}
            onChange={(e) => setView({ ...view, query: e.target.value })}
          />
        </label>
        <label className="sr-only" htmlFor="pattern-category">
          {t("Category", "หมวดหมู่")}
        </label>
        <select
          id="pattern-category"
          value={view.category}
          onChange={(e) => setView({ ...view, category: e.target.value })}
        >
          <option>All</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>
      {view.inventory ? (
        <>
          <div className="patterns-inventory-head">
            <p>
              {t(
                "60 ideas recovered from the supplied component catalog. These entries are references, not installed components.",
                "60 แนวคิดจาก component catalog ที่แนบ เป็นรายการอ้างอิง ไม่ใช่ components ที่ติดตั้งครบแล้ว",
              )}
            </p>
            <Button
              onClick={() =>
                download(
                  "ARTYVERSE-reference-inventory.json",
                  JSON.stringify({ schemaVersion: 1, items: catalog }, null, 2),
                )
              }
            >
              <Download size={16} />
              {t("Export inventory", "ส่งออกรายการ")}
            </Button>
          </div>
          <div className="patterns-inventory">
            {references.map((p, i) => (
              <article key={p.id}>
                <span>
                  {String(i + 1).padStart(2, "0")} / {p.category}
                </span>
                <h2>{p.name}</h2>
                <small>{t("Reference only", "รายการอ้างอิง")}</small>
              </article>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="patterns-results" role="status">
            {filtered.length} {t("directions to explore", "ทิศทางให้ทดลอง")}
            <span>
              {t(
                "Original samples · no external assets",
                "ตัวอย่างต้นฉบับ · ไม่ใช้ assets ของเว็บต้นทาง",
              )}
            </span>
          </div>
          <div className="pattern-grid">
            {filtered.map((p, i) => (
              <article key={p.id}>
                <button
                  className="pattern-cover"
                  onClick={() => go("patterns", p.id)}
                  aria-label={t("Open ", "เปิด ") + p.name}
                >
                  <PatternArt id={p.id} />
                  <span className="pattern-open">
                    <ArrowUpRight size={20} />
                  </span>
                </button>
                <div className="pattern-info">
                  <span>
                    0{i + 1} / {p.category}
                  </span>
                  <h2>
                    <a href={"#/patterns/" + p.id}>{t(p.name, p.th)}</a>
                  </h2>
                  <p>{p.description}</p>
                  <a href={"#/patterns/" + p.id}>
                    {t("Make it yours", "นำไปสร้างงาน")}
                    <ArrowUpRight size={17} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
      {(view.inventory ? references.length : filtered.length) === 0 && (
        <div className="patterns-empty">
          <h2>{t("A different search might help.", "ลองค้นหาอีกแบบ")}</h2>
          <Button
            onClick={() => setView({ ...view, query: "", category: "All" })}
          >
            {t("Clear filters", "ล้างตัวกรอง")}
          </Button>
        </div>
      )}
      <footer className="patterns-footer">
        <strong>
          EXTRACT. <em>COMPOSE.</em> SHIP.
        </strong>
        <a href="#/code">
          {t("Start with your own code", "เริ่มจากโค้ดของคุณ")}
          <ArrowUpRight size={16} />
        </a>
      </footer>
    </div>
  );
}
function PatternDetail({
  id,
  go,
}: {
  id: (typeof patternIds)[number];
  go: Navigate;
}) {
  const s = useStore(),
    t = useT(),
    recipe = patternRecipes.find((p) => p.id === id)!,
    [config, setConfig] = useDraft<PatternConfig>(
      "pattern:" + id,
      defaultPattern(id),
      (v) => patternDraftSchema.safeParse(v).success && v.pattern === id,
    ),
    [src, setSrc] = useState(""),
    [status, setStatus] = useState(""),
    [busy, setBusy] = useState(false),
    [device, setDevice] = useState("desktop"),
    [candidate, setCandidate] = useState<PatternConfig | null>(null),
    [error, setError] = useState("");
  const frame = useRef<HTMLIFrameElement>(null),
    nonce = useRef(""),
    valid = patternConfigSchema.safeParse(config).success;
  useEffect(() => {
    setSrc("");
    setStatus("");
  }, [config]);
  useEffect(() => {
    const listen = (e: MessageEvent) => {
      const d = e.data;
      if (
        e.source !== frame.current?.contentWindow ||
        !d ||
        d.token !== nonce.current ||
        d.artyverse !== true
      )
        return;
      if (d.type === "error" && typeof d.message === "string")
        setError(d.message.slice(0, 500));
    };
    window.addEventListener("message", listen);
    return () => window.removeEventListener("message", listen);
  }, []);
  function preview() {
    try {
      setError("");
      nonce.current = crypto.randomUUID();
      setSrc(buildPreview(createPatternCode(config), nonce.current));
      setStatus(t("Rendering preview…", "กำลังแสดงตัวอย่าง…"));
    } catch (e) {
      setError(String(e));
    }
  }
  async function save() {
    if (!valid || busy) return;
    setBusy(true);
    setError("");
    try {
      const item = await s.create(
        "code",
        config.brand + " / " + recipe.name,
        createPatternCode(config),
      );
      go("code", item.id);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function read(file?: File) {
    if (!file) return;
    setError("");
    if (file.size > 64000) {
      setError(
        t("Preset is too large (64 KB maximum).", "ไฟล์ preset ใหญ่เกิน 64 KB"),
      );
      return;
    }
    try {
      setCandidate(patternConfigSchema.parse(JSON.parse(await file.text())));
    } catch {
      setError(
        t(
          "Invalid pattern preset. Your draft is unchanged.",
          "preset ไม่ถูกต้อง draft เดิมยังอยู่",
        ),
      );
    }
  }
  function apply() {
    if (!candidate) return;
    try {
      if (candidate.pattern === id) setConfig(candidate);
      else {
        localStorage.setItem(
          "av-draft:pattern:" + candidate.pattern,
          JSON.stringify(candidate),
        );
        go("patterns", candidate.pattern);
      }
      setCandidate(null);
      setStatus(
        t(
          "Preset applied to the local draft.",
          "ใช้ preset กับ draft ในเบราว์เซอร์แล้ว",
        ),
      );
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <div className="page pattern-detail">
      <a className="pattern-back" href="#/patterns">
        <ArrowLeft size={16} />
        {t("The collection", "คอลเลกชัน")}
      </a>
      <header className="pattern-detail-head">
        <div>
          <span className="eyebrow">
            // {recipe.category.toUpperCase()} / ORIGINAL LAYOUT
          </span>
          <h1>{t(recipe.name, recipe.th)}</h1>
          <p>{recipe.description}</p>
        </div>
        <Button
          variant="primary"
          disabled={!valid || busy}
          onClick={() => void save()}
        >
          <Plus size={16} />
          {busy
            ? t("Saving…", "กำลังบันทึก…")
            : t("Create in Studio", "สร้างงานใน Studio")}
        </Button>
      </header>
      <div className="pattern-workbench">
        <aside className="pattern-inspector">
          <span className="eyebrow">01 / YOUR COMPOSITION</span>
          <label>
            {t("Brand", "ชื่อแบรนด์")}
            <input
              value={config.brand}
              aria-invalid={!config.brand.trim()}
              maxLength={40}
              onChange={(e) => setConfig({ ...config, brand: e.target.value })}
            />
          </label>
          <label>
            {t("Headline", "หัวข้อหลัก")}
            <textarea
              value={config.heading}
              aria-label={t("Headline", "หัวข้อหลัก")}
              aria-invalid={!config.heading.trim()}
              maxLength={140}
              rows={3}
              onChange={(e) =>
                setConfig({ ...config, heading: e.target.value })
              }
            />
          </label>
          <label>
            {t("Description", "คำอธิบาย")}
            <textarea
              value={config.description}
              aria-label={t("Description", "คำอธิบาย")}
              maxLength={600}
              rows={4}
              onChange={(e) =>
                setConfig({ ...config, description: e.target.value })
              }
            />
          </label>
          <label>
            {t("Style", "สไตล์")}
            <select
              value={config.style}
              onChange={(e) =>
                setConfig({
                  ...config,
                  style: e.target.value as PatternConfig["style"],
                })
              }
            >
              {patternStyles.map((v) => (
                <option key={v}>{v}</option>
              ))}
            </select>
          </label>
          <p>
            {t(
              "Style changes this sample only. Your app theme and saved work stay intact.",
              "สไตล์ใช้เฉพาะตัวอย่างนี้ ธีมแอปและงานเดิมยังอยู่",
            )}
          </p>
          {!valid && (
            <p role="alert">
              {t(
                "Enter a brand and headline before exporting.",
                "ใส่แบรนด์และหัวข้อก่อนส่งออก",
              )}
            </p>
          )}
          <div className="pattern-export">
            <Button
              disabled={!valid}
              onClick={() => {
                try {
                  download(
                    "artyverse-" + id + ".html",
                    exportCode(createPatternCode(config), config.brand),
                    "text/html",
                  );
                } catch (e) {
                  setError(String(e));
                }
              }}
            >
              <Download size={15} />
              {t("Download HTML", "ดาวน์โหลด HTML")}
            </Button>
            <Button
              disabled={!valid}
              onClick={() =>
                download(
                  "artyverse-" + id + "-preset.json",
                  JSON.stringify(patternConfigSchema.parse(config), null, 2),
                )
              }
            >
              <Download size={15} />
              {t("Export preset", "ส่งออก preset")}
            </Button>
            <label className="pattern-import">
              <Upload size={15} />
              {t("Import preset", "นำเข้า preset")}
              <input
                type="file"
                accept=".json,application/json"
                onChange={(e) => {
                  void read(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </label>
            <Button onClick={() => setConfig(defaultPattern(id))}>
              <RotateCcw size={15} />
              {t("Reset sample", "คืนค่าตัวอย่าง")}
            </Button>
          </div>
          <details>
            <summary>{t("Design notes & sources", "แนวทางและที่มา")}</summary>
            <p>
              {t(
                "Independently implemented presentation pattern. Sources: ",
                "สร้างใหม่จากแพตเทิร์นการนำเสนอ แหล่งอ้างอิง: ",
              )}
              {recipe.sources.join(", ")}.{" "}
              {t(
                "Sample content is original. No third-party component code or footage included.",
                "เนื้อหาเป็นตัวอย่างต้นฉบับ ไม่รวมโค้ด component หรือวิดีโอของเจ้าของเว็บ",
              )}
            </p>
            <a href={"#/" + recipe.route}>
              {t("Explore the related tool", "เปิดเครื่องมือที่เกี่ยวข้อง")} ↗
            </a>
          </details>
        </aside>
        <section
          className="pattern-preview-area"
          aria-label={t("Layout preview", "ตัวอย่าง layout")}
        >
          <div className="pattern-preview-bar">
            <Button disabled={!valid} variant="primary" onClick={preview}>
              <Play size={15} />
              {t("Run preview", "เปิดตัวอย่าง")}
            </Button>
            <div>
              <button
                aria-label={t("Desktop preview", "ตัวอย่าง desktop")}
                aria-pressed={device === "desktop"}
                onClick={() => setDevice("desktop")}
              >
                <Monitor size={17} />
              </button>
              <button
                aria-label={t("Mobile preview", "ตัวอย่างมือถือ")}
                aria-pressed={device === "mobile"}
                onClick={() => setDevice("mobile")}
              >
                <Smartphone size={17} />
              </button>
            </div>
          </div>
          <div className={"pattern-frame " + device}>
            {src ? (
              <iframe
                ref={frame}
                title="Pattern layout preview"
                sandbox="allow-scripts"
                referrerPolicy="no-referrer"
                srcDoc={src}
                onLoad={() =>
                  setStatus(
                    t(
                      "Preview loaded. This is an editable sample.",
                      "แสดงตัวอย่างแล้ว เป็นเนื้อหาตัวอย่างที่แก้ไขได้",
                    ),
                  )
                }
              />
            ) : (
              <div className="pattern-preview-empty">
                <PatternArt id={id} />
                <p>
                  {t(
                    "Press Run preview to render the original layout.",
                    "กดเปิดตัวอย่างเพื่อแสดง layout ที่สร้างใหม่",
                  )}
                </p>
              </div>
            )}
          </div>
          <p className="pattern-preview-status" role="status">
            {status ||
              t(
                "Preview runs only when you ask. Draft saved in this browser.",
                "ตัวอย่างเริ่มเมื่อคุณสั่ง draft เก็บในเบราว์เซอร์นี้",
              )}
          </p>
        </section>
      </div>
      {error && (
        <p role="alert" className="pattern-error">
          {error}
        </p>
      )}
      {candidate && (
        <Modal
          title={t("Review imported preset", "ตรวจ preset ก่อนใช้")}
          onClose={() => setCandidate(null)}
        >
          <p>
            {candidate.brand} / {candidate.heading}
          </p>
          <p>
            {candidate.pattern} · {candidate.style}
          </p>
          <p>
            {t(
              "This replaces the local draft for this pattern. It does not overwrite saved projects or run imported code.",
              "แทนที่เฉพาะ draft ของแพตเทิร์นนี้ ไม่ทับโปรเจกต์ที่บันทึก และไม่รันโค้ดจากไฟล์",
            )}
          </p>
          <Button onClick={() => setCandidate(null)}>
            {t("Cancel", "ยกเลิก")}
          </Button>
          <Button variant="primary" onClick={apply}>
            {t("Apply preset", "ใช้ preset")}
          </Button>
        </Modal>
      )}
    </div>
  );
}
