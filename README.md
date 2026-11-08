# ARTYVERSE X · Creative Operating Studio V2

**Artist × Multiverse.** A connected personal workspace for ideas, canvases, code, sound, motion, local agents and stories. React + TypeScript + Vite + Tailwind utilities + Motion for React; Express/SQLite local persistence.

```sh
npm ci
npm run dev
```

Node 24+ required. Open http://localhost:5173. For the built local application: `npm run build && npm start`, then http://localhost:4311. SQLite/media default to `.data`; browser drafts stay in the browser. No provider key is needed for local tools.

New: Projects, Agent Studio (local tools + optional server adapter, provenance/cost/cache/fallback), editable Node Studio with multi-step agent runs, sandboxed Code Studio + CSS inspector + repair review, Sound Lab + actual WAV, SVG Dynamics + optional gestures/sensors/WebGL, Story Studio + linked-document presentation, System & costs. Existing Canvas/Chat/Research/Voice/Live/Library/Templates/Design OS remain available; graph-less V1 workflows use compatibility mode.

Read [the complete design](ARTYVERSE_X_MASTER_SPEC.md), [V2 scope](docs/v2/RELEASE_SCOPE.json), [workflow map](WORKFLOW_MAP.md), [verification](VERIFICATION_REPORT.md), [limitations](KNOWN_LIMITATIONS.md), and [migration/rollback](MIGRATION_AND_ROLLBACK.md). Historical V1 specifications/evidence are retained separately.

`npm test` runs contract tests; `npm run test:e2e` runs isolated browser/API workflows with system Chromium. See Playwright configuration for the executable path. Provider contract checks use a clearly identified local fixture, not live AI inference.

This release is a personal local application. Public multi-user deployment, cloud sync, transcription, billing and external schedules are unavailable. No public deployment or remote deletion was performed.
