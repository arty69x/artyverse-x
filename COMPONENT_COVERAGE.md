# Component registry and coverage — V2

Canonical registry: `artyverse-design-master.json`. Original V8 inventory stays at `docs/source/V8_COMPONENT_INVENTORY.json`. Catalog names are not counts of shipped standalone components. Historical V1 counts/table are in `docs/v1/COMPONENT_COVERAGE.md`; they are not V2 evidence.

| Actual V2 implementation | Purpose / interaction | Source | Verification |
|---|---|---|---|
| projects | create project; active context; linked items; record export | src/v2/Projects.tsx | See V2 test-specific report |
| agents | local tools; optional provider adapter; request budget estimate; cache; cancel; explicit fallback; run evidence; artifact transfer | src/v2/Agents.tsx | See V2 test-specific report |
| automate | editable DAG; node configuration; connections; cycle validation; branch routing; agent steps; actual artifacts; execution evidence | src/v2/NodeStudio.tsx | See V2 test-specific report |
| code | HTML CSS JS source; sandbox Run; actual console; CSS inspector; review local fixes; checkpoint undo; HTML export | src/v2/CodeStudio.tsx | See V2 test-specific report |
| sound | 16-step sequencer; oscillator envelope filter; actual waveform; PCM WAV rendering; save rendered audio; resource cleanup | src/v2/SoundLab.tsx | See V2 test-specific report |
| dynamics | SVG bodies; spring mass gravity; drag pan pinch; manual inspector; optional sensor events; optional WebGL; static fallback | src/v2/Dynamics.tsx | See V2 test-specific report |
| story | scene list; script; timing; document links; timeline; presentation; compatible motion duration | src/v2/StoryStudio.tsx | See V2 test-specific report |
| system | actual status; known unknown cost; cache fallback counts; persistent backup | src/v2/SystemHub.tsx | See V2 test-specific report |
| Shared StudioHead / source review | draft, revisions, undo/redo, safe import review, JSON export, error/missing states | src/v2/shared.tsx | Import/undo and project reopen journeys |
| DocumentScene | Same LayoutNode model in Story preview/presentation | src/v2/DocumentScene.tsx | Linked story presentation |
| HoloField | Opt-in bounded WebGL light field with static fallback | src/v2/HoloField.tsx | Manual browser scope; no real-GPU certification |

Keyboard controls use native buttons/inputs, numeric alternatives to visual dragging, and shared focus-managed dialogs. Responsive panels stack below work stages. Each module states unavailable external capabilities. Full variant/state coverage is not claimed.
