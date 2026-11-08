# Prompt Pack — interactive concept preview

คำขอล่าสุดคือจำลองหน้าจอให้ดู จึงสร้างเส้นทาง preview แยกสำหรับประเมินทิศทางภาพก่อนใช้กับทั้งผลิตภัณฑ์:

- `#/concept/home`: Light Bento dashboard, Speak Smarter., original ARCYCA, four floating chips, feature index, promo, labeled sample metrics and native SVG tool artwork.
- `#/concept/copilot`: Transcript / question-evidence / answer layout; mobile stacks and bottom navigation. Explicit sample transcript, microphone off, no elapsed recording clock. Manual text entry, evidence reveal, answer-format keyboard navigation, prepared tone variants, actual clipboard and browser TTS when supported.
- `#/concept/studio`: Scoped dark Studio, file tree and editable HTML/CSS/JS, explicit Run, real opaque-origin sandbox, validated source/nonce/origin messages, actual console events, device preview, reset, HTML download, and explicit transfer to the existing saved Code Studio.

## ที่มาและการตัดสินใจ

อ้างอิงคำบรรยายใน Master System Architecture & Single-Exec Prompt Pack ล่าสุด และ assets/fonts ที่มีจริง. ไม่ได้อ้างว่าเทียบ pixel กับภาพ 01–06 ที่ยังไม่ครบใน `design/references/`. ไม่มีการใช้ Framer Marketplace component ที่ไม่ได้ตรวจหรือนำเข้าจริง.

Preview ใช้ scoped palette จาก `shared/concept.ts`, CSS และ React/native SVG. Poppins 200/800 + DM Sans + IBM Plex Sans Thai + mono ที่มีอยู่ ใช้ font-display swap. Inter/Kanit ไม่ได้ bundled จึงไม่อ้าง typography ตรงทุก metric. Metadata ขั้นต่ำ 12px; core controls ขนาดสัมผัส 44px; สีผ่าน axe ใน states/viewports ที่รายงาน. ไม่เปลี่ยนธีมหรือบันทึกประวัติงานตัวอย่างให้ผู้ใช้.

ไม่คัดลอก AGENTS.md ของตัวอย่างทับกติกา repository โดยอัตโนมัติ: stack ปัจจุบันเป็น npm/React 19/Vite 7/Tailwind 4/Express 5/Node 24 และ SQLite + browser IndexedDB. การจำลองภาพไม่จำเป็นต้อง downgrade เป็น Node 20, Zod 3, Tailwind 3 หรือย้ายโฟลเดอร์. Node 20 จะไม่รองรับ built-in SQLite ที่ระบบใช้อยู่.

## ความสามารถตามจริง

คำตอบ/หลักฐาน/metric ใน preview มีป้ายข้อมูลตัวอย่าง. การเปลี่ยน tone เลือกข้อความตัวอย่างที่เตรียมไว้ ไม่ใช่ inference. ปุ่มเปิดระบบจริงนำไปยัง workspace ที่มีอยู่. เฉพาะการกด “เปิดต่อใน Studio จริง” จึงสร้าง code document ใหม่; มี test ยืนยันการเปิด preview ไม่สร้างข้อมูลผู้ใช้.

ไมโครโฟนและ sensors ไม่เปิดใน preview. ไม่มี AI classification/vector retrieval/LLM streaming, Firebase identity, Firestore/Drizzle cloud migration, Yjs collaboration, payments หรือ AI auto-fix ที่เชื่อมใหม่. ไม่มีการแสดง confidence, presence, billing หรือความสำเร็จของงานภายนอกจำลอง.

Sandbox reuse core เดิม: `allow-scripts`, ไม่มี `allow-same-origin`, CSP ปิด network/form/object/frame/worker, ตรวจ source + opaque origin + nonce. ไม่เรียกสิ่งนี้ว่า air-gapped และไม่อ้าง HMAC authentication ที่ยังไม่ได้ทำ. Source code ภายใน iframe อ่าน nonce ของตนได้; การ isolate และตรวจ bounded messages เป็นขอบเขตความปลอดภัยที่มีจริง.

## หลักฐาน

- `tests/e2e/concept.spec.ts`: 4 browser journeys ใหม่สำหรับ sample provenance/no implicit saved work, actual controls, real sandbox/parent isolation + saved-editor handoff และ mobile/search/dialog navigation.
- `scripts/verify-concept.mjs`: screenshots + default-state axe + page overflow ที่ 320, 360, 390, 768, 1024, 1280, 1440, 1536 px (3 screens × 8 widths).
- `tests/evidence/concept/`: ผล run จริง, source manifest และภาพที่เปิดตรวจด้วยตา. การจำลอง viewport ไม่ใช่ผลจาก real devices. ไม่มีการอ้าง WCAG certification, 0.8% pixel match, 85% code coverage, INP หรือคะแนน Lighthouse ของ preview โดยไม่มีการวัด.

งานเก็บรายละเอียดทุก workspace ของผลิตภัณฑ์หลักยังเป็นงานต่อเนื่อง; รอบนี้ส่งตัวอย่างสามหน้าตามทิศทางล่าสุด โดยคง tools และข้อมูลเดิม. ดูแผนต่อใน `NEXT_ACTIONS_TH.md` และสถานะ deployment ล่าสุดใน `DEPLOYMENT_REPORT.md`.

## ผลตรวจที่บันทึก

- Full regression: 41 browser/API tests ผ่าน (37 เดิม + 4 ใหม่). หลังแก้เฉพาะ typography/drawer/shortcut ของ concept ตรวจ 4 journeys ที่ได้รับผลซ้ำผ่าน.
- Unit: 16 ผ่าน. TypeScript และ server/browser build ผ่าน.
- 24 default-screen cases ผ่าน axe WCAG tags, ไม่มี page overflow และหัวข้อ hero ไม่ถูกตัด. เพิ่มการตรวจ bounding range ของข้อความ เพราะการซ่อน overflow ของการ์ดอาจทำให้การตรวจ page overflow อย่างเดียวไม่พบปัญหา.
- Drawer และ Search ที่ 390px ใน Light/Dark Studio อีก 4 states ผ่าน axe.
- Built browser edition: render 3 screens, actual Run/opaque-origin parent denial และ explicit save-to-Studio/reload persistence ผ่าน; ไม่มี page errors ที่สังเกตได้.
- รอบก่อน freeze เคยพบ dev hot reload ระหว่าง synthetic recording ทำให้ test การหยุด/backup ต่อเนื่องล้มเหลว; หยุดแก้ source ระหว่าง full regression และรันซ้ำแล้วผ่าน 41 รายการ. เป็นหลักฐานรอบใหม่ ไม่แทนผลล้มเหลวด้วยการเปลี่ยน baseline.
- ไม่มีการทดสอบ TTS voice quality, microphone live STT, real-device gestures, provider inference หรือ production browser interaction หลัง protection ในรอบนี้.
