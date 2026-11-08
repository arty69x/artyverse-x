# Fade W — Identity studies v2

## สถานะ

เป็นชุดศึกษาโลโก้ตามไฟล์ที่ผู้ใช้แนบ ไม่ใช่การเปลี่ยนชื่อแบรนด์หรือแทนโลโก้ของแอปเดิมโดยอัตโนมัติ เก็บ Brand Kit / Orbital A รอบก่อนครบถ้วน

**แกนที่ใช้:** w ค่อย ๆ บางจากซ้ายไปขวา พร้อมจุด Deep Pink ที่สื่อเสียงที่ยังเหลือ ไม่มีกล่องเป็นส่วนหนึ่งของสัญลักษณ์

## สิ่งที่ตรวจพบจากต้นฉบับ — Observed

- SVG `6-whisperx-new-1-fade-w.svg` มี viewBox `-6 -6 112 112` เส้น 4 ช่วงหนา 16 / 12 / 8 / 5 หน่วย จุดอยู่ (92,22), radius 6 สี #D4006A
- แม้ภาพดูเป็น w เส้นเดียว ไฟล์ต้นฉบับไม่ได้เป็น variable-width stroke เดียว แต่เป็น path 4 เส้นปลายมน
- Guideline ระบุ Poppins 200/800, IBM Plex Sans Thai 200/700, Lime #D7E317, Pink #D4006A, พื้นขาว/ดำ และเส้นใต้กว้าง 25%
- ตัวเลือกเดิมมี split wordmark, wX, stacked, centered, underline, orbit และ capsule บางส่วนเป็นองค์ประกอบประกอบในไฟล์ ไม่ใช่โลโก้ที่เลือกสุดท้าย
- ไฟล์ต้นฉบับทั้ง 6 เก็บ byte-identical ใน `sources/` พร้อม hashes ใน design-data.json ไม่ execute scripts ในไฟล์ต้นฉบับเพื่อสร้างบอร์ดนี้
- SVG ที่แนบมี metadata C2PA เก็บไว้ในต้นฉบับ ไม่ได้ตรวจรับรองลายเซ็น และไม่ได้ย้าย metadata เดิมมาอ้างสิทธิ์กับงานที่ดัดแปลงแล้ว

## แบบที่เสนอ — Proposed

| แบบ | หน้าที่ | ข้อสรุป |
|---|---|---|
| 01 Source W | เทียบ geometry เดิม + lockup ที่เสนอ | อ้างอิง ไม่ใช่หลักฐานว่า wordmark ใหม่อยู่ในต้นฉบับ |
| 02 Continuous W | โลโก้แนวนอนหลัก | แนะนำ เส้น outline ต่อเนื่อง ชื่อบาง / X หนา สีเดียวกับชื่อ จุดชมพูเป็น accent หลัก |
| 03 Underline | หัวเว็บและ editorial | ผสมเส้นใต้ 25% ของความกว้างคำที่คำนวณจาก glyph advances |
| 04 Split | โปสเตอร์/พื้นที่แคบ | คำสองบรรทัด บาง → หนา X Pink |
| 05 Centered | Splash, cover, print | สัญลักษณ์ด้านบน ชื่อด้านล่าง |
| 06 wX | Secondary monogram | ไม่มีกล่อง; favicon ใช้ Micro W อย่างเดียวจะโปร่งกว่า |
| 07 Orbit W | งานภาพเชิงทดลอง | ผสม Orbit กับ W ไม่ใช้ที่ 16 px |
| 08 Brand architecture | ARTYVERSE / Whisper Studio | แยก master brand Artist × Multiverse กับเครื่องมือ Whisper |

ชื่อ WhisperX คงไว้เพราะ W และเสียงกระซิบสัมพันธ์กันโดยตรง มีตัวเลือก ARTYVERSE X ในหน้าเปรียบเทียบเพื่อดูงานประยุกต์ ไม่อธิบายว่า W คือ A และยังไม่ได้สรุปว่าผู้ใช้เลือก architecture 08

## Optical sizes

- **Display:** ความหนาเริ่ม 16 → ปลาย 3.5 หน่วย จุด radius 6 เหมาะกับขนาดมากกว่า 24 px
- **Micro:** ความหนาเริ่ม 18 → ปลาย 9 หน่วย จุด radius 7 ใช้ 16–24 px โดยลดความต่างของน้ำหนักให้ปลายยังมีน้ำหนัก
- **Auto:** สลับ Micro เมื่อขนาดไม่เกิน 24 px
- อ้างอิง viewBox กว้าง 112 หน่วย: ที่ 16 px ปลายต้นฉบับ ≈ 0.71 CSS px, Display ≈ 0.50 CSS px, Micro ≈ 1.29 CSS px ค่านี้คำนวณจาก geometry ไม่ใช่ผลนับ pixel จริงหลัง anti-alias
- สัญลักษณ์หลักเป็น closed outline path เดียว + circle ไม่ใช่ภาพ raster และไม่ใช่ stroke ที่ใช้ gradient opacity ปลอมความหนา
- ตารางแสดง 16/20/24/32/48/64 ที่ขนาด CSS จริง ส่วนคอลัมน์ 120 ย่อ preview ลง 64 และติดป้ายชัดเจน Slider ทดสอบ 16–128 แสดงขนาดจริง
- ขนาดต่ำสุดที่แนะนำ: 16 px สำหรับ Micro mark เท่านั้น Wordmark พร้อมชื่อควรใหญ่กว่านั้นมาก ตรวจตามบริบทจริง

## สีและการใช้

พื้นขาวใช้เส้นดำ พื้นดำใช้เส้นขาว พื้น Lime ใช้เส้นดำ จุดเป็น #D4006A ไม่ลด opacity ทั้งโลโก้เพื่อทำเสียงกระซิบ ไม่ใส่ glow, shadow หรือ container เป็นส่วนบังคับของเครื่องหมาย

ค่าของชุดนี้ยึดไฟล์แนบใหม่: #D7E317 / #D4006A ต่างจาก #CCFF00 / violet ใน ARTYVERSE Brand Kit รอบก่อน เป็นการศึกษาแยกชุด ไม่ได้แก้ tokens ของแอปเดิม

ใช้พื้นที่ว่างอย่างน้อยประมาณ 1/4 ความกว้างเครื่องหมายรอบนอกในงานประกอบ โดยไม่ใช้ clear space ที่ฝังใน SVG เป็นพื้นที่ทั้งหมดเสมอ ตรวจจุดชมพูไม่ติดขอบเมื่อทำ favicon

## ฟอนต์และไฟล์ส่งออก

โหลด Poppins 200/800 และ IBM Plex Sans Thai 200/400/700 จากไฟล์ภายในชุด ไม่มี Google Fonts request ฟอนต์มาจาก Fontsource พร้อม SIL OFL notices

ชื่อใน SVG ที่ส่งออกถูกแปลงเป็น outlined paths ด้วย FontTools จาก Poppins ไม่ต้องติดตั้งฟอนต์ปลายทาง Wordmark ไม่ใช่ข้อความที่เปลี่ยนชื่อได้ในโปรแกรมกราฟิกโดยพิมพ์ทับโดยตรง ให้ใช้แหล่งสร้างหรือแก้ path ตามงาน

SVG symbol/lockup ตามธีม ดาวน์โหลดได้จริง หน้า viewer ส่งออก PNG ผ่าน browser canvas ที่ขนาด 16–2048 px สำหรับ symbol และรักษาสัดส่วน lockup พื้นโปร่งใสเลือกได้

SVG symbol ใช้ optical ตาม preview; PNG symbol ในโหมด Auto ใช้ขนาด PNG ที่เลือกเป็นตัวตัดสิน รุ่น Micro จึงถูกใช้กับไฟล์ 16/24 px โดยอัตโนมัติ ตัวอย่าง PNG สำเร็จอยู่ assets/fade-w-auto-*.png

## วิธีเปิด

เปิด index.html ใน browser โดยมี design-data.js, studio.js, style.css และ fonts อยู่ด้วย หรือใช้ static server:

```sh
python -m http.server 8866 --bind 127.0.0.1
```

เปิด http://127.0.0.1:8866 จากโฟลเดอร์ชุดนี้ ไม่มี API keys, backend หรือ account ที่จำเป็น

## การตรวจสอบและข้อจำกัด

ดู `evidence/verification.json` สำหรับ browser และ checks ที่รันจริง มีการตรวจธีม การเลือก 8 แบบ ตัวเลือกแบรนด์ การส่งออก SVG แบบไม่มี text nodes, PNG signature/ขนาด และ overflow ที่ 320/390/768/1024/1440/1920 px

ภาพ screenshot และ PNG เป็นการ render ใน Chromium ที่ DPR 1 ไม่ใช่การทดสอบ real iPhone/iPad หรือการรับรองว่าโลโก้จะอ่านเหมือนกันบนทุกจอ ไม่มีการอ้าง pixel-perfect, trademark clearance หรือการจดทะเบียน ผล contrast ใน contrast.json เป็นเฉพาะคู่สีทึบที่คำนวณ ไม่ใช่ certification ของทุกหน้าจอ

การ build asset ใหม่ใช้ Python FontTools พร้อม WOFF decoder (zlib) และไฟล์ฟอนต์ใน fonts/ ไม่จำเป็นต้องใช้ Brotli decoder สำหรับ outlined exports หน้า browser ยังใช้ WOFF2 ได้ตามปกติ
