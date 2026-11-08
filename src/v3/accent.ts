import { contrastRatio } from "../../shared/design";
export function applyAccent(color: string) {
  if (!/^#[0-9a-f]{6}$/i.test(color)) return;
  document.documentElement.style.setProperty("--accent", color);
  document.documentElement.style.setProperty(
    "--on-accent",
    contrastRatio(color, "#050403") >= contrastRatio(color, "#FFFFFF")
      ? "#050403"
      : "#FFFFFF",
  );
}
