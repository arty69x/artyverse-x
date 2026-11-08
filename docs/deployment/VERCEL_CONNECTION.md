# Vercel connection

Connected 2026-11-08 through the authenticated Vercel connector.

- Project: `artyverse-x-ai-assistant`
- Project ID: `prj_IX1ylxFY2Uj4EcDyCr5CAigTkrXG`
- Team ID: `team_TvjJ1J92T8j921hlAjp2jst1`
- Dashboard: https://vercel.com/~/projects/artyverse-x-ai-assistant
- Local project context: ignored `.vercel/project.json`.
- Build settings submitted successfully: Vite, Node 24.x, `npm ci`, `npm run build`, output `dist`.
- Project identity, account, Vite and Node 24.x read back through the connector. Existing deployment protection preserved.

No deployment, production promotion, domain change, Git push, database migration, paid storage provisioning or secret write was performed. Connector authentication does not establish Vercel CLI authentication; log in through the CLI deliberately if using it later. Git integration/automatic deployments were not configured in this step.

## Deployment boundary

Current API uses local SQLite and `.data/assets`. The static Vite build alone cannot provide its `/api` routes. Deploying this API with a temporary serverless filesystem would not provide durable storage. Before deploying the complete application, connect durable database/media storage plus identity/ownership controls, or configure an authorized persistent backend with API routing. Preserve and verify a backup before migrating existing data. Do not substitute an empty temporary SQLite DB and report cloud persistence as connected.
