# ARTYVERSE X — unified Visual Engineering Studio

## Sources and authority
R1 design/references/01-brand-system.jpg: 1280×720, latest brand system. R2 02-production-blueprint.jpg: 1280×853, latest multi-panel blueprint. R3 03-studio-board.jpg: 1280×889, WPX board inside Canva editor; editor chrome excluded from product. These are actual uploaded JPEG bytes copied unchanged. Latest user request supersedes earlier Interview-first direction. Existing code/data is the authority for functional capabilities. Existing attachments/legacy docs remain historical evidence, not proof of cloud services.

Observed: rainbow sculpted A, pink X, Extract/Compose/Ship, Syne/DM Sans/JetBrains Mono, lime/pink/violet/cyan, light board/dark Studio, ARCYCA, neon outlines, glass, code/preview/inspector, mobile dock. Inferred: board proportions as application layout. Proposed: usable dashboard arrangement, responsive adaptation and shared workspace navigation. Unknown: exact 3D model, material/shader, original editable logo vectors, tiny illegible board labels. Reconstructed assets are explicitly substitutes; no pixel-perfect claim until quantitative comparison verifies matching product screenshots. A brand board is not a full-resolution screenshot of each application route.

## Scope / coverage matrix
| Module | Screen / role | Core / advanced behavior | Evidence / status | Validation |
|---|---|---|---|---|
| Shell | all / local creator | shared route navigation, search, project scope, TH/EN, themes, mobile dock | existing implemented + reconstructed styling | regression + screenshots |
| Home | home / creator | Extract/Compose/Ship native hero, studio entrances, composer, saved-only metrics/recent work | R1/R2 observed identity; proposed layout | browser |
| Builder | builder / creator | presets review, draft, responsive preview, sample bag, export, save to Code Studio | reused implemented local engine | regression |
| Chat / Copilot | chat/copilot/practice/questions | saved conversations/evidence, local outlines; provider status | existing local; AI blocked without provider | regression |
| Create / Code | create/code | editable documents, sandbox, revision/save/export | existing implemented | regression |
| Pipeline | automate/agents | local nodes/runs; actual status/provenance | existing local; external scheduling blocked | regression |
| Audio / Voice | sound/voice | synth/export, microphone/recording with permission | existing implemented browser capabilities | synthetic media regression; hardware unverified |
| Dynamics / Story | dynamics/story/live | interactive SVG, scenes/presentation, local session | existing implemented; not claimed exact WebGL board shader | regression |
| Library / Research | library/research/projects | CRUD, revisions, search, backup and cross-workspace handoff | existing implemented local/SQLite or IndexedDB | regression |
| Design OS | design/design-system | tokens, component guide, motion controls | existing live guide + shared identity | build/screenshots |
| Marketplace / Analytics | marketplace/analytics | local template creation, derived actual record counts | existing; payment/community/cloud blocked | regression |

No new auth, payment, external AI, realtime collaboration or scheduler is represented as connected. No databases are migrated or cleared. Recovery branch pre-reconstruction holds source before changes.

## Canonical contracts
Tokens: shared/design.ts → npm run tokens → DESIGN_TOKENS.json and src/v3/tokens.css. Item/CodeDocument and data/revision validation remain in shared/schema.ts and shared/code.ts. No duplicated editor or new entity. Builder uses shared/storefront.ts v1 and saves CodeDocument v2 through the existing store. Browser hosted mode uses IndexedDB; server mode uses SQLite. Existing drafts and per-document palettes are preserved.

## Screen/flow rules
Home Extract opens research (notes/sources), Compose opens Create, Ship opens Library export. Composer creates one conversation preserving draft on failure. Builder is mounted within the same shell; save opens existing Code Studio. Existing concept URLs remain available for compatibility. Product symbols/copy are live SVG/DOM, never a flattened UI image. Empty/loading/errors/save semantics remain from existing engines. Dialog focus and reduced-motion constraints are retained. Layout adapts at 640/1024/1280; narrow devices stack while preserving actions.

## Design handoff
Editable Figma was not generated. Figma mapping: Shell/Sidebar, Shell/Topbar, Home/EditorialHero, Home/StudioLaunchpad, Brand/PrismA, Brand/ARCYCA, Builder/Workspace, Core/Button, Core/Field. Frames 390 and1440; use canonical tokens, native text and auto layout. Screenshot references are source evidence, not editable Figma outputs. Reconstructed SVG mascot remains a vector approximation, not recovered 3D artwork.

## Normalization and deliberate deviations
| Original reference | Implemented interpretation | Reason / affected scope |
|---|---|---|
| Full 1280×720 multi-panel brand poster | usable home plus living Design System | poster panels are specifications, not one interactive app screen |
| sculpted neon A | PrismMark unique-ID native SVG | editable approximation; original vector unavailable |
| 3D ARCYCA floating cat-ear helmet | reference-generated alpha WebP with SVG fallback | preserves visual character better than previous flat robot; not recovered 3D rig |
| tiny fixed card text and board labels | semantic readable TH/EN native UI | responsive usability/accessibility; tiny unreadable source text not invented |
| mixed light board / dark Studio | existing user theme preserved | no silent reset of saved preferences |
| 6.0/Production-ready badges in blueprint | omitted as application claims | source labels do not establish runtime capability or verification |
| simulated performance monitor and collaboration in brand concept | actual local tools/status retained | no invented metrics, presence, payment or AI |

## Visual comparison limits
Source images were inspected at native resolution and compared compositionally with rendered Home and Design System. Exact overlay/IoU across all screens is not meaningful: source contains tiny screen thumbnails embedded in a brand board, not full-size UI baselines. Remaining mismatches: original 3D shading/model/pose, logo geometry, exact board typography and individual panel arrangements. Brand colors originate in the canonical supplied design specification, not falsely claimed screenshot sampling. The new app is a reconstruction-derived implementation, not a verified pixel-perfect copy of every board pixel. Screenshots and automated checks document actual rendering; no fabricated similarity percentage.

## Delivery state
Native Home, PrismMark/brand variants, shared shell navigation, integrated Builder and generated optimized mascot are Implemented. Supported previous modules remain implemented using their existing engines; acceptance evidence is in VERIFICATION.md. Exact 3D source, native Figma, full-size UI visual baselines, connected AI/cloud identity/payment/collaboration are Blocked/Not supplied, not relabeled as completed. No interaction is represented by a fake success toast.
