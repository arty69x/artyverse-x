import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Coins,
  Database,
  Activity,
  Download,
  RotateCcw,
  CheckCircle2,
  Link2,
  AlertCircle,
} from "lucide-react";
import { PageHead, Button } from "../components/UI";
import { useStore, request, download } from "../core/store";
import { ToolNote, ErrorNotice } from "./shared";
export function SystemHub() {
  const s = useStore(),
    [status, setStatus] = useState<any>(null),
    [agent, setAgent] = useState<any>(null),
    [error, setError] = useState("");
  async function load() {
    try {
      const [a, b] = await Promise.all([
        request("/status"),
        request("/agent/status"),
      ]);
      setStatus(a);
      setAgent(b);
      setError("");
    } catch (e) {
      setError(String(e));
    }
  }
  useEffect(() => {
    void load();
  }, []);
  const runs = s.items.filter((i) => i.kind === "agent-run" && !i.deletedAt),
    priced = runs.filter((i) => typeof i.data.costUsd === "number"),
    unknown = runs.filter((i) => i.data.costUsd === null),
    cost = priced.reduce((n, i) => n + i.data.costUsd, 0),
    cache = runs.filter((i) => i.data.cached),
    fallback = runs.filter((i) => i.data.provenance === "local-fallback");
  return (
    <div className="page v2-page">
      <PageHead
        index="TRANSPARENCY / EVIDENCE / COST"
        title="System overview"
        description="What is real, what is connected, what it costs, and where your work lives. No readiness score is invented."
        action={
          <Button onClick={() => void load()}>
            <RotateCcw size={15} />
            Refresh status
          </Button>
        }
      />
      <ErrorNotice message={error} />
      <div className="v2-system-metrics">
        <article>
          <Activity size={20} />
          <strong>{runs.length}</strong>
          <span>Recorded agent executions</span>
        </article>
        <article>
          <Coins size={20} />
          <strong>${cost.toFixed(6)}</strong>
          <span>Known recorded cost · {unknown.length} unknown</span>
        </article>
        <article>
          <Link2 size={20} />
          <strong>{cache.length}</strong>
          <span>Provider calls avoided by cache</span>
        </article>
        <article>
          <ShieldCheck size={20} />
          <strong>{fallback.length}</strong>
          <span>Clearly labeled local fallbacks</span>
        </article>
      </div>
      <div className="v2-system-grid">
        <section className="control-surface">
          <span className="eyebrow">CAPABILITY CONTRACT</span>
          <h2>Built to tell you the truth.</h2>
          {[
            ["Projects / Library", "Local SQLite records with stable IDs"],
            [
              "Canvas / Research / Voice / Live",
              "Local working tools; browser capabilities apply",
            ],
            ["Node Studio", "Editable local DAG with validation and artifacts"],
            [
              "Code Studio",
              "Sandbox preview, visual CSS inspector, deterministic repair review",
            ],
            ["Sound Lab", "Real Web Audio synthesis and PCM WAV rendering"],
            [
              "Dynamics",
              "Local SVG physics, manual gestures; sensor input only when events arrive",
            ],
            [
              "Story Studio",
              "Linked documents, scripts, scene timing and compatible motion presets",
            ],
            [
              "AI provider",
              agent?.provider === "configured"
                ? `Configured: ${agent.model} · live-provider verification is separate`
                : "Unavailable · local tools and explicit local fallback available",
            ],
            [
              "Cloud / multi-user collaboration",
              "Unavailable · no account or shared sync service",
            ],
            [
              "Background schedules / external actions",
              "Unavailable · local graph runs while open",
            ],
          ].map(([a, b]) => (
            <div className="setting-row" key={a}>
              <span>
                {a}
                <small>{b}</small>
              </span>
              {b.includes("Unavailable") || b.includes("no account") ? (
                <AlertCircle size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
            </div>
          ))}
        </section>
        <div className="flex flex-col gap-5">
          <section className="control-surface">
            <span className="eyebrow">STORAGE / RECOVERY</span>
            <h2>Your work, saved locally.</h2>
            <p>
              {status
                ? `${status.storage} · ${(status.bytes / 1024).toFixed(1)} KB database (media/WAL excluded)`
                : "Checking actual local storage…"}
            </p>
            <p>
              {s.items.filter((i) => !i.deletedAt).length} active records ·{" "}
              {s.items.filter((i) => i.deletedAt).length} in Trash
            </p>
            <Button
              onClick={async () => {
                try {
                  download(
                    "artyverse-v2-backup.json",
                    JSON.stringify(await request("/backup"), null, 2),
                  );
                } catch (e) {
                  setError(String(e));
                }
              }}
            >
              <Download size={15} />
              Download persistent backup
            </Button>
            <p className="v2-caption">
              Save browser drafts first. Backups include persistent items,
              revisions and media; not unsaved browser drafts or server secrets.
            </p>
          </section>
          <section className="control-surface">
            <span className="eyebrow">AI CONNECTION / SERVER ONLY</span>
            <h2>One secure boundary.</h2>
            <p>
              Keys never enter the interface, presets, exports or the client
              bundle. Configure the server environment for provider access.
              Pricing remains unknown unless actual rates are supplied.
            </p>
            <code className="v2-env-help">
              ARTYVERSE_AI_KEY
              <br />
              ARTYVERSE_AI_MODEL
              <br />
              ARTYVERSE_AI_INPUT_USD_PER_MILLION
              <br />
              ARTYVERSE_AI_OUTPUT_USD_PER_MILLION
            </code>
            <ToolNote>
              This release is a personal local workspace. Public multi-user
              deployment requires identity, ownership enforcement,
              infrastructure and its own verification.
            </ToolNote>
          </section>
        </div>
      </div>
    </div>
  );
}
