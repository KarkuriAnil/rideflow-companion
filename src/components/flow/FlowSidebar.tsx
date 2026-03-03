import { typeStyles, integrations } from "@/data/flowData";
import type { NodeType } from "@/data/flowData";

export function FlowSidebar() {
  return (
    <div className="space-y-6">
      {/* Legend */}
      <div className="rounded-xl bg-card p-4 border border-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Legend
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(typeStyles) as [NodeType, typeof typeStyles[NodeType]][]).map(([type, s]) => (
            <div key={type} className="flex items-center gap-2">
              <span
                className="inline-block rounded px-1.5 py-0.5 text-[9px] font-bold tracking-wider uppercase"
                style={{
                  background: s.badge,
                  color: s.badgeText,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                {s.label}
              </span>
              <span className="text-[11px] text-muted-foreground capitalize">{type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div className="rounded-xl bg-card p-4 border border-border">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Integrations
        </h3>
        <div className="space-y-2.5">
          {integrations.map(([name, desc]) => (
            <div key={name} className="flex items-start gap-2">
              <span className="text-sm shrink-0">{name.slice(0, 2)}</span>
              <div>
                <p className="text-xs font-semibold text-foreground">{name.slice(2).trim()}</p>
                <p className="text-[11px] text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
