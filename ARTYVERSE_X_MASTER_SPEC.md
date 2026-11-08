# ARTYVERSE X V3 — merged product and frontend specification
Hosted release supplement: Vercel uses browser-local IndexedDB/service-worker storage; local Node/SQLite remains available. See docs/v3/HOSTED_EDITION.md and DEPLOYMENT_REPORT.md for current deployment status and separate evidence.

ARTYVERSE = Artist × Multiverse. Creative power with disciplined clarity. Latest direction: Premium Tech Editorial × restrained Neon Brutalist × selective Holographic Glass. Dark creative default; light and system modes use the same semantic roles. ARCYCA is the original friendly helmet/skater interaction anchor. Whisper retains Fade W; legacy Arty remains a scene asset.

Canonical visual source: `shared/design.ts`; versioned payloads: `shared/schema.ts`, `shared/v2/contracts.ts`, `shared/interview.ts`. Source decisions: `docs/v3/BRAND_AND_NORMALIZATION.md`. Existing user artifacts, IDs, revisions and local media are preserved.

## Interface contract

Syne 400–800 display, DM Sans UI, IBM Plex Sans Thai and JetBrains Mono. Local font files; documented licenses. Lime #CCFF00, pink #FF2078, structural blue #001E3C, violet #B44FFF, cyan #00C7E8 and ink #050403 are primitives. Semantic text/focus/error roles are adjusted for the theme. Body/control legibility takes precedence over poster fidelity. Original artwork pigments do not become body text tokens.

Desktop uses grouped sidebar, breadcrumb/history, global search and create picker. Sidebar widths 218/256px with optional 80px collapse. Tablet uses a drawer. Phones under 640px have five navigation destinations plus safe-area padding. Tool panels stack intentionally. Page overflow is prohibited; bounded canvas/code/table/timeline scrolling is purposeful.

## Workspaces

| Route | Primary job | Working output |
|---|---|---|
| home | orientation, idea capture, studio entry | persisted conversation, actual counts/recent work, browser portal order |
| projects / projects/:id | organize a creative world | stable project context, linked work, CRUD/detail/export |
| copilot | collect questions and choose user evidence | editable local outline, saved interview session, Agent Studio context |
| practice / questions | retain and rehearse questions | saved Question Bank notes, practice sessions and self-review |
| chat / research | capture ideas and source notes | conversations, notes, editable document transfer |
| create / code | visual layers or web source | saved documents/code, SVG/JSON/HTML export, sandbox/CSS inspector |
| agents / automate | transparent local or configured-provider tasks | actual run evidence, validated graph execution and artifacts |
| voice / sound | record or synthesize audio | actual media assets, recordings, compositions and WAV |
| dynamics / story / live | explore motion and present | SVG physics scenes, scripts, timelines, cue sessions |
| marketplace | preview original free starters | separate editable document or Research brief; no checkout |
| analytics | inspect actual activity | saved-record counts/export; no fabricated quality score |
| library | discover and reopen work | type-aware saved-item routing, search/sort/trash/revisions |
| design-system / design | inspect the shared visual system | 11 live sections, token export, existing Design OS/Motion Lab |
| system / settings | configure and understand capabilities | real costs/status, language/theme/motion, backup/restore |

Copilot uses manual speaker labels. Browser speech recognition is optional and user initiated; it can depend on a vendor network service. Evidence matching uses keyword overlap and stable note IDs. Unknown facts remain placeholders. Local structure is never presented as AI inference; live provider use remains in Agent Studio with provenance/cost/fallback logs. No calibrated confidence or automatic interview quality scoring is invented.

## Shared quality contract

Native controls, keyboard command navigation, roving code/Design OS tabs, native modal focus restoration, appropriate empty/loading/error/missing states, versioned saves, safe import review, browser drafts and preserved artifact relationships. Mascot animation responds to visibility, OS reduced motion and Full/Balanced/Calm/Off preferences. Fixed/mobile navigation does not replace controls or cover the main workspace.

## Evidence and remaining work

Actual results: `VERIFICATION_REPORT.md`; acceptance: `docs/v3/ACCEPTANCE_MATRIX.md`; workflow map: `docs/v3/WORKFLOW_MAP.md`; limits: `KNOWN_LIMITATIONS.md`; rollback: `MIGRATION_AND_ROLLBACK.md`. V1/V2 reports are historical, not copied verification. No public deployment, cloud database, auth, remote collaboration, payment, community service or live paid inference was added without a real connection. Exact reference files named by the earlier Prompt Pack were not available; this is a deliberate merged redesign, not pixel reconstruction.
