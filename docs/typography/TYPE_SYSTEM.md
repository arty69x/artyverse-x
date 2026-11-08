# ARTYVERSE X — typography polish

## Source and scope
R1 design/references/01-brand-system.jpg typography08 and editorial Extract/Compose/Ship; R2 production-blueprint typography06; earlier user contract provides 64/72,48/56,32/40… sizes. Observed: Syne/DM Sans/JetBrains Mono, bold/thin contrast, neon keyword blocks and editorial accents. Responsive clamps, exact tracking, focus and underline values are proposed implementation decisions, not falsely claimed pixel measurements from tiny board text. Existing stored artifact typography is not normalized or rewritten.

## Canonical values
shared/design.ts type is the source for families, loaded weights, 12 roles (display/h1–h6/bodyLarge/body/small/caption/code), base size/line, responsive size, per-role tracking, weights, marker and focus values. npm run tokens generates DESIGN_TOKENS.json and src/v3/tokens.css. The live #/design-system Typography section shows actual canonical role values and exports a typography-only JSON; no separate hand-maintained numeric scale in the documentation.

DM Sans actual Latin weights200/300/400/500/600/700/800 and actual800italic are imported from the already-installed licensed font package. Syne uses the existing variable400–800 file. Thai uses existing IBM Plex Sans Thai200/400/700 files, nearest available weight for others; font-synthesis:none prevents synthetic bold/italic. Thin Latin display uses DM Sans, not a false Syne200 claim. Mono remains actual400. Fonts are served by Vite/local public assets, no new remote font request/provider or dependency.

## Applied behavior / states
| Area | Implemented | Verification boundary |
|---|---|---|
| Shared UI | token-based body, heading/label roles, real strong/bold weights, two-theme focus outline | affected-workflow browser checks |
| Home | actual800 headline, light secondary editorial words, existing marker emphasis and TH/EN-safe wrapping | 320/390/1440 screenshots |
| Keyboard | visible2px semantic focus, underline on actual focused links, explicit field focus | real focus interaction and axe |
| Type Lab | editable browser-persisted text, actual weight selector, Plain/Underline/Marker/Outline/Chromatic previews | select→computed CSS, reload, export |
| Underline | offset and thickness tokens, skip-ink, baseline clearance; no auto-underlining all non-links | visual review; not certification |
| Marker | semantic accent/onAccent pair, multiline box decoration, wraps user text | both themes; safe native text |
| Effects | static outline/chromatic emphasis, focus underline expands only with hover/focus | no flashing/ambient loops; reduced motion removes transition |
| Contract table | every role's size/line/weight/tracking/family/fluid value plus emphasis metric list | generated source values and actual JSON download |

No AI output, fake pipeline state or imported code execution was added. Typography preview is local and never overwrites project documents. The table has intentional internal horizontal scroll on narrow screens; page overflow is prohibited. Long Thai/English input wraps without character splitting, text replacement or unsafe HTML.

## Known limits
Board source is not a full-size font rendering baseline for each screen, so no pixel-perfect or image-difference score. Some older workbench metadata has its existing compact measurements; this update does not falsely claim all legacy labels are globally12px or all modules were redesigned. Exact original font shaping/model artwork remains a documented reconstruction limit. No new FPS/Lighthouse/WCAG certification claim.

## Recorded verification
2026-11-08, Linux/headless Chromium154.0.8037.57, reduced-motion screenshot mode, local server edition. Both server/browser production builds and TypeScript passed. 20 unit tests passed; 9 relevant browser journeys passed. 12 Design System cases (EN/TH × dark/light ×320/390/1440) had no page overflow or axe violations; 3 Home sizes had no overflow or headline clipping. Actual text/weight/effect controls, keyboard focus outline, persisted text reload, loaded Latin200 font and JSON download were exercised. Earlier interrupted HMR/320px overflow attempts were corrected before accepted checks; no screenshot score fabricated. The isolated Type Lab detail image hides fixed topbar only for capture. Raw evidence: tests/evidence/typography/.

## Published runtime
Final runtime79a60c763ede429b9ed97eabedaee9add1c65e9c. Vercel production READY, alias error null; deployment dpl_GBrFYYwByJ8DSsKygsy2cCYEQx2a. Stable domain alias confirmed to that deployment. Remote app-EcxjKEBR.js matches local browser build; remote build reports zero known npm vulnerabilities. Source/build hashes and sanitized release evidence are recorded beside current checks. These are platform checks, not protected production-browser or runtime-log assertions; access policy is unchanged. Later documentation commits do not alter deployed runtime.
