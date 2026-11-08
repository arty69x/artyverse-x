import { useState } from "react";
import {
  BarChart3,
  BookOpen,
  Plus,
  ArrowUpRight,
  Download,
  Search,
  ShoppingBag,
  ShieldCheck,
  Copy,
  Trash2,
  MessageSquare,
  Code2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useStore, useT, download } from "../core/store";
import { PageHead, Button, Modal, Empty, SearchBox } from "../components/UI";
import { defaultNodes, type Item } from "../../shared/schema";
import { routeForItem } from "../../shared/routes";
import type { Navigate } from "../App";
export function Analytics() {
  const s = useStore(),
    t = useT(),
    items = s.scopedItems.filter((i) => !i.deletedAt),
    sessions = items.filter(
      (i) =>
        i.kind === "session" &&
        ["copilot", "practice"].includes(i.data.sessionType),
    ),
    runs = items.filter((i) => i.kind === "agent-run"),
    counts = Object.entries(
      items.reduce(
        (a, i) => {
          a[i.kind] = (a[i.kind] || 0) + 1;
          return a;
        },
        {} as Record<string, number>,
      ),
    ).sort((a, b) => b[1] - a[1]),
    days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - 6 + i);
      const key = d.toLocaleDateString(s.locale);
      return {
        label: d.toLocaleDateString(s.locale, { weekday: "short" }),
        key,
        count: items.filter(
          (x) => new Date(x.createdAt).toLocaleDateString(s.locale) === key,
        ).length,
      };
    }),
    max = Math.max(1, ...days.map((d) => d.count));
  return (
    <div className="page v3-analytics">
      <PageHead
        index="ACTIVITY / ACTUAL SAVED RECORDS"
        title={t("A clearer view of your work", "มองเห็นการสร้างสรรค์ของคุณ")}
        description={t(
          "An honest picture, drawn from saved work in the active project.",
          "ภาพรวมจากงานที่บันทึกจริงในโปรเจกต์ปัจจุบัน",
        )}
        action={
          <Button
            onClick={() =>
              download(
                "artyverse-activity.json",
                JSON.stringify(
                  {
                    scope: s.activeProject || "all",
                    counts,
                    days,
                    interviewSessions: sessions.length,
                    agentRuns: runs.length,
                  },
                  null,
                  2,
                ),
              )
            }
          >
            <Download size={16} />
            {t("Export activity", "ส่งออกข้อมูล")}
          </Button>
        }
      />
      <div className="v3-stat-grid">
        {[
          [
            t("Saved work", "งานที่บันทึก"),
            items.filter((i) => i.kind !== "project").length,
          ],
          [t("Interview sessions", "การสัมภาษณ์"), sessions.length],
          [t("Agent executions", "การทำงานเอเจนต์"), runs.length],
          [
            t("Question bank", "คลังคำถาม"),
            items.filter(
              (i) => i.kind === "note" && i.data.noteType === "question",
            ).length,
          ],
        ].map(([name, value]) => (
          <article key={name}>
            <span>{name}</span>
            <strong>{value}</strong>
            <small>{t("Actual saved records", "ข้อมูลที่บันทึกจริง")}</small>
          </article>
        ))}
      </div>
      <div className="v3-analytics-grid">
        <section className="control-surface">
          <span className="eyebrow">01 / LAST SEVEN DAYS</span>
          <h2>{t("Your creative rhythm", "จังหวะการสร้างงานของคุณ")}</h2>
          <div
            className="v3-activity-chart"
            role="img"
            aria-label={days.map((d) => d.key + ": " + d.count).join(", ")}
          >
            {days.map((d) => (
              <div key={d.key}>
                <strong>{d.count}</strong>
                <i style={{ height: 8 + (d.count / max) * 130 + "px" }} />
                <span>{d.label}</span>
              </div>
            ))}
          </div>
          <p className="v3-mini-note">
            {t(
              "Counts item creation dates, not time spent or unique daily users.",
              "นับจากวันที่สร้างรายการ ไม่ใช่เวลาที่ใช้งานหรือจำนวนผู้ใช้รายวัน",
            )}
          </p>
        </section>
        <section className="control-surface">
          <span className="eyebrow">02 / BY TYPE</span>
          <h2>{t("Many ways to make", "หลากหลายวิธีสร้างสรรค์")}</h2>
          {counts.length ? (
            counts.map(([kind, count]) => (
              <div className="setting-row" key={kind}>
                <span>{kind}</span>
                <strong>{count}</strong>
              </div>
            ))
          ) : (
            <Empty
              title={t("Your story starts here", "เริ่มบันทึกเรื่องราวของคุณ")}
              description={t(
                "Create and save work to see actual activity.",
                "สร้างและบันทึกงานเพื่อดูข้อมูลจริง",
              )}
            />
          )}
        </section>
      </div>
      <div className="v3-honesty">
        <ShieldCheck size={18} />
        <span>
          {t(
            "Response quality scores and topic proficiency are unavailable until a defined evaluation engine is connected.",
            "คะแนนคุณภาพคำตอบและความเชี่ยวชาญยังไม่แสดง จนกว่าจะมีเกณฑ์และระบบประเมินจริง",
          )}
        </span>
      </div>
    </div>
  );
}
export function QuestionBank({ go, id }: { go: Navigate; id?: string }) {
  const s = useStore(),
    t = useT(),
    [q, setQ] = useState(""),
    [editing, setEditing] = useState<Item | null>(
      () =>
        s.items.find(
          (i) => i.id === id && i.data.noteType === "question" && !i.deletedAt,
        ) || null,
    ),
    [creating, setCreating] = useState(false),
    [question, setQuestion] = useState<string>(
      () => s.items.find((i) => i.id === id)?.data.source || "",
    ),
    [answer, setAnswer] = useState<string>(
      () => s.items.find((i) => i.id === id)?.data.body || "",
    ),
    [error, setError] = useState("");
  const items = s.scopedItems.filter(
    (i) =>
      i.kind === "note" &&
      i.data.noteType === "question" &&
      !i.deletedAt &&
      (i.title + " " + i.data.source + " " + i.data.body)
        .toLowerCase()
        .includes(q.toLowerCase()),
  );
  async function save() {
    try {
      const data = {
        ...editing?.data,
        noteType: "question",
        source: question,
        body: answer,
        tags: editing?.data.tags || "",
      };
      if (editing)
        await s.save({
          ...editing,
          title: question.slice(0, 160) || editing.title,
          data,
        });
      else await s.create("note", question.slice(0, 160), data);
      setCreating(false);
      setEditing(null);
    } catch (e) {
      setError(String(e));
    }
  }
  return (
    <div className="page">
      <PageHead
        index="YOUR EVIDENCE / YOUR WORDS"
        title={t("Question Bank", "คลังคำถามของคุณ")}
        description={t(
          "Keep the questions that matter and the answers you want to improve.",
          "เก็บคำถามสำคัญ พร้อมคำตอบที่อยากกลับมาปรับปรุง",
        )}
        action={
          <Button
            variant="primary"
            onClick={() => {
              setQuestion("");
              setAnswer("");
              setCreating(true);
            }}
          >
            <Plus size={16} />
            {t("Add question", "เพิ่มคำถาม")}
          </Button>
        }
      />
      <div className="filter-bar">
        <SearchBox
          value={q}
          onChange={setQ}
          placeholder={t("Search saved questions…", "ค้นหาคำถามที่บันทึก…")}
        />
        <span className="muted">
          {items.length} {t("saved questions", "คำถามที่บันทึก")}
        </span>
      </div>
      {items.length ? (
        <div className="v3-question-grid">
          {items.map((i) => (
            <article className="control-surface" key={i.id}>
              <span className="eyebrow">{i.data.tags || "YOUR QUESTION"}</span>
              <h2>{i.data.source || i.title}</h2>
              <p>
                {String(i.data.body || "").slice(0, 300) ||
                  t(
                    "No answer yet. Add your own experience.",
                    "ยังไม่มีคำตอบ เพิ่มประสบการณ์จริงของคุณ",
                  )}
              </p>
              <div className="button-row">
                <Button
                  onClick={() => {
                    setQuestion(i.data.source || i.title);
                    setAnswer(i.data.body || "");
                    setEditing(i);
                  }}
                >
                  {t("Edit answer", "แก้ไขคำตอบ")}
                </Button>
                <Button
                  onClick={() => {
                    localStorage.setItem(
                      "av-draft:v3:practice:new:question",
                      JSON.stringify(i.data.source || i.title),
                    );
                    go("practice");
                  }}
                >
                  {t("Practice", "ฝึกตอบ")}
                  <ArrowUpRight size={15} />
                </Button>
                <Button
                  title={t("Move to Trash: ", "ย้ายไปถังขยะ: ") + i.title}
                  onClick={() => void s.trash(i)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title={t("Make every question count.", "ให้ทุกคำถามมีความหมาย")}
          description={t(
            "Save a question from Copilot or add one with your own answer.",
            "บันทึกจาก Copilot หรือเพิ่มคำถามพร้อมคำตอบของคุณ",
          )}
          action={
            <Button onClick={() => go("copilot")}>
              {t("Open Copilot", "เปิด Copilot")}
              <ArrowUpRight size={16} />
            </Button>
          }
        />
      )}
      {(creating || editing) && (
        <Modal
          title={t("Your question & answer", "คำถามและคำตอบของคุณ")}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        >
          <label>
            {t("Question", "คำถาม")}
            <textarea
              aria-label={t("Question text", "ข้อความคำถาม")}
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              maxLength={16000}
            />
          </label>
          <label>
            {t("Your answer", "คำตอบของคุณ")}
            <textarea
              rows={8}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              maxLength={30000}
            />
          </label>
          {error && (
            <p className="v2-error" role="alert">
              {error}
            </p>
          )}
          <Button
            variant="primary"
            disabled={!question.trim()}
            onClick={() => void save()}
          >
            {t("Save question", "บันทึกคำถาม")}
          </Button>
        </Modal>
      )}
    </div>
  );
}
const products = [
  {
    id: "signal",
    name: "Signal / Editorial Kit",
    type: "UI Kit",
    headline: "Make room\nfor the extraordinary.",
    description: "A bold editorial composition. Native text and shape layers.",
    style: "lime",
  },
  {
    id: "orbit",
    name: "Orbit / Presentation",
    type: "Template",
    headline: "A new\nperspective.",
    description: "A quiet presentation starter with a strong point of view.",
    style: "violet",
  },
  {
    id: "launch",
    name: "Launch / Social Scene",
    type: "Template",
    headline: "Something\nis coming.",
    description: "A compact announcement composition you can make your own.",
    style: "pink",
  },
  {
    id: "brief",
    name: "Creative Brief / Prompt",
    type: "Prompt",
    headline: "A better brief.\nA clearer idea.",
    description:
      "An editable brief structure with placeholders for your real information.",
    style: "blue",
  },
];
export function Marketplace({ go }: { go: Navigate }) {
  const s = useStore(),
    t = useT(),
    [q, setQ] = useState(""),
    [filter, setFilter] = useState("All"),
    [selected, setSelected] = useState<(typeof products)[number] | null>(null),
    [busy, setBusy] = useState(false);
  const shown = products.filter(
    (p) =>
      (filter === "All" || p.type === filter) &&
      (p.name + " " + p.description).toLowerCase().includes(q.toLowerCase()),
  );
  async function use() {
    if (!selected || busy) return;
    setBusy(true);
    try {
      if (selected.type === "Prompt") {
        const i = await s.create("note", selected.name, {
          body: "# Creative brief\n\nAudience: [ใส่ข้อมูลจริง]\nGoal: [ใส่ข้อมูลจริง]\nConstraints: [ใส่ข้อมูลจริง]\nEvidence for completion: [ใส่ข้อมูลจริง]",
          source: "Original ARTYVERSE starter",
          tags: "brief",
        });
        go("research", i.id);
      } else {
        const nodes = defaultNodes(selected.headline);
        const i = await s.create("document", selected.name, {
          width: 960,
          height: 540,
          nodes,
          templateId: "market-" + selected.id,
        });
        go("create", i.id);
      }
    } catch (e) {
      s.toast(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page v3-marketplace">
      <section className="v3-market-hero">
        <span className="eyebrow">
          // ORIGINAL STARTERS FOR YOUR NEXT WORLD
        </span>
        <h1>
          Where
          <br />
          <span>ideas</span>
          <br />
          <i>
            come <b>alive.</b>
          </i>
        </h1>
        <div>
          <p>
            {t(
              "A small collection of original starters. Make something unmistakably yours.",
              "ชุดเริ่มต้นสร้างสรรค์ต้นฉบับ ที่พร้อมให้คุณนำไปสร้างผลงานในแบบตัวเอง",
            )}
          </p>
          <SearchBox
            value={q}
            onChange={setQ}
            placeholder={t(
              "Search kits, templates, prompts…",
              "ค้นหา UI kit, เทมเพลต, prompt…",
            )}
          />
        </div>
      </section>
      <div
        className="v3-market-filter"
        role="group"
        aria-label={t("Product type", "ประเภทชุดงาน")}
      >
        {["All", "UI Kit", "Template", "Prompt"].map((f) => (
          <button
            key={f}
            aria-pressed={filter === f}
            onClick={() => setFilter(f)}
          >
            {f === "All" ? t("All originals", "ทั้งหมด") : f}
          </button>
        ))}
        <span>
          {t(
            "Free local starters · no checkout",
            "ชุดเริ่มต้นฟรีในเครื่อง · ไม่มีการชำระเงิน",
          )}
        </span>
      </div>
      <div className="v3-market-grid">
        {shown.map((p) => (
          <article key={p.id}>
            <button
              className={"v3-market-cover " + p.style}
              onClick={() => setSelected(p)}
            >
              <span>ARTYVERSE ORIGINAL / {p.type}</span>
              <strong>{p.headline}</strong>
              <ArrowUpRight size={25} />
            </button>
            <div>
              <span className="eyebrow">{p.type} / ORIGINAL STARTER</span>
              <h2>{p.name}</h2>
              <p>{p.description}</p>
              <Button onClick={() => setSelected(p)}>
                {t("Preview starter", "ดูตัวอย่าง")}
                <ArrowUpRight size={16} />
              </Button>
            </div>
          </article>
        ))}
      </div>
      {!shown.length && (
        <Empty
          title={t("No matching starters", "ไม่พบชุดงานที่ค้นหา")}
          description={t(
            "Try another search or clear the filters.",
            "ลองคำค้นอื่นหรือล้างตัวกรอง",
          )}
          action={
            <Button
              onClick={() => {
                setQ("");
                setFilter("All");
              }}
            >
              {t("Clear filters", "ล้างตัวกรอง")}
            </Button>
          }
        />
      )}
      <div className="v3-honesty">
        <ShieldCheck size={18} />
        <span>
          {t(
            "These are labeled original local starters. No creator accounts, orders, paid licenses or checkout service are connected.",
            "เป็นชุดเริ่มต้นต้นฉบับในเครื่อง ยังไม่มีบัญชีผู้ขาย คำสั่งซื้อ หรือบริการชำระเงินที่เชื่อมต่อ",
          )}
        </span>
      </div>
      {selected && (
        <Modal title={selected.name} onClose={() => setSelected(null)}>
          <div className={"v3-market-cover " + selected.style}>
            <strong>{selected.headline}</strong>
          </div>
          <p className="v3-license">
            {t(
              "Original ARTYVERSE starter. You may edit and export it for your own projects. No third-party marketplace asset or license is included.",
              "ชุดเริ่มต้นต้นฉบับ ARTYVERSE คุณแก้ไขและส่งออกสำหรับโปรเจกต์ของตัวเองได้ ไม่รวมสินทรัพย์หรือลิขสิทธิ์จาก marketplace ภายนอก",
            )}
          </p>
          <Button variant="primary" disabled={busy} onClick={() => void use()}>
            {t("Create editable copy", "สร้างสำเนาที่แก้ไขได้")}
            <ArrowRight size={16} />
          </Button>
        </Modal>
      )}
    </div>
  );
}
