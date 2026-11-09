# Canonical deployment operations

Primary: artyverse-x / prj_PhP5npiJbwWMGXFhsO5zWoFJpm3w / artyverse-x.vercel.app.
Legacy recovery: artyverse-x-ai-assistant / prj_IX1ylxFY2Uj4EcDyCr5CAigTkrXG / artyverse-x-ai-assistant.vercel.app.
Team unchanged: team_TvjJ1J92T8j921hlAjp2jst1. Repository remains arty69x/artyverse-x; local .vercel link points to the primary project. Source/data/repos/projects are not deleted or renamed.

Both origins use the same reviewed source SHA. Host-aware legacy gate does not clear data or unconditionally redirect. Canonical/OG URL is the main origin; legacy has host-specific X-Robots-Tag noindex. Supported hash routes continue; copied item IDs are resolved on the destination using a validated source-origin receipt. Browser work remains origin-local; user file selection/import and final confirmation are unavoidable per-profile actions, not cloud synchronization.

Pin browser mode + public production origins in vercel.json/build settings. Optional VITE_APP_ORIGIN/VITE_LEGACY_ORIGIN are for controlled self-hosting/QA, not runtime query overrides. QA uses two real loopback origins, 127.0.0.1:4326 and localhost:4326, with actual separate IndexedDB/service-worker scopes. Production access protection stays unchanged. No bypass/share URL or secret/env download is created.

After both production releases are READY and aliases checked, legacy Git builds are ignored (exit0) to stop competing updates; keep the deployed recovery app. Main remains the release target. Do not remove the legacy deployment/domain or its local browser data to consolidate the branding.

Rollback: source branch recovery/pre-primary-domain-20261108 at db475e1. Prior primary alias deployment dpl_CvbGYTDhJ8o5xGJerLbKwKrRGHKZ; prior legacy dpl_3FmZdx2LCt4V1JbSbnbFb6HvVdMo. Restore prior deployments/build settings if needed; source backups are not storage rollback. Affected browser data should be recovered with the downloaded envelope and existing merge tools, never by wiping stores. Project settings should be restored deliberately; ignored Git builds on legacy can be re-enabled by clearing the ignore command.

Limits: record/reference remapping is based on supported Id/Ids fields and local asset paths; arbitrary user prose/HTML strings are preserved, not rewritten. SHA checksum is integrity only, not origin authentication. A source workspace conflict creates deterministic linked copies rather than overwriting destination items. Repeated same envelope does not create additional saved records. Staging guards capacity but does not turn localStorage and IndexedDB into a cross-store transaction; partial failure remains explicit and recoverable.
