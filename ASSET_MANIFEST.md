# Reconstruction asset notes

## Reconstruction release — 2026-11-08

| ID | File | Purpose / dimensions | Source / optimization |
|---|---|---|---|
| R1 | design/references/01-brand-system.jpg | source board / 1280×720 | user upload, copied unchanged; not runtime flattened UI |
| R2 | design/references/02-production-blueprint.jpg | source blueprint / 1280×853 | user upload, copied unchanged |
| R3 | design/references/03-studio-board.jpg | source dark Studio / 1280×889 | user upload, Canva chrome excluded |
| arcyca-reconstructed | public/assets/arcyca-reconstructed.webp | decorative hero mascot / optimized ≤960px, alpha, ~145KB | image_gen reference reconstruction from R1; not original 3D model; WebP87; explicit layout dimensions; native SVG fallback |
| prism-a | src/v3/Brand.tsx | native accessible-decorative brand mark / viewBox80×72 | hand reconstructed SVG interpretation, unique gradient IDs; not exact recovered logo master |

User interface labels, buttons, cards and fields remain native DOM. The raster mascot contains no changing UI text. State-driven live vector rigs remain in Mascot.tsx / FramerStudioComponents.tsx; the hero artwork is a static decorative scene, not a claim of live sensor/AI activity.
