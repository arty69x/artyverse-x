# ARTYVERSE X V3 · Hyper Polish

**Artist × Multiverse.** A Thai-first local creative studio with a new semantic dark/light/system design, original ARCYCA SVG mascot, responsive navigation, evidence-first interview workspace and retained creative engines.

```sh
npm ci
npm run dev
```

Node 24+ required. Open http://localhost:5173. Built local application: `npm run build && npm start`, then http://localhost:4311. Keep SQLite/media under `.data`; browser drafts remain in the browser. No API key is needed for local tools.

New frontend: Projects search/grid/list/detail/rename/duplicate/trash-undo; Copilot manual transcript/evidence/outline; Practice and Question Bank; original-starter Marketplace; actual Analytics; live 11-section Design System at `#/design-system`; keyboard command palette; mobile bottom tabs and native drawers/dialogs; persisted Home arrangement. Canvas/Code/Node/Agent/Research/Voice/Sound/Dynamics/Story/Live/Library/Design OS are preserved and themed.

Read [the merged design](ARTYVERSE_X_MASTER_SPEC.md), [V3 decisions](docs/v3/IMPLEMENTATION_PLAN_TH.md), [verification](VERIFICATION_REPORT.md), [known limitations](KNOWN_LIMITATIONS.md), and [migration/rollback](MIGRATION_AND_ROLLBACK.md). Repository instructions are in AGENTS.md.

`npm run tokens` generates UI token exports; `npm run typecheck`, `npm test`, and `npm run test:e2e` verify the code and workflows. Browser tests use system Chromium as specified in playwright.config.ts. Versioned evidence is kept separate; changes invalidate affected runtime fingerprints.

Copilot outlines are deterministic local structures, not AI inference. Optional browser STT may use the browser vendor’s service and needs user permission; manual text always works. Provider adapter, real voice recording, synthesis and local workflows remain available within their documented capabilities. Public cloud/multiplayer/commerce/community services are not connected by this frontend upgrade. Vercel is linked; complete hosted persistence and identity remain a separate deployment task.
