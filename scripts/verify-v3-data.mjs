import { spawn } from "node:child_process";
import { mkdtempSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const base = process.env.ARTYVERSE_VERIFY_URL || "http://127.0.0.1:4318";
async function call(host, path, data, method) {
  const r = await fetch(host + "/api" + path, {
    method: method || (data ? "POST" : "GET"),
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
  });
  const x = await r.json();
  if (!r.ok) throw Error(path + " " + r.status() + " " + JSON.stringify(x));
  return x;
}
const project = await call(base, "/items", {
    kind: "project",
    title: "V3 backup / verification fixture",
    data: { schemaVersion: 2, description: "Not user work", color: "#B44FFF" },
  }),
  note = await call(base, "/items", {
    kind: "note",
    title: "V3 backup evidence fixture",
    data: {
      body: "My actual example is supplied by this deterministic test fixture.",
      source: "QA fixture",
      tags: "test",
      projectId: project.id,
    },
  }),
  session = await call(base, "/items", {
    kind: "session",
    title: "V3 backup interview fixture",
    data: {
      sessionType: "copilot",
      transcript: [
        {
          id: crypto.randomUUID(),
          speaker: "interviewer",
          text: "Describe your project?",
          at: new Date().toISOString(),
        },
      ],
      question: "Describe your project?",
      answer: "[ใส่ข้อมูลจริง]",
      evidenceIds: [note.id],
      notes: "",
      projectId: project.id,
    },
  });
const updated = await call(
    base,
    "/items/" + session.id,
    {
      kind: session.kind,
      title: session.title,
      revision: session.revision,
      data: { ...session.data, answer: "Editable answer from the QA fixture." },
    },
    "PUT",
  ),
  backup = await call(base, "/backup");
const child = spawn(
  process.execPath,
  ["--experimental-strip-types", "server/index.ts"],
  {
    env: {
      ...process.env,
      PORT: "4319",
      ARTYVERSE_DATA_DIR: mkdtempSync(join(tmpdir(), "artyverse-v3-restore-")),
    },
    stdio: "ignore",
  },
);
try {
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      await call("http://127.0.0.1:4319", "/status");
      ready = true;
      break;
    } catch {}
    await new Promise((r) => setTimeout(r, 50));
  }
  if (!ready) throw Error("Restore server did not start");
  const restore = await call("http://127.0.0.1:4319", "/restore", backup),
    rows = await call("http://127.0.0.1:4319", "/items");
  for (const item of [project, note, updated]) {
    const copy = rows.find((i) => i.id === item.id);
    if (!copy || JSON.stringify(copy) !== JSON.stringify(item))
      throw Error("Exact restore mismatch " + item.kind);
  }
  const revisions = await call(
    "http://127.0.0.1:4319",
    "/items/" + session.id + "/revisions",
  );
  if (revisions.length !== 2) throw Error("Revision history not restored");
  const result = {
    timestamp: new Date().toISOString(),
    conditions:
      "Built local API, isolated QA data; restore into empty temporary SQLite; no user database modified.",
    projectId: project.id,
    evidenceId: note.id,
    sessionId: session.id,
    exactRecordsPreserved: true,
    evidenceRelationshipPreserved: true,
    revisionCount: revisions.length,
    restore,
  };
  writeFileSync(
    "tests/evidence/v3/backup-restore.json",
    JSON.stringify(result, null, 2),
  );
  console.log(result);
} finally {
  child.kill();
}
