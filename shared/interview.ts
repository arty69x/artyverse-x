import { z } from "zod";
export const transcriptTurn = z.object({
  id: z.string(),
  speaker: z.enum(["interviewer", "you"]),
  text: z.string().max(16000),
  at: z.string(),
});
export const copilotData = z.object({
  sessionType: z.enum(["copilot", "practice"]),
  transcript: z.array(transcriptTurn).max(2000),
  question: z.string().max(16000),
  answer: z.string().max(30000),
  evidenceIds: z.array(z.string()).max(100),
  notes: z.string().max(30000).default(""),
});
export type TranscriptTurn = z.infer<typeof transcriptTurn>;
export function detectQuestion(text: string) {
  const clean = text.trim();
  const cues =
    /[?？]|\b(what|why|how|when|where|which|tell me|describe|explain|can you)\b|อย่างไร|ทำไม|อะไร|เมื่อไร|เล่า|อธิบาย|ไหม|หรือไม่/i;
  const topics = [
    [
      "Technical",
      /code|architecture|flutter|react|typescript|ระบบ|โค้ด|เทคนิค/i,
    ],
    ["Experience", /experience|project|ประสบการณ์|โปรเจกต์|ผลงาน/i],
    ["Behavioral", /challenge|conflict|team|ปัญหา|ทีม|ขัดแย้ง/i],
    ["Motivation", /why|motivation|ทำไม|แรงจูงใจ/i],
  ]
    .filter(([, re]) => (re as RegExp).test(clean))
    .map(([s]) => s as string);
  return {
    question: clean,
    isQuestion: cues.test(clean),
    topics: topics.length ? topics : ["General"],
    method: "Rule-based cues; not an AI confidence probability",
  };
}
const words = (s: string) =>
  new Set(
    Array.from(
      new Intl.Segmenter(undefined, { granularity: "word" }).segment(
        s.toLowerCase(),
      ),
    )
      .filter((x) => x.isWordLike && x.segment.length > 1)
      .map((x) => x.segment),
  );
export function matchEvidence(
  question: string,
  sources: { id: string; title: string; body: string }[],
) {
  const q = words(question);
  return sources
    .map((s) => {
      const w = words(s.title + " " + s.body);
      const overlap = [...q].filter((x) => w.has(x));
      return { ...s, snippet: s.body.slice(0, 900), overlap: overlap.length };
    })
    .filter((s) => s.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 4);
}
export function buildEvidenceOutline(
  question: string,
  sources: { title: string; snippet: string }[],
  locale: "th" | "en",
  format: string,
) {
  const th = locale === "th",
    missing = th ? "[ใส่ข้อมูลจริง]" : "[Add your actual evidence]";
  const evidence = sources.length
    ? sources.map((s, i) => `[${i + 1}] ${s.title}\n${s.snippet}`).join("\n\n")
    : missing;
  if (format === "STAR")
    return `${th ? "สถานการณ์" : "Situation"}: ${missing}\n\n${th ? "หน้าที่" : "Task"}: ${missing}\n\n${th ? "สิ่งที่ทำ" : "Action"}: ${missing}\n\n${th ? "ผลลัพธ์ที่ตรวจสอบได้" : "Verified result"}: ${missing}\n\n${th ? "หลักฐานที่เลือก" : "Selected evidence"}\n${evidence}`;
  if (format === "Short") return sources.length ? sources[0].snippet : missing;
  if (format === "Key Points" || format === "Bullet")
    return sources.length
      ? sources.map((s, i) => `• [${i + 1}] ${s.snippet}`).join("\n")
      : missing;
  return `${th ? "คำถาม" : "Question"}\n${question}\n\n${th ? "หลักฐานจากข้อมูลของคุณ" : "Your selected evidence"}\n${evidence}\n\n${th ? "ร่างคำตอบด้วยคำพูดของคุณ" : "Write the answer in your own words"}\n${missing}`;
}
