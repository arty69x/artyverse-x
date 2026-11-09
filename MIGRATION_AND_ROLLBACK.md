# Migration, deployment and rollback

Initial repository: `https://github.com/arty69x/artyverse-x.git`, branch `work`, baseline commit `0ca7865`. The baseline contained a README, no application or user database. Recovery branch: `recovery/before-artyverse-new`. No remote deletion, force push, domain change, access-policy change or production deployment was performed.

## Run locally

Node >=24 is required for the built-in SQLite API. On a personal machine:

```sh
npm ci
npm run tokens
npm run dev
```

Open http://localhost:5173. API uses port 4311; data directory defaults to `.data`. Drafts/preferences stay in that browser. Media is stored in `.data/assets`, never under public static output.

For a local production build:

```sh
npm run build
npm start
```

Open http://localhost:4311. Do not publish this unauthenticated local server as a multi-user public service. An internet release needs identity/ownership, HTTPS/security policy, quotas, backups and target-specific access validation.

## Backup / restore

Save active drafts first. Settings → Download complete backup includes persistent items, revision snapshots and base64 media. Settings → Preview restore → Merge validates the package before data changes. Existing stable IDs are preserved; the import does not overwrite them. Maximum restore request is 100 MB. Large libraries require a streaming/archive backup upgrade. Browser-only unsaved drafts and UI preferences are not included.

A filesystem recovery copy must include the entire `.data` directory. Stop the process before copying, or use SQLite’s backup API to produce a consistent live snapshot; copying only the database while WAL writes are active is not a reliable backup.

## Rollback

1. Download a current backup and preserve `.data` with the server stopped.
2. Use a separate checkout/worktree at the desired source revision; never `git reset --hard` over uncommitted work.
3. Run `npm ci`, `npm run build`, then test against a copy of the data directory using `ARTYVERSE_DATA_DIR`.
4. Switch local process only after validating the data and critical journeys.
5. Returning to the original README-only baseline does not supply a prior app; keep the data archive for later restoration.

Schema version is 1. Restore accepts only version 1. There is no claimed migration from the legacy blueprint demo localStorage formats. The blueprint sources remain separate, and importing their arbitrary HTML/JS as executable app code is not supported.

## Tests

`npm test` runs contract tests. `npm run test:e2e` starts an isolated local application on web 5174/API 4312 with `.test-data` storage. Chromium is configured at `/usr/bin/chromium`; adjust `playwright.config.ts` on other systems. A second temporary SQLite instance on 4313 verifies a real restore into an empty database. Test evidence uses synthetic records/audio, not private user content.

The first verification run created nine synthetic records in the development database. Those records and their database were preserved separately at `.data-initial-verification-20261107` after stopping the server. The final development preview uses a fresh `.data` directory with an empty Library. Subsequent automated runs use isolated `.test-data/run-*` directories. Neither database is included in the source archive or Git.

## V2 migration — 2026-11-08

V2 starting revision: `fafb2cf` on branch `work`; recovery branch `recovery/pre-v2-20261108`. A recovery manifest, online SQLite backup (when a local DB existed), and immutable media copy were created under ignored `.recovery/pre-v2-20261108` before structural edits. These local user-data backups are intentionally excluded from release ZIPs.

Migration is additive: keep Item envelope v1, add advanced data schemas v2 and optional projectId. Existing graph-less workflows route to compatibility mode. Existing IDs, assets and revisions are retained; no remote repository, hosting, domain, or access-policy changes were performed. Project context attaches to new work; legacy work remains visible under All worlds. New payload types are validated during backup restore too.

Before rollback, download a current persistent backup and save browser drafts. Restore V1 source from the recovery branch into a separate checkout, not over uncommitted work. V1 does not support new V2 kinds: restore its pre-V2 database/media snapshot in a separate data directory as well. Keep the V2 backup for return migration; never feed V2-only records into an unmodified V1 server and expect compatibility. Test the restored workspace before switching local URLs/ports.

No public production deployment was attempted. Public release still needs identity/ownership enforcement, cloud infrastructure, migration rehearsals and deployment-specific acceptance. The local built app can be started independently with `PORT=4315 ARTYVERSE_DATA_DIR=<separate-directory> npm start` for verification.

## V3 frontend migration — 2026-11-08

Recovery branch: `recovery/pre-v3-hyperpolish-20261108`, based on `20b71bf`. Local recovery manifest plus online SQLite/media snapshot were created under ignored `.recovery/pre-v3-hyperpolish-20261108` before implementation. Pending review documents were preserved. No remote deletion, force push, domain change or public deployment occurred.

V3 is additive: keep the Item envelope, database/media layout and all existing IDs/revisions. New interview/practice sessions reuse the session entity with a validated subtype; saved questions reuse notes. Existing data and document colors are not normalized into UI tokens. Existing hash routes remain, with aliases for assets, pipeline, canvas, live-code, inspector, components and overview.

Rollback: first download a current persistent backup and save browser drafts. Restore V2 source in a separate checkout/data directory using the recovery branch/snapshot. V2 can retain JSON records but lacks V3 specialized interview routes/validation; preserve the V3 backup before switching. Keep theme/home-order preferences separate from server data and verify IDs/media/revisions before replacing a running local workspace. Release archives exclude user databases, browser drafts, recovery snapshots and secrets.

Vercel remains linked to the existing project with its access policy preserved. This frontend upgrade does not migrate SQLite/media into serverless storage or publish a public backend. A durable storage and identity decision is still required for that deployment.

## Hosted edition supplement (2026-11-08)

The latest user instruction authorizes Git push and Vercel release. See `docs/v3/HOSTED_EDITION.md` for the browser IndexedDB mode, explicit storage limits and backup/transfer policy. This supplements the prior local-only scope. Recovery source is `2423698` / `recovery/pre-hosted-20261108`; prior READY Vercel deployment is `dpl_C6FAqSyYaoFwV3zZyY4xAM68tzDs`. Existing SQLite data is neither uploaded nor migrated automatically. Vercel deployment protection stays enabled. Deployment result and actual post-deploy checks will be recorded separately.

Reconstruction release: no entity/storage migration. New #/builder route reuses existing storefront draft and CodeDocument contracts. Existing routes, including #/concept/*, remain available. Source recovery branch recovery/pre-reconstruction-20261108 points to f0fbffb. Prior production rollback dpl_3ZwTZNz9P8U2kPinqsN1pmV2712s. Do not clear IndexedDB/localStorage/SQLite when reverting source. New WebP has native SVG fallback; references are build-source evidence, not runtime UI backgrounds.

Reference-library release: recovery/pre-reference-library-20261108 at9d5b4ba. No persistent entity migration; PatternConfig v1 drafts are per-pattern browser keys, explicit saved output is existing CodeDocument v2. Previous stable Vercel typography deployment dpl_GBrFYYwByJ8DSsKygsy2cCYEQx2a. Never clear user stores to revert this source. Raw uploaded scripts are not executed or bundled.

Primary-domain release: see docs/domain-migration/OPERATIONS.md and GUIDE_TH.md. Source checkpoint recovery/pre-primary-domain-20261108 at db475e1. Prior primary deployment dpl_CvbGYTDhJ8o5xGJerLbKwKrRGHKZ, legacy dpl_3FmZdx2LCt4V1JbSbnbFb6HvVdMo. No IndexedDB schema change/store deletion or account/cloud merger. User imports are additive with deterministic copies on conflict; cross-store failure remains explicit. Both rollback/transfer files stay user-controlled. Legacy recovery URL bypasses per-browser forwarding even after confirmation.

## Editorial studio redesign — 2026-11-09

Recovery branch recovery/pre-editorial-redesign-20261109 preserves the prior source. No record/IndexedDB/SQLite schema, item identity, revision, media, or draft-key migration is introduced. Semantic interface colors change; saved artifact colors do not. Prior hash routes remain accessible through primary links, All tools or command search. Only the primary project receives the redesign; legacy remains the published transfer/recovery release. Roll back deployment/source to the previous primary production release if needed; this is a UI rollback, not a browser-data restore.
