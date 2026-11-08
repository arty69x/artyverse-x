/** Canonical V3 interface tokens. Saved artifacts keep their own colors. */
export const designSystem = {
  schemaVersion: 3,
  brand: {
    lime: "#CCFF00",
    pink: "#FF2078",
    blue: "#001E3C",
    violet: "#B44FFF",
    cyan: "#00C7E8",
    smoke: "#90A4AE",
    white: "#FFFFFF",
    ink: "#050403",
  },
  themes: {
    dark: {
      background: "#080B12",
      sidebar: "#0C101A",
      surface: "#111724",
      surface2: "#192131",
      surface3: "#222D40",
      line: "#2B374B",
      lineStrong: "#60708B",
      text: "#F4F6FB",
      muted: "#B0BDD1",
      faint: "#95A3BA",
      accent: "#CCFF00",
      onAccent: "#101600",
      focus: "#C887FF",
      selected: "#352546",
      danger: "#FF9EBC",
      success: "#B8E7A0",
      warning: "#FFD295",
      code: "#0B1220",
      shadow: "0 16px 48px #00000026",
      cardgrad: "linear-gradient(135deg,#152034,#101625)",
    },
    light: {
      background: "#F3F5FA",
      sidebar: "#FFFFFF",
      surface: "#FFFFFF",
      surface2: "#EAF0F7",
      surface3: "#DEE6F1",
      line: "#D0D9E7",
      lineStrong: "#718097",
      text: "#142037",
      muted: "#4E6079",
      faint: "#586A82",
      accent: "#CCFF00",
      onAccent: "#101600",
      focus: "#7623BC",
      selected: "#ECDDFF",
      danger: "#B40046",
      success: "#276719",
      warning: "#885000",
      code: "#F4F7FC",
      shadow: "0 16px 48px #1325470B",
      cardgrad: "linear-gradient(135deg,#FFFFFF,#F0F4FC)",
    },
  },
  space: [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  radius: {
    small: 4,
    input: 10,
    button: 11,
    card: 18,
    hero: 24,
    modal: 22,
    pill: 999,
  },
  motion: {
    micro: 120,
    feedback: 200,
    panel: 320,
    scene: 500,
    stiffness: 180,
    damping: 22,
    mass: 1,
  },
  type: {
    display: "Syne Variable",
    body: "DM Sans",
    thai: "PlexThai",
    mono: "JetBrains Mono",
    bodySize: 16,
    captionSize: 12,
  },
  layout: {
    sidebar: 256,
    sidebarCompact: 218,
    rail: 80,
    topbar: 74,
    mobileTopbar: 60,
    statusbar: 36,
    gutterMobile: 15,
    gutterTablet: 23,
    gutterDesktop: 32,
    breakpoints: [640, 768, 1024, 1280, 1536],
  },
} as const;
export type ThemePreference = "dark" | "light" | "system";
export type ResolvedTheme = "dark" | "light";
export function contrastRatio(a: string, b: string) {
  const l = (h: string) => {
    const c = [1, 3, 5]
      .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
  };
  const x = l(a),
    y = l(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
