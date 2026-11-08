# ARTYVERSE X V2 — ชุดส่งมอบรวม

โปรแกรมรุ่นใหม่: **Creative Operating Studio — Artist × Multiverse**

## เริ่มใช้งาน

ติดตั้ง Node 24 ขึ้นไป แล้วรันในโฟลเดอร์นี้:

```sh
npm ci
npm run dev
```

เปิด http://localhost:5173. หรือ `npm run build && npm start` แล้วเปิด http://localhost:4311. `dist/` เป็น build ที่ตรวจแล้ว; API/SQLite ยังต้องรันด้วย Node ไม่ใช่อัปโหลด HTML อย่างเดียว. เครื่องมือ local ไม่ต้องมี API key. ไม่มี secrets หรือฐานข้อมูลงานส่วนตัวอยู่ในชุดส่งมอบ.

## ของที่รวมไว้

- source และ built assets ของ ARTYVERSE X V2
- Projects, Agent Studio, Node Studio, Code Studio, Sound Lab, Dynamics, Story Studio, System & costs
- Canvas, Chat, Research, Voice, Live, Templates, Library, Design OS/Motion Lab ที่รักษาไว้
- branding เดิมและ Fade W studies พร้อม SVG/fonts/ใบอนุญาตและต้นฉบับที่ผู้ใช้ให้
- `ARTYVERSE_X_MASTER_SPEC.md`: สรุปแบรนด์ ระบบ หน้าจอ ความสามารถ และขอบเขต
- `docs/v2/`: สถาปัตยกรรม, scope, requirement decisions และ normalization
- `VERIFICATION_REPORT.md` และ `tests/evidence/v2/`: ผล build, tests, screenshots, performance sample และ fingerprint
- `MIGRATION_AND_ROLLBACK.md`: การย้ายและย้อนกลับอย่างปลอดภัย
- `research/` ใน ZIP รวม: blueprint.zip เดิม, reconstructed archive, design extraction และ Framer research archive จากรอบศึกษาเดิม พร้อม summary/provenance; ไม่ถือเป็นผลทดสอบของแอปใหม่

## ผลตรวจและขอบเขต

Build ผ่าน, unit 10 และ browser/API 27 รายการผ่าน. ตรวจ built app แยก รวม 18 visual/accessibility cases, ภาษาไทยบนมือถือ, Code interaction/save, V2 backup restore และ V1 compatibility. ดูเงื่อนไขและหลักฐานในรายงาน ไม่ตีความเป็น certification.

นี่คือ personal local release ที่ใช้งานได้ตามขอบเขตข้างต้น. Public multi-user/cloud sync/authentication, transcription, external scheduler และ live AI provider ยังไม่เชื่อม. Advanced tools ยังมี English microcopy และต้องตรวจ sensor/touch/audio บนอุปกรณ์จริงเพิ่ม. รายละเอียดครบใน KNOWN_LIMITATIONS.md.
