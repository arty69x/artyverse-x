# V3 component registry and coverage

Canonical interface: shared/design.ts. Current implementation inventory below; historical V2 mappings are retained in docs/v1/COMPONENT_COVERAGE.md and the source catalog. Names are not a claim of standalone component count or complete state coverage. V3 verification is test-specific in VERIFICATION_REPORT.md.

| Family / surface | Actual scope | Implementation |
|---|---|---|
| Shell | grouped nav, collapse/drawer, five mobile destinations, history, active route, create picker | src/v3/Shell.tsx |
| Command palette | real scoped results, arrows/Enter, empty state, dialog focus | src/v3/Shell.tsx |
| Theme system | dark/light/system, persistence, OS updates, semantic tokens | src/v3/Theme.tsx + shared/design.ts |
| Editorial dashboard | native hero, SVG, actual counts, reorderable portals, real recent items | src/v3/Home.tsx |
| ARCYCA | original layered SVG, state display, motion visibility/reduced cleanup | src/v3/Mascot.tsx |
| Projects | grid/list/detail, search, rename, duplicate record, trash confirmation/undo | src/v3/Projects.tsx |
| Interview | transcript turns, evidence picker, local outline, editable answer, TTS/STT boundaries, sheet | src/v3/Copilot.tsx |
| Question Bank / Marketplace / Analytics | actual notes, labeled editable starters, derived counts | src/v3/Platform.tsx |
| Live design board | eleven real token/component sections, contrast, keyboard tabs, real digest demo | src/v3/DesignBoard.tsx |
| Shared dialogs / buttons | native modal and Strict Mode focus restoration, semantic styling | src/components/UI.tsx |
| Studio source controls | undo/redo, validated import/preview/apply/export, revised Thai controls | src/v2/shared.tsx |
| Retained editors/media/motion | working V2 engines with themed controls and compatible data | src/v2 + src/pages |
| Error boundary | preserve shell and saved records when a workspace fails | src/v3/Boundary.tsx |

The original 151-name inventory remains a planning catalog. No percentage, component verification count, or full-production status is inferred from the catalog or the number of passing tests.
