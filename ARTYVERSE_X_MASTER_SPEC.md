# ARTYVERSE X V2 — Creative Operating Studio

Artist × Multiverse คือแกนแบรนด์: หนึ่งคนสร้างสรรค์ได้หลายโลก โดยใช้ Creativity, Transparency และ Measurable Impact เป็นเกณฑ์ตัดสินใจ. Think → Create → Analyze → Hyper-Polish → Drive เป็นวงจรงาน. ARTYVERSE เป็น master brand; ARTYVERSE X เป็นผลิตภัณฑ์; Fade W + pink dot เป็นสัญลักษณ์ Whisper assistant ที่ใช้ใน composer. ไม่บิด W ให้หมายถึง A.

## โปรแกรมรุ่นใหม่

| เครื่องมือ | Input → การทำงาน → Output | บันทึก / ขั้นต่อไป |
|---|---|---|
| Projects | brief → แยก creative context → project ID | เชื่อมงานใหม่ด้วย projectId; Library กรองตามโปรเจกต์ |
| Agent Studio | prompt → local outline/statistics/brief หรือ optional provider → run record | provenance, usage, elapsed time, unknown/known cost; เปิดผลใน Create |
| Node Studio | graph → validate DAG / branch / transform / agent step / artifact → execution | workflow + execution; note/document จริงเข้า Library |
| Code Studio | HTML/CSS/JS → explicit sandbox Run → live preview + console | save revisions, source JSON, standalone HTML; inspect element แล้วแก้ CSS |
| Sound Lab | 16 steps + oscillator/filter/envelope → Web Audio → actual sound | composition, PCM WAV, rendered recording ใน Library |
| Dynamics | custom SVG bodies + spring/mass/gravity → bounded simulation | scene JSON, drag/pan/pinch, manual controls; sensor ขออนุญาตก่อนและรอ events จริง |
| Story Studio | scene list + saved documents + script + timing → timeline/presentation | story JSON, source relationships, play/pause/next/return |
| System & costs | server status + persisted agent runs → actual counts/cost boundary | backup; connection truth; ไม่มี readiness score ที่คิดขึ้นเอง |

Chat, Canvas, Research, Voice, Live, Templates, Library และ Design OS ใช้ระบบ persistence เดิมต่อ. Workflow V1 ที่ไม่มี graph เปิด compatibility editor ตาม ID; งานใหม่ใช้ Node Studio. Motion Lab Scene Transition บันทึก compatible target story-scene แล้ว Story ใช้ duration จริง. Effect อื่นไม่ถูกอ้างว่าใช้กับ scene ได้ทุกชนิด.

## UX / UI / typography

Deep black + lime #D7E317 + pink #D4006A; cyan/violet ใช้เป็นแสงรอง. Home เป็น editorial asymmetric bento มีโลก orbital native SVG เป็นจุดเด่นเดียว; native composer/buttons/text ไม่ฝังในภาพ. Poppins 200/800 สร้างจังหวะ thin/bold; IBM Plex Sans Thai รองรับภาษาไทย; body ใช้ DM Sans. เก็บฟอนต์และใบอนุญาตใน public/fonts. Brand studies ต้นฉบับยังอยู่ branding/.

Desktop ใช้ sidebar + breadcrumb + contextual inspector. Mobile ใช้ drawer, panels วางซ้อนตามงาน และพื้นที่ graph เลื่อนภายในเฉพาะ canvas. CSS utilities จาก Tailwind 4 เสริม React/Vite โดยไม่เพิ่ม Next.js และไม่ reset UI เดิมด้วย preflight. Motion for React เป็นแพ็กเกจ motion ที่รวม Framer Motion runtime อยู่จริง.

## Data / integration boundaries

- `shared/schema.ts`: Item envelope v1 + theme canonical. เอกสาร V1 ยังใช้ IDs/revisions เดิม.
- `shared/v2/contracts.ts`: graph/code/composition/scene/story/project data schema v2 และ kind→route mapping.
- `shared/v2/graph.ts`: pure local DAG execution, cancellation, branch route, injected artifact/agent adapters.
- `src/v2/shared.tsx`: explicit save, revision-keyed drafts, undo/redo, import validation→preview→apply. Undo เก็บใน session ไม่ปะปนกับ saved revisions.
- SQLite + media files อยู่เครื่องที่รัน server. Browser localStorage เก็บ draft/preferences เท่านั้น. ไม่เรียกว่า cloud sync.
- Code ใช้ opaque-origin iframe `sandbox=allow-scripts` ไม่อนุญาต same-origin, forms, popups หรือ host access; CSP ปิด fetch/connect/resources ภายนอก. ไม่ใช่ OS container หรือ backend shell/terminal. โค้ดหนักยังใช้ทรัพยากร browser ได้.
- Web Audio เริ่มด้วย user gesture, ปิด context/oscillators/timers เมื่อออกหรือซ่อนหน้า. WebGL เปิดแบบ opt-in มี bounded quality/static fallback และหยุด offscreen.
- API keys server-only; ไม่มีการจัดหา key หรือเรียก inference จริงในงานส่งมอบนี้. Adapter tests ใช้ fixture HTTP ในเครื่องและระบุว่าไม่ใช่ AI inference.

## Cost / agent fallback

Local tools ไม่มี API charge. Connected requests มี output cap, estimated request budget, opt-in unknown price, session cache ขนาดไม่เกิน 50 รายการ และ explicit fallback. ประมาณ input ด้วย UTF-8 byte allowance + overhead ไม่ใช่ tokenizer หรือ hard billing cap. Actual usage × configured actual rates ใช้ได้เมื่อ provider ส่ง token counts; ไม่เช่นนั้น cost unknown. Provider ส่งแล้วล้มเหลว cost unknown แม้ local fallback สำเร็จ. Cache hit คิด provider request ใหม่เป็นศูนย์และระบุ source เดิม. แต่ละ agent step ใน graph เก็บ run evidence จริง. Budget ไม่ใช่ billing control ของผู้ให้บริการ.

## สิ่งที่ยังต้องมีสำหรับ public production

Identity/authentication, per-user authorization/ownership, cloud storage/sync, remote collaboration conflict protocol, distributed execution/scheduler, rate limits และ deployment-specific recovery/security tests. ไม่แสดงผู้ร่วมงานหรือ cloud success จำลอง. TH/EN เครื่องมือเดิมและ shell มีส่วนที่แปลแล้ว; advanced tools ยังมี English microcopy. Sensor/gesture/audio บนอุปกรณ์จริงยังต้องตรวจเพิ่ม. ไม่ถือว่าแอปครบ production SaaS เพราะ build หรือ automated checks ผ่าน.

## เอกสารประกอบ

Canonical release registry: `artyverse-design-master.json`; detailed V2 scope: `docs/v2/RELEASE_SCOPE.json`; source decisions: `docs/v2/CONFLICT_AND_NORMALIZATION.md`; verification: `VERIFICATION_REPORT.md`; historical V1 specification: `docs/v1/ARTYVERSE_X_MASTER_SPEC.md`.
