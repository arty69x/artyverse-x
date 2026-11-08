# Reconstruction verification — 2026-11-08

Linux Chromium154.0.8037.57, Node24.19, isolated QA data, actual fonts. Dev API/SQLite and built browser IndexedDB modes. No physical mobile devices, actual human audio, protected Vercel browser or 3D model inspection claimed.

- Both server and browser builds/TypeScript passed on final source. No configured lint script exists.
- Unit: 20 passed. No >85% coverage claim.
- Full regression: 49 cases executed, 47 passed initially; a source-update/HMR navigation interrupted the multi-route geometry case, and the new English320 wordmark case found genuine overflow. Both were rerun after freezing source/fixing the wordmark and passed (2/2). Thus 49 unique cases have passing evidence across the recorded runs, not a claim that the initial full run was green. Historical full-suite report is preserved separately; current raw logs/JSON are under tests/evidence/reconstruction/.
- 9 default-state visual/axe cases: Home320/390/768/1440 × dark/light plus Builder390. No overflow, hero clipping, axe violations or page errors.
- 6 supplementary surface cases: Home1280×720, Builder1440 dark/light, DesignSystem390dark/1440light, Code390dark. No overflow/axe violations/page errors. English320 wordmark regression separately passed.
- Built hosted edition: actual IndexedDB, draft edit/reload, local brief provenance, saved CodeDocument opens/runs independently in opaque-origin sandbox and retains product filters. No page errors.
- npm audit: zero known vulnerabilities. Dependencies unchanged.

These are actual checks of the local supported features, not pixel-perfect scores, sustained FPS, Lighthouse results, real AI generation, cloud collaboration or WCAG certification. Earlier rejected/interrupted attempts were not counted as accepted passes. Old docs/evidence remain historical.

## Source fidelity
Source R1/R2/R3 are actual copied user JPEGs, with original byte dimensions recorded. Qualitative comparison supports visual identity and native reconstructed elements. The source board includes tiny screen thumbnails, not full-size baselines for every route; no manufactured overlay score or exactness claim. Remaining differences and substituted artwork are listed in RECONSTRUCTION.md.

## Release boundary
Hosted mode uses browser-local storage, server mode retains SQLite. No auth/payment/provider or collaboration was connected; no access-policy changes or destructive migration. Runtime/source hashes, deployment READY and stable alias mapping are recorded in release evidence once confirmed. Platform verification is distinct from browser interactions through Vercel protection.
