import { describe, it, expect } from "vitest";
import {
  pack,
  unpack,
  planTransfer,
  collectBrowser,
  stageWrites,
  finishWrites,
  verifyBackup,
  type Backup,
} from "../../shared/transfer";
import {
  safeHash,
  validOrigin,
  PRIMARY_ORIGIN,
  resolveOriginId,
} from "../../shared/origins";
const id = "11111111-1111-4111-a111-111111111111",
  project = "22222222-2222-4222-a222-222222222222",
  asset = "33333333-3333-4333-a333-333333333333";
const row = (i = id, body = "source") => ({
  id: i,
  schemaVersion: 1 as const,
  title: "งานของฉัน",
  kind: "note" as const,
  data: { body },
  revision: 1,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  deletedAt: null,
});
const empty = (): Backup => ({
  schemaVersion: 1,
  items: [],
  revisions: [],
  assets: [],
});
class MemoryStorage implements Storage {
  data = new Map<string, string>();
  get length() {
    return this.data.size;
  }
  clear() {
    this.data.clear();
  }
  getItem(k: string) {
    return this.data.get(k) ?? null;
  }
  key(i: number) {
    return [...this.data.keys()][i] ?? null;
  }
  removeItem(k: string) {
    this.data.delete(k);
  }
  setItem(k: string, v: string) {
    this.data.set(k, String(v));
  }
}
describe("Origin-safe complete workspace transfer", () => {
  it("detects tampering and excludes unrelated secret/config browser keys", async () => {
    const m = new MemoryStorage();
    m.setItem("av-draft:home", '"actual draft"');
    m.setItem("OPENAI_API_KEY", "not-exportable");
    m.setItem("av-provider-key", "not-exportable");
    m.setItem("artyverse-theme", "light");
    const browser = collectBrowser(m);
    expect(browser.map((x) => x.key)).toEqual([
      "artyverse-theme",
      "av-draft:home",
    ]);
    const e = await pack(
      { ...empty(), items: [row()] },
      browser,
      "https://old.example",
    );
    expect((await unpack(e)).payload.backup.items).toHaveLength(1);
    e.payload.backup.items[0].title = "tampered";
    await expect(unpack(e)).rejects.toThrow("checksum");
  });
  it("copies a conflicting workspace deterministically and remaps IDs/asset references without rewriting prose", async () => {
    const source: Backup = {
      schemaVersion: 1,
      items: [
        {
          ...row(project),
          kind: "project",
          data: {
            schemaVersion: 2,
            description: "source project",
            color: "#CCFF00",
          },
        },
        {
          ...row(),
          data: {
            body: id,
            projectId: project,
            sourceId: project,
            url: "/api/assets/" + asset,
          },
        },
      ],
      revisions: [row()],
      assets: [
        {
          id: asset,
          mime: "audio/wav",
          base64: "UklGRg==",
          name: "source.wav",
        },
      ],
    };
    const dest: Backup = {
      schemaVersion: 1,
      items: [row()],
      revisions: [],
      assets: [
        {
          id: asset,
          mime: "audio/wav",
          base64: "T0dHUw==",
          name: "existing.wav",
        },
      ],
    };
    const file = await pack(
      source,
      [
        {
          key: "av-draft:v2:note:" + id,
          value: JSON.stringify({ projectId: project, body: id }),
        },
      ],
      "https://old.example",
    );
    const a = await planTransfer(file, dest, []),
      b = await planTransfer(file, dest, []);
    expect(a.copyWorkspace).toBe(true);
    expect(a.copiedIds).toEqual(b.copiedIds);
    const copied = a.backup.items.find((x) => x.kind === "note")!;
    expect(copied.id).not.toBe(id);
    expect(copied.data.projectId).toBe(a.copiedIds[project]);
    expect(copied.data.url).toBe("/api/assets/" + a.copiedIds[asset]);
    expect(copied.data.body).toBe(id);
    expect(a.backup.revisions[0].id).toBe(copied.id);
    const receipt = new MemoryStorage();
    for (const w of a.writes) receipt.setItem(w.key, w.value);
    expect(resolveOriginId(receipt, "https://old.example", id)).toBe(copied.id);
    expect(a.writes[0].key).toContain(copied.id);
    expect(dest.items[0].title).toBe("งานของฉัน");
  });
  it("keeps both browser drafts and makes the preferred conflict explicit", async () => {
    const e = await pack(
      empty(),
      [{ key: "av-draft:home", value: '"incoming"' }],
      "https://old.example",
    );
    const keep = await planTransfer(e, empty(), [
      { key: "av-draft:home", value: '"current"' },
    ]);
    expect(keep.writes.some((w) => w.key === "av-draft:home")).toBe(false);
    expect(JSON.parse(keep.writes[0].value).value).toBe('"incoming"');
    const replace = await planTransfer(
      e,
      empty(),
      [{ key: "av-draft:home", value: '"current"' }],
      true,
    );
    expect(replace.writes.find((w) => w.key === "av-draft:home")?.value).toBe(
      '"incoming"',
    );
    expect(JSON.parse(replace.writes[0].value).value).toBe('"current"');
  });
  it("preflights draft capacity without changing destination entries and verifies actual merged records", async () => {
    const m = new MemoryStorage();
    m.setItem("av-draft:x", "original");
    const writes = [{ key: "av-draft:y", value: "incoming" }];
    const stages = stageWrites(m, writes, "abc");
    expect(m.getItem("av-draft:y")).toBeNull();
    finishWrites(m, writes, stages);
    expect(m.getItem("av-draft:y")).toBe("incoming");
    expect(m.getItem("av-draft:x")).toBe("original");
    const bad = new MemoryStorage();
    bad.setItem = () => {
      throw Error("quota");
    };
    expect(() => stageWrites(bad, writes, "abc")).toThrow("not changed");
    expect(verifyBackup({ ...empty(), items: [row()] }, empty())).toBe(false);
    expect(
      verifyBackup(
        { ...empty(), items: [row()] },
        { ...empty(), items: [row()] },
      ),
    ).toBe(true);
  });
  it("does not copy identical records and rejects unsafe destinations/deep links", async () => {
    const e = await pack(
      { ...empty(), items: [row()] },
      [],
      "https://old.example",
    );
    expect(
      (await planTransfer(e, { ...empty(), items: [row()] }, [])).copyWorkspace,
    ).toBe(false);
    expect(safeHash("https://evil.example")).toBe("#/home");
    expect(safeHash("#/code/" + id)).toBe("#/code/" + id);
    expect(validOrigin("https://user:pass@evil.example", PRIMARY_ORIGIN)).toBe(
      PRIMARY_ORIGIN,
      resolveOriginId,
    );
    expect(validOrigin("http://example.com", PRIMARY_ORIGIN)).toBe(
      PRIMARY_ORIGIN,
      resolveOriginId,
    );
  });
});
