# Brand / token normalization

Canonical interface source: shared/design.ts. Generated outputs: src/v3/tokens.css and DESIGN_TOKENS.json. Existing shared/schema.ts theme is a compatibility adapter for the retained Design OS. Run npm run tokens after changing the canonical source.

| Earlier value / behavior | V3 resolution | Reason / effect |
|---|---|---|
| #D7E317 accent | #CCFF00 brand lime | Latest UX/UI specification; saved artifact colors unchanged |
| #D4006A pink | #FF2078 primitive, contrasted semantic text roles | Latest palette; do not assume white text on pink passes AA |
| #43E6FF / #9B43FF | #00C7E8 / #B44FFF primitives | Latest cyan/violet roles; focus shades tuned per theme |
| #050708 canvas | #080B12 dark semantic canvas; #050403 remains brand ink | Layer hierarchy and reading comfort; brand primitive is not every surface |
| Default dark only | Dark/light/system | Same semantic component contracts; no color inversion |
| Poppins UI headings | Syne 400–800 + Thai-compatible fallback | Editorial technical direction; no fabricated Syne 900 |
| Font request might imply remote CDN | Local WOFF2 / Fontsource-bundled assets and OFL | No external font service requirement; Syne unused package removed after preserving licensed asset |
| Arty / Whisper / ARCYCA ambiguity | ARCYCA main interaction companion, Arty retained scene asset, Whisper Fade W assistant mark | Role clarity without rewriting user scenes |
| 8px-only spacing | Shared scale plus 15/23px viewport gutters | Deliberate optical exceptions from latest brief |
| Fixed two-up mobile everywhere | One-up complex tools/cards; two-up small metrics/recent previews where readable | Thai copy and touch targets |
| Workflow decorative progress | Local/connected execution metadata only; board is labeled a specimen | No fake AI progress or finished work |

Colors were selected from the explicit supplied token values, not sampled from inaccessible reference files. Gradients and original mascot/portal artwork have documented artistic pigments; they do not define body text or control foregrounds. Token contrast calculation is not a full WCAG certification. New controls choose an accessible ink/white foreground when a custom accent is applied.

Motion Lab's artwork preview intentionally keeps a dark inner canvas in both interface themes, so user-selected neon artwork stays readable. Its navigation/inspector controls follow the selected app theme. Graph connection strokes use semantic focus/danger rather than lime text on a light canvas. Thai heading/body fonts are preloaded to reduce font-layout shifts; user document typography remains unchanged.
