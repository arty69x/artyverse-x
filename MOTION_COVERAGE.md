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

## V2 additions / superseding notes

The table above describes retained V1 effect engines and their limits. It does not imply exhaustive V2 verification. New behavior:

| Surface | Actual behavior | Limits / evidence |
|---|---|---|
| Home orbital world | Native SVG sphere/orbits, restrained pointer tilt, static OS-reduced-motion state | No raster UI; responsive screenshots are art-direction evidence only |
| Dynamics | Custom SVG bodies, mass/spring/damping/gravity, bounded velocity and dt, drag/pan/pinch, numeric alternatives | No rigid-body collisions; sensor input only after permission and real events; simulated browser checks ≠ real sensors |
| HoloField | Optional WebGL raymarched 3D light field, 48 steps, bounded resolution/DPR, approximately 30fps scheduling cap, offscreen/hidden pause and static fallback | GPU/browser dependent; cap is not a measured sustained FPS claim |
| Story Studio | Scene timing from elapsed clock; manual play/pause/next, fade/slide/instant, duration, fullscreen from user action, reduced motion | Scene Transition presets now explicitly support story-scene and apply actual duration; other preset types remain motion-preview |
| Sound Lab | Actual analyser waveform canvas + real audio sequencer | Audio remains user initiated; timers/context/oscillators stop on leaving or hiding view |

No React state update occurs every frame in the SVG spring integrator or WebGL shader loop. Numeric parameters and pointer camera controls update React state on actual user input. All visual effects can be disabled while the tool remains usable. Shared 120/220/480ms durations originate in the canonical theme; art-specific timing remains configurable and is not forced onto one scale.

## V3 visual and lifecycle upgrade

ARCYCA is an original layered SVG in `src/v3/Mascot.tsx`; portable idle asset in `public/assets/arcyca-idle.svg`. Hero and Copilot use restrained float; animation stops for OS reduced motion, Calm/Off, hidden documents and offscreen observation. States are explicit preview/capture/TTS UI states; no AI work is inferred from mascot motion. The mascot is illustrative, not audio lip-sync or a rigid-body character solver.

The Design System's animation is a labeled specimen with pause. Actual loading example computes SHA-256, rather than waiting on an invented timer. Home portal hover, command/dialog transitions and workbench interactions use the shared design language. V2 physics, kinetic geometries and media engines remain with their documented authoring limits. Themes change UI controls rather than recoloring saved art.

## Modern kit supplement

src/concept/FramerStudioComponents.tsx exports real spring/ease/stagger tokens, viewport/tab shared-layout transitions, tactile controls, in-view component entrance and a secondary SVG rig. The rig uses distinct aa/E/FF/sil geometry from a real user-authorized FFT input estimate; it does not recognize phonemes or capture speech-synthesis output. src/components/kit/motion.tsx enforces OS/Calm/Off/hidden policy; rig IntersectionObserver suspends ambient motion offscreen. New synthetic-media and reduced-motion journeys passed; real-device FPS/audio/sensors remain unverified. See COMPONENT_UPGRADE_REPORT.md and tests/evidence/component-upgrade/.

Typography polish: focus-link quarter underline expands on hover/keyboard focus using existing panel duration; reduced motion removes transition. Outline/marker/chromatic text emphasis is static, not a loop or AI streaming effect. No FPS or animation-fidelity claim. TypographyLab preview controls have actual local effects and exported canonical values.

Reference-library release: independently authored native depth rail with manual controls, keyboard/Home/End and actual scroll-derived index; chapter navigation with native scrolling/IntersectionObserver, colored panels and skip. Reduced-motion removes settling/transforms. No autoplay, scroll hijack, vendor Framer code, original video or claim of identical full-screen wipe choreography.
