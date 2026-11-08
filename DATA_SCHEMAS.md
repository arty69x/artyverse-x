# Data contracts

Canonical runtime validation: `shared/schema.ts`. Integration interfaces: `shared/providers.ts`. Persistent storage and transactions: `server/index.ts`.

| Entity | Identity / version | Payload and relations |
|---|---|---|
| Item | UUID, schemaVersion 1, revision, createdAt, updatedAt, deletedAt | kind = document / conversation / note / recording / session / workflow / preset |
| Document | Item ID retained across revisions | width, height, LayoutNode[]; sourceId / templateId when derived |
| LayoutNode | Stable UUID in its document | text / shape / image; x,y,w,h in document pixels; bounded size/color; local asset reference only |
| Conversation | Item ID | Message[]; own-content roles user/note; no fabricated assistant role |
| Message | UUID + timestamp | text; user/note role |
| ResearchNote | Item ID | body, source record string, tags; send selection/body to related new item |
| Recording | Item ID + assetId | url, duration, MIME, size; bytes stored outside localStorage |
| Asset | UUID | MIME, original filename metadata, byte size, server-side media path |
| LiveSession | Item ID | notes, newline cue cards, elapsed seconds |
| Workflow | Item ID | source, supported action, result, runAt; local execution only |
| MotionPreset | Item ID + schemaVersion 1 | category, compatibleTargets, bounded preview values, 14 spatial controls |
| Revision | Item ID + revision integer | Complete saved Item snapshot; old revisions load into browser draft |
| Backup | schemaVersion 1 + exportedAt | saved items, revisions, assets with base64 bytes; stable-ID merge |

The Item table and revision table hold JSON records; asset metadata is separate. Upload limits are 25 MB, restore request limit 100 MB, document JSON import 2 MB, motion preset import 50 KB, theme preset import 10 KB and conversation text attachment 100 KB. Imported media references cannot execute scripts or fetch arbitrary external URLs. MIME magic bytes are checked before upload/restore.

Persistent state is separate from session state (selection/zoom/modal), transient previews (token/motion edits) and undo history (bounded in-memory node snapshots). Browser drafts use `av-draft:*` and `av-canvas-*` keys. Malformed text drafts receive a raw recovery copy when possible. Large media never goes into browser localStorage. Full quota/corruption recovery remains limited; see known limitations.

Data migration policy: only schema version 1 is accepted now. A future migration must validate a copy, preview the result, commit transactionally and retain the original backup on failure. Legacy blueprint formats are not silently migrated.

## V2 additions

Canonical validation: `shared/v2/contracts.ts`, invoked by `shared/schema.ts` on create/update/restore. Item envelope remains schemaVersion 1 for compatibility; new payloads use schemaVersion 2. `kindRoutes` is the shared open-item route contract.

| Kind | Versioned payload | Relationships |
|---|---|---|
| project | description, color | other item data.projectId |
| workflow V2 | graph.nodes/edges + execution | node artifactId / agentRunId; graph-less V1 retained |
| code | html, css, js, safe CSS overrides | projectId, saved revisions |
| composition | 16 steps, tempo, oscillator, envelope, filter, capped volume | rendered recording.sourceId |
| scene | bodies, spring stiffness/damping/gravity | body stable IDs; body coordinates separate from viewport camera |
| story | scene list, scripts, durations, transition | scene.documentId references saved document, never duplicates it |
| agent-run | prompt/output, provenance, status, duration, usage, known/unknown cost, fallback reason | projectId; downstream document.sourceId |

Source JSON import: max 2 MB → schema validation → preview → apply to draft → explicit save. Imported code never executes automatically. Studio drafts are keyed by item ID and base revision; invalid drafts are preserved under av-recovery and fall back safely. Browser history, temporary preview, server revisions and provider-session cache are separate. Media bytes stay outside localStorage.
