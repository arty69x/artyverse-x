# Latest release — Editorial Studio (2026-11-09)

https://artyverse-x.vercel.app — READY deployment `dpl_E9sKif7BuSYb3VdAH6CSASFECavw`, exact runtime revision `9c2b47f05ac72a418ec0e8ff3deaa677954427e5`. Alias and Git SHA verified. Build output app-plAV7eNz.js matches local production build (277.69KB /87.54KB gzip); these are build sizes, not performance scores. Build completed and found0 vulnerabilities in platform install output.

Scope: deliberate editorial redesign across28 routes; eight primary links,19 specialist destinations, new native orbital Home artwork and shared controls/materials. Existing artifact data and workflows remain.29 units,56 accepted browser tests,65 static route/theme/viewport checks and local production-browser persistence smoke passed. Source fingerprint: f2cf2d896601adc5bc2f67d87aa9720f95490b88d5c23ba4fcd65044f5336b56. Detailed limits: docs/editorial-redesign/VERIFICATION.md.

SSO enabled/all_except_custom_domains remains unchanged on both projects. Legacy alias retains migration deployment `dpl_9oi96N8rCr8sh7AhRVkHs5w2Ynho`; old browser data is not moved or removed. Protected production UI was not browser-tested; local built-browser tests and platform deployment evidence are separate.

Rollback primary to `dpl_2XZdjpw1mCRjzUsnoSUKGMreWuiS`; source checkpoint recovery/pre-editorial-redesign-20261109. No data schema migration. Source/build and sanitized platform artifacts: tests/evidence/editorial-redesign/. A later evidence-only documentation commit does not change runtime.

---

# Previous release — Primary domain and workspace transfer (2026-11-09)

Canonical: https://artyverse-x.vercel.app. Runtime source `2ab80b17725394cfb6e793dad869a4609a77e159`, pushed to GitHub main; recovery branch `recovery/pre-primary-domain-20261108` preserves db475e1.

Both production deployments READY with exact source SHA and aliases verified: primary `dpl_FfZC8GtPdLfsGkiqzACKk6J6whyW`; legacy `dpl_9oi96N8rCr8sh7AhRVkHs5w2Ynho`. Both build app-Gl3VX_PN.js, matching the local production build. SSO remains enabled/all_except_custom_domains on both. Legacy ignore-build update (`exit 0`) was accepted after READY to retain the transfer release; no domain removed and no blanket redirect.

29 unit tests,54 existing regression cases and real two-origin IndexedDB/browser transfer checks passed. See docs/domain-migration/VERIFICATION.md and tests/evidence/domain-migration/. Production interaction behind SSO was not browser-tested; platform READY/alias evidence is separate. No real user's browser data has been moved by the agent. Users export from the old browser/profile and review/import on main; old `?recovery=1` remains available. Guide: docs/domain-migration/GUIDE_TH.md.

Rollback primary to `dpl_CvbGYTDhJ8o5xGJerLbKwKrRGHKZ`, legacy to `dpl_3FmZdx2LCt4V1JbSbnbFb6HvVdMo`; clear legacy ignore-build setting when resuming legacy builds. Deployment rollback does not undo browser records; retain source and destination backup files. Source/build fingerprints and sanitized platform checks are committed separately from runtime. Later documentation commits do not change runtime.

ZIP v15/v12 inventoried only; not executed or merged because the latest attachment supplied no requested operation.

---

# ARTYVERSE X — Git and Vercel release
**Previous release — Reference-driven Pattern Library (2026-11-08):** runtime `d3069e8b0c0be3d1b7d5448b118aade359898cfc`; deployment `dpl_3FmZdx2LCt4V1JbSbnbFb6HvVdMo`.

- Library: https://artyverse-x-ai-assistant.vercel.app/#/patterns
- Depth example: https://artyverse-x-ai-assistant.vercel.app/#/patterns/depth
- Chapters example: https://artyverse-x-ai-assistant.vercel.app/#/patterns/chapters
- Scope:8 original editable code layouts,6 artifact-only styles,60 explicitly reference-only inventory entries. All12 source files inventoried; no source statuses, vendor scripts or stock media copied as runtime capability.

Current checks:24 unit tests;10 selected new/affected browser workflows;18 gallery/detail/generated cases plus8 narrow maximum-content cases. Ten cases include axe; others check geometry. Both builds/TypeScript passed, plus local production browser IndexedDB draft/save/reload/Code Studio/filter handoff. No new full54-case regression, FPS/Lighthouse, source-motion or pixel-perfect score. Raw evidence: tests/evidence/reference-library/; decisions: docs/reference-library/ADOPTION.md.

Source fingerprint `8cf487d9e2cbd36f094c6e285c74756f185c875a9581cd065ddc783cfe6ae3cf`. Prior stable rollback `dpl_GBrFYYwByJ8DSsKygsy2cCYEQx2a`; recovery branch `recovery/pre-reference-library-20261108` at9d5b4ba. No data migration, provider/key/payment/cloud changes or access-policy relaxation. Platform READY/build/alias confirmation is recorded below once verified; protected production-browser interaction remains distinct from local built-browser tests. Documentation commits follow the exact deployed runtime SHA.

---

**Historical release — Typography polish (2026-11-08):** runtime `79a60c763ede429b9ed97eabedaee9add1c65e9c`; final deployment `dpl_GBrFYYwByJ8DSsKygsy2cCYEQx2a`. Live typography controls: https://artyverse-x-ai-assistant.vercel.app/#/design-system (Typography section); Home: https://artyverse-x-ai-assistant.vercel.app/#/home .

12 canonical type roles, real Latin200–800 weights/800italic, Thai200/400/700 fallback, emphasis/focus values, actual editable previews and JSON export. Both builds passed;20 units,9 affected journeys and15 visual/layout cases passed.12 of the visual cases include automated axe checks;3 Home cases check geometry/clipping. No new full49-case regression, Lighthouse or pixel-perfect claim. Source fingerprint `e3724b893cd2943d3109ac0ea5245aae79a7ec0fce170799e8e58456f931bd00`; per-file/build hashes and current evidence: tests/evidence/typography/.

Prior stable rollback: `dpl_H64eLwVVyS7mzuYpU4jJhdMn2ngV`; source recovery `recovery/pre-typography-polish-20261108` at `31a2b3d`. No storage migration, provider/payment change or access-policy relaxation. Runtime/docs commits remain separate.

---

**Historical release — Unified reconstructed Visual Engineering Studio (2026-11-08):** production READY, runtime commit `d4c53d03ee0dba7261de0ad4418583a2d531abcb`, deployment `dpl_H64eLwVVyS7mzuYpU4jJhdMn2ngV`. Stable alias confirmed to this deployment; alias error null.

- Home: https://artyverse-x-ai-assistant.vercel.app/#/home
- Builder inside shared shell: https://artyverse-x-ai-assistant.vercel.app/#/builder
- Native brand board and tokens: https://artyverse-x-ai-assistant.vercel.app/#/design-system
- Immutable deployment: https://artyverse-x-ai-assistant-p2uckamoa-arty69xs-projects.vercel.app
- Runtime fingerprint: `652f7b42d3796ea358f05a51b87c5b312ac2363c64e7d4cb940a35798613f42c`.

Vercel independently cloned the runtime SHA, reported zero known npm vulnerabilities, built `app-0bSXSAWN.js` (same as local browser build), completed and assigned the stable alias. Target/team/project checked before release. Existing SSO/access policy unchanged. Local workflows were browser-tested; protected production interactions and runtime observability were not exercised. No new monitoring integration or claim of clean live runtime logs.

Both builds passed; 20 units passed; 49 unique browser/API cases have accepted passing evidence across 47 initial passes plus 2 corrected/frozen-source retests. 15 visual/axe cases recorded no page overflow or violations; English320 wordmark separately corrected and retested. Actual local IndexedDB draft/brief/export/sandbox handoff verified. See `docs/reconstruction/VERIFICATION.md` and `tests/evidence/reconstruction/` for raw evidence and initial failures. No transferred Lighthouse/FPS/certification/pixel-perfect score.

Rollback: prior deployment `dpl_3ZwTZNz9P8U2kPinqsN1pmV2712s`, recovery branch `recovery/pre-reconstruction-20261108` at `f0fbffb`. No destructive storage migration. Documentation/evidence commits follow the deployed runtime SHA without changing application code. Services remain local/explicitly unavailable according to existing provider boundaries; sample commerce is not connected checkout.

---

**Historical release — Modern component kit + Storefront Builder (2026-11-08):** Vercel production READY, runtime commit `6896339578f250dc15f120d203cb348d14773a45`, deployment `dpl_3ZwTZNz9P8U2kPinqsN1pmV2712s`. Stable alias confirmed: https://artyverse-x-ai-assistant.vercel.app/#/concept/builder . Home: https://artyverse-x-ai-assistant.vercel.app/#/concept/home .

Radix controls, adapted shadcn composition, Motion interactions, original editable storefront templates, independent export, real Studio handoff, and permission-based FFT mascot are included. Sample goods/prices; no checkout or AI generation claim. Existing workspace and access policy preserved.

Evidence: `tests/evidence/component-upgrade/`, `COMPONENT_UPGRADE_REPORT.md`. Both builds passed; 20 unit tests and 47 browser/API regression tests passed, with 6 affected journeys repeated; 32 responsive and 7 overlay checks recorded no axe violations or page overflow. Vercel independently built `app-C51XHvNi.js`, reported zero known npm vulnerabilities and completed deployment; alias error null. Browser workflows were verified locally, not through protected production. No new Lighthouse/FPS/WCAG certification claim.

Rollback: prior production `dpl_FHqyYQTgDNPcJ6MjmiBu6aQFDLNH`; recovery branch `recovery/pre-component-upgrade-20261108` at `2286811`. Documentation/evidence commits follow the runtime SHA without altering deployed code.

---

**Historical release — Prompt Pack concept preview (2026-11-08):** production READY at runtime commit `867eaa7acba2cb98578f6433d189f1a7a0fa0c59`, deployment `dpl_FHqyYQTgDNPcJ6MjmiBu6aQFDLNH`. Stable alias mapping confirmed. Open https://artyverse-x-ai-assistant.vercel.app/#/concept/home (Copilot / Studio tabs). This adds a labeled, interactive design preview; the original workspace and browser persistence remain available. Previous release details below are historical.

Current evidence: `tests/evidence/concept/` and `docs/v3/CONCEPT_PREVIEW_TH.md`. Source/build fingerprints recorded; 41 unique regression cases passed, followed by 4 concept-specific checks after final isolated UI changes; 24 responsive screen states and 4 overlays passed default-state axe checks. The final browser build's sandbox/IndexedDB handoff was exercised locally. Vercel reports READY, 0 known npm vulnerabilities, and generated `app-CsY9zTcv.js` / `Concept-Cm4GXMLg.js` matching local build names. No new production-browser interaction claim is made; existing protection and execution-network limits remain.

Rollback for this release: prior production deployment `dpl_Ani56twRcWrJjSEcRtaoEz7daazK`; source recovery branch `recovery/pre-visual-polish-20261108` at `de7fe80`. Preview does not create records merely by viewing it; explicit save-to-Studio creates a new code document. No access-policy relaxation, data deletion or new paid integration occurred.

Date: 2026-11-08. Production status confirmed **READY**, target **production**, alias error **null**.

- Stable URL: https://artyverse-x-ai-assistant.vercel.app
- Existing URL preserved: https://artyverse-x-ai-assistant-arty69xs-projects.vercel.app
- Immutable deployment: https://artyverse-x-ai-assistant-nq2v5lei8-arty69xs-projects.vercel.app
- Deployment ID: `dpl_Ani56twRcWrJjSEcRtaoEz7daazK`
- Project: `artyverse-x-ai-assistant` / `prj_IX1ylxFY2Uj4EcDyCr5CAigTkrXG`
- Source: https://github.com/arty69x/artyverse-x/commit/230d3716c78dcd09ad3d62df4bd05b9e0299a374
- Runtime fingerprint: `c9f44fe9b9c91064733b3560f5adecbaedc2266b4a37547023714c73d32d64ae`
- Framework: Vite; Node 24; build `VITE_STORAGE_MODE=browser npm run build`; output `dist/`.
- Production build phase about 21 seconds (18 seconds in the build-completed log); local and remote main entry both `app-rwz_r7T3.js`, worker emitted at `/browser-worker.js`.

## Git delivery

Pushed `work`, fast-forwarded remote `main` from the initial commit, and pushed `recovery/pre-hosted-20261108` at `2423698`. No force push or history deletion. Documentation/evidence commits may follow the runtime release commit without changing deployed code. This release was created through the Vercel API from an exact Git SHA. Automatic deploy-on-push has not been verified or claimed.

## Verified scope

- Both server and browser production builds completed; TypeScript passed.
- Existing server regression: **37 browser/API tests passed** after hosted runtime changes (`04e94a1`).
- Final Vitest 5.1.0: **16 unit tests passed**; current npm audit **0 known vulnerabilities**. The initial build's three test-tool advisories were remediated before production.
- Browser edition: **12 recorded scenarios passed**, repeated on the final build. Real IndexedDB CRUD/reload, atomic revision conflict, binary WAV Blob persistence, media signature rejection, local agent provenance/unavailable AI, trash/restore, exact backup/restore into an empty browser context (records, three revisions, media), invalid backup recovery, merge preserving edits, Home at 390/1440 with no axe violations or page overflow. No page errors observed in these local static-build tests.
- Vercel production build independently reported **found 0 vulnerabilities**, completed successfully, and alias lookup maps the stable URL to this exact production deployment.

Raw evidence: `tests/evidence/deployment/`. Source and build manifests include per-file SHA-256. Full V3 Lighthouse numbers in the historical report apply to the earlier pre-service-worker runtime; no new Lighthouse score is claimed for this hosted startup path.

## Post-deployment limits and access

The existing protection remains `ssoProtection.enabled=true`, `deploymentType=all_except_custom_domains`; password/trusted-IP settings are unchanged. No bypass/share link, domain purchase or access-policy relaxation was created. Opening a protected URL may require the authorized Vercel account.

Production interaction was not browser-tested from this execution environment: the outbound proxy rejected the Vercel host, and no CLI/OIDC/protected-browser credentials were available. Platform READY status, build logs and alias assignment were verified through the connected Vercel tools. Local static-build interaction results above are separate from this limitation. Client-side production error monitoring and real-device testing remain gaps; no error-free production certification is claimed.

## What works online / data boundary

The hosted app is a browser-local workspace: documents, projects, notes, media, revisions and local tools are stored in IndexedDB on that browser profile and origin. This avoids temporary serverless SQLite. Use Settings → Backup before clearing site data or changing domain/browser/device. Each alias/immutable deployment URL is a different storage origin; use the stable URL for ongoing work. The worker does not cache an offline app shell. No cloud sync, public account system, shared backend, live AI, multiplayer or checkout is implied. Local Node/SQLite mode remains intact.

## Rollback and next work

Source recovery: `recovery/pre-hosted-20261108` (`2423698`). Previous Vercel deployment retained: `dpl_C6FAqSyYaoFwV3zZyY4xAM68tzDs`. Revert or redeploy the intended reviewed source rather than force-resetting Git. Back up browser work before changing origins/schemas; frontend rollback does not delete IndexedDB.

The first preview promotion API call returned HTTP 422. Recovered by building the same tested Git SHA with explicit `target=production`; final READY/alias records confirm success. No repeated blind promote retry or access-policy workaround was used.

Continuation plan: `docs/v3/NEXT_ACTIONS_TH.md`; architecture: `docs/v3/HOSTED_EDITION.md`. No paid integrations, provider keys or personal SQLite/media were uploaded.

Package the final source/research and browser build with `python3 scripts/package-hosted.py`. Its runtime/build hash checks intentionally reject stale artifacts; the older V3 ZIP and evidence remain separate historical deliverables.

Typography final platform confirmation: `dpl_GBrFYYwByJ8DSsKygsy2cCYEQx2a` READY/production, alias error null, stable alias points to it; remote `app-EcxjKEBR.js` matches local browser build and npm reports0 known vulnerabilities. Protected production browser interactions/runtime logs were not exercised. No new monitoring/paid integration installed. Evidence/docs commits follow runtime79a60c7.

Reference-library final confirmation: production READY, alias error null; stable alias maps to dpl_3FmZdx2LCt4V1JbSbnbFb6HvVdMo. Git source d3069e8; app-i27OuK4H.js matches local browser build. Remote npm reports0 known vulnerabilities; Build Completed/Deployment completed recorded. Current source/build fingerprints and sanitized metadata are in tests/evidence/reference-library/. No protected production-browser/runtime error scan claim; existing SSO policy retained.
