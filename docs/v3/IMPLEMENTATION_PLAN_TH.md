# ARTYVERSE X V3 — merged frontend upgrade

Latest authorization: full update / merge / rewrite / hyper polish. This work upgrades the existing local product; it does not replace the backend, delete repositories, create subscriptions, or publish a public deployment.

## Decisions

- Keep npm + React/Vite/TypeScript/Tailwind4 + Motion + Express/SQLite. No monorepo, duplicate editor or Firebase migration.
- Dark creative default, plus persistent light/system themes. Preserve existing explicit language preferences; first-run language is Thai.
- ARTYVERSE = Artist × Multiverse. Wordmark ARTYVERSE + pink X. ARCYCA is the new original helmet/skater companion; the old Arty ghost remains part of saved Dynamics scenes and legacy illustrations. Fade W remains Whisper's assistant identity.
- Latest palette is the primitive brand source; semantic themes are tuned separately for contrast. UI font system: Syne 400–800, DM Sans, self-hosted IBM Plex Sans Thai and JetBrains Mono. Poppins remains available for legacy document/brand assets, not the new interface heading system.
- Preserve all V2 item IDs, revisions, media and routes. Add route aliases and a shared saved-item resolver for interview sessions/question notes. Copilot and Practice reuse the session entity; Question Bank reuses notes with a validated subtype.
- Copilot can capture manual turns, select evidence, build an editable deterministic outline, use browser TTS, save questions/sessions, and pass context to Agent Studio. Browser STT is capability-gated and user initiated; it is not simulated or treated as verified live transcription.
- Marketplace contains labeled original editable starters with no fake orders/creator statistics/payment. Analytics derives saved-record counts, not fictional quality metrics.

## Phases / actual scope

1. Recovery + repository audit — recovery/pre-v3-hyperpolish-20261108, local online SQLite/media snapshot, preserved pending review documents.
2. Semantic tokens/themes/fonts — shared/design.ts, generated CSS/JSON, selected foreground for custom accent, Settings preferences.
3. Shell/Home — grouped desktop navigation, collapse/drawer, five mobile navigation destinations, command palette arrows/Enter, create picker, original SVG hero, actual counts/recent work, persisted keyboard-accessible portal reordering.
4. Workspaces — Projects search/grid/list/detail/rename/duplicate/trash-undo; Copilot/Practice/Question Bank; original-starter Marketplace; actual Analytics; live 11-section Design System; legacy engines themed and retained.
5. Interaction/accessibility — native dialog focus restoration fixed for Strict Mode, roving editor/Design OS tabs, translated known static controls, microphone/audio cleanup, mascot hidden/offscreen/reduced-motion suspension, workspace error boundary.
6. Verification/handoff — build/unit/old+new browser workflows, full-theme default-state audits, responsive cases, built-application smoke and backup restoration; evidence recorded separately from V2.

## Intentionally unavailable or partial

Remote collaboration, public identity, cloud persistence, external checkout, community backend, background scheduler and credentialed AI inference are not added by a frontend rewrite. Browser Web Speech support, network service/privacy behavior, real microphone/sensor/touch devices and platform TTS need separate verification. No calibrated confidence, automated interview quality score or diarization is invented. Advanced technical copy still includes English labels; user content is never auto-translated. Exact six references requested in a prior prompt are still not supplied at those repository paths, so this is intentional art-direction work, not pixel reconstruction.

## Measured performance follow-up

The first Lighthouse 13.6 mobile lab run recorded performance 69, accessibility 95, best practices 100, SEO 92, LCP 5.7s and TBT 380ms. The local built server was serving uncompressed assets; the entry eagerly initialized document validators/other workspaces. Changes are limited to measured risks: compression middleware (with SSE excluded), pure route metadata separated from Zod contracts, lazy loading retained workspaces, Thai-font preloads, accessible names for mobile create/language controls, and a real robots.txt. A later report records actual remeasurement; no score is copied forward as a pass. Compression is the only new runtime dependency and is justified by measured on-wire payload size.
