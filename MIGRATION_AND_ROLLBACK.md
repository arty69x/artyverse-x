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
