# แผนงานต่อจากรุ่น Git/Vercel

## เสร็จในรอบนี้

- รักษา source V3 และ checkpoint/recovery บน Git
- เพิ่ม browser edition สำหรับ Vercel โดยไม่ใช้ SQLite ชั่วคราวใน serverless
- คง server edition และข้อมูล local เดิม
- ตรวจ persistence/revision conflict/media/backup/restore/invalid input/local tool ของ browser edition และ regression ของ server edition
- บันทึก deployment ID, commit, URL, access policy และ rollback ตามผลจริง

## งานลำดับถัดไป

1. **ตรวจบนเครื่องจริง:** iPhone/iPad/Android, keyboard, screen reader, microphone permission/cleanup, module service worker/IndexedDB, Safari storage eviction, sensor และ motion. ใช้รายงานจริงแยกจาก headless simulation.
2. **Cloud persistence + ownership:** ออกแบบ data adapter รองรับ auth และ owner/project roles ก่อนเปิด shared backend. เลือก durable SQL/object storage และกำหนด quota/cost budget. Migration ต้อง preview, stable IDs, transactional records, media validation และ rollback; browser backup ยังใช้โอนข้อมูลได้.
3. **AI provider จริง:** ตั้ง secrets เฉพาะ server, cancellation/quotas/cost limits และทดสอบคำตอบพร้อม citation จากหลักฐานจริง. ห้ามอ้าง deterministic outline เป็น inference. ไม่ส่งข้อมูลส่วนตัวไป provider โดยอัตโนมัติ.
4. **Collaboration:** หลัง identity/ownership พร้อม จึงเพิ่ม role/invite/presence และ conflict handling. ตรวจสอง browser + offline convergence จริง.
5. **Advanced tools:** Canvas grouping/locking/snapping; Motion presets ที่ยังขาด; localization ของคำอธิบาย legacy; Studio auto-fix แบบ diff/review และ sandbox isolation. แต่ละส่วนมี acceptance/evidence ก่อนนับ coverage.
6. **Commerce/community/scheduling:** ต้องมีบริการจริง สิทธิ์ และนโยบายข้อมูล จึงเปิด checkout, moderation และ background scheduler. ระหว่างนี้คง unavailable และ labeled local starters.

อย่าใช้เปอร์เซ็นต์ความสำเร็จรวมที่ไม่มี inventory/เกณฑ์รองรับ. ใช้ Required/Implemented/Verified/Blocked ใน COMPONENT_COVERAGE.md และ MOTION_COVERAGE.md. บันทึกหลักฐานกับ source revision และทำให้ stale เมื่อสิ่งที่เกี่ยวข้องเปลี่ยน.

## ขอบเขตค่าใช้จ่ายและสิทธิ์

รอบนี้ไม่เพิ่มบริการเสียเงิน, ฐานข้อมูล cloud, API keys, billing, domain หรือเปลี่ยน Vercel deployment protection. การเชื่อมบริการต่อไปต้องมีบัญชี/สิทธิ์และ budget ที่เหมาะกับบริการนั้น. ไม่ต้องทำลาย local edition เพื่อพัฒนาต่อ.
