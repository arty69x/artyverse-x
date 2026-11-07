# Verification report — ARTYVERSE X

Recorded 2026-11-07. Scope: local single-user release; redesign/art-direction verification. No pixel-perfect, WCAG certification or public production-readiness claim.

## Source and conditions

Tested runtime commit: `18d8194`. Runtime fingerprint: `a8f6d4524b452abce45ca6da1356c92b5df11203d2e8a19d508e6aa48ebaf1bd`. Exact hashes are in `tests/evidence/source-manifest.json`; documentation/evidence may be added later without changing this runtime. Runtime changes invalidate relevant evidence.

Node 24.19.0, Linux, headless Chromium 154.0.8037.57, Playwright with `/usr/bin/chromium`. Versions come from this installation and package-lock.json, not the blueprint. E2E uses isolated web 5174/API 4312 and a new `.test-data/run-*` directory; restore uses an empty temporary database on 4313. Built-app smoke uses `npm start` on 4315. Viewports are simulation, not real-device tests.

## Results

| Check | Result | Evidence |
|---|---|---|
| TypeScript + Vite build | Passed | tests/evidence/build.log |
| Contract tests | 3 passed | tests/evidence/unit.log |
| End-to-end journeys | 14 passed; zero skipped, unexpected or flaky | tests/evidence/playwright-results.json and end-to-end.log |
| Main-route layout | 10 routes × 6 widths passed, 320/390/768/1024/1440/1920 px | E2E route test |
| Visual cases | 27 cases, no recorded page overflow/runtime errors | tests/evidence/visual-audit.json |
| Automated accessibility | 24 default route/viewport axe scans at 390/1440 passed; Home and Motion Lab also asserted in E2E | visual-audit.json + journey tests |
| Thai Home | 390px, no page overflow | tests/evidence/home-thai-390.png |
| Built application | Browser → template → editor → API → SQLite revision passed | tests/evidence/production-smoke.json |
| Framer companion | Native desktop/phone renders visually inspected; final mutations returned no diagnostics | tests/evidence/framer-evidence.json |

Build has upstream notices about ignored Motion `use client` directives and Zod pure-annotation comments. They are not TypeScript/runtime failures. Main entry: 485.93 kB minified / 152.32 kB gzip. Editor, Voice, Workflows and Design OS have lazy chunks. Exact sizes are in the build log.

## Verified stories

1. Home idea → own-content conversation → Create → save → Library → reopen/reload.
2. Template preview → new document → edit → undo/redo → SVG download.
3. Research draft survives navigation → save → material transfer to Create.
4. Local workflow validation → deterministic execution → saved result.
5. Kinetic geometry + Thai text → preset save/export/import/preview apply → spatial keyboard navigation.
6. API stale revision returns 409; trash/restore works; invalid backup and foreign origin rejected.
7. Main routes render without page errors at six widths.
8. Reduced-motion Home remains readable; native dialog Escape works; Home axe scan passes.
9. Chromium synthetic microphone → actual MediaRecorder bytes → stop → playback → Library; captured tracks end. Physical microphones were not tested.
10. Live timer pause stays stable → cue presentation keyboard navigation → session save.
11. Backup restores into an empty second database. Documents, revisions, media metadata and exact audio bytes match. Invalid restore preserves the item count.
12. Document JSON export → validate → preview → explicit apply → save/reload retains Thai/English content.
13. Motion Lab initial controls pass the scoped axe scan.
14. A newer saved revision supersedes stale browser cache; the older unsaved draft stays downloadable.

## Visual review and performance

Home desktop/mobile, Create mobile, Motion Lab, Thai Home and Framer desktop/phone images were inspected. Mobile template cards changed to one column after a clipped word was found. Editor gained a mobile layer strip and explicit names for icon-only actions. Canvas geometry has accessible alternatives through Layers, Inspector and semantic DOM text.

The initial kinetic rAF sample ran alongside other browser work and had a high tail; it is retained in the JSON. A targeted follow-up sampled 179 frames at DPR 1: median 16.70 ms, p95 16.80 ms, maximum 16.80 ms between callbacks. This short headless sample is not a sustained 60 FPS guarantee, GPU benchmark or device certification.

Geometry tests confirm finite and distinct sampled formulas for all 16 paths. Screenshots do not prove motion timelines. Exhaustive duration/pause/reverse/choreography testing of every effect remains pending.

## Limits and data hygiene

No live AI, transcription, cloud, scheduler or public deployment was tested or claimed. No exhaustive screen-reader/manual accessibility audit, long-duration memory soak, all custom-accent contrast checks or physical mobile tests. Localization and advanced editor/workflow/media/motion requirements remain incomplete; see KNOWN_LIMITATIONS.md.

The 151-name source catalog is inventory, not 151 verified standalone components. Initial synthetic test records were preserved in `.data-initial-verification-20261107`; the final development preview uses a fresh empty Library. Subsequent tests use isolated storage. Some test screenshots intentionally show agent-created verification records.
