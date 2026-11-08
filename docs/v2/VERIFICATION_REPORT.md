# Verification report — ARTYVERSE X V2

Recorded 2026-11-08. Scope: personal local Creative Operating Studio, redesign/art-direction review. No public-production, pixel-perfect, WCAG certification or sustained FPS claim.

## Source and conditions

Runtime revision: `a15909f17c146a5652e09c37f80d7b6c39134332`. Runtime fingerprint: `2675dd267a9d94f78fe8e5a66637aa275e904690bc2deab0195488893cdcee84`. File hashes: `tests/evidence/v2/source-manifest.json`. Documentation/test tooling/evidence added later do not change this runtime. Relevant source changes invalidate the affected evidence.

Node 24.19.0; Linux; Chromium 154.0.8037.57; system executable `/usr/bin/chromium`. E2E uses isolated web 5174/API 4312 and fresh `.test-data/run-*`; V1 restore uses 4313; provider adapter test uses local HTTP fixture + isolated API 4316. Built-app checks use `npm start` on 4315 with separate data and restore into an empty temporary database on 4317. No live provider key or paid inference was used. Viewport simulation is not real-device testing.

## Recorded results

| Check | Result | Evidence |
|---|---|---|
| TypeScript + Vite build | Passed | tests/evidence/v2/build.log |
| Unit contracts | 10 passed in 2 files | tests/evidence/v2/unit.log |
| Browser/API journeys | 27 passed; 0 skipped, unexpected or flaky | tests/evidence/v2/playwright-results.json; end-to-end.log |
| Existing route layout | 10 routes × 6 widths, no overflow/runtime errors in test | journeys.spec.ts |
| New route layout | 8 routes × 6 widths, no overflow/runtime errors in test | v2.spec.ts |
| Built default-state visual/axe audit | 9 routes × 2 widths = 18 cases, 0 recorded violations/overflow/page errors | tests/evidence/v2/built-visual-audit.json; matching PNGs |
| Thai Home | 390px, no page overflow | home-th-390.png; built-visual-audit.json |
| Built artifact workflow | Code Run → actual preview button interaction → SQLite save | built-visual-audit.json |
| V2 backup/restore | project/code/composition/scene/story/workflow stable IDs and exact data restored into empty DB; 12 fixture records merged | built-visual-audit.json |
| V1 compatibility | Graph-less workflow opens retained editor; actual run/save; same ID, revision and project preserved | tests/evidence/v2/legacy-compatibility.json |
| Provider adapter | Fixture response/usage/cost, exact cache, budget block, HTTP failure with unknown cost fallback, cancellation | v2.spec.ts; explicitly a fixture, not AI inference |
| Multi-step agents | Two actual local agent run records → saved note, graph reload retains execution | v2.spec.ts |
| Code boundary | No auto-run; visual inspector applied CSS; parent document denied in iframe; source review and undo/redo | v2.spec.ts |
| Sound | WAV RIFF/44.1kHz and nonzero PCM, rendered Library recording, AudioContext closed on view exit | v2.spec.ts |
| Data recovery | Corrupt studio draft retained under recovery key; safe default; wrong-kind deep link gives missing state | v2.spec.ts |

Main entry: 364.96 kB minified / 112.44 kB gzip. Motion has a separate 135.76 kB / 44.93 kB gzip chunk; workspaces are lazy loaded. Exact output sizes are in build.log. Upstream Motion `use client` directives and Zod annotation warnings are recorded build notices, not ignored test failures.

## Performance sample

Isolated built-app Dynamics, 1440×1000 / DPR1 / headless Chromium / WebGL off. An SVG body was dragged 90×30 viewport pixels before sampling spring settling. 179 rAF intervals: median 16.70 ms, p95 16.80 ms, maximum 16.80 ms; 0 long tasks during the sample; observed JS heap 6927218 bytes. `tests/evidence/v2/performance-sample.json` records conditions. These are scheduling intervals in one short run, not GPU frame completion or a sustained real-device FPS guarantee. The earlier longTasks array in the multi-route visual audit includes axe/screenshots/navigation workload and must not be attributed to the app alone. The isolated profile excludes that workload.

Opt-in WebGL created a canvas and did not show its unavailable fallback in the headless built-app check. This does not certify real-device GPU performance, context recovery or all shaders on all browsers.

## Limits and evidence invalidation

Automated accessibility scans cover default states and selected dialogs/controls only. Manual screen-reader, 200% zoom, every error state, full TH/EN, real iPad/phone multitouch/sensors/microphone and public security/deployment checks remain. A screenshot is appearance evidence, not proof of motion or workflow. Public multi-user infrastructure, live AI inference, transcription, cloud sync and external schedules were not verified or connected.

V1 evidence remains in `tests/evidence` and `docs/v1/VERIFICATION_REPORT.md` as historical records. New evidence lives in `tests/evidence/v2`. No source archive buildVerified, versions, scores or component coverage were copied into V2 results. Reports become stale when the hashed runtime changes; rerun the relevant commands and regenerate the manifest before relying on them again.
