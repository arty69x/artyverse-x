import express from "express";
import { DatabaseSync } from "node:sqlite";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import { itemInput, type Item } from "../shared/schema.ts";
import{registerAgent}from"./agent.ts";
const dir = resolve(process.env.ARTYVERSE_DATA_DIR || ".data");
mkdirSync(dir, { recursive: true });
mkdirSync(resolve(dir, "assets"), { recursive: true });
const db = new DatabaseSync(resolve(dir, "workspace.sqlite"));
db.exec(
  "PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS items(id TEXT PRIMARY KEY,json TEXT NOT NULL); CREATE TABLE IF NOT EXISTS revisions(id TEXT, revision INTEGER,json TEXT,PRIMARY KEY(id,revision)); CREATE TABLE IF NOT EXISTS assets(id TEXT PRIMARY KEY,mime TEXT,name TEXT,size INTEGER);",
);
function validMedia(mime: string, b: Buffer): boolean {
  const magic = b.subarray(0, 16);
  return mime === "image/png"
    ? magic
        .subarray(0, 8)
        .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
    : mime === "image/jpeg"
      ? magic.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
      : mime === "image/webp"
        ? magic.toString("ascii", 0, 4) === "RIFF" &&
          magic.toString("ascii", 8, 12) === "WEBP"
        : mime === "audio/webm"
          ? magic.subarray(0, 4).equals(Buffer.from([26, 69, 223, 163]))
          : mime === "audio/mp4"
            ? magic.toString("ascii", 4, 8) === "ftyp"
            : mime === "audio/ogg"
              ? magic.toString("ascii", 0, 4) === "OggS"
              : mime === "audio/wav"
                ? magic.toString("ascii", 0, 4) === "RIFF" &&
                  magic.toString("ascii", 8, 12) === "WAVE"
                : false;
}
const app = express();
app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (
    req.headers.origin &&
    !/^https?:\/\/(localhost|127\.0\.0\.1|[^/]+\.internal)(:\d+)?$/.test(
      req.headers.origin,
    )
  ) {
    res.status(403).json({ error: "Cross-origin write denied" });
    return;
  }
  next();
});
app.post(
  "/api/assets",
  express.raw({
    type: [
      "image/png",
      "image/jpeg",
      "image/webp",
      "audio/webm",
      "audio/ogg",
      "audio/mp4",
      "audio/wav",
    ],
    limit: "25mb",
  }),
  (req, res) => {
    if (!Buffer.isBuffer(req.body) || !req.body.length) {
      res
        .status(400)
        .json({ error: "Supported media required (25 MB maximum)." });
      return;
    }
    const id = randomUUID(),
      mime = (req.headers["content-type"] || "").split(";")[0];
    if (!validMedia(mime, req.body)) {
      res
        .status(400)
        .json({
          error: "File signature does not match a supported media type",
        });
      return;
    }
    writeFileSync(resolve(dir, "assets", id), req.body);
    db.prepare("INSERT INTO assets VALUES(?,?,?,?)").run(
      id,
      mime,
      String(req.headers["x-filename"] || "Media").slice(0, 180),
      req.body.length,
    );
    res
      .status(201)
      .json({ id, url: `/api/assets/${id}`, mime, size: req.body.length });
  },
);
app.get("/api/assets/:id", (req, res) => {
  const row = db
    .prepare("SELECT * FROM assets WHERE id=?")
    .get(String(req.params.id)) as any;
  if (!row) {
    res.status(404).end();
    return;
  }
  res.type(row.mime).sendFile(resolve(dir, "assets", row.id));
});
app.use(express.json({ limit: "100mb" }));
registerAgent(app,db);
const all = (): Item[] =>
  db
    .prepare("SELECT json FROM items")
    .all()
    .map((r: any) => JSON.parse(r.json));
app.get("/api/status", (_req, res) =>
  res.json({
    storage: "Local SQLite",
    ai: process.env.ARTYVERSE_AI_KEY&&process.env.ARTYVERSE_AI_MODEL?"configured":"unavailable",
    cloud: "unavailable",
    scheduler: "unavailable",
    bytes: readFileSync(resolve(dir, "workspace.sqlite")).byteLength,
  }),
);
app.get("/api/items", (_req, res) => res.json(all()));
app.post("/api/items", (req, res) => {
  const parsed = itemInput.safeParse(req.body);
  if (!parsed.success) {
    res
      .status(400)
      .json({ error: "Invalid item", issues: parsed.error.issues });
    return;
  }
  const now = new Date().toISOString();
  const item: Item = {
    ...parsed.data,
    id: randomUUID(),
    schemaVersion: 1,
    revision: 1,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
  };
  const json = JSON.stringify(item);
  db.prepare("INSERT INTO items VALUES(?,?)").run(item.id, json);
  db.prepare("INSERT INTO revisions VALUES(?,?,?)").run(item.id, 1, json);
  res.status(201).json(item);
});
app.put("/api/items/:id", (req, res) => {
  const row = db
    .prepare("SELECT json FROM items WHERE id=?")
    .get(String(req.params.id)) as any;
  if (!row) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  const parsed = itemInput.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid item" });
    return;
  }
  const old: Item = JSON.parse(row.json);
  if (parsed.data.revision !== old.revision) {
    res
      .status(409)
      .json({ error: "A newer revision exists. Reload before saving." });
    return;
  }
  const item = {
    ...old,
    ...parsed.data,
    revision: old.revision + 1,
    updatedAt: new Date().toISOString(),
  };
  const json = JSON.stringify(item);
  db.prepare("UPDATE items SET json=? WHERE id=?").run(json, item.id);
  db.prepare("INSERT INTO revisions VALUES(?,?,?)").run(
    item.id,
    item.revision,
    json,
  );
  res.json(item);
});
app.post("/api/items/:id/trash", (req, res) => {
  const row = db
    .prepare("SELECT json FROM items WHERE id=?")
    .get(String(req.params.id)) as any;
  if (!row) {
    res.status(404).json({ error: "Item not found" });
    return;
  }
  const item = JSON.parse(row.json);
  item.deletedAt = req.body.restore ? null : new Date().toISOString();
  item.updatedAt = new Date().toISOString();
  db.prepare("UPDATE items SET json=? WHERE id=?").run(
    JSON.stringify(item),
    item.id,
  );
  res.json(item);
});
app.get("/api/items/:id/revisions", (req, res) =>
  res.json(
    db
      .prepare("SELECT json FROM revisions WHERE id=? ORDER BY revision DESC")
      .all(String(req.params.id))
      .map((r: any) => JSON.parse(r.json)),
  ),
);
app.get("/api/backup", (_req, res) =>
  res.json({
    schemaVersion: 1,
    exportedAt: new Date().toISOString(),
    items: all(),
    revisions: db
      .prepare("SELECT json FROM revisions")
      .all()
      .map((r: any) => JSON.parse(r.json)),
    assets: db
      .prepare("SELECT * FROM assets")
      .all()
      .map((a: any) => ({
        ...a,
        base64: readFileSync(resolve(dir, "assets", a.id)).toString("base64"),
      })),
  }),
);
app.post("/api/restore", (req, res) => {
  try {
    const b = req.body;
    if (
      b.schemaVersion !== 1 ||
      !Array.isArray(b.items) ||
      b.items.length > 10000 ||
      !Array.isArray(b.assets)
    )
      throw Error("Unsupported backup");
    const rows = b.items.map((i: any) => {
      itemInput.parse(i);
      if (
        typeof i.id !== "string" ||
        !/^[a-z0-9-]{36}$/.test(i.id) ||
        !Number.isInteger(i.revision) ||
        i.revision < 1 ||
        !Number.isFinite(Date.parse(i.createdAt)) ||
        !Number.isFinite(Date.parse(i.updatedAt)) ||
        i.schemaVersion !== 1
      )
        throw Error("Invalid item identity");
      return i;
    });
    for (const a of b.assets) {
      if (
        !/^[a-z0-9-]{36}$/.test(a.id) ||
        ![
          "image/png",
          "image/jpeg",
          "image/webp",
          "audio/webm",
          "audio/ogg",
          "audio/mp4",
          "audio/wav",
        ].includes(a.mime) ||
        typeof a.base64 !== "string" ||
        a.base64.length > 35000000
      )
        throw Error("Invalid media");
    }
    const history = Array.isArray(b.revisions) ? b.revisions : [];
    if (history.length > 100000) throw Error("Too many revisions");
    for (const i of history) {
      itemInput.parse(i);
      if (
        !/^[a-z0-9-]{36}$/.test(i.id) ||
        !Number.isInteger(i.revision) ||
        i.revision < 1
      )
        throw Error("Invalid revision");
    }
    for (const a of b.assets) {
      const bytes = Buffer.from(a.base64, "base64");
      if (!validMedia(a.mime, bytes) || bytes.length !== a.size)
        throw Error("Invalid media signature or size");
    }
    db.exec("BEGIN");
    for (const i of rows) {
      db.prepare("INSERT OR IGNORE INTO items VALUES(?,?)").run(
        i.id,
        JSON.stringify(i),
      );
    }
    for (const i of history)
      db.prepare("INSERT OR IGNORE INTO revisions VALUES(?,?,?)").run(
        i.id,
        i.revision,
        JSON.stringify(i),
      );
    for (const a of b.assets) {
      if (!existsSync(resolve(dir, "assets", a.id)))
        writeFileSync(
          resolve(dir, "assets", a.id),
          Buffer.from(a.base64, "base64"),
        );
      db.prepare("INSERT OR IGNORE INTO assets VALUES(?,?,?,?)").run(
        a.id,
        a.mime,
        a.name,
        a.size,
      );
    }
    db.exec("COMMIT");
    res.json({
      imported: rows.length,
      policy: "Merge by stable ID; existing items preserved",
    });
  } catch (e) {
    try {
      db.exec("ROLLBACK");
    } catch {}
    res
      .status(400)
      .json({ error: e instanceof Error ? e.message : "Invalid backup" });
  }
});
if (existsSync(resolve("dist"))) {
  app.use(express.static(resolve("dist")));
  app.get("/{*path}", (_req, res) => res.sendFile(resolve("dist/index.html")));
}
app.use((err: any, _req: any, res: any, _next: any) =>
  res.status(err.status || 500).json({
    error:
      err.status === 413
        ? "File exceeds size limit"
        : "Request could not be completed",
  }),
);
app.listen(Number(process.env.PORT || 4311), "127.0.0.1", () =>
  console.log("ARTYVERSE X local server on " + (process.env.PORT || 4311)),
);
