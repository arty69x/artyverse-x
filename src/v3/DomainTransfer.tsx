import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Download,
  Upload,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "../components/UI";
import { useStore, useT, download, request } from "../core/store";
import { mainOrigin, legacyOrigin, legacyHost } from "../hosted/domains";
import { safeHash, primaryLink } from "../../shared/origins";
import {
  pack,
  unpack,
  backupSchema,
  collectBrowser,
  planTransfer,
  backupSignature,
  stageWrites,
  finishWrites,
  verifyBackup,
  portableKey,
  type TransferEnvelope,
  type TransferPlan,
} from "../../shared/transfer";
import "./transfer.css";
export default function DomainTransfer({
  sourceHash,
}: {
  sourceHash?: string;
}) {
  const s = useStore(),
    t = useT(),
    sourceMode =
      legacyHost &&
      new URLSearchParams(location.search).get("recovery") !== "1",
    returnHash = safeHash(
      sourceHash || new URLSearchParams(location.search).get("next"),
    );
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [exported, setExported] = useState(false),
    [file, setFile] = useState<TransferEnvelope | null>(null),
    [plan, setPlan] = useState<TransferPlan | null>(null),
    [preferIncoming, setPreferIncoming] = useState(false),
    [rollback, setRollback] = useState(""),
    [result, setResult] = useState<{
      records: number;
      media: number;
      revisions: number;
      drafts: number;
      hash: string;
    } | null>(null),
    [returnTo, setReturnTo] = useState(returnHash),
    [recovery, setRecovery] = useState<
      { storageKey: string; key: string; value: string; sourceOrigin: string }[]
    >([]);
  const [confirmedMain, setConfirmedMain] = useState(false);
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
    },
    [],
  );
  function loadRecovery() {
    const a = [];
    for (let i = 0; i < localStorage.length; i++) {
      const storageKey = localStorage.key(i)!;
      if (!storageKey.startsWith("av-origin-recovery:")) continue;
      try {
        const r = JSON.parse(localStorage.getItem(storageKey)!);
        if (portableKey(r.key) && typeof r.value === "string")
          a.push({ storageKey, ...r });
      } catch {}
    }
    setRecovery(a);
  }
  useEffect(() => {
    try {
      loadRecovery();
    } catch {}
  }, []);
  async function exportWorkspace(isRollback = false) {
    setBusy(true);
    setError("");
    try {
      const backup = backupSchema.parse(await request("/backup")),
        browser = collectBrowser(localStorage),
        data = await pack(backup, browser, location.origin, returnHash);
      const serialized = JSON.stringify(data);
      if (new Blob([serialized]).size > 100 * 1024 * 1024)
        throw Error(
          t(
            "Workspace exceeds the 100 MB transfer limit. Export large artifacts separately; the original workspace is unchanged.",
            "พื้นที่ทำงานใหญ่เกินขีดจำกัดไฟล์ย้าย 100 MB กรุณาส่งออกชิ้นงานขนาดใหญ่แยก ข้อมูลเดิมยังอยู่",
          ),
        );
      download(
        isRollback
          ? "artyverse-before-move.json"
          : "artyverse-workspace-transfer.json",
        serialized,
      );
      if (isRollback) setRollback(await backupSignature(backup, browser));
      setExported(true);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function review(next: TransferEnvelope, prefer = preferIncoming) {
    const n = ++generation.current;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const target = backupSchema.parse(await request("/backup")),
        current = collectBrowser(localStorage),
        nextPlan = await planTransfer(next, target, current, prefer);
      if (generation.current !== n) return;
      setFile(next);
      setPlan(nextPlan);
      setPreferIncoming(prefer);
      let hash = safeHash(next.payload.returnHash);
      for (const [oldId, newId] of Object.entries(nextPlan.copiedIds))
        hash = hash.replaceAll(oldId, newId);
      setReturnTo(hash);
    } catch (e) {
      setError(String(e));
      setPlan(null);
    } finally {
      if (generation.current === n) setBusy(false);
    }
  }
  async function read(input?: File) {
    if (!input) return;
    setError("");
    setPlan(null);
    setFile(null);
    if (input.size > 100 * 1024 * 1024) {
      setError(
        t("Transfer file exceeds 100 MB.", "ไฟล์ย้ายข้อมูลใหญ่เกิน 100 MB"),
      );
      return;
    }
    setBusy(true);
    try {
      const incoming = await unpack(JSON.parse(await input.text()));
      await review(incoming);
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function apply() {
    if (!file || !plan || rollback !== plan.destinationSignature || busy)
      return;
    setBusy(true);
    setError("");
    let staged: string[] = [],
      merged = false;
    try {
      const latest = backupSchema.parse(await request("/backup"));
      if (
        (await backupSignature(latest, collectBrowser(localStorage))) !==
        plan.destinationSignature
      )
        throw Error(
          t(
            "This workspace changed after review. Review the file again before applying.",
            "ข้อมูลปลายทางเปลี่ยนหลังตรวจ กรุณาตรวจไฟล์อีกครั้งก่อนใช้",
          ),
        );
      staged = stageWrites(localStorage, plan.writes, file.sha256);
      await request("/restore", plan.backup);
      merged = true;
      const saved = backupSchema.parse(await request("/backup"));
      if (!verifyBackup(plan.backup, saved))
        throw Error(
          t(
            "Record verification differs. Keep both backup files and review again.",
            "ผลตรวจข้อมูลไม่ตรง เก็บไฟล์สำรองทั้งสองไว้แล้วตรวจอีกครั้ง",
          ),
        );
      finishWrites(localStorage, plan.writes, staged);
      if (!plan.writes.every((w) => localStorage.getItem(w.key) === w.value))
        throw Error("Draft verification failed");
      await s.refresh();
      setResult({
        records: plan.backup.items.length,
        media: plan.backup.assets.length,
        revisions: plan.backup.revisions.length,
        drafts: plan.writes.length,
        hash: file.sha256,
      });
      loadRecovery();
    } catch (e) {
      if (!merged) for (const key of staged) localStorage.removeItem(key);
      setError(
        (merged
          ? t(
              "Records are preserved; browser drafts may still be pending. Keep the transfer file and review again. ",
              "ข้อมูลที่บันทึกยังอยู่ แต่อาจย้าย draft ไม่ครบ เก็บไฟล์ย้ายข้อมูลแล้วตรวจอีกครั้ง ",
            )
          : "") + String(e),
      );
      setPlan(null);
    } finally {
      setBusy(false);
    }
  }
  function recover(entry: (typeof recovery)[number]) {
    try {
      const current = localStorage.getItem(entry.key);
      if (current !== null && current !== entry.value) {
        const rollbackKey = "av-origin-recovery:manual:" + crypto.randomUUID();
        localStorage.setItem(
          rollbackKey,
          JSON.stringify({
            schemaVersion: 1,
            key: entry.key,
            value: current,
            sourceOrigin: location.origin,
          }),
        );
      }
      localStorage.setItem(entry.key, entry.value);
      loadRecovery();
      s.toast(
        t(
          "Draft restored. Reopen its workspace to load it.",
          "คืน draft แล้ว เปิดพื้นที่ทำงานนั้นใหม่เพื่อโหลดข้อมูล",
        ),
      );
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <div className="page transfer-page">
      <header className="transfer-head">
        <span className="eyebrow">// ONE CREATIVE HOME</span>
        <h1>
          {t("Your work.", "งานของคุณ")}
          <br />
          <em>{t("One main address.", "ที่อยู่หลักเดียว")}</em>
        </h1>
        <p>
          {t("ARTYVERSE X is moving to", "ARTYVERSE X ใช้โดเมนหลักที่")}{" "}
          <a href={mainOrigin}>{new URL(mainOrigin).host}</a>
        </p>
        <span className="transfer-origin">
          {t("This browser workspace", "ข้อมูลในเบราว์เซอร์ที่อยู่นี้")}:{" "}
          {location.origin}
        </span>
      </header>
      <div className="transfer-principle">
        <ShieldCheck size={20} />
        <p>
          {t(
            "Work stays separate at each address. Move saved work, media, revisions and browser drafts with a reviewed transfer file. The source stays intact.",
            "แต่ละโดเมนเก็บงานแยกกัน ใช้ไฟล์ย้ายข้อมูลเพื่อนำงาน สื่อ ประวัติ และ draft มารวม โดยข้อมูลต้นทางยังอยู่",
          )}
        </p>
      </div>
      <section className="transfer-step">
        <span>01 / {t("SAVE A TRANSFER FILE", "เก็บไฟล์ย้ายข้อมูล")}</span>
        <h2>
          {sourceMode
            ? t("Bring everything with you.", "นำงานติดตัวไปด้วย")
            : t("Keep a recovery point.", "เก็บจุดกู้คืนไว้ก่อน")}
        </h2>
        <p>
          {t(
            "Saved projects, deleted items, media and revisions, plus app drafts and preferences. Unrelated browser keys are excluded.",
            "รวมโปรเจกต์ งานในถังขยะ สื่อ ประวัติ draft และการตั้งค่าแอป ไม่รวม key อื่นที่ไม่ใช่ข้อมูลพื้นที่ทำงาน",
          )}
        </p>
        <Button
          disabled={busy}
          onClick={() => void exportWorkspace(!sourceMode)}
        >
          <Download size={17} />
          {t("Download transfer file", "ดาวน์โหลดไฟล์ย้ายข้อมูล")}
        </Button>
        {exported && (
          <p role="status" className="transfer-ok">
            {t(
              "File prepared for download. Keep it until the destination is verified.",
              "เตรียมไฟล์ให้ดาวน์โหลดแล้ว เก็บไว้จนกว่าจะตรวจปลายทางสำเร็จ",
            )}
          </p>
        )}
        {sourceMode && (
          <a
            className="button primary"
            href={
              mainOrigin +
              "/?from=legacy&next=" +
              encodeURIComponent(returnHash) +
              "#/transfer"
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("Open main site to import", "เปิดเว็บหลักเพื่อนำเข้า")}
            <ArrowUpRight size={17} />
          </a>
        )}
      </section>
      {sourceMode && (
        <section className="transfer-step">
          <span>
            02 /{" "}
            {t("AFTER YOU CHECK THE MAIN SITE", "เมื่อเช็กงานบนเว็บหลักแล้ว")}
          </span>
          <h2>
            {t("Use the main address from now on.", "ใช้โดเมนหลักต่อจากนี้")}
          </h2>
          <label className="transfer-choice">
            <input
              type="checkbox"
              checked={confirmedMain}
              onChange={(e) => setConfirmedMain(e.target.checked)}
            />
            {t(
              "I imported and checked my work at the main site.",
              "ฉันนำเข้าและตรวจงานที่เว็บหลักแล้ว",
            )}
          </label>
          <Button
            variant="primary"
            disabled={!confirmedMain || busy}
            onClick={() => {
              try {
                localStorage.setItem("av-domain-forward", "true");
                location.replace(
                  primaryLink(mainOrigin, returnHash, legacyHost),
                );
              } catch (e) {
                setError(String(e));
              }
            }}
          >
            {t("Always open main site", "เปิดเว็บหลักเสมอ")}
            <ArrowRight size={16} />
          </Button>
          <p>
            {t(
              "You can still recover old data with the recovery link below. Nothing at this address is deleted.",
              "ยังกลับมากู้คืนข้อมูลเดิมผ่านลิงก์ด้านล่างได้ ไม่มีการล้างข้อมูลที่โดเมนนี้",
            )}
          </p>
        </section>
      )}
      {!sourceMode && (
        <section className="transfer-step">
          <span>02 / {t("REVIEW BEFORE APPLY", "ตรวจสอบก่อนใช้")}</span>
          <h2>
            {t(
              "Bring your old workspace here.",
              "นำพื้นที่ทำงานเดิมมารวมที่นี่",
            )}
          </h2>
          <p>
            {t(
              "Choose the transfer file downloaded from the other address. The file is validated before any record changes.",
              "เลือกไฟล์ย้ายข้อมูลจากอีกโดเมน ระบบจะตรวจรูปแบบและ checksum ก่อนเปลี่ยนข้อมูล",
            )}
          </p>
          <label className="button transfer-file">
            <Upload size={17} />
            {t("Choose transfer file", "เลือกไฟล์ย้ายข้อมูล")}
            <input
              type="file"
              accept=".json,application/json"
              disabled={busy}
              onChange={(e) => {
                void read(e.target.files?.[0]);
                e.target.value = "";
              }}
            />
          </label>
          <a
            href={legacyOrigin + "/?recovery=1#/transfer"}
            target="_blank"
            rel="noopener noreferrer"
            className="transfer-link"
          >
            {t(
              "Return to old address to export or recover",
              "กลับโดเมนเก่าเพื่อสำรองหรือกู้คืน",
            )}{" "}
            ↗
          </a>
          {file && !plan && !result && (
            <Button disabled={busy} onClick={() => void review(file)}>
              <RotateCcw size={16} />
              {t("Review again", "ตรวจอีกครั้ง")}
            </Button>
          )}
          {file && plan && !result && (
            <div className="transfer-review">
              <h3>
                {t(
                  "Verified file structure & checksum",
                  "ตรวจรูปแบบและ checksum แล้ว",
                )}
              </h3>
              <p>
                {file.payload.sourceOrigin} → {location.origin}
              </p>
              <dl>
                {[
                  [
                    t("Saved records", "งานที่บันทึก"),
                    file.payload.backup.items.length,
                  ],
                  [t("Media", "สื่อ"), file.payload.backup.assets.length],
                  [
                    t("Revisions", "ประวัติ"),
                    file.payload.backup.revisions.length,
                  ],
                  [
                    t("Browser entries", "draft และการตั้งค่า"),
                    file.payload.browser.length,
                  ],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
              <p>
                {plan.copyWorkspace
                  ? t(
                      "Different records share IDs. The source workspace will be imported as linked copies with new IDs; destination records stay unchanged.",
                      "พบ ID ซ้ำแต่ข้อมูลต่างกัน จะนำพื้นที่ต้นทางมาเป็นสำเนาพร้อม ID ใหม่และปรับความสัมพันธ์ที่รองรับ งานปลายทางเดิมไม่ถูกทับ",
                    )
                  : t(
                      "Matching IDs with identical contents are reused. Missing records and media are merged.",
                      "รายการ ID และเนื้อหาเหมือนกันใช้ร่วมกัน เติมเฉพาะรายการและสื่อที่ยังไม่มี",
                    )}
              </p>
              <p>
                {plan.recordConflicts}{" "}
                {t("record/history conflicts", "รายการงาน/ประวัติที่ขัดกัน")} ·{" "}
                {plan.assetConflicts} {t("media conflicts", "สื่อที่ขัดกัน")} ·{" "}
                {plan.draftConflicts}{" "}
                {t("browser conflicts", "รายการ draft/การตั้งค่าที่ขัดกัน")}
              </p>
              <label className="transfer-choice">
                <input
                  type="checkbox"
                  checked={preferIncoming}
                  disabled={busy}
                  onChange={(e) => void review(file, e.target.checked)}
                />
                {t(
                  "Use source drafts/preferences when they differ (preserve destination copies for recovery).",
                  "ใช้ draft/การตั้งค่าจากต้นทางเมื่อขัดกัน และเก็บของปลายทางไว้กู้คืน",
                )}
              </label>
              <p>
                {t(
                  "With this option off, current drafts stay active and incoming conflicts are kept as recovery copies below.",
                  "หากไม่เลือก จะใช้ draft เดิมที่ปลายทาง และเก็บของต้นทางที่ขัดกันไว้ในส่วนกู้คืนด้านล่าง",
                )}
              </p>
              <div className="button-row">
                <Button
                  disabled={busy}
                  onClick={() => void exportWorkspace(true)}
                >
                  <Download size={16} />
                  {t("Backup this workspace first", "สำรองปลายทางก่อน")}
                </Button>
                <Button
                  variant="primary"
                  disabled={busy || rollback !== plan.destinationSignature}
                  onClick={() => void apply()}
                >
                  {t("Merge and verify transfer", "รวมและตรวจผลการย้าย")}
                  <ArrowRight size={16} />
                </Button>
              </div>
              {rollback !== plan.destinationSignature && (
                <p>
                  {t(
                    "Download the destination backup to enable merging.",
                    "ดาวน์โหลดไฟล์สำรองปลายทางก่อน จึงจะรวมข้อมูลได้",
                  )}
                </p>
              )}
            </div>
          )}
        </section>
      )}
      {busy && (
        <p role="status">
          {t(
            "Working with actual workspace data…",
            "กำลังจัดการข้อมูลพื้นที่ทำงานจริง…",
          )}
        </p>
      )}
      {error && (
        <p className="transfer-error" role="alert">
          {error}
        </p>
      )}
      {result && (
        <section className="transfer-success" role="status">
          <CheckCircle2 size={28} />
          <h2>
            {t(
              "Transfer verified in this workspace.",
              "ตรวจผลการย้ายในพื้นที่นี้สำเร็จ",
            )}
          </h2>
          <p>
            {result.records} {t("records", "งาน")} · {result.media}{" "}
            {t("media", "สื่อ")} · {result.revisions}{" "}
            {t("revisions", "ประวัติ")} · {result.drafts}{" "}
            {t("browser writes verified", "รายการ browser ที่ตรวจแล้ว")}
          </p>
          <p>
            {t(
              "The old address was not cleared. Keep both backup files. Continue to reload your imported settings and selection.",
              "ไม่มีการล้างโดเมนเก่า เก็บไฟล์สำรองทั้งสองไว้ กดไปต่อเพื่อโหลดการตั้งค่าและงานที่เลือก",
            )}
          </p>
          <a
            className="button primary"
            href={location.origin + "/" + returnTo}
            onClick={(e) => {
              e.preventDefault();
              location.assign(location.origin + "/" + returnTo);
              location.reload();
            }}
          >
            {t("Continue to workspace", "ไปยังพื้นที่ทำงาน")}
            <ArrowRight size={16} />
          </a>
        </section>
      )}
      {recovery.length > 0 && (
        <section className="transfer-step">
          <span>
            03 / {t("PRESERVED BROWSER CONFLICTS", "สำเนาที่เก็บไว้กู้คืน")}
          </span>
          <h2>{t("Both drafts are kept.", "เก็บ draft ทั้งสองฝั่งไว้")}</h2>
          <p>
            {t(
              "Inspect a saved conflict before choosing to make it active. Saved project records are not overwritten here.",
              "ตรวจสำเนาที่ขัดกันก่อนเลือกใช้งาน ไม่ทับเอกสารโปรเจกต์ที่บันทึกจากส่วนนี้",
            )}
          </p>
          {recovery.map((r) => (
            <details key={r.storageKey}>
              <summary>{r.key}</summary>
              <p>{r.sourceOrigin}</p>
              <textarea
                aria-label={t(
                  "Preserved browser entry",
                  "รายการ browser ที่เก็บไว้",
                )}
                readOnly
                value={r.value}
              />
              <Button onClick={() => recover(r)}>
                {t("Use this preserved draft", "ใช้สำเนาที่เก็บไว้นี้")}
              </Button>
              <Button
                onClick={() =>
                  download(
                    "artyverse-preserved-draft.json",
                    JSON.stringify(r, null, 2),
                  )
                }
              >
                {t("Download entry", "ดาวน์โหลดรายการ")}
              </Button>
            </details>
          ))}
        </section>
      )}
      <footer className="transfer-footer">
        <a href={legacyOrigin + "/?recovery=1" + returnHash}>
          {t("Open old workspace for recovery", "เปิดพื้นที่เดิมเพื่อกู้คืน")}
        </a>
        <a href={primaryLink(mainOrigin, returnHash, legacyHost)}>
          {t("Go to main address", "ไปโดเมนหลัก")} ↗
        </a>
      </footer>
    </div>
  );
}
