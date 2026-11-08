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

Hosted browser storage adapter: implemented; 12 verification scenarios in tests/evidence/deployment/hosted-verification.json. Server regression retains 37 passing cases. Backend mode is explicit and cloud identity/sync remain unavailable.

## Modern component kit supplement

| Family | Implementation | Actual behavior |
|---|---|---|
| Accessible Tabs / Switch | src/components/kit/primitives.tsx | Adapted shadcn composition, actual Radix semantics/keyboard, tokenized styling |
| Motion policy | src/components/kit/motion.tsx | OS reduced motion + app Calm/Off + hidden awareness |
| Storefront Builder / templates | src/concept/FramerStudioComponents.tsx; shared/storefront.ts | Draft edit/validation/Undo, measured viewport, reviewed presets, files/export and explicit editor handoff |
| Catalog / detail / sample bag | FramerStudioComponents.tsx | Real local filtering and selection; labeled sample goods/prices; no checkout |
| SVG rig / audio input | FramerStudioComponents.tsx; src/core/useSpectrum.ts | Distinct mouth states, gesture-only real FFT visualization, resource cleanup |
| Type / focus / color block | studio-kit.css and shared PageHead/button styles | Bold, editorial underline, readable marker and keyboard focus |

These families are not a claim that the historical 151-item inventory is implemented. Evidence and limitations are recorded separately in COMPONENT_UPGRADE_REPORT.md.

Reconstruction additions: PrismMark (native SVG/unique gradients), BrandPanel (primary lockup and 3 monogram surfaces), StudioLaunchpad (3 actual workspace journeys and 6 actual tool routes), UnifiedBuilder (existing editor engine within shared shell). ARCYCA hero is optimized decorative reference-generated WebP with real load-error SVG fallback. No duplicated editor, fake metrics or connected provider added. Component counts elsewhere are historical; these named additions do not imply 151-component coverage.
