# ARTYVERSE X — Git and Vercel release
**Latest release — Prompt Pack concept preview (2026-11-08):** production READY at runtime commit `867eaa7acba2cb98578f6433d189f1a7a0fa0c59`, deployment `dpl_FHqyYQTgDNPcJ6MjmiBu6aQFDLNH`. Stable alias mapping confirmed. Open https://artyverse-x-ai-assistant.vercel.app/#/concept/home (Copilot / Studio tabs). This adds a labeled, interactive design preview; the original workspace and browser persistence remain available. Previous release details below are historical.

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
