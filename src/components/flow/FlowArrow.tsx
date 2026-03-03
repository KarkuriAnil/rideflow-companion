interface FlowArrowProps {
  label: string;
  color?: string;
}

export function FlowArrow({ label, color = "#94A3B8" }: FlowArrowProps) {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="w-px h-5" style={{ background: color }} />
      {label && (
        <span
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full my-0.5"
          style={{
            color,
            background: `${color}15`,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {label}
        </span>
      )}
      <svg width="12" height="8" viewBox="0 0 12 8" className="mt-0.5">
        <path d="M6 8L0 0h12z" fill={color} />
      </svg>
    </div>
  );
}
