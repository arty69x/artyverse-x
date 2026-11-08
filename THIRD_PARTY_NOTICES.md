# Third-party notices

Direct runtime dependencies: React/React DOM (MIT), Motion (MIT), Express (MIT), Zod (MIT), Lucide React (ISC, with upstream icon notices), and fonts Space Grotesk, DM Sans, Noto Sans Thai (SIL Open Font License 1.1). Installed dependency versions are pinned by package-lock.json. Selected runtime/font license texts are copied under docs/licenses; full package notices remain in the installed packages.

Original ARTYVERSE X SVG/CSS assets were authored in this implementation. No Marketplace template/component/vector/plugin was copied, bought or remixed. The Marketplace registry contains candidates and reference links only. Source-derived V8 contracts are preserved as supplied research evidence, not represented as independently implemented runtime components.

V2 uses Tailwind CSS/@tailwindcss/vite (MIT) and existing Motion for React/Framer Motion runtime (MIT) from package-lock.json. Local Poppins and IBM Plex Sans Thai font files are bundled with their OFL license files under public/fonts; DM Sans remains a body font via Fontsource. Brand source studies and their provenance remain in branding/. No paid Framer Marketplace source, vector or plugin has been copied or acquired in this release.

V3 uses a self-hosted Syne Latin variable WOFF2 (400–800) with its OFL in `public/fonts/syne-OFL.txt`, sourced from the Fontsource Syne distribution. The unused font-source package was removed after preserving the licensed asset. JetBrains Mono is bundled through its Fontsource package; DM Sans and IBM Plex Sans Thai retain their existing licenses. Original ARCYCA and portal vector geometry were authored for this implementation; no paid Marketplace artwork was copied.

V3 performance follow-up adds Express compression middleware and its type definitions (MIT). It compresses built static/API responses, excludes text/event-stream from buffering, and replaces no authentication or storage system. Lighthouse is used as an external development audit tool, not added to the app runtime.

Modern component kit: Switch/Tabs composition is adapted from shadcn/ui (MIT, copyright 2023 shadcn); source blob references and changes are documented in docs/v3/COMPONENT_LIBRARY_DECISIONS.md, full license at docs/licenses/shadcn-MIT.txt. Runtime Radix Switch 1.4.1 / Tabs 1.2.1 and their dependencies use MIT licensing (WorkOS); license copied from the installed package to docs/licenses/radix-MIT.txt. No Framer Marketplace, Magic UI, Aceternity UI or React Bits asset is bundled by this update.
