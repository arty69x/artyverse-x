import { useState } from "react";
import {
  Plus,
  ArrowUpRight,
  Folder,
  Orbit,
  Search,
  LayoutGrid,
  List,
  MoreHorizontal,
  Copy,
  Pencil,
  Trash2,
  Download,
  RotateCcw,
  ArrowLeft,
  Code2,
  PenTool,
  AudioLines,
  Layers,
} from "lucide-react";
import { useStore, useT, download } from "../core/store";
import { PageHead, Button, Modal, Empty, SearchBox } from "../components/UI";
import { routeForItem } from "../../shared/routes";
import type { Item } from "../../shared/schema";
import type { Navigate } from "../App";
export function ProjectsV3({ go, id }: { go: Navigate; id?: string }) {
  const s = useStore(),
    t = useT(),
    [query, setQuery] = useState(""),
    [list, setList] = useState(false),
    [creating, setCreating] = useState(false),
    [editing, setEditing] = useState<Item | null>(null),
    [title, setTitle] = useState(""),
    [description, setDescription] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [remove, setRemove] = useState<Item | null>(null),
    [undo, setUndo] = useState<Item | null>(null),
    projects = s.items.filter(
      (i) =>
        i.kind === "project" &&
        !i.deletedAt &&
        i.title.toLowerCase().includes(query.toLowerCase()),
    ),
    project = s.items.find(
      (i) => i.id === id && i.kind === "project" && !i.deletedAt,
    ),
    work = project
      ? s.items.filter((i) => !i.deletedAt && i.data.projectId === project.id)
      : [];
  async function submit() {
    if (!title.trim() || busy) return;
    setBusy(true);
    try {
      if (editing)
        await s.save({
          ...editing,
          title,
          data: { ...editing.data, description },
        });
      else {
        const p = await s.create("project", title, {
          schemaVersion: 2,
          description,
          color: "#B44FFF",
        });
        s.setActiveProject(p.id);
      }
      setCreating(false);
      setEditing(null);
      setTitle("");
      setDescription("");
      setError("");
    } catch (e) {
      setError(String(e));
    } finally {
      setBusy(false);
    }
  }
  async function duplicate(p: Item) {
    try {
      await s.create("project", p.title + t(" — copy", " — สำเนา"), {
        ...p.data,
      });
      s.toast(
        t(
          "Created a separate project. Linked work was not duplicated.",
          "สร้างโปรเจกต์แยกแล้ว ชิ้นงานที่เชื่อมไม่ได้ถูกทำสำเนา",
        ),
      );
    } catch (e) {
      setError(String(e));
    }
  }
  const count = (id: string) =>
    s.items.filter((i) => !i.deletedAt && i.data.projectId === id).length;
  if (id && !project)
    return (
      <div className="empty">
        <h1>{t("Project not found", "ไม่พบโปรเจกต์")}</h1>
        <Button onClick={() => go("projects")}>
          {t("All projects", "โปรเจกต์ทั้งหมด")}
        </Button>
      </div>
    );
  return (
    <div className="page v3-projects">
      <PageHead
        index="YOUR MULTIVERSE / PROJECTS"
        title={
          project
            ? project.title
            : t("A home for every world", "หนึ่งพื้นที่ สำหรับทุกจักรวาล")
        }
        description={
          project
            ? project.data.description ||
              t(
                "One project. Many ways to create.",
                "หนึ่งโปรเจกต์ หลายวิธีสร้างสรรค์",
              )
            : t(
                "Every idea deserves its own space. Keep the whole story together.",
                "ให้ทุกไอเดียมีพื้นที่ของตัวเอง และเชื่อมทุกชิ้นงานไว้ด้วยกัน",
              )
        }
        action={
          <Button
            variant="primary"
            onClick={() => {
              setCreating(true);
              setTitle("");
              setDescription("");
            }}
          >
            <Plus size={17} />
            {t("New project", "โปรเจกต์ใหม่")}
          </Button>
        }
      />
      {error && (
        <p className="v2-error" role="alert">
          {error}
        </p>
      )}
      {undo && (
        <div className="v3-undo-banner" role="status">
          <span>
            {t(
              "Project moved to Trash. Its linked work is preserved.",
              "ย้ายโปรเจกต์ไปถังขยะแล้ว ชิ้นงานที่เชื่อมยังอยู่ครบ",
            )}
          </span>
          <Button
            onClick={async () => {
              await s.trash(undo, true);
              setUndo(null);
            }}
          >
            <RotateCcw size={16} />
            {t("Undo", "ย้อนกลับ")}
          </Button>
        </div>
      )}
      {project ? (
        <>
          <Button onClick={() => go("projects")}>
            <ArrowLeft size={16} />
            {t("All projects", "ทุกโปรเจกต์")}
          </Button>
          <div className="v3-project-detail-hero">
            <Orbit size={60} />
            <div>
              <span className="eyebrow">
                PROJECT / {project.id.slice(0, 8)}
              </span>
              <h2>{project.title}</h2>
              <p>
                {work.length} {t("linked creations", "ชิ้นงานที่เชื่อมไว้")}
              </p>
            </div>
            <Button
              onClick={() => {
                s.setActiveProject(project.id);
                go("library");
              }}
            >
              {t("Open project Library", "เปิดคลังของโปรเจกต์")}
              <ArrowUpRight size={16} />
            </Button>
          </div>
          <div className="v3-project-launch">
            {[
              ["create", PenTool, "Canvas"],
              ["code", Code2, "Code Studio"],
              ["sound", AudioLines, "Sound Lab"],
              ["story", Layers, "Story Studio"],
            ].map(([r, Icon, label]: any) => (
              <button
                key={r}
                onClick={() => {
                  s.setActiveProject(project.id);
                  go(r);
                }}
              >
                <Icon size={24} />
                <span>{label}</span>
                <Plus size={16} />
              </button>
            ))}
          </div>
          {work.length ? (
            <div className="v3-project-work">
              {work.map((i) => (
                <a key={i.id} href={"#/" + routeForItem(i) + "/" + i.id}>
                  <Folder size={20} />
                  <span>
                    <strong>{i.title}</strong>
                    <small>
                      {i.kind} · {t("Revision", "รุ่นที่")} {i.revision}
                    </small>
                  </span>
                  <ArrowUpRight size={18} />
                </a>
              ))}
            </div>
          ) : (
            <Empty
              title={t(
                "A new world, ready for your first idea.",
                "จักรวาลใหม่ พร้อมรับไอเดียแรกของคุณ",
              )}
              description={t(
                "Choose a tool above to create work linked to this project.",
                "เลือกเครื่องมือด้านบนเพื่อสร้างงานที่เชื่อมกับโปรเจกต์นี้",
              )}
            />
          )}
        </>
      ) : (
        <>
          <div className="v3-project-context">
            <button
              className={!s.activeProject ? "selected" : ""}
              onClick={() => s.setActiveProject(null)}
            >
              <Orbit size={20} />
              <span>{t("All your worlds", "ทุกจักรวาลของคุณ")}</span>
              <small>
                {
                  s.items.filter((i) => !i.deletedAt && i.kind !== "project")
                    .length
                }{" "}
                {t("saved items", "รายการที่บันทึก")}
              </small>
            </button>
            {s.activeProject && (
              <span>
                {t("Active project: ", "โปรเจกต์ปัจจุบัน: ")}
                {s.items.find((i) => i.id === s.activeProject)?.title}
              </span>
            )}
          </div>
          <div className="filter-bar">
            <SearchBox
              value={query}
              onChange={setQuery}
              placeholder={t("Search projects…", "ค้นหาโปรเจกต์…")}
            />
            <span className="muted">
              {projects.length} {t("projects", "โปรเจกต์")}
            </span>
            <button
              className="icon-button"
              aria-label={t("Show grid", "แสดงการ์ด")}
              aria-pressed={!list}
              onClick={() => setList(false)}
            >
              <LayoutGrid size={19} />
            </button>
            <button
              className="icon-button"
              aria-label={t("Show list", "แสดงรายการ")}
              aria-pressed={list}
              onClick={() => setList(true)}
            >
              <List size={19} />
            </button>
          </div>
          {projects.length ? (
            <div className={list ? "v3-project-list" : "v3-project-grid"}>
              {projects.map((p, i) => (
                <article
                  key={p.id}
                  className={s.activeProject === p.id ? "selected" : ""}
                >
                  <a
                    className={"v3-project-cover cover-" + (i % 4)}
                    href={"#/projects/" + p.id}
                    onClick={() => s.setActiveProject(p.id)}
                  >
                    <span>
                      ARTYVERSE / PROJECT {String(i + 1).padStart(2, "0")}
                    </span>
                    <Orbit size={70} />
                    <strong>{p.title}</strong>
                    <ArrowUpRight size={21} />
                  </a>
                  <div className="v3-project-card-info">
                    <h2>{p.title}</h2>
                    <p>
                      {p.data.description ||
                        t(
                          "A new creative world, ready to take shape.",
                          "พื้นที่ใหม่ที่พร้อมให้ไอเดียเป็นรูปเป็นร่าง",
                        )}
                    </p>
                    <div>
                      <span>
                        {count(p.id)} {t("creations", "ชิ้นงาน")}
                      </span>
                      <small>
                        {new Date(p.updatedAt).toLocaleDateString(s.locale)}
                      </small>
                    </div>
                    <div className="v3-project-actions">
                      <Button
                        onClick={() => {
                          s.setActiveProject(p.id);
                          go("projects", p.id);
                        }}
                      >
                        {t("Open project", "เปิดโปรเจกต์")}
                        <ArrowUpRight size={15} />
                      </Button>
                      <details className="v3-action-menu" onClick={e=>{if((e.target as HTMLElement).closest("button"))e.currentTarget.removeAttribute("open")}}>
                        <summary
                          aria-label={
                            t("Project actions: ", "จัดการโปรเจกต์: ") + p.title
                          }
                        >
                          <MoreHorizontal size={20} />
                        </summary>
                        <div>
                          <button
                            onClick={() => {
                              setEditing(p);
                              setTitle(p.title);
                              setDescription(p.data.description || "");
                            }}
                          >
                            <Pencil size={15} />
                            {t("Rename / edit brief", "แก้ชื่อและโจทย์")}
                          </button>
                          <button onClick={() => void duplicate(p)}>
                            <Copy size={15} />
                            {t("Duplicate project record", "ทำสำเนาโปรเจกต์")}
                          </button>
                          <button
                            onClick={() =>
                              download(
                                p.title + "-records.json",
                                JSON.stringify(
                                  {
                                    project: p,
                                    items: s.items.filter(
                                      (i) => i.data.projectId === p.id,
                                    ),
                                  },
                                  null,
                                  2,
                                ),
                              )
                            }
                          >
                            <Download size={15} />
                            {t("Export records", "ส่งออกรายการ")}
                          </button>
                          <button onClick={() => setRemove(p)}>
                            <Trash2 size={15} />
                            {t("Move to Trash", "ย้ายไปถังขยะ")}
                          </button>
                        </div>
                      </details>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              title={
                query
                  ? t("No matching projects", "ไม่พบโปรเจกต์ที่ค้นหา")
                  : t(
                      "Make space for your next idea.",
                      "เปิดพื้นที่ให้ไอเดียถัดไปของคุณ",
                    )
              }
              description={t(
                "Projects connect your documents, code, sounds and stories.",
                "โปรเจกต์เชื่อมงานออกแบบ โค้ด เสียง และเรื่องราวของคุณ",
              )}
              action={
                <Button
                  onClick={() => {
                    setQuery("");
                    setCreating(true);
                  }}
                >
                  <Plus size={17} />
                  {t("Create a project", "สร้างโปรเจกต์")}
                </Button>
              }
            />
          )}
        </>
      )}
      {(creating || editing) && (
        <Modal
          title={
            editing
              ? t("Edit project", "แก้ไขโปรเจกต์")
              : t("Create a project", "สร้างโปรเจกต์")
          }
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void submit();
            }}
          >
            <label>
              {t("Project name", "ชื่อโปรเจกต์")}
              <input
                required
                autoFocus
                maxLength={180}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label>
              {t("Purpose / brief", "เป้าหมายหรือโจทย์")}
              <textarea
                rows={4}
                value={description}
                maxLength={10000}
                onChange={(e) => setDescription(e.target.value)}
              />
            </label>
            <Button
              type="submit"
              variant="primary"
              disabled={busy || !title.trim()}
            >
              {editing
                ? t("Save project", "บันทึกโปรเจกต์")
                : t("Create project", "สร้างโปรเจกต์")}
            </Button>
          </form>
        </Modal>
      )}
      {remove && (
        <Modal
          title={t("Move this project to Trash?", "ย้ายโปรเจกต์ไปถังขยะ?")}
          onClose={() => setRemove(null)}
        >
          <p>
            {t(
              "Linked work stays intact. You can restore the project from Library Trash.",
              "ชิ้นงานที่เชื่อมยังอยู่ครบ คุณกู้โปรเจกต์กลับได้จากถังขยะในคลังงาน",
            )}
          </p>
          <div className="modal-actions">
            <Button onClick={() => setRemove(null)}>
              {t("Cancel", "ยกเลิก")}
            </Button>
            <Button
              onClick={async () => {
                const p = remove;
                await s.trash(p);
                setUndo(p);
                setRemove(null);
                if (s.activeProject === p.id) s.setActiveProject(null);
                if (id) go("projects");
              }}
            >
              {t("Move to Trash", "ย้ายไปถังขยะ")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
