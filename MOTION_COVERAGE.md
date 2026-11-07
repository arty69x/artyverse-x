# Motion coverage

All scenes are previews or labeled samples. No generic “motion verified” score is generated. A screenshot establishes only appearance at its captured state.

| Category | Implemented | Current limits | Evidence |
|---|---|---|---|
| Text Reveal | Blur Reveal, Color Morph, Scramble, Typewriter, Kerning Tighten, Chromatic Aberration; duration/intensity, replay, grapheme segmentation, reduced-motion fallback | Not every effect uses every possible master trigger/repeat option; Thai kerning should be used sparingly | Source + browser render; full time-based effect assertions pending |
| Classic scroll mask | Four directions, softness, native preview scroll, reverse scrub, responsive observer, font readiness, reduced-motion unmasked fallback | Start/end have safe engine defaults, not full exposed authoring UI; no full stagger authoring | Source + preview |
| Kinetic typography | 16 distinct geometry functions, text, size, speed, echo count, color, quality, pause; depth sorting, bounded DPR/glyph count, near-plane guard, hidden/offscreen suspension | No pointer/scroll mode, font/camera/FOV/depth/focus authoring beyond engine constants; scene apply unavailable | Geometry contract test; browser preset/geometry test; measured rAF sample in visual-audit.json |
| Spatial carousel | Arc/Circular, 14 values, runtime dimension clamp, swipe, velocity-aware threshold, manual arrows, Home/End, index/count, detail | Not full momentum physics or wheel input; autoplay intentionally absent | Browser keyboard/swipe-capable implementation; navigation test |
| Cinematic carousel | Three original vector/CSS sample scenes, headline/context, next/previous, opt-in autoplay, pause | No video scenes or gallery alternative in this study | Browser rendering; timer cleanup in source |
| Media corridor | Native scroll container, sample gallery scenes, progress, skip, reverse scroll | Simplified geometry; not shared-media expansion into page flow | Browser render; source |
| SVG motion | Original orbital SVG, speed, color, pause, reduced motion | No arbitrary path morph authoring | Browser render; source |
| Card interaction | Real button, hover tilt, press feedback, adjustable intensity, focus affordance | No drag/tilt combination | Browser render; source |
| Scene transition | Replayable text scene, duration, reduced-motion-safe transition | Not a scene timeline editor | Browser render; source |

Geometry names: Helix, Double Helix, Orbital Ring, Spiral Vortex, Sine Ribbon, Figure Eight, Lissajous Flow, Möbius Loop, Torus Knot, Spherical Orbit, Cylindrical Tunnel, Conical Spiral, Expanding Wave, Grid Fold, Fractal Branch, Particle Constellation. Each maps to a separate formula in `src/core/geometry.ts`; unit tests compare samples and reject non-finite coordinates.

Spatial authoring units/ranges/defaults are defined by `ranges`/`defaults` in `src/pages/DesignOS.tsx`. Width/height authoring values are separate from runtime preview clamping. Presets are schemaVersion 1 JSON data, validated before preview application. Importing never executes code. Compatibility is explicitly `motion-preview`; a document scene integration is still in progress.

Presets can be saved, duplicated, exported, imported into preview, reset and replayed. Global Full/Balanced/Calm/Off and OS reduced-motion reduce decorative work. Canvas has semantic DOM text. No promise of “zero DOM overhead” or sustained 60 FPS is made.
