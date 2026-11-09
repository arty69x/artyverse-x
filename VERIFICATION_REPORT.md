# ARTYVERSE X V3 — verification report

**Historical baseline:** this report records runtime `fd1ee45` before hosted mode. The later Git/Vercel release adds a separately tested browser-storage edition; see `docs/v3/HOSTED_EDITION.md` and `tests/evidence/deployment/`. Original Lighthouse scores below are not measurements of that new startup path.

Date: 2026-11-08. Runtime source revision: `fd1ee45a62bada2855e59f62145d332fa3dd56f0`.
Runtime SHA-256 fingerprint: `c184296b73c105eb63cbef63f4c1e90c0f008c99596836e5f5791aaeb42b47e0`.
Scope: intentional merged frontend redesign, with retained local V1/V2 engines. This is not pixel reconstruction, cloud deployment, WCAG certification or a claim that every feature in the historical master prompts is completed.

## Conditions and provenance

Node 24.19, Linux, headless Chromium 154.0.8037.57. Build served by Express at localhost:4318 against an isolated QA database. Browser/API regression uses separate test ports and databases. User databases and remote hosting were not modified. Test fixtures and synthetic audio are explicitly labeled; provider fixture output is not live AI inference.

`tests/evidence/v3/source-manifest.json` lists hashes of every runtime file, package configuration and generated tokens. Documentation/evidence commits may follow without changing runtime. Re-run relevant verification and regenerate this manifest when runtime changes. V2 results remain historical under `docs/v2/VERIFICATION_REPORT.md`.

## Actual checks

| Check | Result | Evidence |
|---|---|---|
| TypeScript | passed `npm run typecheck` | typecheck.log |
| Production build | passed `npm run build` | build.log |
| Unit tests | 16 passed, 3 files | unit.log |
| Full browser/API suite | 37 passed, 0 failed/skipped/flaky | playwright-results.json, end-to-end.log |
| Default-state WCAG-tagged axe audit | 50 desktop cases: 25 routes × dark/light, no violations or page overflow | visual-audit.json |
| Responsive layout survey | 135 font-loaded Thai cases: 15 routes × 320/390/640/768/820/1024/1280/1440/1536, no page overflow | visual-audit.json |
| Motion Lab | both themes checked separately, no axe violations | visual-audit.json, final-motion-followup.log |
| Mobile answer sheet | tested native dialog/focus and axe default state | visual-audit.json, V3 E2E |
| Final Home followup | Thai dark/light at 390 and 1440; checked after final early-render/accessibility/delivery changes | final-home-audit.log, visual-audit.json |
| Backup/restore | 3 exact records, stable IDs/evidence relationship and 2 revisions restored into empty temporary database | backup-restore.json |

Evidence filenames in the table are relative to `tests/evidence/v3/`. Full-route and responsive surveys retain their own timestamps; final Home followup covers subsequent Home loading and accessible-name changes. Automated default-state checks do not cover every dialog, error, screen reader or device condition. No lint command exists, so no lint pass is claimed.

The 37 regression cases include Home→Chat→Create→Library; template editing/undo/export; Research handoff; workflow validation/run; Motion preset round trip; synthetic recording/playback/track cleanup; Live timer/presentation; backup and document imports; revision conflict recovery; opaque-origin code sandbox and inspector edits; graph execution; real PCM WAV synthesis; dynamics/session persistence; fixture-provider cache/budget/error/cancel boundaries; themes; command keyboard/focus; project CRUD/trash undo; evidence→Copilot→Question Bank→Practice; starter creation; eleven-section Design System; mobile navigation; and data-loading draft retention.

## Measured performance

Lighthouse **13.6.0**, default simulated mobile profile, final built Home at localhost, isolated from E2E/axe/profile runs. One final run, not a field percentile or sustained device guarantee:

- Performance **96**, Accessibility **100**, Best Practices **100**, SEO **100**.
- LCP **1.3 s**, FCP **1.3 s**, total blocking time **210 ms**, CLS **0.004**.
- Initial application entry **270.60 KB minified / 85.87 KB gzip** from build output; Motion is a separate chunk and editors/validators are lazy. This is not the total transferred page budget.
- Server compression verified on JavaScript responses; SSE excluded. Thai fonts preloaded; Home renders before API records arrive, displaying honest loading metrics.
- Original run was 69/95/100/92 (LCP 5.7 s); intermediate compressed run 91/100/100/100 (LCP 3.0 s). Raw before/intermediate/final JSON is retained. No artificial delays or fixtures were used to replace Home content during Lighthouse.
- Separate Dynamics sample: 179 rAF intervals after SVG drag at 1440×1000/DPR1/WebGL off; median **16.7 ms**, p95 **16.7 ms**, max **16.8 ms**, no observed long tasks in this short interval. This measures rAF scheduling in headless Chromium, not GPU FPS or real-device 60 FPS compliance.

Raw files: lighthouse-mobile-before.json, lighthouse-mobile-compressed.json, lighthouse-mobile.json and performance-sample.json. INP requires real interaction/field measurement; TBT is not an INP result.

## Visual review and remaining limits

Screenshots show native editable UI, original SVG ARCYCA and vector portal artwork, both semantic themes and phone/tablet layouts. QA record counts come from actual isolated fixtures; new installs do not receive fake saved history. Image compositions were reviewed as an intentional redesign. Six named reference image files are absent from the repository; no pixel sampling, image-diff tolerance or reference-match claim is made.

Live browser STT, real microphones/sensors/multitouch, sustained mobile/GPU performance and manual screen-reader testing remain unverified. Copilot outlines are deterministic evidence tools, not AI inference. Credentialed AI, durable cloud hosting, authentication/ownership, remote collaboration, commerce/community and scheduling need external integration. Advanced Canvas grouping/locking/snapping and complete legacy-copy localization are outside this frontend pass. See KNOWN_LIMITATIONS.md and COMPONENT_COVERAGE.md.

## Delivery and rollback

Recovery branch: `recovery/pre-v3-hyperpolish-20261108` at `20b71bf`; recovery manifest/snapshots excluded from delivery archives. Existing item envelope and IDs are preserved; Copilot/Practice use validated session subtypes. No destructive migration, public deployment, remote rewrite or access-policy change occurred.

Start with `npm ci`, then `npm run dev`; or `npm run build && npm start`. Node 24+ and a running local API are required. Production deployment of the complete backend requires durable storage and identity decisions; a static Vercel build alone is not the full product.

Package with `python3 scripts/package-v3.py` after committing the reviewed source/evidence. It checks runtime file hashes and verifies archive CRC plus every packaged entry SHA-256. Packaging result is written beside the archive; it does not modify user data.

## Latest reconstruction evidence
See docs/reconstruction/VERIFICATION.md and tests/evidence/reconstruction/. This supersedes previous runtime claims for the new home/brand/shell. 49 unique browser/API cases have passing evidence (47 initial passes + 2 accepted retests; initial failures retained transparently), 20 units, 15 visual/axe surface cases, both runtime builds and built IndexedDB handoff. No pixel-perfect/3D/FPS/Lighthouse claim. Historical metrics are not transferred to the reconstruction.

## Typography polish (latest)
Both builds/TypeScript,20 unit tests and9 affected browser journeys passed.12 TH/EN two-theme typography cases passed axe/page-overflow checks;3 Home sizes passed overflow/clipping checks. Actual weight/effect/focus/draft/export behavior verified. See docs/typography/TYPE_SYSTEM.md and tests/evidence/typography/. Prior full49-case regression belongs to the preceding runtime and is not relabeled as a new full run. No pixel-perfect/Lighthouse/certification claim.

## Reference-library adoption (latest)
24 unit tests,10 new/affected browser workflows,18 gallery/detail/generated-layout checks plus8 maximum-content320px cases passed. Ten visual cases include axe; eight generated desktop and eight generated narrow cases check geometry. Both builds/TypeScript and actual browser IndexedDB save/reload/Studio/filter handoff passed. Full54-case regression, original Framer motion matching and new Lighthouse/FPS are not claimed. All12 source fingerprints, V7 syntax recovery,60 reference-only entries and8 newly authored templates are separated in docs/reference-library/.

## Canonical domain / safe browser transfer
29 unit tests;54 normal app browser/API regression cases; real two-origin isolated IndexedDB/service-worker migration with records/WAV/revisions/drafts, conflicts/idempotency/receipt URL mapping, tamper rejection, explicit forwarding and recovery bypass; legacy gate +4 destination widths checked with axe. See docs/domain-migration/VERIFICATION.md. Platform checks are separate from user-local data: no actual user's personal browser storage has been claimed migrated by Vercel API.
