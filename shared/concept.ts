import { designSystem } from "./design";
/** Visual exploration of the user's latest Prompt Pack, isolated from applied themes. */
export const conceptPalette = {
  paper: "#F4F6F9",
  surface: "#FFFFFF",
  ink: "#132033",
  muted: "#566377",
  line: "#D8DEE8",
  soft: "#EAEFF5",
  lime: designSystem.brand.lime,
  onLime: "#122000",
  pink: designSystem.brand.pink,
  pinkText: "#C90061",
  violet: "#7440D4",
  cyan: "#00E5FF",
  navy: "#0A1F8F",
  night: "#05080D",
  panel: "#0D131E",
  raised: "#141E2D",
  nightText: "#EDF2FA",
  nightMuted: "#A9B8CE",
  nightLine: "#2A384E",
} as const;
export const conceptEvidence = {
  id: "sample-story-01",
  label: "ตัวอย่าง · Project story",
  body: "ฉันพัฒนาเว็บแอปจัดการงานสร้างสรรค์ด้วย React และ TypeScript โดยแยกส่วนแสดงผลออกจากข้อมูล และทดสอบเส้นทางสร้าง แก้ไข บันทึก และเปิดงานซ้ำ",
};

export const conceptMotion = {
  spring: { type: "spring" as const, stiffness: 420, damping: 26, mass: 0.8 },
  smooth: { duration: 0.32, ease: [0, 0, 0.2, 1] as const },
  stagger: 0.08,
};
