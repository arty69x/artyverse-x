import { useState } from "react";
import {
  Plus,
  ArrowUpRight,
  FolderOpen,
  Check,
  PenTool,
  Workflow,
  AudioLines,
  Code2,
  Orbit,
  Layers,
} from "lucide-react";
import { useStore, useT, download } from "../core/store";
import { PageHead, Button, Modal, Empty } from "../components/UI";
import type { Navigate } from "../App";
export function Projects({ go }: { go: Navigate }) {
  const s = useStore(),
    t = useT(),
    [creating, setCreating] = useState(false),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const projects = s.items.filter((i) => i.kind === "project" && !i.deletedAt);
  async function create() {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      const p = await s.create("project", title, {
        schemaVersion: 2,
        description,
        color: "#D7E317",
      });
      s.setActiveProject(p.id);
      setCreating(false);
      setTitle("");
      s.toast("Project created. New work will be linked here.");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="page v2-page">
      <PageHead
        index="YOUR MULTIVERSE / PROJECTS"
        title={t("A home for every world", "หนึ่งพื้นที่ สำหรับทุกจักรวาล")}
        description={t(
          "Keep documents, code, sounds and stories connected by project. Existing work stays exactly where you left it.",
          "เชื่อมเอกสาร โค้ด เสียง และเรื่องราวไว้ในโปรเจกต์ โดยรักษางานเดิม",
        )}
        action={
          <Button variant="primary" onClick={() => setCreating(true)}>
            <Plus size={16} />
            {t("New project", "โปรเจกต์ใหม่")}
          </Button>
        }
      />
      <div className="v2-project-grid">
        <button
          className={"v2-project-card " + (!s.activeProject ? "is-active" : "")}
          onClick={() => s.setActiveProject(null)}
        >
          <span className="v2-project-icon">
            <Orbit size={24} />
          </span>
          <h2>{t("All your worlds", "ทุกจักรวาลของคุณ")}</h2>
          <p>
            {s.items.filter((i) => !i.deletedAt && i.kind !== "project").length}{" "}
            saved items · includes legacy work
          </p>
          <span className="text-button">
            {!s.activeProject ? (
              <>
                <Check size={15} />
                Active context
              </>
            ) : (
              <>
                View all projects <ArrowUpRight size={16} />
              </>
            )}
          </span>
        </button>
        {projects.map((p) => (
          <article
            className={
              "v2-project-card " + (s.activeProject === p.id ? "is-active" : "")
            }
            key={p.id}
          >
            <span className="v2-project-icon" style={{ color: p.data.color }}>
              <FolderOpen size={24} />
            </span>
            <h2>{p.title}</h2>
            <p>
              {p.data.description ||
                "A new creative world, ready to take shape."}
            </p>
            <small>
              {
                s.items.filter((i) => !i.deletedAt && i.data.projectId === p.id)
                  .length
              }{" "}
              linked items
            </small>
            <div className="button-row">
              <Button
                onClick={() => {
                  s.setActiveProject(p.id);
                  go("library");
                }}
              >
                {t("Open project", "เปิดโปรเจกต์")}
                <ArrowUpRight size={15} />
              </Button>
              <Button
                onClick={() =>
                  download(
                    p.title + "-project.json",
                    JSON.stringify(
                      {
                        schemaVersion: 1,
                        project: p,
                        items: s.items.filter((i) => i.data.projectId === p.id),
                      },
                      null,
                      2,
                    ),
                  )
                }
              >
                Export records
              </Button>
            </div>
          </article>
        ))}
      </div>
      <section className="v2-project-launch">
        <span className="eyebrow">ONE PROJECT / MANY WAYS TO CREATE</span>
        <div className="v2-launch-grid">
          {[
            ["create", "Canvas", "Shape an idea", PenTool],
            ["code", "Code Studio", "Build and inspect", Code2],
            ["sound", "Sound Lab", "Compose a signal", AudioLines],
            ["dynamics", "Dynamics", "Explore physical motion", Orbit],
            ["automate", "Node Studio", "Connect your process", Workflow],
            ["story", "Story Studio", "Give your work a narrative", Layers],
          ].map(([r, name, desc, Icon]: any) => (
            <button key={r} onClick={() => go(r)}>
              <Icon size={22} />
              <span>
                {name}
                <small>{desc}</small>
              </span>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      </section>
      {creating && (
        <Modal
          title={t("Create a project", "สร้างโปรเจกต์")}
          onClose={() => setCreating(false)}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void create();
            }}
          >
            <label>
              {t("Project name", "ชื่อโปรเจกต์")}
              <input
                autoFocus
                required
                maxLength={180}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              {t("Purpose / brief", "เป้าหมายหรือโจทย์")}
              <textarea
                rows={4}
                maxLength={10000}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            {error && (
              <p className="v2-error" role="alert">
                {error}
              </p>
            )}
            <Button
              type="submit"
              variant="primary"
              disabled={busy || !title.trim()}
            >
              Create project
            </Button>
          </form>
        </Modal>
      )}
    </div>
  );
}
