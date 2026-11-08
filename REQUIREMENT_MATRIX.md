# Requirement matrix

Each status is limited to the delivered local scope. In-progress sections have additional requirements listed in KNOWN_LIMITATIONS.md. Evidence must be read in its recorded test conditions.

| ID | Requirement | Status |
|---|---|---|
| MP-00 | Source of truth | Implemented in local scope |
| MP-01 | Product vision | Implemented in local scope |
| MP-02 | Honest capabilities | Implemented in local scope |
| MP-03 | Safe migration | Implemented in local scope |
| MP-04 | Art direction | Implemented in local scope |
| MP-05 | Visual restraint | Implemented in local scope |
| MP-06 | Tokens | In progress / subset delivered |
| MP-07 | Typography | In progress / subset delivered |
| MP-08 | Information architecture | Implemented in local scope |
| MP-09 | Global shell | In progress / subset delivered |
| MP-10 | Home | Implemented in local scope |
| MP-11 | Shared composer | In progress / subset delivered |
| MP-12 | Chat | In progress / subset delivered |
| MP-13 | Explore | Implemented in local scope |
| MP-14 | Templates | Implemented in local scope |
| MP-15 | Create | In progress / subset delivered |
| MP-16 | Research | In progress / subset delivered |
| MP-17 | Voice | Implemented in local scope |
| MP-18 | Live | In progress / subset delivered |
| MP-19 | Automate | In progress / subset delivered |
| MP-20 | Library | In progress / subset delivered |
| MP-21 | Settings | In progress / subset delivered |
| MP-22 | Cross-workspace journeys | In progress / subset delivered |
| MP-23 | Card families | Implemented in local scope |
| MP-24 | Assets | Implemented in local scope |
| MP-25 | Living assistant | In progress / subset delivered |
| MP-26 | Scroll reveal | In progress / subset delivered |
| MP-27 | Text effects | Implemented in local scope |
| MP-28 | Kinetic typography | In progress / subset delivered |
| MP-29 | Spatial carousel | Implemented in local scope |
| MP-30 | Cinematic carousel | Implemented in local scope |
| MP-31 | Media corridor | In progress / subset delivered |
| MP-32 | SVG motion | Implemented in local scope |
| MP-33 | Motion orchestration | In progress / subset delivered |
| MP-34 | Motion Lab | In progress / subset delivered |
| MP-35 | Design OS | In progress / subset delivered |
| MP-36 | Component coverage | Implemented in local scope |
| MP-37 | Viewer and presentation | In progress / subset delivered |
| MP-38 | Data persistence | Implemented in local scope |
| MP-39 | Virtual files | In progress / subset delivered |
| MP-40 | Localization/responsive | In progress / subset delivered |
| MP-41 | Accessibility | In progress / subset delivered |
| MP-42 | Performance | In progress / subset delivered |
| MP-43 | Security | Implemented in local scope |
| MP-44 | Verification | Implemented in local scope |
| MP-45 | Acceptance | In progress / subset delivered |
| MP-46 | Export/deployment | Implemented in local scope |
| MP-47 | Execution plan | Implemented in local scope |
| MP-48 | Deliverables | Implemented in local scope |
| MP-49 | Craft | In progress / subset delivered |

## V2 scope supplement

The MP rows above remain scoped requirements, not a statement that every clause is complete. V2 implementation/acceptance is canonically inventoried in `docs/v2/RELEASE_SCOPE.json`; remaining requirements are in `KNOWN_LIMITATIONS.md`. Actual test evidence is listed in `VERIFICATION_REPORT.md`.

| New scope | Source | Implemented boundary | Remaining |
|---|---|---|---|
| Projects / unified open routes | Latest user upgrade + MP-22/38 | projectId relationships, same IDs, scoped Library, kindRoutes | cloud ownership and remote sync |
| Agent costs / fallback / pipeline | Latest user + MP-02/19/43 | local tools, optional adapter, logged provenance/cost, DAG agent steps | credentialed live inference and provider-specific verification |
| Code / inspector / fixes | Latest user + MP-39 | explicit iframe Run, visual CSS inspector, review/checkpoint, source import/export | host IDE/package runner and AI semantic repair |
| Audio / sensors / 3D | Latest user + MP-17/25/32/42 | actual Web Audio/WAV, SVG physics/gestures, optional sensor/WebGL | real-device certification and broad performance budget |
| Storytelling / presentation | Latest user + MP-18/37 | scripts, linked documents, scene timeline, compatible motion duration | multimedia timeline editing and server render farm |
| Full production | User craft goal + MP-46 | tested local source/build/export/backup | identity, ownership, infrastructure, live-provider and public release checks |

Requirement sources and conflict reasoning: `docs/v2/CONFLICT_AND_NORMALIZATION.md`. Historical V1 master and component evidence are retained in `docs/v1/`; source claims and verification statuses are never imported as V2 results.

## V3 frontend acceptance

New implementation scope and explicit limits: `docs/v3/RELEASE_SCOPE.json` and `docs/v3/ACCEPTANCE_MATRIX.md`. This is an intentional redesign with real native UI, not reference-pixel reconstruction. The live 11-section Design System, two semantic themes/system preference, responsive shell, original mascot, Projects CRUD/detail, evidence-first interview tools, original starter catalog and actual analytics are new frontend deliveries. Old local engines, saved artifacts and IDs remain. External cloud/auth/multiplayer/commerce/community services are not implied by frontend completion. V3 evidence must be read separately from historical V1/V2 results.
