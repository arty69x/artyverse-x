# ARTYVERSE X — Framer ecosystem integration plan

สถานะ: แผนใช้งานและ shortlist ที่ตรวจจากหน้าเว็บสาธารณะ ณ 2026-11-07 ไม่ใช่รายการที่ซื้อ remix ติดตั้ง import หรือทดสอบในโปรเจกต์แล้ว รอบนี้ยังเป็นการสรุปก่อนเริ่ม implementation ตามคำขอผู้ใช้

## แหล่งที่ผู้ใช้กำหนดและวิธีใช้

| แหล่ง | ใช้กับ ARTYVERSE X | วิธีนำมาใช้ / ขอบเขต |
| --- | --- | --- |
| Templates | Home, product introduction, showcase, Help/marketing pages | เลือก template ที่มีโครงและสิทธิ์ตรงงาน; remix เข้า Framer เมื่อมี project/remix link ที่ตรวจแล้ว |
| Components | Text reveal, cards, gallery, navigation, presentation surfaces | คัดเฉพาะ component ตรง workflow; ปรับ typography/tokens และทดสอบ property/state/responsive; ตรวจความเข้ากันได้ก่อนใช้ใน React ภายนอก |
| Plugins | จัดการ assets, gradient, icon/vector workflow, design/export tooling | เป็นเครื่องมือใน Framer editor หรือบริการเฉพาะ; ไม่ถือว่าเป็น runtime API ของแอปอัตโนมัติ |
| Vectors | UI icons, orbit/shape illustrations, empty states | เลือกชุดสอดคล้องกัน; เก็บ provenance/license; ตรวจรูปแบบส่งออกและปรับสีตาม tokens |
| Community Gallery | Composition, spacing, hierarchy, typography, choreography references | บันทึก reference เฉพาะส่วน; การแสดงใน Gallery ไม่เท่ากับมีสิทธิ์ remix/source ของเว็บไซต์ |
| Framer Motion / Motion for React | Animation runtime ของ UI ที่เราพัฒนา | ใช้หนึ่งแพ็กเกจต่อ build ตามบริบท; แชร์ motion contracts และ reduced-motion policy |

## Architecture ที่เสนอ

- Framer project: visual authoring / remix / reusable presentation components / public-facing pages ตามชิ้นที่เลือก
- React/TypeScript workspace: Chat, Meeting, capture, data persistence, Research, Create, Library, automation และ secure provider contracts
- Shared design contract: colors/type/space/radius/motion, asset provenance และ component props/data adapters
- ไม่ผูก inference หรือ session persistence เข้ากับ template ทางการตลาด; interaction สวยไม่ใช่หลักฐานว่ามี AI/backend แล้ว
- รายการ Marketplace เป็น candidate หรือ imported asset เท่านั้น ไม่เรียกว่า connected integration จนมีหลักฐานจริง

Hybrid เป็นข้อเสนอ ไม่ใช่การเปลี่ยน hosting/URL/access policy หรือสร้าง Framer project โดยอัตโนมัติ

## Shortlist เริ่มต้น

### Templates — ฟรีตามหน้ารายการที่ตรวจ

1. DeepOcean — https://www.framer.com/marketplace/templates/deepocean/
   ใช้พิจารณา Home แบบ composer-first/assistant entry ตามคำอธิบายผู้สร้าง; ปรับเป็น identity cosmic ของ ARTYVERSE X ไม่เปลี่ยนแบรนด์เป็น deep-sea โดยเงียบ ๆ คำกล่าวเรื่อง working AI ใน template ต้องตรวจแยกจากความสามารถจริง
2. Camo — https://www.framer.com/marketplace/templates/camo/
   ใช้พิจารณาพื้นที่สงบ/technical hierarchy และ single-accent material สำหรับ product presentation; ยังไม่ใช่ UI ของ meeting/editor ที่ทำงานครบ
3. Pretty — https://www.framer.com/marketplace/templates/pretty/
   ใช้พิจารณา SaaS feature/section composition; ไม่คัด pricing/account claims มาเป็นระบบที่เชื่อมแล้ว

### Components / vectors / plugins

- 3D SpatialGallery — https://www.framer.com/marketplace/components/3d-spatialgallery/
  Candidate สำหรับ showcase/media corridor; ผู้สร้างระบุ WebGL tunnel และ controls หลายค่า ต้องทดสอบ performance, keyboard, touch, context loss และ reduced motion เอง
- Text Reveal — https://www.framer.com/marketplace/components/xDgp5el32fHNjPkyEMsb/
  Candidate สำหรับ headline/section text; ต้องตรวจ Thai graphemes/line wrapping และ native typography ไม่ใช้กับ transcript ที่กำลังเปลี่ยนหรือบทพูดที่กำลังอ่าน
- coolicons — https://www.framer.com/marketplace/vectors/coolicons/
  Candidate icon set; เลือกให้สัมพันธ์กับ icon language ของโปรแกรมและตรวจสิทธิ์ใช้นอก Framer
- ShaderGradient — https://www.framer.com/marketplace/plugins/shadergradient/
  Candidate สำหรับ atmospheric backgrounds ใน Framer; มี React package ที่ผู้สร้างชี้ไว้ ต้องตรวจ package/API/license แยกก่อนใช้ภายนอก ปิดใน Meeting Power Saver/Off และมี static fallback
- React Export — https://www.framer.com/marketplace/plugins/react-export/
  Optional export workflow; หน้าที่ตรวจระบุ paid monthly subscription และแยก commercial plan ไม่ใช่ default dependency ของ free-first build ยังไม่ได้สมัครหรือรัน CLI

หน้า detail ที่ตรวจแสดง Limited license สำหรับหลายรายการ คำว่า Free ไม่ได้ถูกตีความเป็นสิทธิ์แจกจ่าย source/repackage/resell หรือ unrestricted external use อัตโนมัติ ต้องบันทึก terms ของชิ้นที่เลือกก่อนนำเข้าจริง

## Motion runtime ตามเอกสารปัจจุบัน

React project ใหม่ภายนอก Framer:

```tsx
// npm install motion
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
```

Framer Code Components / Overrides:

```tsx
import { motion, AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
```

อ้างอิง https://motion.dev/docs/react และ https://motion.dev/docs/framer

ไม่มีการติดตั้งทั้งสอง package เป็น animation engines ซ้อนกันโดยไม่จำเป็น และยังไม่ได้ติดตั้งในโปรเจกต์จากแผนนี้

## การใช้ motion ในแต่ละพื้นที่

| Surface | Motion ที่เสนอ | ข้อจำกัด |
| --- | --- | --- |
| Home | Restrained entrance, orbit/mascot, composer transition | ไม่บล็อกการพิมพ์/คลิก; hero motion หนึ่งจุดหลัก |
| Shell | Panel/drawer transitions, active navigation | Focus และ keyboard ต้องต่อเนื่อง; ลด motion ได้ |
| Chat | Message/artifact entrance, contextual panels | Streaming ตาม provider events จริง; ไม่ typewrite คำตอบปลอม |
| Meeting | Feedback จาก capture/record/save จริง | หยุด decoration; capture/persistence สำคัญกว่า animation |
| Reader | Revision transition ที่ผู้ใช้เลือก, reading controls | ไม่แก้บทที่กำลังอ่านกลางทาง; ไม่ scramble/typewrite live script |
| Create | Selection feedback, layer reorder, inspector changes | ไม่ให้ layout animation แข่งกับ document coordinates หรือ drag engine |
| Library | Card/detail transition, filter/reorder | Controls ไม่ถูก inactive cards บัง; mobile alternative |
| Motion Lab | Preset preview, replay/pause, effect authoring | Shared schemas, actual validation, visibility cleanup และ budgets |

Kinetic typography ยังคงใช้ Canvas เมื่อเหมาะสม Motion ใช้ควบคุม UI/scene values รอบ engine ไม่อัปเดต React state ทุก frame และไม่อ้าง zero overhead หรือ FPS โดยไม่มีการวัด

## Resource acceptance workflow

Discover → shortlist → preview → check terms/cost/access → acquire/remix → inspect source/property contracts → normalize with ledger → integrate → verify → record evidence.

เก็บ id, source URL, creator, license label/terms URL, acquisition proof, original props, normalized tokens, compatible targets, dependencies, cost state, fallback และ verification evidence

ไม่มีการซื้อ สมัครบริการ รัน third-party plugin หรือ publish site ในรอบนี้ รายการยังมีสถานะ candidate

## Export uncertainty ที่ต้องตรวจเมื่อเลือก workflow

เอกสาร Framer Help ที่ตรวจพบมีข้อความต่างกัน: หน้า porting-your-data กล่าวถึงการนำ published output ออกไปใช้ ส่วนหน้า can-i-export-my-website-to-html-and-self-host-it ระบุว่าไม่มี HTML export สำหรับ self-hosting จึงไม่สรุปว่าได้ editable React source หรือ self-hosting ครบทุกบริการโดยอัตโนมัติ ต้องทดสอบ export mechanism/selected plugin กับ project จริง รวม CMS, fonts, assets, forms และ dependencies

- https://www.framer.com/help/articles/porting-your-data-from-framer/
- https://www.framer.com/help/articles/can-i-export-my-website-to-html-and-self-host-it/

## ผลส่งมอบรอบถัดไป

Framer selection board + reference screenshots, resource/rights registry, module-to-component matrix, shared motion tokens/presets, native Framer component adaptation หรือ React adapter ที่รองรับจริง และผลตรวจ mobile/focus/reduced-motion/performance แยกจากคำกล่าวของผู้สร้าง
