import type { LayoutNode } from "../../shared/schema";
export function DocumentScene({
  nodes,
  width = 960,
  height = 540,
  title = "Document",
}: {
  nodes: LayoutNode[];
  width?: number;
  height?: number;
  title?: string;
}) {
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="v2-document-scene"
      role="img"
      aria-label={title}
    >
      {nodes.map((n) =>
        n.type === "shape" ? (
          <rect
            key={n.id}
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            fill={n.color}
          />
        ) : n.type === "image" ? (
          <image
            key={n.id}
            x={n.x}
            y={n.y}
            width={n.w}
            height={n.h}
            href={n.asset}
            preserveAspectRatio="xMidYMid slice"
          />
        ) : (
          <foreignObject key={n.id} x={n.x} y={n.y} width={n.w} height={n.h}>
            <div
              style={{
                fontSize: n.size,
                color: n.color,
                fontFamily: "Poppins, PlexThai, sans-serif",
                lineHeight: 1.12,
                whiteSpace: "pre-wrap",
                overflowWrap: "anywhere",
              }}
            >
              {n.text}
            </div>
          </foreignObject>
        ),
      )}
    </svg>
  );
}
