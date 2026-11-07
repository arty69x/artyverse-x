import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
export function ScrollReveal({
  text,
  direction = "Bottom → Top",
  softness = 18,
  start = 0.05,
  end = 0.85,
  calm = false,
}: {
  text: string;
  direction?: string;
  softness?: number;
  start?: number;
  end?: number;
  calm?: boolean;
}) {
  const container = useRef<HTMLDivElement>(null),
    target = useRef<HTMLHeadingElement>(null),
    reduced = useReducedMotion();
  useEffect(() => {
    const c = container.current,
      t = target.current;
    if (!c || !t) return;
    let raf = 0;
    const render = () => {
      const progress = Math.max(
        0,
        Math.min(
          1,
          (c.scrollTop / Math.max(1, c.scrollHeight - c.clientHeight) - start) /
            Math.max(0.05, end - start),
        ),
      );
      const dir =
        direction === "Bottom → Top"
          ? "to top"
          : direction === "Top → Bottom"
            ? "to bottom"
            : direction === "Left → Right"
              ? "to right"
              : "to left";
      const edge = (0.12 + progress * 0.88) * 100;
      t.style.maskImage =
        calm || reduced || edge >= 99
          ? "none"
          : `linear-gradient(${dir},#000 ${Math.max(0, edge - softness)}%,transparent ${edge}%)`;
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(render);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(c);
    observer.observe(t);
    c.addEventListener("scroll", schedule, { passive: true });
    void document.fonts.ready.then(schedule);
    schedule();
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      c.removeEventListener("scroll", schedule);
    };
  }, [text, direction, softness, start, end, calm, reduced]);
  return (
    <div className="scroll-reveal" ref={container}>
      <div className="scroll-reveal-hint">
        SCROLL THIS PREVIEW ↓ / REVERSE TO SCRUB BACK
      </div>
      <div className="scroll-reveal-track">
        <h2 ref={target}>{text}</h2>
        <p>
          Native scroll container · responsive text measurement · reduced-motion
          fallback
        </p>
      </div>
    </div>
  );
}
