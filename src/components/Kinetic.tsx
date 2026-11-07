import { useEffect, useRef } from "react";
import { point } from "../core/geometry";
export function Kinetic({
  text,
  path,
  speed = 1,
  size = 28,
  color = "#CCFF00",
  paused = false,
  quality = "Balanced",
  echo = 1,
}: {
  text: string;
  path: number;
  speed?: number;
  size?: number;
  color?: string;
  paused?: boolean;
  quality?: string;
  echo?: number;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    phase = useRef(0);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext("2d");
    if (!ctx) return;
    let raf = 0,
      time = phase.current,
      previous = 0,
      visible = true;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)"),
      glyphs = Array.from(
        new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
          text || "ARTYVERSE X",
        ),
        (s) => s.segment,
      ),
      count = Math.min(
        quality === "Full" ? 144 : quality === "Calm" ? 48 : 96,
        Math.max(32, glyphs.length * 5),
      );
    const render = (now: number) => {
      const rect = el.getBoundingClientRect(),
        dpr = Math.min(devicePixelRatio, quality === "Full" ? 2 : 1.5),
        w = Math.max(1, rect.width),
        h = Math.max(1, rect.height);
      if (
        el.width !== Math.floor(w * dpr) ||
        el.height !== Math.floor(h * dpr)
      ) {
        el.width = Math.floor(w * dpr);
        el.height = Math.floor(h * dpr);
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      if (
        previous &&
        !paused &&
        !reduced.matches &&
        quality !== "Off" &&
        quality !== "Calm"
      )
        time += Math.min(50, now - previous) * 0.0003 * speed;
      phase.current = time;
      previous = now;
      const dots = Array.from({ length: count }, (_, i) => ({
        p: point(path, i / count, time),
        i,
      })).sort((a, b) => b.p[2] - a.p[2]);
      const scale = Math.min(w / 700, h / 450);
      for (const {
        p: [x, y, z],
        i,
      } of dots) {
        const depth = 700 + z;
        if (depth < 120) continue;
        const perspective = 700 / depth;
        for (let e = Math.min(echo, 4) - 1; e >= 0; e--) {
          ctx.globalAlpha = Math.max(
            0.1,
            (0.45 + perspective * 0.3) * Math.pow(0.42, e),
          );
          ctx.fillStyle = color;
          ctx.font = `500 ${Math.min(90, size * perspective * scale)}px 'Space Grotesk','Noto Sans Thai',sans-serif`;
          ctx.textAlign = "center";
          ctx.fillText(
            glyphs[i % glyphs.length],
            w / 2 + (x + e * 5) * perspective * scale,
            h / 2 + (y + e * 5) * perspective * scale,
          );
        }
      }
      ctx.globalAlpha = 1;
      if (
        visible &&
        !document.hidden &&
        !paused &&
        !reduced.matches &&
        quality !== "Off" &&
        quality !== "Calm"
      )
        raf = requestAnimationFrame(render);
    };
    const refresh = () => {
      cancelAnimationFrame(raf);
      previous = 0;
      if (visible && !document.hidden) raf = requestAnimationFrame(render);
    };
    const observer = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      refresh();
    });
    observer.observe(el);
    const resize = new ResizeObserver(refresh);
    resize.observe(el);
    document.addEventListener("visibilitychange", refresh);
    reduced.addEventListener("change", refresh);
    refresh();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", refresh);
      reduced.removeEventListener("change", refresh);
    };
  }, [text, path, speed, size, color, paused, quality, echo]);
  return (
    <div className="kinetic-wrap">
      <canvas ref={canvas} aria-hidden="true" />
      <span className="sr-only">
        Kinetic typography preview: {text}. Decorative canvas has a static text
        alternative.
      </span>
    </div>
  );
}
