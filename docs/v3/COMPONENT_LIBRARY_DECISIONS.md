# Modern component kit — choices, provenance and scope

Latest authorization: implement the strongest coherent modern option; add bold, editorial underline/focus, color blocks, Motion studio/storefront and controls.

## Selected foundation

- React 19, Tailwind 4 and Motion 12 remain the existing runtime. No second animation engine, framework migration or paid service is added.
- Actual packages installed: `@radix-ui/react-tabs@1.2.1` and `@radix-ui/react-switch@1.4.1` (MIT / WorkOS). Narrow primitives supply roving tab focus, semantics and switch keyboard behavior.
- Actual shadcn/ui source inspected through the GitHub connector after the registry hostname was blocked by the execution proxy. Composition/data-slot patterns are adapted in `src/components/kit/primitives.tsx`; scoped classes, larger targets, Motion selection and project tokens replace upstream styling. No claim that the CLI or an entire shadcn theme was installed.
- Official source: https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/new-york-v4/ui/switch.tsx (blob c45932afe4e484c900aa916e81d0e0d67137bedc), and tabs.tsx (blob 6e174747a509f8a906ce9cfb27bc2c7603f2b6b5). MIT license copied under docs/licenses/shadcn-MIT.txt; Radix license under docs/licenses/radix-MIT.txt.
- Magic UI, Aceternity UI and React Bits were discussed as options, not installed or copied. The selected kit uses a consistent editorial design instead of combining unrelated effect libraries. Framer Marketplace templates/plugins are platform-specific; no paid asset, Framer plugin or unsupported React export is claimed.

## Design decisions

Bold/regular weight contrast, thick editorial underlines, lime marker blocks, restrained hard shadows and clear keyboard focus are the main visual language. Shared PageHead/buttons in the existing app also receive heavier type/focus styling. Theme and artifact colors remain separate; the storefront document exports its own explicit palette.

`shared/design.ts` remains the application token source. `shared/concept.ts` holds scoped concept/motion tokens and references canonical lime/pink. `shared/storefront.ts` owns a validated document configuration, original product catalog/vector paths and one CSS source shared by live rendering/export. No values from imported content are executed as JavaScript.

## Working tools

- `#/concept/builder`: original Editorial Objects and Afterhours Edit templates; preview-before-apply, draft Undo, validated editable brand/headline/highlight/description/banner, accent and announcement switch; browser draft persistence including incomplete text.
- Desktop/Tablet/Mobile viewport buttons use real measured widths and shared-layout Motion with a viewport clamp. Caption shows effective rendered size. No wheel capture or scroll hijack.
- Radix Preview/Code/Files tabs have keyboard navigation. Preview stays mounted but hidden while other panels are active, preserving category and sample bag state without duplicate keyboard targets.
- Original SVG product catalog, category filters, detail dialog, sample selection bag/removal/clear. Prices/products are explicitly samples. No checkout, orders, inventory or payment success is fabricated.
- Export HTML/CSS/config; the independent HTML artifact retains native category filtering/product detail/sample bag with no package or network dependencies. Explicit save opens a new real Code Studio document; its sandbox runs only on Run.
- Studio Guide invokes the existing deterministic local brief tool and saves an honest `agent-run`; no fake generation stages/model badges. It does not alter a storefront from arbitrary prose. Configured AI remains available only behind the existing server adapter/Agent Studio boundary.
- Component suite: tactile button interaction counter, actual clipboard/token JSON download, Radix switches with visible effects, typography/palette specimens, and a secondary SVG rig. ARCYCA remains the primary brand mascot.

## Motion / audio boundaries

Shared tactile spring 420/26/.8, smooth token .32 and stagger .08. Shared-layout highlights, viewport resizing, button press/hover and in-view specimen stagger have static fallbacks. The motion provider honors OS reduced motion, app Calm/Off and document visibility. Ambient rig loops suspend offscreen. No FPS or INP claim is inferred from build/tests.

Microphone starts only after a disclosure/user gesture. Web Audio uses actual stream data, FFT 256, real sample rate and a non-recording RMS/energy-band visual estimate. `viseme_aa/E/FF/sil` are distinct drawings; this is not calibrated phoneme recognition, transcription or synchronized speech-synthesis audio. No microphone audio is sent or saved. Stop/navigation/unmount/hidden cleanup stops tracks, RAF and audio nodes/contexts; pending permission is invalidated with generation IDs. Browser/device quality and live hardware vary.

Thinking/Success rig states refer to actual local brief execution/results; Listening requires an active microphone. Explaining is an available rig state, not a claim that a TTS/FFT output integration exists.

## Verification

See tests/evidence/component-upgrade/ and COMPONENT_UPGRADE_REPORT.md for final source revision, actual checks and deployment. Browser simulation, synthetic audio and default-state axe are separate from real-device/screen-reader/certification testing. Existing prompt examples' production-grade labels, provider names, progress and scores were not imported as results.
