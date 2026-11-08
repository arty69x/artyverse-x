# ARTYVERSE X V3 — วิธีใช้และขอบเขตส่งมอบ

ติดตั้ง Node 24 ขึ้นไป แล้วรัน `npm ci` และ `npm run dev`. เปิด http://localhost:5173. หรือใช้ `npm run build && npm start` แล้วเปิด http://localhost:4311. ไม่ต้องมี API key สำหรับเครื่องมือ local.

## สิ่งที่เปลี่ยน

- ระบบภาพใหม่ dark/light/system พร้อมจำการตั้งค่า, typography ไทย–อังกฤษ, sidebar แบ่งกลุ่ม, command palette ใช้ keyboard, drawer/bottom navigation บนมือถือ
- Home ใหม่พร้อม ARCYCA SVG ต้นฉบับ, composer, actual metrics/recent work และจัดเรียง portal ได้
- Projects ค้นหา grid/list/detail แก้ชื่อ ทำสำเนารายการ และ trash/undo
- Copilot / Practice / Question Bank ใช้บทสนทนาและหลักฐานจริง สร้างโครงร่างที่แก้ไขได้ และส่งต่อ Agent Studio
- Marketplace รวม original starters ที่ preview และสร้างเอกสาร/brief ใหม่ได้จริง; Analytics นับจากรายการที่บันทึก
- Design System 11 ส่วนจาก tokens/components ที่ใช้จริง พร้อม Design OS/Motion Lab เดิม
- เครื่องมือ V2 ทั้งหมดและข้อมูลเดิมคงอยู่; แก้ contrast, keyboard และ dialog focus ร่วมกัน

## ความสามารถที่ต้องอ่านตามจริง

Copilot local outline ไม่ใช่ AI inference; ข้อมูลขาดยังเป็น placeholder. Browser STT ต้องได้รับสิทธิ์และอาจใช้บริการออนไลน์ของเบราว์เซอร์; ใช้ข้อความแทนได้. ไม่มีระบบ cloud identity, remote multiplayer, commerce/community backend หรือ scheduler ที่เชื่อมใหม่. Vercel ผูกโปรเจกต์แล้ว แต่การ deploy backend เต็มระบบยังต้อง persistent storage และ identity.

ชุด ZIP รวม source, build, assets/fonts/ใบอนุญาต, branding เดิม, blueprint/reconstructed/design extraction/Framer research และหลักฐาน V3. ไม่รวมฐานข้อมูลหรือไฟล์งานส่วนตัว, node_modules, secrets หรือ recovery snapshots. ติดตั้ง dependencies ก่อนรัน.

ดูผลตรวจจริงใน VERIFICATION_REPORT.md และข้อจำกัดใน KNOWN_LIMITATIONS.md. ภาพที่มี QA fixtures เป็นข้อมูลทดสอบที่ระบุชื่อชัดเจน; แอปติดตั้งใหม่ไม่สร้างประวัติผู้ใช้จำลองให้เอง.

## เอกสารและหลักฐาน

- ARTYVERSE_X_MASTER_SPEC.md และ artyverse-design-master.json: ขอบเขตระบบที่รวมแล้ว
- DESIGN_TOKENS.json: export จาก shared/design.ts
- COMPONENT_COVERAGE.md และ MOTION_COVERAGE.md: coverage ตามจริง
- docs/v3/: แผน, workflow, normalization, acceptance และข้อจำกัด
- tests/evidence/v3/: ผลทดสอบ ภาพหน้าจอ Lighthouse และ source fingerprint
- MIGRATION_AND_ROLLBACK.md: recovery และขอบเขต deployment
- docs/v2/VERIFICATION_REPORT.md: หลักฐานรุ่นก่อน แยกจาก V3

แพ็กด้วย `python3 scripts/package-v3.py` หลังตรวจ fingerprint. ชื่อ ZIP: ARTYVERSE_X_V3_HYPER_POLISH.zip.

ผลตรวจสุดท้าย: typecheck/build ผ่าน, unit 16 และ browser/API 37 tests ผ่าน. Lighthouse mobile simulation: Performance 96, Accessibility/Best Practices/SEO 100, LCP 1.3s. ดูเงื่อนไขใน VERIFICATION_REPORT.md.

## รุ่น Git/Vercel ต่อจาก ZIP เดิม

ดู DEPLOYMENT_REPORT.md สำหรับ URL และ release commit ปัจจุบัน. บน Vercel งานอยู่ใน IndexedDB ของเบราว์เซอร์ ต้อง backup ก่อนล้างข้อมูลหรือย้าย origin. SQLite server edition ยังใช้ได้. แผนงานต่อและ checkpoint: docs/v3/NEXT_ACTIONS_TH.md. ชุดใหม่แพ็กด้วย scripts/package-hosted.py; ZIP เดิมเป็น baseline ก่อน hosted edition.
