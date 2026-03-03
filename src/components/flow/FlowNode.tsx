import { typeStyles, type FlowNode as FlowNodeType } from "@/data/flowData";

interface FlowNodeProps {
  node: FlowNodeType;
}

export function FlowNode({ node }: FlowNodeProps) {
  const s = typeStyles[node.type] || typeStyles.screen;

  return (
    <div
      className="flow-node rounded-xl px-5 py-4 w-full max-w-md mx-auto"
      style={{
        background: s.bg,
        borderLeft: `4px solid ${s.border}`,
      }}
    >
      <div className="flex items-start gap-3">
        <span
          className="inline-block rounded-md px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase shrink-0 mt-0.5"
          style={{
            background: s.badge,
            color: s.badgeText,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {s.label}
        </span>
        <div className="min-w-0">
          <h3
            className="text-sm font-bold leading-tight"
            style={{ color: s.text }}
          >
            {node.label}
          </h3>
          {node.sub && (
            <p
              className="text-xs mt-1 leading-relaxed whitespace-pre-line opacity-80"
              style={{ color: s.text }}
            >
              {node.sub}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
