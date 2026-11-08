import type { CSSProperties } from "react";
import { conceptPalette } from "../../shared/concept";
import { PreviewMotionProvider } from "../components/kit/motion";
import { FramerStudioBuilder } from "../concept/FramerStudioComponents";
import "../concept/concept.css";
import "../concept/studio-kit.css";
import { useStore, useT } from "../core/store";
export function UnifiedBuilder() {
  const t = useT(),
    s = useStore();
  return (
    <div
      className="unified-builder cp-root cp-studio-theme"
      style={
        {
          ...Object.fromEntries(
            Object.entries(conceptPalette).map(([k, v]) => ["--cp-" + k, v]),
          ),
          "--cp-paper": conceptPalette.night,
          "--cp-surface": conceptPalette.panel,
          "--cp-soft": conceptPalette.raised,
          "--cp-line": conceptPalette.nightLine,
          "--cp-ink": conceptPalette.nightText,
          "--cp-muted": conceptPalette.nightMuted,
          "--cp-pinkText": conceptPalette.pink,
        } as CSSProperties
      }
    >
      <header className="recon-workspace-title">
        <span className="eyebrow">// COMPOSE / WEBSITE STUDIO</span>
        <h1>
          {t("Make it yours.", "สร้างให้เป็นคุณ")}
          <span>↗</span>
        </h1>
        <p>
          {t(
            "Design, preview and export. One connected workspace.",
            "ออกแบบ ดูตัวอย่าง และส่งออก พร้อมทำต่อใน Code Studio",
          )}
        </p>
      </header>
      <PreviewMotionProvider>
        <FramerStudioBuilder onInfo={s.toast} />
      </PreviewMotionProvider>
    </div>
  );
}
