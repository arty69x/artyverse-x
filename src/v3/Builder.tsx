import type { CSSProperties } from "react";
import { conceptPalette } from "../../shared/concept";
import { PreviewMotionProvider } from "../components/kit/motion";
import { FramerStudioBuilder } from "../concept/FramerStudioComponents";
import "../concept/concept.css";
import "../concept/studio-kit.css";
import { useStore } from "../core/store";
export function UnifiedBuilder() {
  const s = useStore();
  return (
    <div
      className="unified-builder cp-root cp-studio-theme"
      style={
        {
          ...Object.fromEntries(
            Object.entries(conceptPalette).map(([k, v]) => ["--cp-" + k, v]),
          ),
          "--cp-paper": "var(--bg)",
          "--cp-surface": "var(--surface)",
          "--cp-soft": "var(--surface2)",
          "--cp-line": "var(--line)",
          "--cp-ink": "var(--text)",
          "--cp-muted": "var(--muted)",
          "--cp-pinkText": conceptPalette.pink,
        } as CSSProperties
      }
    >
      <PreviewMotionProvider>
        <FramerStudioBuilder onInfo={s.toast} />
      </PreviewMotionProvider>
    </div>
  );
}
