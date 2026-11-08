# ARTYVERSE X — Creative Intelligence Workspace

ฉบับออกแบบระบบใหม่ · 7 พฤศจิกายน 2026 · ขอบเขตส่งมอบ: แอปสำหรับใช้งานในเครื่อง พร้อม source, local backend และ Framer design companion

## แนวคิดใหม่

ARTYVERSE X เป็นพื้นที่ที่เปลี่ยน **ความคิด → บริบท → ชิ้นงาน → การนำเสนอ → ความทรงจำของงาน** ให้ต่อเนื่องกัน ผู้ใช้ไม่ต้องเริ่มต้นใหม่ทุกครั้งที่เปลี่ยนเครื่องมือ สิ่งที่เชื่อมระบบคือเอกสารและที่มาของงาน ไม่ใช่การใส่ chatbot ไว้ทุกหน้า

แกนผลิตภัณฑ์มีสามพื้นที่:

1. **Capture & Understand** — Conversations, Research, Voice: เก็บต้นฉบับ ข้อคิด แหล่งข้อมูล และเสียงจริง
2. **Create & Express** — Create, Templates, Live: จัดองค์ประกอบ แก้ไข ส่งออก และนำเสนอ
3. **Organize & Refine** — Library, Automate, Design OS: กลับมาทำต่อ ลดงานซ้ำ และควบคุมภาษาออกแบบ

Home เป็นจุดเริ่มต้นที่สงบและมีบุคลิก ส่วนเครื่องมือเชิงลึกจะปรากฏเมื่อผู้ใช้เข้าสู่ workspace ที่เกี่ยวข้อง

## ขอบเขตความสามารถและหลักความจริง

- **Local working:** บันทึกและแก้ข้อความ, editor, local workflow, การบันทึกเสียง, cue presentation, presets, SQLite persistence, backup/restore และ export
- **Connected:** ไม่มี provider AI หรือ cloud service ที่เชื่อมอยู่ในชุดส่งมอบนี้
- **Unavailable:** AI inference, transcription, cloud accounts/sync, scheduler, external action execution แสดงสถานะตรงไปตรงมา
- แอปไม่สร้างคำตอบ AI, transcript หรือ progress ปลอม และไม่อ้างว่างานจะทำต่อหลังปิด browser
- เทมเพลตและ motion scenes เป็นตัวอย่างที่มีป้ายกำกับ งานใน Library มาจากการบันทึกของผู้ใช้จริง
- นี่คือ local application release ไม่ใช่บริการ SaaS ที่เปิดให้ผู้ใช้หลายคนใช้งานทางอินเทอร์เน็ตได้ทันที

## โครงสร้างหน้าและเครื่องมือ

| พื้นที่ | หน้าที่และความสามารถที่สร้างแล้ว | Input → Output | ขั้นถัดไป |
|---|---|---|---|
| Home | cinematic planet, native composer, tool portals, template samples, งานล่าสุดจริง, tour | ความคิด → conversation ที่บันทึกแล้ว | Conversations / Templates |
| Conversations | สร้างประวัติ, draft ต่อบทสนทนา, แนบ text/Markdown/CSV, copy, edit as new, ส่งข้อความเข้า Create | ข้อความของผู้ใช้ → บันทึกที่มี stable message ID | Create / Library |
| Explore | workspace portals หกแบบ, ค้นหาตามหน้าที่ | งานที่ต้องการทำ → เครื่องมือที่พร้อมเริ่ม | workspace ที่เลือก |
| Templates | หก original templates, categories, search, preview, สร้างเอกสารใหม่ | เทมเพลต → document ใหม่ ไม่ทับของเก่า | Create |
| Create | text/shape/image, select, drag, resize, numeric geometry, layers, reorder, duplicate/delete, align, zoom/fit, undo/redo, save revisions, SVG/JSON export, presentation | document coordinates → เอกสารที่แก้ต่อได้และไฟล์ส่งออก | Library / Present |
| Research | notes, source records, tags, draft, save, selection transfer, Markdown export | ข้อความและแหล่งอ้างอิง → note / document / conversation | Create / Conversations |
| Voice | permission จาก user gesture, input meter, recording timer, stop, playback, title, save/discard, cleanup | microphone stream จริง → audio asset + recording record | Library / text alternative |
| Live | ชื่อ session, notes, cue cards, timer, pause/resume/finish, cue presentation, keyboard navigation, local save | เนื้อหาที่ผู้ใช้เตรียม → session ที่กลับมาเปิดได้ | Library / Presentation |
| Automate | local three-stage flow: input → transform → output, validation, deterministic actions, run result, export, saved workflows | ข้อความ → outline / uppercase / word & grapheme count | Save / export |
| Library | grid/list, type filter, title search, sort, open, rename, duplicate, trash/restore, metadata, JSON export, recording viewer | งานจริงของผู้ใช้ → งานที่เปิดต่อได้ | editor/viewer ตามชนิด |
| Settings | TH/EN สำหรับส่วนหลัก, accent, motion quality, integration status, storage measurement, backup preview/merge, shortcuts | preferences / backup → local configuration / restored records | กลับไปทำงาน |
| Design OS | Overview, Tokens, component family registry, shared Layout Studio, Motion Lab, verification scope, export, browser virtual JSON review | tokens / presets / JSON → preview/apply/checkpoint/export | shared editor / Motion Lab |

### ลักษณะ UX ของแต่ละพื้นที่

**Home:** เปิดมาพบประโยค Intelligence, in motion. วางบนขอบดาวเคราะห์ แสง lime ซ้ายและ violet/blue ขวา เส้นวงโคจรเป็นรายละเอียดรอง composer อยู่กลาง ไม่ต้องรอ intro animation เมื่อส่งข้อความ จะสร้าง conversation และไปต่อในระบบเดียวกัน

**Conversations:** แสดงเนื้อหาของผู้ใช้อย่างชัดเจน ไม่มี assistant response จำลอง ประวัติอยู่ซ้ายบน desktop ที่กว้างพอ หน้าจอแคบใช้ Library เป็นทางเข้าประวัติร่วมกัน composer อยู่ล่างของพื้นที่อ่าน ไม่บังคับ scroll ขณะอ่านย้อนหลัง

**Create:** ลำดับงานคือเลือก → แก้ → ตรวจ → บันทึก toolbar แยกการเพิ่ม element กับ viewport controls ด้านซ้ายเป็น layer list ด้านขวาเป็น selection inspector บน mobile ย้าย inspector ลงด้านล่าง ไม่ลด desktop ทั้งหน้าจนแตะไม่ได้ ใช้พิกัดเอกสารแยกจาก zoom ที่เห็นบนจอ

**Research:** note editor อยู่กลาง มี source และ tags เป็นบริบทที่แก้ได้ การส่งต่อใช้ข้อความที่เลือกก่อน หากไม่เลือกใช้ทั้งเนื้อหา ไม่มีการสรุปอ้างว่าเป็น AI

**Voice:** ปุ่ม Record เป็นจุดเด่นเดียว meter สัมพันธ์กับเสียงจริง หลังหยุดจึงเห็น player และ Save/Discard ไม่เปิดไมค์โดยอัตโนมัติ transcription แสดง unavailable

**Live:** แบ่ง preparation กับ cue cards timer ใช้เวลาจริงและหยุดเมื่อออกจาก view เก็บค่า draft เพื่อกู้กลับ ไม่มีการอ้างว่า session ดำเนินต่ออยู่เบื้องหลัง

**Automate:** มองเห็นข้อมูลเข้า การแปลง และผลลัพธ์ครบในหน้าเดียว validation ชี้กลับไป input node ชุดนี้เป็น fixed local pipeline ไม่ใช่ arbitrary external automation graph

**Library:** เริ่มว่างเมื่อไม่มีงานจริง แยก sample templates ไว้ใน Templates การลบเป็น soft delete ไป Trash เพื่อกู้คืนได้ ไม่ลบไฟล์ของผู้ใช้อย่างถาวรจากปุ่มทั่วไป

## ภาษาออกแบบ

ชื่อทิศทาง **Luminous Intelligence / Deep Black Creative Universe**

- พื้นหลังดำลึก #060608, surface #0D0D12, accent lime #CCFF00
- สี cyan/violet ใช้ในงานภาพและ workspace differentiation ไม่ใช้ glow ทุกขอบ
- Space Grotesk สำหรับ display/headings, DM Sans สำหรับ UI และ Noto Sans Thai สำหรับภาษาไทย ติดตั้งและเสิร์ฟ font จาก package ภายในแอป
- Heading มี Hero, Section, Workspace, Card และ Compact Label; `//` ใช้เป็น context marker
- เว้นพื้นที่ว่างให้เนื้อหาหลัก หลีกเลี่ยงการใส่ card จำนวนมากโดยไม่มีลำดับ
- Card หก families: Featured Artifact, Workspace Portal, Editorial Note, Media Frame, Workflow Node, Control Surface
- สร้าง planet/orbit, portal geometries และ Arty companion ด้วย CSS/SVG ที่แก้ไขได้ ไม่มีข้อความสำคัญฝังในภาพ raster
- tokens canonical อยู่ `shared/schema.ts` ส่วน `DESIGN_TOKENS.json` และ `src/tokens.css` เป็นไฟล์สร้างจาก `npm run tokens`

### Composition studies และข้อสรุป

พิจารณา (A) ภาพ nebula เต็ม hero จาก blueprint, (B) planet rim แบบ vector/CSS และ (C) หน้าพื้นดำ composer อย่างเดียว เลือก B เพื่อรักษาตัวตน cosmic โดยไม่แข่งกับงานพิมพ์ ลดขนาด asset และไม่ผูกกับสิทธิ์รูปเดิมที่ยังไม่มีใบอนุญาตแยก ส่วน C ใช้กับ workspace ที่ต้องอ่านและแก้ข้อมูลนาน ๆ ข้อนี้เป็นการตัดสินใจออกแบบ ไม่ใช่ผล user testing หรือการวัด pixel จาก reference ที่ไม่ได้แนบใน session ปัจจุบัน

## Motion system

Motion ใช้แพ็กเกจ `motion` ผ่าน `motion/react` ซึ่งเป็นแนวทางปัจจุบันของ Motion สำหรับ React และใช้ Framer Motion ภายใน dependency graph ไม่ติดตั้ง engine สองชุดโดยไม่จำเป็น

Motion Lab มีแปดพื้นที่: Text Reveal, Kinetic Typography, Spatial Carousel, Cinematic Carousel, Media Corridor, SVG Motion, Card Interaction และ Scene Transition

- Text effects หกแบบ + classic scroll mask สี่ทิศทาง ใช้ Intl.Segmenter กับ Thai graphemes
- Canvas kinetic มี 16 สูตร geometry แตกต่างกันจริง มี sorting ตาม depth, near-plane guard, DPR/glyph/echo budget, offscreen/hidden suspension และ semantic alternative
- Spatial carousel มี Arc/Circular, authoring controls 14 ค่า, runtime viewport clamp, swipe/velocity-aware threshold, arrows, Home/End และเปิด detail ได้
- Cinematic scene เป็น labeled sample สามฉาก มี manual navigation และ autoplay แบบ opt in
- Corridor เป็น native scroll gallery ในพื้นที่ preview มี progress และ skip ไม่มี scroll hijack ทั้งเว็บไซต์
- Preset เป็น versioned data ผ่าน validation ก่อนนำเข้า ไม่มี eval หรือ imported executable code
- Full/Balanced/Calm/Off และ OS reduced motion เป็นข้อจำกัดเพิ่มเติม
- **ข้อจำกัด:** engine ยังไม่รองรับทุก kinetic camera/font/mode option ตาม master, scene presets ยัง apply ไป document presentation ไม่ได้, corridor เป็น simplified study ไม่ใช่ full cinematic shared-media expansion

## โครงสร้างข้อมูลและระบบบันทึก

Entity ที่ใช้จริง: Item (document/conversation/note/recording/session/workflow/preset), Message, LayoutNode, Asset และ revision snapshots แต่ละ Item มี UUID, schemaVersion, createdAt, updatedAt, revision และ deletedAt; ความสัมพันธ์ข้าม workspace เก็บ sourceId/templateId/assetId ใน data

ข้อมูลถาวรเก็บ SQLite ใน `.data/workspace.sqlite` และไฟล์ media ใน `.data/assets/` browser localStorage ใช้กับ draft ข้อความ/preferences และ canvas draft ขนาดเล็ก ไม่เก็บเสียงขนาดใหญ่ใน localStorage

- Save เป็น explicit action พร้อมสถานะ browser draft / saved revision
- API ตรวจ expected revision; ถ้า stale ตอบ 409 โดยไม่ทับงานล่าสุด
- การเปิด revision เก่าจะโหลดเป็น draft ก่อน Save เป็น revision ใหม่
- Trash เป็น soft delete กู้คืนได้จาก Library
- Backup ส่งออก records, revisions และ media bytes; Restore ใช้ stable ID merge โดยรักษารายการที่มีอยู่
- Restore ไม่เขียนทับข้อมูลเดิมเมื่อ validation ล้มเหลว; import มีขนาดจำกัด 100 MB ต่อ request
- draft ใน browser แยกจาก server backup ต้อง Save ก่อนสำรองเพื่อรวมงานล่าสุด
- multi-project membership, collaboration, cloud history และ asset garbage collection ยังไม่ implement

## Integration boundaries และความปลอดภัย

Provider contracts อยู่ `shared/providers.ts` ทุก provider เริ่ม unavailable ไม่เก็บ secret ใน bundle, tokens, presets หรือ exports

API ใช้ local server, ตรวจ origin, จำกัด payload, validate imported node values/media references และตรวจ magic bytes ของชนิดไฟล์ที่รองรับ ไม่มีการ execute imported HTML/JS

ขอบเขตนี้ไม่มี authentication หรือ multi-user authorization จึงเหมาะกับเครื่องส่วนตัวเท่านั้น ก่อนเปิด public hosting ต้องเพิ่ม auth, ownership, quotas, transport/security policy และทดสอบ deployment จริง ห้ามเผยแพร่ local database เป็น static assets

## การนำ Framer มาใช้

สร้าง editable design companion ใน Arty’s Workspace:
https://framer.com/projects/Q9u0Ksh8PgRNuFPtNtGO

มี native layers, color tokens, typography styles, desktop และ phone breakpoints ตรวจภาพ render แล้ว เป็น design companion ไม่ใช่ backend runtime และ composer ใน Framer ระบุชัดว่าเป็น visual specification

Marketplace templates/components/plugins/vectors และ community gallery ใช้เป็นแหล่งศึกษาตาม registry ใน `docs/source/FRAMER_RESOURCE_REGISTRY.json` ยังไม่มีการซื้อ นำเข้า remix หรืออ้างสิทธิ์ commercial redistribution ของรายการใด ไม่บังคับ export React ผ่าน plugin ที่มีค่าใช้จ่าย ไม่ถือว่า gallery ให้สิทธิ์นำ source มาใช้โดยอัตโนมัติ

## สถานะและงานต่อไป

รายละเอียด canonical scope อยู่ `artyverse-design-master.json`; component inventory และ motion limitations แยกใน coverage documents

งานที่ต้องทำต่อเพื่อให้ครบทุกข้อของ master เดิม:

1. เพิ่ม multi-project model และ navigation/scroll/selection restoration ให้ครบทุกกรณี
2. TH/EN ให้ครบทุก validation, help text และ deep inspector controls (ชุดนี้แปล nav, primary headings และหลาย primary actions แล้ว ยังไม่ครบทุก string)
3. เพิ่ม grouping, locking, snapping, guides, pan tool, document dimensions editing และ richer document formats ใน editor
4. ขยาย AI/provider gateway, cancellation/quota/error contracts เมื่อมีบริการที่อนุญาตจริง และเชื่อม transcription แยกจาก recording
5. ขยาย Automate เป็น graph editor ที่เพิ่ม/ลบ/configure/เชื่อม node ได้ รวม scheduler เฉพาะเมื่อมี backend จริง
6. เพิ่ม full media viewer zoom/pan/next/previous, multi-scene project presentations และ motion preset scene application
7. ทำ token scales editor/redo ที่ครบกว่า accent preview, registry interactive previews ทุก required family และ Advanced Files แบบ multi-file selective patch
8. เพิ่ม production identity/ownership/security, deployment configuration และ real-device testing ก่อนเปิดบริการสาธารณะ

รายการนี้ไม่ใช่อุปสรรคต่อการใช้งาน local workflows ที่ส่งมอบแล้ว และไม่มีการนำ source buildVerified หรือคะแนนของ blueprint มาใช้เป็นผลของโปรเจกต์ใหม่
