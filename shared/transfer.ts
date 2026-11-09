import { originMapKey } from "./origins";
import { z } from "zod";
import { itemInput, type Item } from "./schema";
export const preferenceKeys = [
  "artyverse-theme",
  "av-locale",
  "av-motion",
  "av-accent",
  "av-active-project",
  "av-nav-compact",
  "av-home-layout-v3",
  "av-virtual-file",
] as const;
export function portableKey(k: string) {
  return (
    k.length <= 350 &&
    (preferenceKeys.includes(k as any) ||
      k.startsWith("av-draft:") ||
      k.startsWith("av-recovery:") ||
      k.startsWith("av-canvas-") ||
      k.startsWith("av-origin-recovery:") ||
      k.startsWith("av-origin-map:"))
  );
}
const uuid = z.string().regex(/^[a-z0-9-]{36}$/);
const record = z.custom<Item>((v: any) => {
  try {
    itemInput.parse(v);
    return (
      /^[a-z0-9-]{36}$/.test(v.id) &&
      v.schemaVersion === 1 &&
      Number.isInteger(v.revision) &&
      v.revision >= 1 &&
      Number.isFinite(Date.parse(v.createdAt)) &&
      Number.isFinite(Date.parse(v.updatedAt)) &&
      (v.deletedAt === undefined ||
        v.deletedAt === null ||
        typeof v.deletedAt === "string")
    );
  } catch {
    return false;
  }
}, "Invalid saved record");
export const backupSchema = z
  .object({
    schemaVersion: z.literal(1),
    exportedAt: z.string().optional(),
    items: z.array(record).max(10000),
    revisions: z.array(record).max(100000).default([]),
    assets: z
      .array(
        z
          .object({
            id: uuid,
            mime: z.string().max(100),
            name: z.string().max(180).optional(),
            base64: z
              .string()
              .max(35000000)
              .regex(/^[A-Za-z0-9+/]*={0,2}$/),
            size: z.number().optional(),
          })
          .passthrough(),
      )
      .max(10000),
  })
  .passthrough();
export type Backup = z.infer<typeof backupSchema>;
const entries = z
  .array(
    z
      .object({
        key: z.string().refine(portableKey, "Non-workspace key"),
        value: z.string().max(2000000),
      })
      .strict(),
  )
  .max(2000)
  .superRefine((a, c) => {
    if (new Set(a.map((v) => v.key)).size !== a.length)
      c.addIssue({ code: "custom", message: "Duplicate browser key" });
    if (a.reduce((n, e) => n + e.key.length + e.value.length, 0) > 2500000)
      c.addIssue({
        code: "custom",
        message: "Browser drafts exceed 5 MB character budget",
      });
  });
export const transferPayloadSchema = z
  .object({
    schemaVersion: z.literal(1),
    format: z.literal("ARTYVERSE_WORKSPACE_TRANSFER"),
    sourceOrigin: z
      .string()
      .url()
      .max(200)
      .refine((v) => {
        try {
          return (
            /^https?:$/.test(new URL(v).protocol) && new URL(v).origin === v
          );
        } catch {
          return false;
        }
      }, "Use an origin, not a URL path"),
    exportedAt: z.string().datetime(),
    returnHash: z.string().max(300),
    backup: backupSchema,
    browser: entries,
  })
  .strict();
export type TransferPayload = z.infer<typeof transferPayloadSchema>;
export const envelopeSchema = z
  .object({
    payload: transferPayloadSchema,
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
  })
  .strict();
export type TransferEnvelope = z.infer<typeof envelopeSchema>;
export function stable(value: any): string {
  if (Array.isArray(value)) return "[" + value.map(stable).join(",") + "]";
  if (value && typeof value === "object")
    return (
      "{" +
      Object.keys(value)
        .sort()
        .filter((k) => value[k] !== undefined)
        .map((k) => JSON.stringify(k) + ":" + stable(value[k]))
        .join(",") +
      "}"
    );
  return JSON.stringify(value);
}
export async function digest(value: unknown) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest(
        "SHA-256",
        new TextEncoder().encode(stable(value)),
      ),
    ),
  ]
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");
}
export function collectBrowser(storage: Storage) {
  const result: { key: string; value: string }[] = [];
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i)!;
    if (portableKey(key)) result.push({ key, value: storage.getItem(key)! });
  }
  return entries.parse(result.sort((a, b) => a.key.localeCompare(b.key)));
}
export async function pack(
  backup: unknown,
  browser: unknown,
  sourceOrigin: string,
  returnHash = "#/home",
): Promise<TransferEnvelope> {
  const payload = transferPayloadSchema.parse({
    schemaVersion: 1,
    format: "ARTYVERSE_WORKSPACE_TRANSFER",
    sourceOrigin,
    exportedAt: new Date().toISOString(),
    returnHash,
    backup,
    browser,
  });
  return { payload, sha256: await digest(payload) };
}
export async function unpack(input: unknown) {
  const file = envelopeSchema.parse(input);
  if ((await digest(file.payload)) !== file.sha256)
    throw Error("Transfer checksum mismatch; no data was applied");
  if (
    new Set(file.payload.backup.items.map((i) => i.id)).size !==
    file.payload.backup.items.length
  )
    throw Error("Duplicate saved-record ID");
  if (
    new Set(file.payload.backup.assets.map((a) => a.id)).size !==
    file.payload.backup.assets.length
  )
    throw Error("Duplicate media ID");
  if (
    new Set(file.payload.backup.revisions.map((a) => a.id + ":" + a.revision))
      .size !== file.payload.backup.revisions.length
  )
    throw Error("Duplicate revision identity");
  return file;
}
export function backupSignature(
  backup: Backup,
  browser: TransferPayload["browser"],
) {
  return digest({
    items: backup.items,
    revisions: backup.revisions,
    assets: backup.assets,
    browser,
  });
}
function referenceMap(value: any, map: Map<string, string>, key = ""): any {
  if (typeof value === "string") {
    if (/(?:Id|Ids)$/.test(key) || key === "id-reference")
      return map.get(value) || value;
    if (
      ["asset", "url"].includes(key) &&
      /^\/api\/assets\/[a-z0-9-]{36}$/.test(value)
    ) {
      const id = value.split("/").pop()!;
      return "/api/assets/" + (map.get(id) || id);
    }
    return value;
  }
  if (Array.isArray(value)) return value.map((v) => referenceMap(v, map, key));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, referenceMap(v, map, k)]),
    );
  return value;
}
async function copyId(namespace: string, id: string) {
  const h = await digest(namespace + ":" + id);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-4${h.slice(13, 16)}-a${h.slice(17, 20)}-${h.slice(20, 32)}`;
}
export type TransferPlan = {
  backup: Backup;
  writes: { key: string; value: string }[];
  recordConflicts: number;
  assetConflicts: number;
  draftConflicts: number;
  copyWorkspace: boolean;
  destinationSignature: string;
  copiedIds: Record<string, string>;
};
export async function planTransfer(
  file: TransferEnvelope,
  destination: Backup,
  current: TransferPayload["browser"],
  preferIncoming = false,
): Promise<TransferPlan> {
  const source = file.payload.backup,
    items = new Map(destination.items.map((i) => [i.id, i])),
    history = new Map(
      destination.revisions.map((i) => [i.id + ":" + i.revision, i]),
    ),
    assets = new Map(destination.assets.map((i) => [i.id, i]));
  const recordConflicts =
    source.items.filter(
      (i) => items.has(i.id) && stable(i) !== stable(items.get(i.id)),
    ).length +
    source.revisions.filter(
      (i) =>
        history.has(i.id + ":" + i.revision) &&
        stable(i) !== stable(history.get(i.id + ":" + i.revision)),
    ).length;
  const assetConflicts = source.assets.filter(
    (a) =>
      assets.has(a.id) &&
      (a.base64 !== assets.get(a.id)!.base64 ||
        a.mime !== assets.get(a.id)!.mime ||
        String(a.name || "Media") !==
          String(assets.get(a.id)!.name || "Media")),
  ).length;
  const copyWorkspace = recordConflicts + assetConflicts > 0,
    map = new Map<string, string>();
  if (copyWorkspace) {
    for (const id of new Set(
      [...source.items, ...source.revisions, ...source.assets].map((i) => i.id),
    ))
      map.set(id, await copyId(file.sha256, id));
  }
  const copyTitle = (title: string) => {
    let out = "";
    for (const part of new Intl.Segmenter(undefined, {
      granularity: "grapheme",
    }).segment(title)) {
      if ((out + part.segment).length > 160) break;
      out += part.segment;
    }
    return out + " · source copy";
  };
  const transform = (i: Item): Item => ({
    ...i,
    id: map.get(i.id) || i.id,
    title: copyWorkspace ? copyTitle(i.title) : i.title,
    data: referenceMap(i.data, map),
  });
  const backup: Backup = {
    ...source,
    items: source.items.map(transform),
    revisions: source.revisions.map(transform),
    assets: source.assets.map((a) => ({ ...a, id: map.get(a.id) || a.id })),
  };
  const existing = new Map(current.map((e) => [e.key, e.value])),
    writes: { key: string; value: string }[] = [];
  let draftConflicts = 0;
  for (const e of file.payload.browser) {
    let key = e.key;
    for (const [oldId, newId] of map) key = key.replaceAll(oldId, newId);
    let value = e.value;
    if (e.key === "av-active-project") value = map.get(value) || value;
    else if (copyWorkspace) {
      try {
        value = JSON.stringify(referenceMap(JSON.parse(value), map));
      } catch {}
    }
    const old = existing.get(key);
    if (old === value) continue;
    if (old !== undefined) {
      draftConflicts++;
      const recoveryKey =
        "av-origin-recovery:" +
        file.sha256.slice(0, 16) +
        ":" +
        (await digest(key)).slice(0, 16);
      writes.push({
        key: recoveryKey,
        value: JSON.stringify({
          schemaVersion: 1,
          key,
          value: preferIncoming ? old : value,
          sourceOrigin: preferIncoming
            ? "destination before transfer"
            : file.payload.sourceOrigin,
        }),
      });
      if (!preferIncoming) continue;
    }
    writes.push({ key, value });
  }
  const mapKey = originMapKey(file.payload.sourceOrigin);
  let previousIds: Record<string, string> = {};
  try {
    const old = JSON.parse(existing.get(mapKey) || "null");
    if (
      old?.schemaVersion === 1 &&
      old.sourceOrigin === file.payload.sourceOrigin
    )
      previousIds = Object.fromEntries(
        Object.entries(old.ids || {}).filter(
          ([a, b]) =>
            /^[a-z0-9-]{36}$/.test(a) &&
            typeof b === "string" &&
            /^[a-z0-9-]{36}$/.test(b),
        ) as [string, string][],
      );
  } catch {}
  const ids = {
    ...previousIds,
    ...Object.fromEntries(
      source.items.map((i) => [i.id, map.get(i.id) || i.id]),
    ),
  };
  writes.push({
    key: mapKey,
    value: JSON.stringify({
      schemaVersion: 1,
      sourceOrigin: file.payload.sourceOrigin,
      ids,
    }),
  });
  return {
    backup,
    writes: [...new Map(writes.map((w) => [w.key, w])).values()],
    recordConflicts,
    assetConflicts,
    draftConflicts,
    copyWorkspace,
    destinationSignature: await backupSignature(destination, current),
    copiedIds: Object.fromEntries(map),
  };
}
export function stageWrites(
  storage: Storage,
  writes: TransferPlan["writes"],
  hash: string,
) {
  const prefix = "av-transfer-stage:" + hash + ":";
  const keys: string[] = [];
  try {
    for (const w of writes) {
      const key = prefix + w.key;
      storage.setItem(key, w.value);
      keys.push(key);
    }
  } catch (e) {
    for (const key of keys) storage.removeItem(key);
    throw Error(
      "Draft storage is full or unavailable; saved records were not changed",
    );
  }
  return keys;
}
export function finishWrites(
  storage: Storage,
  writes: TransferPlan["writes"],
  stageKeys: string[],
) {
  for (let i = 0; i < writes.length; i++) {
    storage.removeItem(stageKeys[i]);
    storage.setItem(writes[i].key, writes[i].value);
  }
}
export function verifyBackup(expected: Backup, actual: Backup) {
  const items = new Map(actual.items.map((v) => [v.id, v])),
    revisions = new Map(
      actual.revisions.map((v) => [v.id + ":" + v.revision, v]),
    ),
    assets = new Map(actual.assets.map((v) => [v.id, v]));
  return (
    expected.items.every((v) => stable(v) === stable(items.get(v.id))) &&
    expected.revisions.every(
      (v) => stable(v) === stable(revisions.get(v.id + ":" + v.revision)),
    ) &&
    expected.assets.every((v) => {
      const a = assets.get(v.id);
      return a?.base64 === v.base64 && a?.mime === v.mime;
    })
  );
}
