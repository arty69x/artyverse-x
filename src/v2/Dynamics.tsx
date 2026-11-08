import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  Download,
  Move3D,
  Smartphone,
} from "lucide-react";
import {
  initialPhysics,
  physicsSchema,
  type PhysicsScene,
} from "../../shared/v2/contracts";
import {
  useStudio,
  StudioHead,
  Missing,
  ErrorNotice,
  ToolNote,
} from "./shared";
import { HoloField } from "./HoloField";
import { Button } from "../components/UI";
import { download } from "../core/store";
type Body = { x: number; y: number; vx: number; vy: number };
export function Dynamics({ id }: { id?: string }) {
  const st = useStudio<PhysicsScene>(
      "scene",
      id,
      initialPhysics,
      "Untitled motion world",
    ),
    { value, setValue } = st,
    [paused, setPaused] = useState(false),
    [selected, setSelected] = useState(value.bodies[0]?.id || ""),
    [webgl, setWebgl] = useState(false),
    [zoom, setZoom] = useState(1),
    [pan, setPan] = useState({ x: 0, y: 0 }),
    [sensor, setSensor] = useState("off"),
    [tilt, setTilt] = useState({ x: 0, y: 0 }),
    reduced = useReducedMotion(),
    calm = !!reduced || ["Calm", "Off"].includes(st.s.motion);
  const svg = useRef<SVGSVGElement>(null),
    groups = useRef(new Map<string, SVGGElement>()),
    positions = useRef(new Map<string, Body>()),
    config = useRef(value),
    force = useRef({ x: 0, y: 0 }),
    drag = useRef<{ id: string; point: { x: number; y: number } } | null>(null),
    pointers = useRef(new Map<number, { x: number; y: number }>()),
    camera = useRef<{
      x: number;
      y: number;
      pan: { x: number; y: number };
      zoom: number;
      distance: number;
    } | null>(null),
    sensorListener = useRef<((e: DeviceOrientationEvent) => void) | null>(null);
  config.current = value;
  const body = value.bodies.find((n) => n.id === selected);
  useEffect(() => {
    for (const n of value.bodies)
      if (!positions.current.has(n.id))
        positions.current.set(n.id, { x: n.x, y: n.y, vx: 0, vy: 0 });
    for (const k of positions.current.keys())
      if (!value.bodies.some((n) => n.id === k)) positions.current.delete(k);
  }, [value.bodies]);
  useEffect(() => {
    let raf = 0,
      last = 0,
      visible = true;
    const draw = (now: number) => {
      const dt = Math.min(
        0.025,
        Math.max(0.001, (now - (last || now - 16)) / 1000),
      );
      last = now;
      const cfg = config.current;
      for (const n of cfg.bodies) {
        let p = positions.current.get(n.id);
        if (!p) {
          p = { x: n.x, y: n.y, vx: 0, vy: 0 };
          positions.current.set(n.id, p);
        }
        const target =
            drag.current?.id === n.id ? drag.current.point : { x: n.x, y: n.y },
          stiff = drag.current?.id === n.id ? 180 : cfg.stiffness;
        if (!paused && !calm) {
          const ax =
              ((target.x - p.x) * stiff - p.vx * cfg.damping) / n.mass +
              force.current.x,
            ay =
              ((target.y - p.y) * stiff - p.vy * cfg.damping) / n.mass +
              cfg.gravity +
              force.current.y;
          p.vx = Math.max(-650, Math.min(650, p.vx + ax * dt));
          p.vy = Math.max(-650, Math.min(650, p.vy + ay * dt));
          p.x = Math.max(n.radius, Math.min(1000 - n.radius, p.x + p.vx * dt));
          p.y = Math.max(n.radius, Math.min(700 - n.radius, p.y + p.vy * dt));
        } else if (drag.current?.id === n.id) {
          p.x = target.x;
          p.y = target.y;
          p.vx = 0;
          p.vy = 0;
        } else if (calm) {
          p.x = n.x;
          p.y = n.y;
        }
        groups.current
          .get(n.id)
          ?.setAttribute(
            "transform",
            `translate(${p.x} ${p.y}) rotate(${calm ? 0 : Math.max(-12, Math.min(12, p.vx * 0.018))})`,
          );
      }
      if (visible && !document.hidden && !paused && !calm)
        raf = requestAnimationFrame(draw);
    };
    const refresh = () => {
      cancelAnimationFrame(raf);
      last = 0;
      if (visible && !document.hidden && !paused && !calm)
        raf = requestAnimationFrame(draw);
    };
    const observer = new IntersectionObserver((e) => {
      visible = e[0].isIntersecting;
      refresh();
    });
    if (svg.current) observer.observe(svg.current);
    document.addEventListener("visibilitychange", refresh);
    refresh();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [paused, calm]);
  function stopSensor() {
    if (sensorListener.current)
      window.removeEventListener("deviceorientation", sensorListener.current);
    sensorListener.current = null;
    force.current = { x: 0, y: 0 };
    setTilt({ x: 0, y: 0 });
    setSensor("off");
  }
  useEffect(
    () => () => {
      if (sensorListener.current)
        window.removeEventListener("deviceorientation", sensorListener.current);
    },
    [],
  );
  async function enableSensor() {
    if (
      !window.isSecureContext ||
      typeof DeviceOrientationEvent === "undefined"
    ) {
      setSensor("unavailable");
      return;
    }
    try {
      const permission = (DeviceOrientationEvent as any).requestPermission;
      if (
        permission &&
        (await permission.call(DeviceOrientationEvent)) !== "granted"
      ) {
        setSensor("permission denied");
        return;
      }
      setSensor("waiting for device data");
      let last = 0;
      const listener = (e: DeviceOrientationEvent) => {
        if (typeof e.gamma !== "number" || typeof e.beta !== "number") return;
        force.current = {
          x: Math.max(-100, Math.min(100, e.gamma * 3)),
          y: Math.max(-100, Math.min(100, (e.beta - 35) * 3)),
        };
        if (performance.now() - last > 100) {
          setTilt({ x: e.gamma, y: e.beta });
          setSensor("active");
          last = performance.now();
        }
      };
      sensorListener.current = listener;
      window.addEventListener("deviceorientation", listener);
    } catch (e) {
      setSensor("permission error");
      st.setError(String(e));
    }
  }
  function point(e: React.PointerEvent) {
    const matrix = svg.current?.getScreenCTM();
    if (!matrix) return { x: 500, y: 350 };
    const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
      matrix.inverse(),
    );
    return {
      x: Math.max(0, Math.min(1000, (p.x - pan.x) / zoom)),
      y: Math.max(0, Math.min(700, (p.y - pan.y) / zoom)),
    };
  }
  function down(e: React.PointerEvent<SVGSVGElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const id = (e.target as Element)
      .closest("[data-body]")
      ?.getAttribute("data-body");
    if (pointers.current.size === 1 && id) {
      setSelected(id);
      drag.current = { id, point: point(e) };
    } else {
      const pts = [...pointers.current.values()];
      camera.current = {
        x: e.clientX,
        y: e.clientY,
        pan: { ...pan },
        zoom,
        distance:
          pts.length >= 2
            ? Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y)
            : 0,
      };
      if (pts.length >= 2) drag.current = null;
    }
  }
  function move(e: React.PointerEvent<SVGSVGElement>) {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size >= 2 && camera.current) {
      const p = [...pointers.current.values()],
        distance = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (camera.current.distance)
        setZoom(
          Math.min(
            2,
            Math.max(
              0.5,
              (camera.current.zoom * distance) / camera.current.distance,
            ),
          ),
        );
      return;
    }
    if (drag.current) {
      drag.current.point = point(e);
      if (paused || calm) {
        const p = drag.current.point;
        groups.current
          .get(drag.current.id)
          ?.setAttribute("transform", `translate(${p.x} ${p.y})`);
      }
    } else if (camera.current) {
      const box = svg.current!.getBoundingClientRect(),
        factor = 1000 / box.width;
      setPan({
        x: camera.current.pan.x + (e.clientX - camera.current.x) * factor,
        y: camera.current.pan.y + (e.clientY - camera.current.y) * factor,
      });
    }
  }
  function up(e: React.PointerEvent<SVGSVGElement>) {
    if (drag.current) {
      const d = drag.current;
      setValue((v) => ({
        ...v,
        bodies: v.bodies.map((n) =>
          n.id === d.id
            ? { ...n, x: Math.round(d.point.x), y: Math.round(d.point.y) }
            : n,
        ),
      }));
      drag.current = null;
    }
    pointers.current.delete(e.pointerId);
    if (!pointers.current.size) camera.current = null;
  }
  function update(patch: Record<string, unknown>) {
    setValue((v) => ({
      ...v,
      bodies: v.bodies.map((n) => (n.id === selected ? { ...n, ...patch } : n)),
    }));
  }
  if (st.missing) return <Missing kind="Dynamics scene" />;
  return (
    <div className="v2-page">
      <StudioHead
        index="SVG / PHYSICS / SENSOR / WEBGL"
        title={st.title}
        onTitle={st.setTitle}
        description="A physical SVG scene with real spring-mass dynamics. Drag a body, pinch the scene, or connect an available device sensor."
        onSave={() => void st.save()}
        busy={st.busy}
      >
        {st.importControl}
        <Button onClick={() => setPaused(!paused)}>
          {paused ? <Play size={15} /> : <Pause size={15} />}
          {paused ? "Play physics" : "Pause physics"}
        </Button>
        <Button
          onClick={() => {
            positions.current.clear();
            value.bodies.forEach((n) =>
              groups.current
                .get(n.id)
                ?.setAttribute("transform", `translate(${n.x} ${n.y})`),
            );
            setPan({ x: 0, y: 0 });
            setZoom(1);
          }}
        >
          <RotateCcw size={15} />
          Reset positions
        </Button>
      </StudioHead>
      <ErrorNotice message={st.error} />
      <div className="v2-dynamics-layout">
        <section className="v2-physical-stage">
          <HoloField enabled={webgl} calm={calm || paused} />
          <div className="v2-physical-caption">
            <span>PHYSICAL SVG WORLD / {value.bodies.length} BODIES</span>
            <span>
              {calm
                ? "CALM / STATIC FALLBACK"
                : paused
                  ? "PAUSED"
                  : "LOCAL PHYSICS"}
            </span>
          </div>
          <svg
            ref={svg}
            viewBox="0 0 1000 700"
            className="v2-physical-svg"
            aria-label="Interactive physical scene. Select a body from the list to edit with the keyboard."
            onPointerDown={down}
            onPointerMove={move}
            onPointerUp={up}
            onPointerCancel={up}
          >
            <g transform={`translate(${pan.x} ${pan.y}) scale(${zoom})`}>
              {value.bodies.map((n) => (
                <g
                  key={n.id}
                  data-body={n.id}
                  ref={(el) => {
                    if (el) groups.current.set(n.id, el);
                    else groups.current.delete(n.id);
                  }}
                  transform={`translate(${n.x} ${n.y})`}
                  style={{ cursor: "grab" }}
                >
                  {n.shape === "orb" ? (
                    <>
                      <circle
                        r={n.radius}
                        fill={n.color}
                        fillOpacity=".13"
                        stroke={n.color}
                      />
                      <circle
                        r={n.radius * 0.65}
                        fill="none"
                        stroke={n.color}
                        strokeOpacity=".25"
                      />
                    </>
                  ) : n.shape === "star" ? (
                    <path
                      d={`M0 ${-n.radius} Q${n.radius * 0.18} ${-n.radius * 0.18} ${n.radius} 0 Q${n.radius * 0.18} ${n.radius * 0.18} 0 ${n.radius} Q${-n.radius * 0.18} ${n.radius * 0.18} ${-n.radius} 0 Q${-n.radius * 0.18} ${-n.radius * 0.18} 0 ${-n.radius}Z`}
                      fill={n.color}
                    />
                  ) : (
                    <g
                      transform={`translate(${-n.radius} ${-n.radius}) scale(${n.radius / 50})`}
                    >
                      <path
                        d="M18 65V43a32 32 0 0 1 64 0v43c0 9-10 12-16 5l-5-5-11 9-12-9-8 8c-7 5-12 0-12-8Z"
                        fill={n.color}
                      />
                      <ellipse cx="38" cy="47" rx="5" ry="8" fill="#11130c" />
                      <ellipse cx="63" cy="47" rx="5" ry="8" fill="#11130c" />
                      <path
                        d="M44 65q8 6 15-1"
                        fill="none"
                        stroke="#11130c"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </g>
                  )}
                  {n.id === selected && (
                    <circle
                      r={n.radius + 12}
                      fill="none"
                      stroke="#f0f0f8"
                      strokeDasharray="3 6"
                      opacity=".5"
                    />
                  )}
                </g>
              ))}
            </g>
          </svg>
          <div className="v2-physical-footer">
            <span>Drag a body · Drag empty space to pan · Pinch to zoom</span>
            <span>{Math.round(zoom * 100)}%</span>
          </div>
        </section>
        <aside className="v2-instrument-controls">
          <span className="eyebrow">WORLD / SELECTED BODY</span>
          <div className="v2-body-list">
            {value.bodies.map((n) => (
              <button
                className={selected === n.id ? "selected" : ""}
                key={n.id}
                onClick={() => setSelected(n.id)}
              >
                <i style={{ background: n.color }} />
                {n.id}
              </button>
            ))}
          </div>
          <div className="button-row">
            <Button
              disabled={value.bodies.length >= 24}
              onClick={() => {
                const id =
                  "node-" +
                  (value.bodies.length + 1) +
                  "-" +
                  Math.random().toString(36).slice(2, 5);
                setValue((v) => ({
                  ...v,
                  bodies: [
                    ...v.bodies,
                    {
                      id,
                      x: 300 + Math.random() * 400,
                      y: 200 + Math.random() * 200,
                      mass: 1,
                      radius: 28,
                      color: "#43E6FF",
                      shape: "orb",
                    },
                  ],
                }));
                setSelected(id);
              }}
            >
              <Plus size={14} />
              Add body
            </Button>
            <Button
              title="Delete selected body"
              disabled={value.bodies.length <= 1}
              onClick={() => {
                setValue((v) => ({
                  ...v,
                  bodies: v.bodies.filter((n) => n.id !== selected),
                }));
                setSelected(
                  value.bodies.find((n) => n.id !== selected)?.id || "",
                );
              }}
            >
              <Trash2 size={14} />
            </Button>
          </div>
          {body && (
            <>
              <label>
                Shape
                <select
                  value={body.shape}
                  onChange={(e) => update({ shape: e.target.value })}
                >
                  <option value="whisper">Arty companion</option>
                  <option value="orb">Orb</option>
                  <option value="star">Spark</option>
                </select>
              </label>
              <div className="two-col">
                <label>
                  Mass
                  <input
                    type="number"
                    min={0.1}
                    max={10}
                    step={0.1}
                    value={body.mass}
                    onChange={(e) =>
                      update({
                        mass: Math.min(
                          10,
                          Math.max(0.1, Number(e.target.value)),
                        ),
                      })
                    }
                  />
                </label>
                <label>
                  Color
                  <input
                    type="color"
                    value={body.color}
                    onChange={(e) => update({ color: e.target.value })}
                  />
                </label>
              </div>
              <label className="v2-slider">
                <span>
                  Radius<output>{body.radius} px</output>
                </span>
                <input
                  aria-label="Body radius"
                  type="range"
                  min={10}
                  max={70}
                  value={body.radius}
                  onChange={(e) => update({ radius: Number(e.target.value) })}
                />
              </label>
              <div className="two-col">
                {(["x", "y"] as const).map((k) => (
                  <label key={k}>
                    {k.toUpperCase()}
                    <input
                      type="number"
                      min={0}
                      max={k === "x" ? 1000 : 700}
                      value={body[k]}
                      onChange={(e) =>
                        update({
                          [k]: Math.min(
                            k === "x" ? 1000 : 700,
                            Math.max(0, Number(e.target.value)),
                          ),
                        })
                      }
                    />
                  </label>
                ))}
              </div>
            </>
          )}
          {(
            [
              { key: "stiffness", name: "Spring stiffness", min: 5, max: 200 },
              { key: "damping", name: "Damping", min: 1, max: 30 },
              { key: "gravity", name: "Gravity", min: -150, max: 150 },
            ] as const
          ).map((c) => (
            <label className="v2-slider" key={c.key}>
              <span>
                {c.name}
                <output>{value[c.key]}</output>
              </span>
              <input
                aria-label={c.name}
                type="range"
                min={c.min}
                max={c.max}
                value={value[c.key]}
                onChange={(e) =>
                  setValue((v) => ({ ...v, [c.key]: Number(e.target.value) }))
                }
              />
            </label>
          ))}
          <label className="v2-check">
            <input
              type="checkbox"
              checked={webgl}
              onChange={(e) => setWebgl(e.target.checked)}
            />
            WebGL holographic light field
          </label>
          <div className="v2-sensor">
            <span className="eyebrow">DEVICE ORIENTATION / {sensor}</span>
            <p>
              X {tilt.x.toFixed(1)}° / Y {tilt.y.toFixed(1)}°
            </p>
            <Button
              onClick={() =>
                sensor === "off" ||
                sensor.includes("error") ||
                sensor === "unavailable"
                  ? void enableSensor()
                  : stopSensor()
              }
            >
              <Smartphone size={14} />
              {sensor === "off" || sensor === "unavailable"
                ? "Enable sensor"
                : "Stop sensor"}
            </Button>
          </div>
          <Button
            onClick={() =>
              download(
                st.title + "-physics.json",
                JSON.stringify(value, null, 2),
              )
            }
          >
            <Download size={14} />
            Export scene
          </Button>
        </aside>
      </div>
      <ToolNote>
        Physics and drag controls work locally. Sensor values appear only after
        real events; unsupported or permission-denied devices retain manual
        controls. WebGL is optional and falls back to a static background. No
        physical-device verification is claimed.
      </ToolNote>
    </div>
  );
}
