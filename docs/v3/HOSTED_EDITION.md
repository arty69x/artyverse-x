# Hosted browser edition — deployment architecture

The user's 2026-11-08 instruction authorizes Git push and Vercel deployment. This supplements the earlier local-only delivery scope; it does not authorize deleting data or weakening deployment protection.

## Two real storage modes

- `npm run dev` and ordinary `npm run build && npm start`: existing Node 24/SQLite/media server. Existing data paths, IDs, API contracts and AI server adapter remain unchanged.
- Vercel build: `VITE_STORAGE_MODE=browser npm run build`. The app waits for a same-origin module service worker before opening the workspace. Only `/api/` requests are handled in IndexedDB on this origin, inside this browser profile. Static files come from Vercel. No serverless SQLite or shared unauthenticated database is created.

Browser mode supports validated item CRUD, atomic revision checks, revision history, trash/restore, typed media with file signatures and 25 MB limit, stable asset URLs, backup/restore and local Agent tools. Imported backup assets have an aggregate 100 MB limit. Restore validates everything before one transaction and retains existing IDs instead of overwriting. It does not execute imported source. Connected AI requests report unavailable or explicitly use a labeled deterministic fallback. There are no provider keys in this edition.

## Privacy and recovery

Work is isolated by browser profile **and origin**. Immutable deployment URLs, stable project aliases and custom domains are separate storage origins; export/import a backup to transfer work. Clearing website data removes hosted records. Browser eviction/private browsing/quota restrictions also apply. The interface includes this warning and a Settings backup link. A reload from the same origin retains data; cloud sync and public accounts are not implied. Drafts/preferences remain browser-local and outside the item/media backup.

This service worker does not cache the application shell for offline launch. An initial network load is required. It does not intercept third-party URLs or execute user HTML. Code Studio's opaque-origin iframe is retained.

A browser without module service workers/IndexedDB, or where registration fails, receives a visible startup error and reload action. The server edition remains an alternative. Real iOS/Android/device speech/sensor behavior remains unverified.

## Target and rollback

Repository: https://github.com/arty69x/artyverse-x (initial remote main was 0ca7865). Project: `artyverse-x-ai-assistant`, project ID `prj_IX1ylxFY2Uj4EcDyCr5CAigTkrXG`, team `team_TvjJ1J92T8j921hlAjp2jst1`. Existing SSO deployment protection must be preserved. No domain, paid database, subscription or bypass-policy change is required.

Local recovery branch: `recovery/pre-hosted-20261108` at `2423698`. Prior Vercel READY deployment: `dpl_C6FAqSyYaoFwV3zZyY4xAM68tzDs`. Preserve that deployment for rollback. A hosted frontend rollback does not delete IndexedDB. Back up important work before transferring domains or changing schemas.

Release checks: both build modes, existing unit/browser/API regression, and `node scripts/verify-hosted.mjs` against a static browser build. Raw current evidence lives in `tests/evidence/deployment/`; original V3 Lighthouse scores retain the earlier runtime revision and must not be presented as measurements of the service-worker boot path.
