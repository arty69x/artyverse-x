# V3 acceptance matrix

Statuses must refer to recorded evidence in the final V3 report, not copied source claims.

| Scope | Acceptance | Evidence source |
|---|---|---|
| Themes | dark/light/system persist; OS change updates system mode | V3 theme E2E, semantic contrast unit tests |
| Shell | grouped navigation, drawer, five mobile destinations, active route, keyboard command search | V3 command/mobile journeys + route layout audit |
| Home | actual saved counts, original native SVG artwork, persisted portal order | V3 home/reorder journeys + screenshots |
| Projects | create/search/rename/duplicate/trash-undo; same linked work | V3 project journey + V2 scoped-save regression |
| Copilot | manual turns, evidence selection, no invented facts, outline edit/save, correct reopen route | V3 cross-workspace journey + interview contract tests |
| Speech | explicit permission disclosure, capability errors and manual fallback, tracks/context cleanup | Source review; live browser service and real-device verification separate |
| Marketplace | labeled starter preview creates a new editable item | V3 starter journey |
| Analytics | counts only actual persisted records; no synthetic quality score | Data derivation in Platform.tsx; render/a11y audit |
| Design System | 11 live sections, default-theme contrast pairs, roving tabs and focus restoration | V3 board journey + theme audits |
| Existing tools | retain editing, undo, export, WAV, graph artifacts, backup, provider fallback contracts | V1/V2 regression suite on V3 runtime |
| Responsive | no page overflow with fonts loaded; justified internal canvas scrolling | V3 layout audit, boundary/phone screenshots |
| Motion | reduced/Off/Calm stop decorative transforms; hidden/offscreen mascot suspension | Source lifecycle review, reduced-motion browser audit |
| Production boundary | no public/cloud/AI success claim without real configuration | Updated limitations/deployment notes |
