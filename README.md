Current visual system: **Editorial Studio** — a quieter Home, eight primary destinations and a grouped All tools directory, with shared light/dark surfaces across existing workspaces. Design decisions and real verification: [docs/editorial-redesign/SYSTEM.md](docs/editorial-redesign/SYSTEM.md). Existing records, drafts and editor workflows are preserved.

# ARTYVERSE X · Visual Engineering Studio

**Main site: https://artyverse-x.vercel.app** · [Move old browser work](https://artyverse-x.vercel.app/#/transfer) · [Recovery](https://artyverse-x-ai-assistant.vercel.app/?recovery=1#/transfer)

**Artist × Multiverse.** A Thai-first local creative studio with a new semantic dark/light/system design, original ARCYCA SVG mascot, responsive navigation, evidence-first interview workspace and retained creative engines.

```sh
npm ci
npm run dev
```

Node 24+ required. Open http://localhost:5173. Built local application: `npm run build && npm start`, then http://localhost:4311. Keep SQLite/media under `.data`; browser drafts remain in the browser. No API key is needed for local tools.

New frontend: Projects search/grid/list/detail/rename/duplicate/trash-undo; Copilot manual transcript/evidence/outline; Practice and Question Bank; original-starter Marketplace; actual Analytics; live 11-section Design System at `#/design-system`; keyboard command palette; mobile bottom tabs and native drawers/dialogs; persisted Home arrangement. Canvas/Code/Node/Agent/Research/Voice/Sound/Dynamics/Story/Live/Library/Design OS are preserved and themed.

Read [the merged design](ARTYVERSE_X_MASTER_SPEC.md), [V3 decisions](docs/v3/IMPLEMENTATION_PLAN_TH.md), [verification](VERIFICATION_REPORT.md), [known limitations](KNOWN_LIMITATIONS.md), and [migration/rollback](MIGRATION_AND_ROLLBACK.md). Repository instructions are in AGENTS.md.

`npm run tokens` generates UI token exports; `npm run typecheck`, `npm test`, and `npm run test:e2e` verify the code and workflows. Browser tests use system Chromium as specified in playwright.config.ts. Versioned evidence is kept separate; changes invalidate affected runtime fingerprints.

Copilot outlines are deterministic local structures, not AI inference. Optional browser STT may use the browser vendor’s service and needs user permission; manual text always works. Provider adapter, real voice recording, synthesis and local workflows remain available within their documented capabilities. Public cloud/multiplayer/commerce/community services are not connected by this frontend upgrade. Hosted persistence is browser-local IndexedDB; cloud identity/sync remain unavailable. Canonical deployment uses artyverse-x, with the old origin retained for reviewed transfer/recovery.

## Vercel / browser edition

`vercel.json` builds with `VITE_STORAGE_MODE=browser`. On Vercel, items/media/revisions live in this browser's IndexedDB, not a shared cloud database. Use Settings → Backup before clearing site data or moving to another origin/device. AI remains unavailable in this edition; deterministic local tools work. Existing Node/SQLite mode remains the default when running locally. See [hosted architecture](docs/v3/HOSTED_EDITION.md) and deployment evidence under `tests/evidence/deployment/`.

## Prompt Pack design preview

Open `#/concept/home`, `#/concept/copilot`, or `#/concept/studio` (also linked from Home). Three native, responsive concept screens use labeled examples. Code editing/Run/export and explicit handoff to saved Studio work locally; no sample AI/auth/collaboration success is implied. See [concept scope and evidence](docs/v3/CONCEPT_PREVIEW_TH.md).

## Modern component kit / storefront builder

Open `#/concept/builder` for reviewed local templates, editable native storefront, responsive Motion viewport, Radix keyboard tabs/switches, product/detail/sample-bag controls, HTML/CSS/config export and real Code Studio handoff. The component suite below it demonstrates bold/underline/color blocks, tactile controls and gesture-only microphone SVG visualization. Goods/prices are samples; no checkout or AI-generation service is implied. See [release checks](COMPONENT_UPGRADE_REPORT.md) and [library choices/licenses](docs/v3/COMPONENT_LIBRARY_DECISIONS.md).

### Unified reconstructed Studio

Open `/#/home` for the Extract / Compose / Ship workspace and `/#/builder` for the existing editable storefront engine within the same navigation. `/#/design-system` includes native prism-A brand variants. Actual user-uploaded boards are preserved under `design/references/`; source authority, module mapping and remaining fidelity limits are in [reconstruction notes](docs/reconstruction/RECONSTRUCTION.md). The mascot hero is an optimized generated reconstruction, not a recovered 3D model. Existing editors, persistence, sandbox and export remain the same shared engines.

### Pattern Library from supplied references

Open `/#/patterns`:8 independently authored editable web layouts,6 artifact-only styles and a separate60-entry reference inventory. Preview on request, edit a local draft, review imported presets, export self-contained HTML or create a new real CodeDocument in the existing Studio. No Framer component package/script/media was copied into runtime. All12 uploaded-source decisions, V7 recovery and source-to-feature mapping: [reference adoption](docs/reference-library/ADOPTION.md).

Canonical operations and per-browser migration: [guide](docs/domain-migration/GUIDE_TH.md), [deployment targets](docs/domain-migration/OPERATIONS.md), [evidence](docs/domain-migration/VERIFICATION.md). No user data is silently cleared or claimed migrated without a verified import.
