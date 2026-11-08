/** Hosted edition: only same-origin /api requests use browser-local IndexedDB.
 * No network AI, cloud identity or shared database is implied. */
import { itemInput, type Item } from "../../shared/schema";
const scope = self as any;
const dbReady = new Promise<IDBDatabase>((resolve, reject) => {
  const r = indexedDB.open("artyverse-hosted-workspace", 1);
  r.onupgradeneeded = () => {
    const db = r.result;
    db.createObjectStore("items", { keyPath: "id" });
    db.createObjectStore("revisions", { keyPath: ["id", "revision"] });
    db.createObjectStore("assets", { keyPath: "id" });
  };
  r.onsuccess = () => resolve(r.result);
  r.onerror = () => reject(r.error);
});
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
const idValid = (s: unknown) =>
  typeof s === "string" && /^[a-z0-9-]{36}$/.test(s);
async function read<T = any>(name: string, id?: IDBValidKey): Promise<T> {
  const db = await dbReady;
  return new Promise((resolve, reject) => {
    const r =
      id === undefined
        ? db.transaction(name).objectStore(name).getAll()
        : db.transaction(name).objectStore(name).get(id);
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}
async function write(stores: string[], fn: (tx: IDBTransaction) => void) {
  const db = await dbReady;
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(stores, "readwrite");
    tx.oncomplete = () => resolve();
    tx.onabort = tx.onerror = () =>
      reject(tx.error || Error("Storage transaction aborted"));
    try {
      fn(tx);
    } catch (e) {
      tx.abort();
      reject(e);
    }
  });
}
async function create(input: any) {
  const parsed = itemInput.parse(input),
    now = new Date().toISOString();
  const item: Item = {
    ...parsed,
    id: crypto.randomUUID(),
    schemaVersion: 1,
    revision: 1,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  await write(["items", "revisions"], (tx) => {
    tx.objectStore("items").add(item);
    tx.objectStore("revisions").add(item);
  });
  return item;
}
async function update(id: string, input: any, trash = false) {
  const parsed = trash ? input : itemInput.parse(input);
  const db = await dbReady;
  return new Promise<Item>((resolve, reject) => {
    const tx = db.transaction(["items", "revisions"], "readwrite");
    let result: Item;
    let failure: Error | undefined;
    tx.oncomplete = () => resolve(result);
    tx.onabort = tx.onerror = () =>
      reject(failure || tx.error || Error("Storage failed"));
    const r = tx.objectStore("items").get(id);
    r.onsuccess = () => {
      const old = r.result as Item;
      if (!old) {
        failure = Error("Item not found");
        tx.abort();
        return;
      }
      if (!trash && parsed.revision !== old.revision) {
        failure = Error("A newer revision exists. Reload before saving.");
        tx.abort();
        return;
      }
      result = trash
        ? {
            ...old,
            deletedAt: parsed.restore ? null : new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : {
            ...old,
            ...parsed,
            revision: old.revision + 1,
            updatedAt: new Date().toISOString(),
          };
      tx.objectStore("items").put(result);
      if (!trash) tx.objectStore("revisions").add(result);
    };
  });
}
const mediaTypes = [
  "image/png",
  "image/jpeg",
  "image/webp",
  "audio/webm",
  "audio/ogg",
  "audio/mp4",
  "audio/wav",
];
async function validMedia(blob: Blob) {
  const b = new Uint8Array(await blob.slice(0, 16).arrayBuffer()),
    s = new TextDecoder().decode(b);
  switch (blob.type) {
    case "image/png":
      return b.slice(0, 8).join() === "137,80,78,71,13,10,26,10";
    case "image/jpeg":
      return b[0] === 255 && b[1] === 216 && b[2] === 255;
    case "image/webp":
      return s.startsWith("RIFF") && s.slice(8, 12) === "WEBP";
    case "audio/wav":
      return s.startsWith("RIFF") && s.slice(8, 12) === "WAVE";
    case "audio/webm":
      return b.slice(0, 4).join() === "26,69,223,163";
    case "audio/ogg":
      return s.startsWith("OggS");
    case "audio/mp4":
      return s.slice(4, 8) === "ftyp";
    default:
      return false;
  }
}
function encode(b: Uint8Array) {
  let s = "";
  for (let n = 0; n < b.length; n += 8192)
    s += String.fromCharCode(...b.subarray(n, n + 8192));
  return btoa(s);
}
function identity(i: any) {
  itemInput.parse(i);
  if (
    !idValid(i.id) ||
    i.schemaVersion !== 1 ||
    !Number.isInteger(i.revision) ||
    i.revision < 1 ||
    !Number.isFinite(Date.parse(i.createdAt)) ||
    !Number.isFinite(Date.parse(i.updatedAt)) ||
    (i.deletedAt !== null && !Number.isFinite(Date.parse(i.deletedAt)))
  )
    throw Error("Invalid item identity");
  return i;
}
async function restore(body: any) {
  if (
    body.schemaVersion !== 1 ||
    !Array.isArray(body.items) ||
    body.items.length > 10000 ||
    !Array.isArray(body.assets) ||
    body.assets.length > 10000
  )
    throw Error("Unsupported backup");
  const items = body.items.map(identity),
    history = (body.revisions || []).map(identity);
  if (
    history.length > 100000 ||
    new Set(items.map((i: Item) => i.id)).size !== items.length
  )
    throw Error("Invalid backup inventory");
  const assets: any[] = [];
  let bytes = 0;
  for (const a of body.assets) {
    if (
      !idValid(a.id) ||
      !mediaTypes.includes(a.mime) ||
      typeof a.base64 !== "string" ||
      a.base64.length > 35000000
    )
      throw Error("Invalid media");
    const binary = Uint8Array.from(atob(a.base64), (c) => c.charCodeAt(0)),
      blob = new Blob([binary], { type: a.mime });
    bytes += blob.size;
    if (
      blob.size > 25 * 1024 * 1024 ||
      bytes > 100 * 1024 * 1024 ||
      !(await validMedia(blob))
    )
      throw Error("Invalid or oversized media");
    assets.push({
      id: a.id,
      mime: a.mime,
      name: String(a.name || "Media").slice(0, 180),
      size: blob.size,
      blob,
    });
  }
  // One transaction: retain existing records/media/history rather than silently overwriting.
  let imported = 0;
  await write(["items", "revisions", "assets"], (tx) => {
    for (const i of items) {
      const store = tx.objectStore("items"),
        r = store.get(i.id);
      r.onsuccess = () => {
        if (!r.result) {
          store.add(i);
          imported++;
        }
      };
    }
    for (const i of history) {
      const store = tx.objectStore("revisions"),
        r = store.get([i.id, i.revision]);
      r.onsuccess = () => {
        if (!r.result) store.add(i);
      };
    }
    for (const a of assets) {
      const store = tx.objectStore("assets"),
        r = store.get(a.id);
      r.onsuccess = () => {
        if (!r.result) store.add(a);
      };
    }
  });
  return { imported, policy: "Merge by stable ID; existing items preserved" };
}
async function localRun(input: any) {
  if (
    typeof input.prompt !== "string" ||
    !input.prompt.trim() ||
    input.prompt.length > 24000 ||
    !["local", "connected"].includes(input.mode) ||
    !["outline", "analyze", "brief"].includes(input.tool)
  )
    throw Error("Invalid agent request");
  if (input.mode === "connected" && !input.fallback)
    return json(
      {
        error:
          "AI provider unavailable in browser edition. Use a local tool or run the configured server edition.",
      },
      503,
    );
  const began = performance.now(),
    prompt = input.prompt.trim(),
    lines = prompt
      .split(/\n+/)
      .map((s: string) => s.trim())
      .filter(Boolean),
    tool = input.tool;
  let text = "";
  if (tool === "outline")
    text = lines.map((s: string, i: number) => `${i + 1}. ${s}`).join("\n");
  else if (tool === "analyze") {
    const words = Array.from(
      new Intl.Segmenter(undefined, { granularity: "word" }).segment(prompt),
    ).filter((x) => x.isWordLike);
    text = JSON.stringify(
      {
        method: "Local text statistics, not AI inference",
        words: words.length,
        graphemes: Array.from(
          new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(
            prompt,
          ),
        ).length,
        lines: lines.length,
        uniqueWords: new Set(words.map((x) => x.segment.toLocaleLowerCase()))
          .size,
      },
      null,
      2,
    );
  } else
    text = `# Working brief\n\n## Source material\n${prompt}\n\n## Decisions to make\n- Intended audience\n- Desired outcome\n- Constraints\n- Evidence for completion\n\nLocal structure template. No AI inference was used.`;
  const item = await create({
    kind: "agent-run",
    title: prompt.slice(0, 100),
    data: {
      schemaVersion: 2,
      prompt,
      text,
      tool,
      provenance: input.mode === "local" ? "local-tool" : "local-fallback",
      status: "completed",
      model: null,
      usage: null,
      costUsd: 0,
      cached: false,
      fallbackReason:
        input.mode === "connected" ? "AI unavailable in browser edition" : null,
      elapsedMs: performance.now() - began,
      estimatedInputTokens: null,
      estimatedCostUsd: null,
      ...(input.projectId ? { projectId: input.projectId } : {}),
    },
  });
  return json({ item, id: item.id });
}
async function route(req: Request) {
  const path = new URL(req.url).pathname.slice(4),
    method = req.method;
  if (
    method !== "GET" &&
    Number(req.headers.get("content-length")) > 100 * 1024 * 1024
  )
    return json({ error: "Request too large" }, 413);
  if (path === "/items" && method === "GET") return json(await read("items"));
  if (path === "/items" && method === "POST")
    return json(await create(await req.json()), 201);
  const match = path.match(
    /^\/items\/([a-z0-9-]{36})(?:\/(trash|revisions))?$/,
  );
  if (match) {
    if (method === "PUT" && !match[2])
      return json(await update(match[1], await req.json()));
    if (method === "POST" && match[2] === "trash")
      return json(await update(match[1], await req.json(), true));
    if (method === "GET" && match[2] === "revisions")
      return json(
        (await read<Item[]>("revisions"))
          .filter((i) => i.id === match[1])
          .sort((a, b) => b.revision - a.revision),
      );
  }
  if (path === "/assets" && method === "POST") {
    let blob = await req.blob();
    blob = blob.slice(
      0,
      blob.size,
      (req.headers.get("content-type") || "").split(";")[0],
    );
    if (blob.size > 25 * 1024 * 1024 || !(await validMedia(blob)))
      return json(
        { error: "Unsupported media signature or maximum size exceeded" },
        400,
      );
    const asset = {
      id: crypto.randomUUID(),
      mime: blob.type,
      size: blob.size,
      name: (req.headers.get("x-filename") || "Media").slice(0, 180),
      blob,
    };
    await write(["assets"], (tx) => tx.objectStore("assets").add(asset));
    return json(
      {
        id: asset.id,
        mime: asset.mime,
        size: asset.size,
        url: "/api/assets/" + asset.id,
      },
      201,
    );
  }
  if (/^\/assets\/[a-z0-9-]{36}$/.test(path) && method === "GET") {
    const a = await read("assets", path.split("/")[2]);
    return a
      ? new Response(a.blob, {
          headers: {
            "Content-Type": a.mime,
            "Content-Length": String(a.size),
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "no-store",
          },
        })
      : json({ error: "Asset missing" }, 404);
  }
  if (path === "/status" && method === "GET") {
    const items = await read("items");
    return json({
      storage: "Browser IndexedDB",
      ai: "unavailable",
      cloud: "unavailable",
      scheduler: "unavailable",
      bytes: new TextEncoder().encode(JSON.stringify(items)).length,
    });
  }
  if (path === "/backup" && method === "GET") {
    const assets: any[] = [];
    for (const a of await read("assets")) {
      const { blob, ...meta } = a;
      assets.push({
        ...meta,
        base64: encode(new Uint8Array(await blob.arrayBuffer())),
      });
    }
    return json({
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      items: await read("items"),
      revisions: await read("revisions"),
      assets,
    });
  }
  if (path === "/restore" && method === "POST")
    return json(await restore(await req.json()));
  if (path === "/agent/status" && method === "GET")
    return json({
      provider: "unavailable",
      model: null,
      pricing: null,
      localTools: ["outline", "analyze", "brief"],
      cachedResponses: 0,
      externalActions: "unavailable",
    });
  if (path === "/agent/run" && method === "POST")
    return localRun(await req.json());
  if (path.startsWith("/agent/cancel/") && method === "POST")
    return json({ cancelled: false });
  return json({ error: "Unavailable browser-local endpoint" }, 404);
}
scope.addEventListener("install", (event: any) =>
  event.waitUntil(scope.skipWaiting()),
);
scope.addEventListener("activate", (event: any) =>
  event.waitUntil(scope.clients.claim()),
);
scope.addEventListener("fetch", (event: any) => {
  const url = new URL(event.request.url);
  if (url.origin === scope.location.origin && url.pathname.startsWith("/api/"))
    event.respondWith(
      route(event.request).catch((e: Error) =>
        json(
          {
            error:
              e.message ||
              "Browser storage unavailable. Export a backup and check browser permissions.",
          },
          /newer revision/.test(e.message)
            ? 409
            : /not found/.test(e.message)
              ? 404
              : 400,
        ),
      ),
    );
});
