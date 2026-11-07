# Known limitations

This is a runnable local application and a full product design direction. It does not complete every advanced requirement in the original master prompt.

- No connected AI inference, speech transcription, cloud sync, authentication, billing, external actions or schedules. Provider contracts intentionally return unavailable.
- Single personal workspace. Project memberships, sharing and collaboration are not implemented.
- Localization covers navigation, Home, main page headings and many primary actions. Deep inspectors, help text, errors and several controls remain English. Full TH/EN acceptance is pending.
- Canvas supports text/rectangles/local images. Grouping, locking, snapping, guides, dedicated pan tool, arbitrary export sizes, rich text/font selection and multi-page documents are not implemented. Native viewport scrolling provides navigation when zoomed. SVG uses system-font fallback outside the app; text metrics may differ. Long text can exceed a node until resized.
- Editor JSON import validates and previews a replacement of the active browser draft. It accepts the active canvas dimensions and is not an automatic new project import. Save explicitly to create a revision.
- Automate is a fixed local three-node pipeline with three text transforms. It is not an arbitrary node-graph builder or background automation service.
- Research supports note/source/tags and transfer. A linked idea map, source crawler and AI research are unavailable.
- Voice recording/playback is real, but physical devices and all platform codecs have not been tested. Maximum upload is 25 MB; recording is not automatically chunked to permanent storage during capture.
- Live timer pauses when the view is destroyed; it does not imply a background live session. Cue-card navigation is separate from document presentation.
- Motion Lab has functional studies across eight categories. Kinetic controls are a supported subset; no pointer/camera/FOV authoring, full 3D renderer or automatic scene-preset application is claimed. Media corridor is a simplified native-scroll study, not the full reference corridor expansion.
- Theme preview/apply handles accent and displays other foundation values; complete scale editing and global token undo/redo are not implemented.
- Component catalog mappings include native controls and structural CSS patterns; they are not 151 independent React components. Complete state coverage is not claimed.
- Advanced Files edits one browser-local JSON virtual file, with full replacement review and a session checkpoint. No archive, multi-file patch selection or host filesystem editing.
- Library preserves records with soft delete. There is no permanent purge/asset garbage collection, arbitrary import into Library, or full unified image viewer zoom/pan/gallery controls.
- Draft persistence uses browser storage; unavailable/quota-limited browser storage has not received complete recovery UX. Save to the local server and export important work.
- Backup includes saved records/revisions/media, not unsaved browser drafts or preferences. Restore request limit is 100 MB; large-media libraries need an archive/streaming implementation.
- Full scroll/filter/selection context restoration, pinning, provider retry/cancellation and all error states remain incomplete.
- Security is scoped to a personal local server. It has no multi-user authorization and must not be exposed publicly without additional work.
- Automated Chromium viewport checks are simulation, not real iPad/iPhone/Android testing. Accessibility checks are scoped automated checks plus keyboard journeys, not WCAG certification. No 60 FPS guarantee or exhaustive performance/device claim.
- Framer project is an editable visual companion. Its composer is a visual spec, not a second working AI app. No Marketplace resource was bought or imported.
