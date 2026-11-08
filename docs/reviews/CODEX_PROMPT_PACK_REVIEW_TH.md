# ARTYVERSE X — Codex Prompt Pack review

ตรวจ 2026-11-08 โดยเทียบ package.json, vite.config.ts, src/App.tsx, sandbox, V2 scope/limitations และ Vercel connection. รอบนี้เป็น prompt review: ไม่ได้ติดตั้ง AGENTS.md, เปลี่ยน stack/theme, ย้ายข้อมูล หรือเริ่ม Phase 0 implementation. ผลทดสอบเดิมเป็น recorded baseline ไม่ได้รันใหม่ในรอบ review.

## ข้อสรุป

เป็น product/design brief ที่ละเอียดและมีหลักความจริงดี แต่ยังไม่ควรวาง Part A เป็น AGENTS.md ของรีโปปัจจุบันโดยตรง. ต้องปรับ repo assumptions, source precedence, acceptance ที่ทดสอบได้ และ deployment/auth boundaries ก่อน. นี่เป็นการเปลี่ยน product focus ไปสู่ Interview Copilot ไม่ใช่แค่ polish frontend เดิม.

## Findings

| ระดับ | จุด | ผลกระทบ / คำแก้ |
|---|---|---|
| Critical | Stack สมมติเป็น pnpm artifacts/lib/drizzle/shadcn | ของจริงเป็น npm, React/Vite/TS/Tailwind4, Motion, Express, builtin SQLite. รักษา stack ก่อน; monorepo/Firebase เป็น migration decision แยก |
| Critical | เปลี่ยน product heart, default theme และ IA | ต้องระบุว่า Interview เป็น flagship use case หรือแทน Creative Studio. รักษา Canvas/Research/Voice/Live/Automate/Sound/Dynamics/Story/Library/Design OS และ aliases จนมี migration plan |
| Critical | API มาก่อน auth ใน Phase 4 | Paid AI proxy ต้องมี identity/ownership validation, limits และ server quotas ก่อน exposure. Phase 7 ใช้ขยาย collaboration ไม่ใช่เพิ่งเพิ่มความปลอดภัยให้ API ที่ public แล้ว |
| High | ภาพ 6 รูปและ legacy paths ถูกถือว่ามีอยู่ | ยังไม่มี design/references หรือ legacy ตามชื่อในรีโป. ทำ source manifest: available/missing, path/hash, provenance และข้ออนุมาน; ห้ามจับคู่ชื่อไฟล์จากการเดา |
| High | Screenshot board ถูกใช้เป็น golden ของ responsive app | แยก reference board, selected crop และ target screen. ต้องสร้าง approved baseline ที่ viewport/font/state เดียวกันก่อนใช้ pixel diff |
| High | Web Speech + fake microphone ต้องสร้าง transcript | Fake audio device ไม่ได้ mock SpeechRecognition/backend STT. ใช้ deterministic STT fixture สำหรับ UI contract, WAV fixture สำหรับ server STT integration และ real microphone checks แยก |
| High | Speaker labeling ถูกคาดหวังจาก Web Speech | ไม่มี diarization ที่รับประกัน. ใช้ manual speaker label หรือ engine ที่รองรับจริง; Auto เป็น unavailable หากไม่มี capability |
| High | Sandbox origin check ไม่ระบุ opaque origin | allow-scripts/no-same-origin ส่ง origin null. ตรวจ event.source + per-run nonce + schema + bounded payload; null ไม่ใช่ตัวระบุตัวตน. ห้ามแก้ด้วย allow-same-origin |
| High | AA ถูกอ้างจาก palette | สีขึ้นกับ foreground/background/ขนาด/น้ำหนัก. semantic fills ไม่ใช่สีข้อความอัตโนมัติ; ทำ contrast ในทุก theme/state รวม focus/disabled/error |
| High | Strict CSP ขัดกับ arbitrary code preview | แยก app CSP ออกจาก isolated preview CSP. อนุญาต inline code เฉพาะ sandbox เมื่อจำเป็น; ปิด network/forms/popups/host access; ตรวจ source/nonce และไม่ส่ง secrets เข้า iframe |
| High | Firebase/Auth/Firestore/RTDB/Functions/Yjs เป็นค่าเริ่มต้น | เป็นบริการ/architecture ใหม่ ไม่ใช่ของที่มีแล้ว. เริ่มจาก interfaces + local workflows; เลือก backend เดียวและทำ recovery/migration ก่อนเชื่อมจริง |
| Medium | Every-commit full checks กับ lint/typecheck ที่ไม่มี | baseline มี npm ci/dev/build/test/test:e2e/tokens; typecheck รวมใน build, ไม่มี lint script. แยก checks ต่อ concern และ full gates ต่อ phase; ห้ามสร้าง lint แบบ no-op |
| Medium | Tailwind config ถูกบังคับ | Tailwind 4 ใช้ CSS-first theme/variables ได้. ไม่ต้องสร้าง legacy config หรือเปลี่ยน version เพียงเพราะ prompt |
| Medium | Confidence/scoring/analytics ไม่กำหนดความหมาย | แยก rule score, model self-report และ calibrated confidence. Practice quality ต้องมี rubric; trend ใช้ actual sessions และไม่เรียกคุณภาพว่า calibrated หากไม่มี evidence |
| Medium | Fixture/checkout/credits/stats เสี่ยงดูเหมือนจริง | ติด sample/development label. Production ไม่มี fabricated usage, credits, orders, community posts หรือ payment success; unavailable controls ต้องอธิบายชัด |
| Medium | Fixed FPS/Lighthouse/INP gates ไม่กำหนด environment | ระบุ browser/device/throttle/DPR/version/warm-cold route/sample window. ใช้ TBT เป็น lab proxy ส่วน INP แยก instrumented interactions/field measurement. ไม่ถือว่า simulated mobile = real device |
| Medium | Auto-fix ต้องสำเร็จภายใน 3 ครั้ง | กำหนด max 3 attempts, validate และ reviewable diff; failure ต้องเป็นผลยอมรับได้เมื่อแก้ไม่ได้. ห้าม auto-apply unsafe edits หรือ success ปลอม |
| Medium | 4-family limit แต่มี optional IBM Plex | กำหนด Inter + Kanit + Poppins + JetBrains Mono ชัดเจน หรือเลือกชุดเดิมโดยตั้งใจ. อ่าน OFL/subset/font budget; ไม่ถามซื้อ license ถ้าใช้ license ที่อนุญาตอยู่แล้ว |
| Medium | สีจากภาพมีอำนาจเหนือค่าแบรนด์ทั้งหมด | sampled values เป็น observation ที่อาจมี JPEG/antialias artifacts. ใช้ approved canonical tokens เป็น runtime source; บันทึก original → sampled → canonical → reason |
| Medium | ห้าม horizontal scroll ทุก width | ห้าม page overflow แต่อนุญาต canvas, code editor, table และ timeline เลื่อนภายในเมื่อมีเหตุผล พร้อม keyboard/touch alternatives |
| Medium | Vercel connection ถูกตีความพร้อม deploy | เชื่อมโปรเจกต์แล้ว แต่ API/data ยัง local. ต้องมี persistent DB/media backend และ auth boundary; ห้ามใช้ ephemeral SQLite แล้วเรียกว่า cloud persistence |

## Contrast ที่คำนวณจากค่าใน prompt

คำนวณ WCAG relative luminance จาก opaque sRGB hex บน #FFFFFF; เป็นการตรวจค่าที่เขียน ไม่ใช่ sampled pixels จาก reference.

| สีหน้า / พื้น | Ratio | ข้อความปกติ AA (4.5:1) |
|---|---:|---|
| #D4006A / white | 5.24:1 | ผ่าน |
| #FF2D78 / white | 3.56:1 | ไม่ผ่าน |
| #8B93A7 / white | 3.07:1 | ไม่ผ่าน |
| #22C55E / white | 2.28:1 | ไม่ผ่าน |
| #F59E0B / white | 2.15:1 | ไม่ผ่าน |
| #EF4444 / white | 3.76:1 | ไม่ผ่าน |

ข้อความใหญ่ใช้เกณฑ์ 3:1 ตามนิยาม WCAG. Fill สีเหล่านี้อาจใช้ได้เมื่อจับคู่ ink/darker text ที่เหมาะสม; ไม่ได้หมายความว่าต้องเลิกใช้ทั้ง palette. Contrast ไม่พิสูจน์ WCAG certification.

## ข้อความแทนส่วนสำคัญใน Part A

```text
Repository facts take precedence over assumed directory names and package managers.
Preserve the current npm + React/Vite/TypeScript/Tailwind 4 + Motion + Express/SQLite
stack unless a separate migration is approved. Do not create a monorepo, add shadcn,
install a duplicate animation runtime, or switch backend solely to match this brief.

Read package.json and project instructions before choosing commands. Existing commands:
npm ci; npm run dev; npm run build; npm test; npm run test:e2e; npm run tokens.
Type checking currently runs in build. Record missing lint/typecheck scripts honestly;
add meaningful configuration in an explicitly scoped foundation task if needed.

Preserve existing items, IDs, revisions, assets, routes and unsaved user drafts.
Keep a recovery point before structural migration. Retain legacy route aliases until
navigation and data migration are verified.

Use the latest explicit user decision for product focus and default theme.
Interview Copilot is a proposed flagship module; do not silently remove the existing
Creative Operating Studio modules. References guide the intended redesign; canonical
approved tokens and runtime data schemas remain authoritative.

Fixtures and providers must be explicitly labeled. Do not use sample transcripts,
answers, analytics, credits, orders or community records as production user data.
Unavailable integrations have honest states and working local/manual alternatives.

Validate iframe messages by expected WindowProxy source, per-run nonce, payload schema,
message type and size/rate bounds. Opaque-origin messages may have origin 'null'; never
trust that string as identity and never add allow-same-origin to bypass the check.

Run checks relevant to each change. Run full agreed regression/release gates at phase
completion, pin the tested source revision and conditions, and invalidate stale evidence.
Never update a visual baseline just to hide a mismatch.
```

## ข้อความเพิ่มใน Part B / Phase 0

```text
First reconcile this brief with the existing ARTYVERSE X V2 implementation.
Produce a source manifest and conflict ledger before proposing migrations.
List exact available/missing reference and legacy files; do not invent their content.
Report the product/theme/route changes separately from frontend polish.

Confirm a reversible plan for existing SQLite/media data and Vercel API hosting.
No public AI proxy, account system, billing or collaboration is considered connected
until configured and tested. Local work must continue without waiting for API keys.

For this audit, write documentation only. Do not install AGENTS.md, replace the stack,
switch themes, seed production data, deploy, or begin implementation phases.
```

## Acceptance ที่แก้สำหรับ Part C

- Phase 1: canonical light/dark tokens + contrast pairs; board แยกจาก app screenshots; ไม่มีการอ้าง pixel-match เมื่อ references ไม่พร้อม.
- Phase 2: user-editable bento มี reorder/keyboard/reset และ persistence; fixture labels ชัด; ไม่มีเครดิตหรือ stats จำลองแสดงเป็นของจริง.
- Phase 3: fixture STT มี interim/final/error/cancel events; unsupported Web Speech มี text/manual fallback; real-device STT ตรวจแยก. Bottom sheet ต้องมีปุ่มเปิด/ปิด/ขยายและ focus behavior นอกจาก drag.
- Phase 4: minimal identity/ownership + quotas/rate limits ก่อน public AI proxy; source citations อ้าง stable snippet IDs; validate citation existence, unsupported facts/placeholders และ structured answer at completion. Partial streaming ต้องมี protocol ชัดเจน ไม่ parse partial JSON เป็น final answer.
- Phase 5: define hardware/profile and frame metric; adaptive quality, cleanup, hidden/offscreen pause, reduced motion; mascot appearance ใช้ asset ที่มีสิทธิ์และพร้อมจริง. TTS visemes เป็น text-driven approximation ไม่ใช่ audio lip sync.
- Phase 6: deliberate runtime error triggers reviewable proposed fix, at most 3 attempts; either verified fix or explicit unresolved state. Test parent DOM/storage/top-navigation/network boundary ตาม threats ที่ระบุ; ไม่อ้างว่า iframe กัน CPU exhaustion ได้.
- Phase 7: two-browser test ต้องมี authorized users คนละ session; room membership/roles enforced on transport; offline/reconnect convergence และ persisted snapshots; presence เป็นของจริง. Firebase emulators เมื่อเลือก Firebase จริง; backend authorization tests เมื่อเลือก Express stack.
- Phase 8: measure Lighthouse under pinned conditions, route entry budget รวม imported shared chunks/fonts/assets, real interaction/field INP แยก lab proxies; findings/accepted limitations ชัดเจน. PWA caching ห้าม cache secrets/private responses โดยไม่มีนโยบายและ tests.

## ลำดับที่เหมาะกับเป้าหมาย frontend-first

0. Audit/requirements/source manifest/recovery.
1. Tokens + typed Thai-first copy + light/dark + component foundation.
2. Shell + Home + Projects + Library; keep legacy routes compatible.
3. Copilot UI with deterministic labeled fixtures and manual input.
4. Studio/Marketplace visual system using existing Code Studio core; no fake checkout.
5. Mascot/motion + responsive/a11y + visual polish across screens.
6. Backend/evidence/STT/AI integration with early auth/ownership/rate boundary.
7. Auth expansion/collaboration/invites/offline data migration.
8. Release checks/documentation/deployment-specific verification.

ลำดับนี้เป็นข้อเสนอเพื่อให้งาน frontend เสร็จเป็นช่วงที่ตรวจได้ ไม่ใช่คำสั่งเริ่ม implementation. ไม่จำเป็นต้องรอ API keys เพื่อทำ UI, manual workflows, fixtures และ provider contracts.
