import { z } from "zod";
export const graphNodeTypes = [
  "input",
  "trim",
  "uppercase",
  "outline",
  "count",
  "replace",
  "branch",
  "agent",
  "note",
  "document",
  "output",
] as const;
export const graphNode = z.object({
  id: z.string().min(1).max(100),
  type: z.enum(graphNodeTypes),
  label: z.string().max(100),
  x: z.number().finite().min(0).max(5000),
  y: z.number().finite().min(0).max(5000),
  config: z.record(z.string(), z.unknown()),
});
export const graphEdge = z.object({
  id: z.string().min(1),
  from: z.string(),
  to: z.string(),
  port: z.enum(["out", "true", "false"]).default("out"),
});
export const graphSchema = z.object({
  schemaVersion: z.literal(2),
  nodes: z.array(graphNode).min(1).max(100),
  edges: z.array(graphEdge).max(300),
});
export type Graph = z.infer<typeof graphSchema>;
export type GraphNode = z.infer<typeof graphNode>;
export const codeSchema = z.object({
  schemaVersion: z.literal(2),
  html: z.string().max(150000),
  css: z.string().max(150000),
  js: z.string().max(150000),
  overrides: z
    .array(
      z.object({
        selector: z.string().max(1000),
        property: z.string().max(60),
        value: z.string().max(500),
      }),
    )
    .max(500)
    .default([]),
});
export type CodeDocument = z.infer<typeof codeSchema>;
export const synthSchema = z.object({
  schemaVersion: z.literal(2),
  tempo: z.number().min(40).max(200),
  wave: z.enum(["sine", "triangle", "sawtooth", "square"]),
  cutoff: z.number().min(100).max(16000),
  attack: z.number().min(0.005).max(1),
  release: z.number().min(0.02).max(2),
  volume: z.number().min(0).max(0.3),
  steps: z.array(z.number().int().min(-1).max(84)).length(16),
});
export type Composition = z.infer<typeof synthSchema>;
export const physicsSchema = z.object({
  schemaVersion: z.literal(2),
  stiffness: z.number().min(5).max(200),
  damping: z.number().min(1).max(30),
  gravity: z.number().min(-150).max(150),
  bodies: z
    .array(
      z.object({
        id: z.string(),
        x: z.number().min(0).max(1000),
        y: z.number().min(0).max(700),
        mass: z.number().min(0.1).max(10),
        radius: z.number().min(10).max(70),
        color: z.string().regex(/^#[0-9a-f]{6}$/i),
        shape: z.enum(["orb", "star", "whisper"]),
      }),
    )
    .min(1)
    .max(24),
});
export type PhysicsScene = z.infer<typeof physicsSchema>;
export const storySchema = z.object({
  schemaVersion: z.literal(2),
  scenes: z
    .array(
      z.object({
        id: z.string(),
        title: z.string().max(200),
        script: z.string().max(10000),
        duration: z.number().min(1).max(300),
        documentId: z.string().nullable(),
        transition: z.enum(["fade", "slide", "instant"]),
        transitionDuration: z.number().min(0).max(5).default(0.5),
      }),
    )
    .min(1)
    .max(100),
});
export type Story = z.infer<typeof storySchema>;
export const projectSchema = z.object({
  schemaVersion: z.literal(2),
  description: z.string().max(10000),
  color: z.string().regex(/^#[0-9a-f]{6}$/i),
});
export const advancedSchemas: Record<string, z.ZodType> = {
  project: projectSchema,
  code: codeSchema,
  composition: synthSchema,
  scene: physicsSchema,
  story: storySchema,
};
export const kindRoutes: Record<string, string> = {
  document: "create",
  conversation: "chat",
  note: "research",
  recording: "library",
  session: "live",
  workflow: "automate",
  preset: "design",
  project: "projects",
  code: "code",
  composition: "sound",
  scene: "dynamics",
  story: "story",
  "agent-run": "agents",
};
export function freshGraph(): Graph {
  const a = crypto.randomUUID(),
    b = crypto.randomUUID(),
    c = crypto.randomUUID(),
    d = crypto.randomUUID();
  return {
    schemaVersion: 2,
    nodes: [
      {
        id: a,
        type: "input",
        label: "Your brief",
        x: 40,
        y: 90,
        config: { text: "" },
      },
      {
        id: b,
        type: "outline",
        label: "Make an outline",
        x: 310,
        y: 90,
        config: {},
      },
      {
        id: c,
        type: "document",
        label: "Create an artifact",
        x: 580,
        y: 90,
        config: { title: "Workflow artifact" },
      },
      {
        id: d,
        type: "output",
        label: "Review the result",
        x: 850,
        y: 90,
        config: {},
      },
    ],
    edges: [
      { id: crypto.randomUUID(), from: a, to: b, port: "out" },
      { id: crypto.randomUUID(), from: b, to: c, port: "out" },
      { id: crypto.randomUUID(), from: c, to: d, port: "out" },
    ],
  };
}
export const initialComposition: Composition = {
  schemaVersion: 2,
  tempo: 100,
  wave: "triangle",
  cutoff: 4500,
  attack: 0.02,
  release: 0.2,
  volume: 0.12,
  steps: [60, -1, 67, -1, 64, -1, 72, -1, 60, -1, 67, 64, -1, 72, 67, -1],
};
export const initialPhysics: PhysicsScene = {
  schemaVersion: 2,
  stiffness: 45,
  damping: 8,
  gravity: 0,
  bodies: [
    {
      id: "arty",
      x: 500,
      y: 300,
      mass: 1.5,
      radius: 45,
      color: "#D7E317",
      shape: "whisper",
    },
    {
      id: "cyan",
      x: 300,
      y: 220,
      mass: 1,
      radius: 28,
      color: "#43E6FF",
      shape: "orb",
    },
    {
      id: "pink",
      x: 710,
      y: 370,
      mass: 2,
      radius: 32,
      color: "#D4006A",
      shape: "star",
    },
  ],
};
export function newStoryScene() {
  return {
    id: crypto.randomUUID(),
    title: "A new perspective",
    script: "Give this scene a purpose. What should your audience understand?",
    duration: 6,
    documentId: null,
    transition: "fade" as const,
    transitionDuration: 0.5,
  };
}
