# Decisions, conflicts and normalization

| Source / conflict | Resolution | Reason | Affected areas |
|---|---|---|---|
| Latest request asks a new complete system; blueprint contains multiple WhisperX/WPX variants | Design a unified ARTYVERSE X local application with shared core | Avoid stitching incompatible demo products | Entire app |
| User says clear everything; master requires recovery | Keep remote and initial commit; recovery branch before scaffolding | New design does not require destroying remote/history | Git / rollback |
| External v9 vs embedded v10.1 | Preserve both as evidence; use latest user master for behavior | Newer embedded metadata does not prove runtime functionality | Specs / inventory |
| Exact design-v8-spec.md and design-master-v8.json are not attached here | Do not claim to read those exact files; use extracted V8 contracts within provided masters | Accurate provenance | Tokens / carousel / 151 catalog |
| No accessible newly attached hero reference image | Use user composition description and inspected blueprint assets as inspiration | No pixel sampling claim | Home visual direction |
| Source lime #CCFF00 vs user starting #B8FF36 | Adopt #CCFF00 as proposed brand accent | Connect reconstructed brand while keeping user cosmic direction; starting palette was adaptable | Interface accent / original mascot |
| Source muted #8A8AA2 | Normalize to #A3A3B6 | Improve body-label contrast in dark UI | Semantic muted text |
| Source Syne vs proposed Space Grotesk | Self-host Space Grotesk + DM Sans + Noto Sans Thai | Deliberate geometric identity and Thai support | Typography |
| Carousel authoring dimension contracts differ | Wide authoring ranges, runtime width clamp to preview viewport | Keep editing freedom while preserving touch usability | Spatial carousel |
| V8 catalog 151 names vs actual components | Store inventory; map shared native patterns; report scoped implemented and smoke-verified mappings | Avoid inventing component coverage | Registry |
| Blueprint demos simulate speech/AI/scores | Replace with manual/local operations and explicit unavailable states | Honest capabilities | Chat / Voice / Automate |
| Framer website output vs React app runtime | Editable Framer visual companion plus local React/Node source app | Native Framer design is useful without pretending it supplies this database/backend | Delivery |
| Marketplace free items vs redistribution rights | Candidate registry only; no acquired/remixed Marketplace assets | License and paid tools not assumed | Asset provenance |
| Framer Motion older package name vs current Motion React | Install motion and import motion/react | Official current React API, one engine tree | Motion |
| Pure browser local vs media persistence | Small browser drafts; SQLite + file media on local server | Avoid large recordings in localStorage | Persistence |
| Full master vs delivered implementation | Per-module subset statuses and explicit follow-up backlog | Local release is useful without claiming every advanced option is done | All reports |

Spacing values outside the base scale are intentional composition or viewport measurements (e.g. 224px sidebar, 960×540 document, 665px hero floor). They are not forced onto an arbitrary scale when that breaks the composition.

## V2 superseding decisions

See `docs/v2/CONFLICT_AND_NORMALIZATION.md` for latest source-by-source decisions, brand architecture, typography/palette normalization, V1 compatibility, provider cost/fallback semantics and Framer licensing boundaries. These supersede conflicting earlier implementation decisions; user documents/artifacts retain their own values.

## V3 merged frontend

Latest UX/UI specification determines dark-first themes, primitive palette and Syne editorial direction. Actual repository facts override the earlier Prompt Pack's assumed pnpm monorepo and prototype-only status. Existing SQLite saves, real graph execution, CSS inspector and audio lifecycle remain intact. ARCYCA is the new primary mascot; Arty scene assets and Whisper Fade W are retained with distinct roles. Semantic foregrounds are checked independently of brand fill colors. Full decisions: `docs/v3/BRAND_AND_NORMALIZATION.md`.
