import { useState, useMemo } from "react";
import { SECTIONS, flows, type SectionName, type FlowNode as FlowNodeType } from "@/data/flowData";
import { FlowNode } from "@/components/flow/FlowNode";
import { FlowArrow } from "@/components/flow/FlowArrow";
import { FlowSidebar } from "@/components/flow/FlowSidebar";

interface EdgeItem {
  __edge: true;
  label: string;
  to: string;
}

type OrderedItem = FlowNodeType | EdgeItem;

function isEdge(item: OrderedItem): item is EdgeItem {
  return "__edge" in item;
}

const Index = () => {
  const [active, setActive] = useState<SectionName>("Auth & Onboarding");
  const flow = flows[active];

  const ordered = useMemo(() => {
    const nodeMap: Record<string, FlowNodeType> = {};
    flow.nodes.forEach((n) => (nodeMap[n.id] = n));

    const visited = new Set<string>();
    const result: OrderedItem[] = [];

    const edgeMap: Record<string, { to: string; label: string }[]> = {};
    flow.edges.forEach(([from, to, label]) => {
      if (!edgeMap[from]) edgeMap[from] = [];
      edgeMap[from].push({ to, label });
    });

    function traverse(id: string) {
      if (visited.has(id)) return;
      visited.add(id);
      if (nodeMap[id]) result.push(nodeMap[id]);
      (edgeMap[id] || []).forEach(({ to, label }) => {
        result.push({ __edge: true, label, to });
        traverse(to);
      });
    }

    const roots = flow.nodes.filter((n) => !flow.edges.some((e) => e[1] === n.id));
    roots.forEach((r) => traverse(r.id));
    flow.nodes.forEach((n) => {
      if (!visited.has(n.id)) result.push(n);
    });

    return result;
  }, [flow]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black"
                style={{ background: "#1B2A6B", color: "#fff" }}
              >
                L
              </div>
              <div>
                <h1 className="text-lg font-extrabold tracking-tight text-foreground">
                  LinQ
                </h1>
                <p className="text-[11px] text-muted-foreground -mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                  GoTogetherRides · User Flow Reference
                </p>
              </div>
            </div>
            <span
              className="hidden sm:block text-xs font-medium text-muted-foreground px-3 py-1.5 rounded-full border border-border"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              Same Route. Shared Ride.
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-0.5 -mb-px">
            {SECTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setActive(s)}
                className="relative px-3 py-2.5 text-xs font-medium whitespace-nowrap transition-colors shrink-0"
                style={{
                  color: active === s ? flows[s].color : undefined,
                  fontWeight: active === s ? 700 : 500,
                }}
              >
                {s}
                {active === s && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: flows[s].color }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Flow Column */}
          <div className="flex-1 min-w-0">
            {/* Section Header */}
            <div
              className="rounded-xl p-5 mb-6"
              style={{ background: flow.light }}
            >
              <h2
                className="text-xl font-extrabold tracking-tight"
                style={{ color: flow.color }}
              >
                {active}
              </h2>
              <p
                className="text-xs mt-1 font-medium opacity-70"
                style={{ color: flow.color, fontFamily: "'JetBrains Mono', monospace" }}
              >
                {flow.nodes.length} steps · {flow.edges.length} connections
              </p>
            </div>

            {/* Flow Steps */}
            <div className="flex flex-col items-center">
              {ordered.map((item, i) => {
                if (isEdge(item)) {
                  return <FlowArrow key={`edge-${i}`} label={item.label} color={flow.color} />;
                }
                return <FlowNode key={item.id} node={item} />;
              })}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="lg:sticky lg:top-36">
              <FlowSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
