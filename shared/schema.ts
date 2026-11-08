import { copilotData } from "./interview.ts";
import { designSystem } from "./design.ts";
import { z } from "zod";
import { advancedSchemas, graphSchema } from "./v2/contracts.ts";
export const kinds = [
  "document",
  "conversation",
  "note",
  "recording",
  "session",
  "workflow",
  "preset",
  "project",
  "code",
  "composition",
  "scene",
  "story",
  "agent-run",
] as const;
export const nodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["text", "shape", "image"]),
  text: z.string().max(20000).default(""),
  x: z.number().min(-4000).max(4000),
  y: z.number().min(-4000).max(4000),
  w: z.number().min(10).max(4000),
  h: z.number().min(10).max(4000),
  color: z.string().regex(/^#[0-9a-f]{6}$/i, "Use a six-digit hex color"),
  size: z.number().min(8).max(300).default(36),
  asset: z
    .string()
    .max(2000)
    .refine(
      (s) =>
        /^\/api\/assets\/[a-z0-9-]{36}$/.test(s) ||
        /^\/assets\/[a-zA-Z0-9_.-]+$/.test(s),
      "Use a local asset reference",
    )
    .optional(),
});
export const itemInput = z
  .object({
    title: z.string().trim().min(1).max(180),
    kind: z.enum(kinds),
    data: z.record(z.string(), z.unknown()).superRefine((data, ctx) => {
      if ("nodes" in data) {
        if (!Array.isArray(data.nodes) || data.nodes.length > 300) {
          ctx.addIssue({ code: "custom", message: "Invalid document nodes" });
          return;
        }
        if (
          new Set(data.nodes.map((n: any) => n?.id)).size !== data.nodes.length
        )
          ctx.addIssue({ code: "custom", message: "Node IDs must be unique" });
        for (const n of data.nodes)
          if (!nodeSchema.safeParse(n).success)
            ctx.addIssue({ code: "custom", message: "Invalid layout node" });
      }
      if (
        "messages" in data &&
        (!Array.isArray(data.messages) ||
          data.messages.length > 5000 ||
          (data.messages as any[]).some(
            (m) =>
              !m ||
              typeof m.text !== "string" ||
              typeof m.id !== "string" ||
              !["user", "note"].includes(m.role),
          ))
      )
        ctx.addIssue({
          code: "custom",
          message: "Invalid conversation messages",
        });
      for (const key of ["body", "source", "tags", "cards", "notes", "result"])
        if (key in data && typeof data[key] !== "string")
          ctx.addIssue({
            code: "custom",
            message: "Invalid text field " + key,
          });
      for (const key of ["width", "height"])
        if (
          key in data &&
          (typeof data[key] !== "number" ||
            !Number.isFinite(data[key]) ||
            data[key] < 100 ||
            data[key] > 4000)
        )
          ctx.addIssue({
            code: "custom",
            message: "Invalid document dimension",
          });
      for (const key of ["elapsed", "duration", "size"])
        if (
          key in data &&
          (typeof data[key] !== "number" ||
            !Number.isFinite(data[key]) ||
            data[key] < 0)
        )
          ctx.addIssue({ code: "custom", message: "Invalid numeric metadata" });
      if (
        "url" in data &&
        (typeof data.url !== "string" ||
          !/^\/api\/assets\/[a-z0-9-]{36}$/.test(data.url))
      )
        ctx.addIssue({ code: "custom", message: "Invalid media reference" });
    }),
    revision: z.number().int().min(0).optional(),
  })
  .superRefine((item, ctx) => {
    if (
      item.kind === "session" &&
      ["copilot", "practice"].includes(String(item.data.sessionType)) &&
      !copilotData.safeParse(item.data).success
    )
      ctx.addIssue({ code: "custom", message: "Invalid interview session" });
    const schema = advancedSchemas[item.kind];
    if (schema && !schema.safeParse(item.data).success)
      ctx.addIssue({
        code: "custom",
        message: "Invalid " + item.kind + " data",
      });
    if (item.data.graph && !graphSchema.safeParse(item.data.graph).success)
      ctx.addIssue({ code: "custom", message: "Invalid node graph" });
    if (
      item.data.projectId !== undefined &&
      (typeof item.data.projectId !== "string" ||
        !/^[a-z0-9-]{36}$/.test(item.data.projectId))
    )
      ctx.addIssue({ code: "custom", message: "Invalid project reference" });
  });
export type LayoutNode = z.infer<typeof nodeSchema>;
export type Item = {
  id: string;
  schemaVersion: 1;
  title: string;
  kind: (typeof kinds)[number];
  data: Record<string, any>;
  revision: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};
export type Message = {
  id: string;
  role: "user" | "note";
  text: string;
  createdAt: string;
};
export const theme = {
  schemaVersion: 1,
  primitive: {
    background: designSystem.themes.dark.background,
    surface: designSystem.themes.dark.surface,
    text: designSystem.themes.dark.text,
    muted: designSystem.themes.dark.muted,
    accent: designSystem.themes.dark.accent,
    danger: designSystem.themes.dark.danger,
    border: designSystem.themes.dark.line,
    elevated: designSystem.themes.dark.surface2,
    pink: designSystem.brand.pink,
    cyan: designSystem.brand.cyan,
    violet: designSystem.brand.violet,
  },
  semantic: {
    background: "primitive.background",
    surface: "primitive.surface",
    elevated: "primitive.elevated",
    text: "primitive.text",
    muted: "primitive.muted",
    border: "primitive.border",
    focus: "primitive.accent",
    accent: "primitive.accent",
    danger: "primitive.danger",
  },
  component: {
    composer: {
      background: "semantic.surface",
      border: "semantic.border",
      radius: 12,
    },
    button: {
      background: "semantic.elevated",
      primary: "semantic.accent",
      radius: 8,
      minHeight: 44,
    },
    dialog: { background: "semantic.elevated", radius: 16 },
    sidebar: { width: 256, background: "semantic.background" },
    inspector: { width: 225, background: "semantic.surface" },
  },
  space: [4, 8, 12, 16, 24, 32, 48, 64, 96],
  radius: [4, 8, 12, 16, 24],
  duration: { micro: 120, panel: 220, scene: 480, ambient: 6000 },
  font: {
    display: "Syne Variable",
    body: "DM Sans",
    thai: "IBM Plex Sans Thai",
  },
};
export const uid = () => crypto.randomUUID();
export function defaultNodes(title = "Your next big idea"): LayoutNode[] {
  return [
    {
      id: uid(),
      type: "shape",
      text: "",
      x: 0,
      y: 0,
      w: 960,
      h: 540,
      color: "#11131A",
      size: 36,
    },
    {
      id: uid(),
      type: "text",
      text: "ARTYVERSE X  /  CREATIVE STUDIO",
      x: 64,
      y: 58,
      w: 800,
      h: 30,
      color: "#CCFF00",
      size: 16,
    },
    {
      id: uid(),
      type: "text",
      text: title,
      x: 64,
      y: 170,
      w: 810,
      h: 160,
      color: "#F0F0F8",
      size: 64,
    },
    {
      id: uid(),
      type: "text",
      text: "Give your ideas a place to become.",
      x: 64,
      y: 408,
      w: 800,
      h: 50,
      color: "#A3A3B6",
      size: 24,
    },
  ];
}
export function validateWorkflow(data: Record<string, any>): string[] {
  const errors: string[] = [];
  if (!data.source?.trim()) errors.push("Add source text before running.");
  if (!["uppercase", "outline", "word-count"].includes(data.action))
    errors.push("Choose a supported local action.");
  return errors;
}
export function runWorkflow(data: Record<string, any>): string {
  const errors = validateWorkflow(data);
  if (errors.length) throw Error(errors.join(" "));
  const s = String(data.source);
  return data.action === "uppercase"
    ? s.toLocaleUpperCase()
    : data.action === "word-count"
      ? `${Array.from(new Intl.Segmenter(undefined, { granularity: "word" }).segment(s)).filter((x) => x.isWordLike).length} words / ${Array.from(new Intl.Segmenter(undefined, { granularity: "grapheme" }).segment(s)).length} graphemes`
      : s
          .split(/\n+/)
          .filter(Boolean)
          .map((x, i) => `${i + 1}. ${x.trim()}`)
          .join("\n");
}
