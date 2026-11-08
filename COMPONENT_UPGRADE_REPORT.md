# ARTYVERSE X — modern component / storefront release

2026-11-08. Scope: user-authorized component selection and visual upgrade, bold/editorial underline/focus/color blocks, responsive Motion storefront builder and interactive rig/controls. Runtime revision and source/build hashes are recorded in tests/evidence/component-upgrade/source-manifest.json and build-manifest.json. Deployment details follow after the source checkpoint; older V3 reports remain historical.

## What changed

- Real Radix Switch/Tabs with inspected shadcn/ui composition and retained MIT notices; no wholesale framework/theme replacement. Installed versions come from actual npm ls output in installed-versions.json.
- Reused Motion 12 with shared tactile tokens, LayoutGroup selection highlights, responsive viewport layout, button feedback, in-view stagger and reduced-motion/Calm/Off/hidden fallbacks. No duplicate animation package.
- Stronger shared PageHead/button typography, visible focus/underline; concept Home/Copilot/Studio use explicit bold, editorial underline and lime blocks. New Builder is linked from concept Home, navigation and the real Design System.
- Two original reviewed local templates, editable/versioned browser draft, validation/Undo, actual category/product/detail/sample-bag interactions, safe HTML/CSS/config downloads and saved Code Studio handoff.
- Studio Guide saves an actual local brief result. Secondary SVG rig visualizes a gesture-authorized live microphone input with distinct mouth drawings and cleanup. Primary ARCYCA remains unchanged.

Key source: src/components/kit/, src/concept/FramerStudioComponents.tsx, src/concept/studio-kit.css, shared/storefront.ts, shared/concept.ts, src/core/useSpectrum.ts. Full choices/source/license references: docs/v3/COMPONENT_LIBRARY_DECISIONS.md.

## Recorded checks

| Check | Actual result / scope | Evidence in tests/evidence/component-upgrade/ |
|---|---|---|
| TypeScript + Vite | Server and browser production builds passed | server-build.log, browser-build.log |
| Unit | 20 tests passed, including draft/export/safe-rendering contracts | unit.log |
| Full browser/API regression | 47 passed (41 previous + 6 new) | regression.log |
| Final narrow-touch CSS followup | 6 affected Builder/control/media journeys repeated and passed | followup.log |
| Responsive / default-state axe | 32 cases: four concept screens × 320/360/390/768/1024/1280/1440/1536; no axe violations/page overflow/hero clipping | visual-checks.json, screenshots |
| Dialog/panel/error states | 7 states at 390px: product detail, bag, preset, mic consent, Code, Files, invalid draft; no axe violations or page overflow | overlay-checks.json, screenshots |
| Built hosted edition | Actual IndexedDB; edited draft survives reload; real local brief provenance; saved storefront reopens/runs and filters inside the opaque-origin iframe | built-browser-checks.json |
| Dependency audit | Zero known npm vulnerabilities at the recorded run | npm-audit.json |

Linux/headless Chromium 154, isolated QA databases/browser contexts and static preview; fonts loaded for visual checks. Motion is Off for deterministic screenshots. Browser/API tests exercise actual controls and synthetic microphone tracks, not real-device audio recognition. Default-state axe is not WCAG certification. Raw logs retain warnings from build tooling; no nonexistent lint check or >85% coverage claim is made. An initial CSS merge error was restored from the recovery checkpoint and corrected before accepted builds/regression; rejected/interrupted checks were not counted as passes or deployed.

The six new browser journeys cover reviewed template cancellation/apply/Undo and incomplete draft reload; real viewport constraints and keyboard tabs; category/bag state retained across hidden panels; independent HTML export and sandbox handoff; real Radix switch effects and local-run provenance; microphone gesture/stop/navigation cleanup; denial/retry and reduced-motion static rig.

## Limits and honest capabilities

Goods, prices and bag selections are labeled samples; there is no merchant account, order or payment service. Templates/vectors are original, not copied from a paid Framer asset. Framer Marketplace plugins were not installed into React. AI reconstruction/model badges/progress from the sample code were not fabricated. Studio Guide is deterministic and does not build from arbitrary prose; connected AI remains behind the existing authorized server boundary.

The FFT rig is an RMS/energy-band illustration, not calibrated phoneme recognition, transcription or speech-synthesis lip sync. No audio is recorded, uploaded or stored. Real hardware, iOS/background behavior and voice quality remain unverified. No sustained FPS, INP, pixel-match threshold, new Lighthouse score, cloud identity, multiplayer or production-grade full-service claim follows from these checks.

Hosted work remains private to browser profile/origin in IndexedDB; drafts/preferences remain browser-local and outside server backups. Local Node/SQLite edition and existing URLs/IDs/media/revisions remain intact. No destructive data migration or access-policy relaxation occurred. Recovery branch: recovery/pre-component-upgrade-20261108 at 2286811; prior Vercel production deployment: dpl_FHqyYQTgDNPcJ6MjmiBu6aQFDLNH. Production interaction through Vercel protection is separate from local static-build verification and is not claimed without evidence.

## Production delivery

Runtime source: `6896339578f250dc15f120d203cb348d14773a45`. Vercel deployment `dpl_3ZwTZNz9P8U2kPinqsN1pmV2712s` is READY, production, alias error null. Stable alias verified to this deployment: https://artyverse-x-ai-assistant.vercel.app/#/concept/builder . Remote build generated `app-C51XHvNi.js`, matching local browser build, and reported zero known npm vulnerabilities. Source/build fingerprints and sanitized deployment/alias evidence are in `tests/evidence/component-upgrade/`. Documentation commits may follow this runtime SHA. Local browser verification and remote platform build/alias verification are distinct; protected production interactions were not exercised. Previous production remains the rollback target recorded above.
