import { useUI } from "../v3/i18n";
import { useEffect, useRef, useState } from "react";
import {
  Play,
  Square,
  Download,
  Save,
  Volume2,
  AudioLines,
  RotateCcw,
} from "lucide-react";
import {
  initialComposition,
  synthSchema,
  type Composition,
} from "../../shared/v2/contracts";
import { scheduleTone, renderComposition } from "./audio";
import {
  useStudio,
  StudioHead,
  Missing,
  ErrorNotice,
  ToolNote,
  downloadBlob,
} from "./shared";
import { Button } from "../components/UI";
import { upload, download } from "../core/store";
const noteName = (m: number) =>
  m < 0
    ? "REST"
    : ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"][
        m % 12
      ] +
      (Math.floor(m / 12) - 1);
export function SoundLab({ id }: { id?: string }) {
  const ui = useUI();

  const st = useStudio<Composition>(
      "composition",
      id,
      initialComposition,
      "Untitled sound",
    ),
    { value, setValue } = st,
    [playing, setPlaying] = useState(false),
    [active, setActive] = useState(-1),
    [rendering, setRendering] = useState(false),
    [message, setMessage] = useState("");
  const resource = useRef<{
      ctx: AudioContext;
      filter: BiquadFilterNode;
      gain: GainNode;
      analyser: AnalyserNode;
      timer: ReturnType<typeof setInterval>;
      oscillators: Set<OscillatorNode>;
    } | null>(null),
    latest = useRef(value),
    canvas = useRef<HTMLCanvasElement>(null);
  const mounted = useRef(false),
    starting = useRef(false);
  latest.current = value;
  function stop() {
    const r = resource.current;
    if (r) {
      clearInterval(r.timer);
      r.oscillators.forEach((o) => {
        try {
          o.stop();
        } catch {}
      });
      r.filter.disconnect();
      r.gain.disconnect();
      r.analyser.disconnect();
      void r.ctx.close().catch(() => {});
      resource.current = null;
    }
    setPlaying(false);
    setActive(-1);
  }
  useEffect(() => {
    mounted.current = true;
    const visibility = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", visibility);
    return () => {
      mounted.current = false;
      document.removeEventListener("visibilitychange", visibility);
      const r = resource.current;
      if (r) {
        clearInterval(r.timer);
        r.oscillators.forEach((o) => {
          try {
            o.stop();
          } catch {}
        });
        void r.ctx.close().catch(() => {});
        resource.current = null;
      }
    };
  }, []);
  useEffect(() => {
    const r = resource.current;
    if (r) {
      r.filter.frequency.setTargetAtTime(value.cutoff, r.ctx.currentTime, 0.04);
      r.gain.gain.setTargetAtTime(value.volume, r.ctx.currentTime, 0.04);
    }
  }, [value.cutoff, value.volume]);
  useEffect(() => {
    if (!playing || !canvas.current) return;
    const c = canvas.current,
      ctx = c.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    const samples = new Uint8Array(256);
    function draw() {
      const r = resource.current;
      if (!r) return;
      const rect = c.getBoundingClientRect(),
        dpr = Math.min(1.5, devicePixelRatio);
      if (
        c.width !== Math.floor(rect.width * dpr) ||
        c.height !== Math.floor(rect.height * dpr)
      ) {
        c.width = Math.floor(rect.width * dpr);
        c.height = Math.floor(rect.height * dpr);
      }
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx!.clearRect(0, 0, rect.width, rect.height);
      r.analyser.getByteTimeDomainData(samples);
      ctx!.beginPath();
      samples.forEach((s, i) => {
        const x = (i / (samples.length - 1)) * rect.width,
          y = (s / 128 - 1) * rect.height * 0.4 + rect.height / 2;
        i ? ctx!.lineTo(x, y) : ctx!.moveTo(x, y);
      });
      ctx!.strokeStyle = "#D7E317";
      ctx!.lineWidth = 1.5;
      ctx!.stroke();
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, [playing]);
  async function play() {
    if (starting.current) return;
    starting.current = true;
    try {
      if (!window.AudioContext)
        throw Error("Web Audio is not supported in this browser");
      synthSchema.parse(value);
      stop();
      const ctx = new AudioContext();
      await ctx.resume();
      if (!mounted.current || document.hidden) {
        await ctx.close();
        return;
      }
      const filter = ctx.createBiquadFilter(),
        gain = ctx.createGain(),
        analyser = ctx.createAnalyser();
      filter.type = "lowpass";
      filter.frequency.value = value.cutoff;
      gain.gain.value = value.volume;
      analyser.fftSize = 256;
      filter.connect(gain);
      gain.connect(analyser);
      analyser.connect(ctx.destination);
      let step = 0,
        next = ctx.currentTime + 0.05;
      const oscillators = new Set<OscillatorNode>();
      const tick = () => {
        while (next < ctx.currentTime + 0.12) {
          const cfg = latest.current,
            duration = 60 / cfg.tempo / 4,
            note = cfg.steps[step % 16];
          if (note >= 0) {
            const o = scheduleTone(ctx, filter, note, next, duration, cfg);
            oscillators.add(o);
            o.addEventListener("ended", () => oscillators.delete(o));
          }
          setActive(step % 16);
          step++;
          next += duration;
        }
      };
      const timer = setInterval(tick, 25);
      resource.current = { ctx, filter, gain, analyser, timer, oscillators };
      tick();
      setPlaying(true);
      setMessage(
        "Playing actual synthesized audio. Playback stops when you leave or hide this view.",
      );
      st.setError("");
    } catch (e) {
      stop();
      st.setError(String(e));
    } finally {
      starting.current = false;
    }
  }
  async function render(saveRecording = false) {
    setRendering(true);
    try {
      const result = await renderComposition(synthSchema.parse(value));
      if (saveRecording) {
        const a = await upload(result.blob, st.title + ".wav");
        await st.s.create("recording", st.title + " — rendered audio", {
          url: a.url,
          assetId: a.id,
          mime: "audio/wav",
          duration: result.duration,
          size: a.size,
          sourceId: st.current?.id,
        });
        st.s.toast("Rendered audio saved to Library");
      } else downloadBlob(st.title + ".wav", result.blob);
      setMessage(
        `Rendered ${result.duration.toFixed(2)} seconds / 44.1 kHz / mono PCM WAV`,
      );
    } catch (e) {
      st.setError(String(e));
    } finally {
      setRendering(false);
    }
  }
  function set<K extends keyof Composition>(k: K, v: Composition[K]) {
    setValue((old) => ({ ...old, [k]: v }));
  }
  if (st.missing) return <Missing kind="Composition" />;
  return (
    <div className="v2-page">
      <StudioHead
        index="CREATE / WEB AUDIO STUDIO"
        title={st.title}
        onTitle={st.setTitle}
        description="A procedural instrument, a sixteen-step sequence, and an actual audio export. No sampled progress. No microphone required."
        onSave={() => void st.save()}
        busy={st.busy}
      >
        {st.importControl}
        <Button disabled={rendering} onClick={() => void render()}>
          <Download size={15} />
          {rendering ? "Rendering…" : "Export WAV"}
        </Button>
        <Button
          variant={playing ? "" : "primary"}
          onClick={() => (playing ? stop() : void play())}
        >
          {playing ? <Square size={15} /> : <Play size={15} />}
          {playing ? "Stop audio" : "Play sequence"}
        </Button>
      </StudioHead>
      <ErrorNotice message={st.error} />
      <div className="v2-sound-grid">
        <section className="v2-sound-stage">
          <div className="v2-panel-heading">
            <span className="eyebrow">
              OSCILLATOR / {value.wave.toUpperCase()}
            </span>
            <span className="state-badge">
              {playing ? "AUDIO ACTIVE" : "IDLE · USER INITIATED"}
            </span>
          </div>
          <div className="v2-waveform">
            <canvas ref={canvas} aria-hidden="true" />
            {!playing && (
              <div>
                <AudioLines size={55} />
                <span>Press play to see the actual output waveform.</span>
              </div>
            )}
          </div>
          <div className="v2-sequencer">
            <div className="v2-panel-heading">
              <span className="eyebrow">
                16 STEPS / 1 BAR / SIXTEENTH NOTES
              </span>
              <Button onClick={() => set("steps", Array(16).fill(-1))}>
                {ui("Clear steps")}
              </Button>
            </div>
            <div className="v2-step-grid">
              {value.steps.map((note, i) => (
                <div
                  className={"v2-step " + (active === i ? "is-active" : "")}
                  key={i}
                >
                  <button
                    className={note < 0 ? "is-rest" : ""}
                    aria-label={"Toggle step " + (i + 1)}
                    aria-pressed={note >= 0}
                    onClick={() =>
                      set(
                        "steps",
                        value.steps.map((n, j) =>
                          j === i ? (n < 0 ? 60 : -1) : n,
                        ),
                      )
                    }
                  >
                    <span>{String(i + 1).padStart(2, "0")}</span>
                    <i />
                  </button>
                  <label>
                    <span className="sr-only">Note for step {i + 1}</span>
                    <select
                      aria-label={"Note for step " + (i + 1)}
                      value={note}
                      onChange={(e) =>
                        set(
                          "steps",
                          value.steps.map((n, j) =>
                            j === i ? Number(e.target.value) : n,
                          ),
                        )
                      }
                    >
                      <option value={-1}>REST</option>
                      {Array.from({ length: 25 }, (_, n) => n + 48).map((n) => (
                        <option value={n} key={n}>
                          {noteName(n)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <p className="v2-caption" role="status">
            {message ||
              "Audio begins only after a user gesture. No sound is played automatically."}
          </p>
        </section>
        <aside className="v2-instrument-controls">
          <span className="eyebrow">SOUND DESIGN</span>
          <label>
            {ui("Wave shape")}
            <select
              value={value.wave}
              onChange={(e) => set("wave", e.target.value as any)}
            >
              {["sine", "triangle", "sawtooth", "square"].map((x) => (
                <option key={x}>{x}</option>
              ))}
            </select>
          </label>
          {(
            [
              {
                key: "tempo",
                name: "Tempo",
                min: 40,
                max: 200,
                step: 1,
                unit: "BPM",
              },
              {
                key: "cutoff",
                name: "Low-pass filter",
                min: 100,
                max: 16000,
                step: 100,
                unit: "Hz",
              },
              {
                key: "attack",
                name: "Attack",
                min: 0.005,
                max: 1,
                step: 0.005,
                unit: "s",
              },
              {
                key: "release",
                name: "Release",
                min: 0.02,
                max: 2,
                step: 0.01,
                unit: "s",
              },
              {
                key: "volume",
                name: "Output gain",
                min: 0,
                max: 0.3,
                step: 0.01,
                unit: "×",
              },
            ] as const
          ).map((c) => (
            <label className="v2-slider" key={c.key}>
              <span>
                {c.name}
                <output>
                  {Number(value[c.key].toFixed(3))} {c.unit}
                </output>
              </span>
              <input
                aria-label={c.name}
                type="range"
                min={c.min}
                max={c.max}
                step={c.step}
                value={value[c.key]}
                onChange={(e) => set(c.key, Number(e.target.value))}
              />
            </label>
          ))}
          <Button disabled={rendering} onClick={() => void render(true)}>
            <Save size={15} />
            {ui("Render to Library")}
          </Button>
          <Button
            onClick={() =>
              download(
                st.title + "-composition.json",
                JSON.stringify(value, null, 2),
              )
            }
          >
            {ui("Export composition data")}
          </Button>
          <Button
            onClick={() => {
              stop();
              setValue(structuredClone(initialComposition));
            }}
          >
            <RotateCcw size={15} />
            {ui("Reset sound")}
          </Button>
          <ToolNote>
            This is synthesized audio, not speech transcription. Output is
            capped at 0.3 gain; actual perceived loudness depends on your
            device.
          </ToolNote>
        </aside>
      </div>
    </div>
  );
}
