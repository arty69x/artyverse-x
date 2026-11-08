import { useUI } from "../v3/i18n";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Plus,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Download,
  Maximize,
  ArrowUp,
  ArrowDown,
  Layers,
} from "lucide-react";
import { newStoryScene, type Story } from "../../shared/v2/contracts";
import {
  useStudio,
  StudioHead,
  Missing,
  ErrorNotice,
  ToolNote,
} from "./shared";
import { DocumentScene } from "./DocumentScene";
import { Button, Modal } from "../components/UI";
import { download } from "../core/store";
export function StoryStudio({ id }: { id?: string }) {
  const ui = useUI();

  const st = useStudio<Story>(
      "story",
      id,
      { schemaVersion: 2, scenes: [newStoryScene()] },
      "Untitled story",
    ),
    { value, setValue } = st,
    [index, setIndex] = useState(0),
    [playing, setPlaying] = useState(false),
    [elapsed, setElapsed] = useState(0),
    [present, setPresent] = useState(false),
    [hideChrome, setHideChrome] = useState(false),
    reduced = useReducedMotion();
  const started = useRef(0),
    base = useRef(0),
    stage = useRef<HTMLDivElement>(null);
  const scene = value.scenes[Math.min(index, value.scenes.length - 1)],
    document = st.s.items.find(
      (i) => i.id === scene.documentId && i.kind === "document" && !i.deletedAt,
    ),
    total = value.scenes.reduce((n, s) => n + s.duration, 0),
    before = value.scenes.slice(0, index).reduce((n, s) => n + s.duration, 0),
    calm = !!reduced || ["Calm", "Off"].includes(st.s.motion);
  function navigate(next: number) {
    setIndex(Math.max(0, Math.min(value.scenes.length - 1, next)));
    setElapsed(0);
    base.current = 0;
    started.current = performance.now();
  }
  useEffect(() => {
    if (!playing) return;
    started.current = performance.now();
    base.current = elapsed;
    const timer = setInterval(() => {
      const t = base.current + (performance.now() - started.current) / 1000;
      if (t >= scene.duration) {
        if (index < value.scenes.length - 1) {
          setIndex((i) => i + 1);
          setElapsed(0);
        } else {
          setElapsed(scene.duration);
          setPlaying(false);
        }
      } else setElapsed(t);
    }, 50);
    return () => clearInterval(timer);
  }, [playing, index, scene.duration]);
  useEffect(() => {
    if (!present) return;
    const key = (e: KeyboardEvent) => {
      if (
        ["INPUT", "TEXTAREA", "SELECT"].includes(
          (e.target as HTMLElement).tagName,
        )
      )
        return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        navigate(index + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        navigate(index - 1);
      }
      if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [present, index, value.scenes.length]);
  function patch(p: Partial<Story["scenes"][number]>) {
    setValue((v) => ({
      ...v,
      scenes: v.scenes.map((s, i) => (i === index ? { ...s, ...p } : s)),
    }));
  }
  function close() {
    setPresent(false);
    setPlaying(false);
    setHideChrome(false);
    if (window.document.fullscreenElement)
      void window.document.exitFullscreen().catch(() => {});
  }
  function move(delta: number) {
    const to = index + delta;
    if (to < 0 || to >= value.scenes.length) return;
    const next = [...value.scenes];
    [next[index], next[to]] = [next[to], next[index]];
    setValue((v) => ({ ...v, scenes: next }));
    navigate(to);
  }
  function display() {
    return (
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="v2-story-content"
          key={scene.id}
          initial={
            calm || scene.transition === "instant"
              ? false
              : { opacity: 0, x: scene.transition === "slide" ? 40 : 0 }
          }
          animate={{ opacity: 1, x: 0 }}
          exit={
            calm || scene.transition === "instant"
              ? {}
              : { opacity: 0, x: scene.transition === "slide" ? -25 : 0 }
          }
          transition={{
            duration: calm ? 0 : (scene.transitionDuration ?? 0.5),
          }}
        >
          {document ? (
            <DocumentScene
              nodes={document.data.nodes}
              width={document.data.width}
              height={document.data.height}
              title={document.title}
            />
          ) : (
            <div className="v2-story-title-scene">
              <span className="eyebrow">
                ARTYVERSE X / {String(index + 1).padStart(2, "0")}
              </span>
              <h2>{scene.title}</h2>
              <p>{scene.script}</p>
              {scene.documentId && (
                <small>
                  Linked document unavailable. Showing scene script.
                </small>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    );
  }
  if (st.missing) return <Missing kind="Story" />;
  return (
    <div className="v2-page">
      <StudioHead
        index="STORYTELLING / SCRIPT / PRESENTATION"
        title={st.title}
        onTitle={st.setTitle}
        description="Arrange scenes, connect real documents, prepare your script and control the timing. One story, with an editable source."
        onSave={() => void st.save()}
        busy={st.busy}
      >
        {st.importControl}
        <Button
          onClick={() =>
            download(st.title + "-story.json", JSON.stringify(value, null, 2))
          }
        >
          <Download size={15} />
          {ui("Export story")}
        </Button>
        <Button variant="primary" onClick={() => setPresent(true)}>
          <Play size={15} />
          {ui("Present story")}
        </Button>
      </StudioHead>
      <ErrorNotice message={st.error} />
      <div className="v2-story-layout">
        <aside className="v2-scene-list">
          <span className="eyebrow">SCENES / {value.scenes.length}</span>
          {value.scenes.map((s, i) => (
            <button
              className={index === i ? "selected" : ""}
              key={s.id}
              onClick={() => navigate(i)}
            >
              <span>{String(i + 1).padStart(2, "0")}</span>
              <div>
                {s.title}
                <small>
                  {s.duration}s ·{" "}
                  {s.documentId ? "Linked document" : "Script scene"}
                </small>
              </div>
            </button>
          ))}
          <Button
            disabled={value.scenes.length >= 100}
            onClick={() => {
              setValue((v) => ({
                ...v,
                scenes: [...v.scenes, newStoryScene()],
              }));
              setIndex(value.scenes.length);
              setElapsed(0);
            }}
          >
            <Plus size={15} />
            {ui("Add scene")}
          </Button>
        </aside>
        <section className="v2-story-preview">
          <div className="v2-story-stage">{display()}</div>
          <div className="v2-story-controls">
            <Button
              disabled={index === 0}
              onClick={() => navigate(index - 1)}
              title={ui("Previous scene")}
            >
              <ChevronLeft size={16} />
            </Button>
            <Button onClick={() => setPlaying(!playing)}>
              {playing ? <Pause size={15} /> : <Play size={15} />}
              {playing ? "Pause" : "Play timeline"}
            </Button>
            <Button
              disabled={index >= value.scenes.length - 1}
              onClick={() => navigate(index + 1)}
              title={ui("Next scene")}
            >
              <ChevronRight size={16} />
            </Button>
            <span>
              {(before + elapsed).toFixed(1)} / {total}s
            </span>
          </div>
          <div
            className="v2-story-progress"
            role="progressbar"
            aria-label="Story playback progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(((before + elapsed) / total) * 100)}
          >
            <i style={{ width: ((before + elapsed) / total) * 100 + "%" }} />
          </div>
          <div className="v2-story-timeline">
            {value.scenes.map((s, i) => (
              <button
                key={s.id}
                style={{ flex: s.duration }}
                className={index === i ? "selected" : ""}
                onClick={() => navigate(i)}
              >
                {i + 1}
                <small>{s.duration}s</small>
              </button>
            ))}
          </div>
        </section>
        <aside className="v2-instrument-controls">
          <span className="eyebrow">SCENE / SCRIPT</span>
          <label>
            {ui("Scene title")}
            <input
              aria-label={ui("Scene title")}
              value={scene.title}
              maxLength={200}
              onChange={(e) => patch({ title: e.target.value })}
            />
          </label>
          <label>
            {ui("Speaker script")}
            <textarea
              aria-label={ui("Speaker script")}
              rows={6}
              maxLength={10000}
              value={scene.script}
              onChange={(e) => patch({ script: e.target.value })}
            />
          </label>
          <label>
            {ui("Linked document")}
            <select
              aria-label={ui("Linked document")}
              value={scene.documentId || ""}
              onChange={(e) => patch({ documentId: e.target.value || null })}
            >
              <option value="">{ui("Use title and script")}</option>
              {st.s.items
                .filter((i) => i.kind === "document" && !i.deletedAt)
                .map((i) => (
                  <option value={i.id} key={i.id}>
                    {i.title}
                  </option>
                ))}
            </select>
          </label>
          <label>
            {ui("Scene duration / seconds")}
            <input
              type="number"
              min={1}
              max={300}
              value={scene.duration}
              onChange={(e) =>
                patch({
                  duration: Math.min(300, Math.max(1, Number(e.target.value))),
                })
              }
            />
          </label>
          <label>
            {ui("Transition")}
            <select
              value={scene.transition}
              onChange={(e) => patch({ transition: e.target.value as any })}
            >
              <option value="fade">Fade</option>
              <option value="slide">Slide</option>
              <option value="instant">Instant</option>
            </select>
          </label>
          <label>
            {ui("Transition duration / seconds")}
            <input
              type="number"
              min={0}
              max={5}
              step={0.1}
              value={scene.transitionDuration ?? 0.5}
              onChange={(e) =>
                patch({
                  transitionDuration: Math.max(
                    0,
                    Math.min(5, Number(e.target.value)),
                  ),
                })
              }
            />
          </label>
          <label>
            {ui("Apply compatible Motion Lab preset")}
            <select
              aria-label="Apply scene motion preset"
              defaultValue=""
              onChange={(e) => {
                const p = st.s.items.find((i) => i.id === e.target.value);
                if (p)
                  patch({
                    transition: "fade",
                    transitionDuration: Math.min(
                      5,
                      Math.max(0, p.data.duration),
                    ),
                  });
              }}
            >
              <option value="">{ui("Choose a saved scene preset")}</option>
              {st.s.items
                .filter(
                  (i) =>
                    i.kind === "preset" &&
                    !i.deletedAt &&
                    i.data.compatibleTargets?.includes("story-scene"),
                )
                .map((i) => (
                  <option value={i.id} key={i.id}>
                    {i.title}
                  </option>
                ))}
            </select>
          </label>
          <div className="button-row">
            <Button
              disabled={index === 0}
              onClick={() => move(-1)}
              title={ui("Move scene earlier")}
            >
              <ArrowUp size={15} />
            </Button>
            <Button
              disabled={index === value.scenes.length - 1}
              onClick={() => move(1)}
              title={ui("Move scene later")}
            >
              <ArrowDown size={15} />
            </Button>
            <Button
              disabled={value.scenes.length <= 1}
              onClick={() => {
                setValue((v) => ({
                  ...v,
                  scenes: v.scenes.filter((_, i) => i !== index),
                }));
                navigate(Math.max(0, index - 1));
              }}
            >
              <Trash2 size={15} />
              {ui("Delete scene")}
            </Button>
          </div>
        </aside>
      </div>
      <ToolNote>
        Linked scenes use saved documents from the same Library. Motion presets
        apply only when explicitly marked compatible with story scenes. Timeline
        playback stops when this view is destroyed; there is no background
        scheduler.
      </ToolNote>
      {present && (
        <Modal
          wide
          title={
            hideChrome
              ? "Presentation"
              : st.title + ` / ${index + 1} of ${value.scenes.length}`
          }
          onClose={close}
        >
          <div ref={stage} className="v2-full-story-stage">
            {display()}
          </div>
          {!hideChrome && (
            <>
              <p className="v2-speaker-notes">{scene.script}</p>
              <div className="modal-actions">
                <Button
                  disabled={index === 0}
                  onClick={() => navigate(index - 1)}
                >
                  ← Previous
                </Button>
                <Button onClick={() => setPlaying(!playing)}>
                  {playing ? "Pause" : "Play"}
                </Button>
                <Button
                  disabled={index === value.scenes.length - 1}
                  onClick={() => navigate(index + 1)}
                >
                  Next →
                </Button>
                <Button
                  onClick={() => {
                    if (stage.current?.requestFullscreen)
                      void stage.current
                        .requestFullscreen()
                        .catch(() => st.s.toast("Fullscreen unavailable"));
                  }}
                >
                  <Maximize size={15} />
                  {ui("Fullscreen")}
                </Button>
              </div>
            </>
          )}
          <div className="modal-actions">
            <Button onClick={() => setHideChrome(!hideChrome)}>
              {hideChrome ? "Show controls" : "Hide controls"}
            </Button>
            <Button onClick={close}>{ui("Exit presentation")}</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
