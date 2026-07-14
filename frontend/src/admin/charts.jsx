import React from "react";

export function Sparkline({ data, color = "#6C3CE0", width = 120, height = 36 }) {
  if (!data || data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const span = max - min || 1;
  const step = data.length > 1 ? width / (data.length - 1) : width;
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = height - ((v - min) / span) * (height - 4) - 2;
    return [x, y];
  });
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function AreaChart({ data, labels = [], height = 240, formatValue = (v) => v }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-ink/30">
        No sales in this period yet.
      </div>
    );
  }
  const W = 640;
  const H = height;
  const padB = 26;
  const padT = 14;
  const max = Math.max(...data, 1);
  const n = data.length;
  const stepX = n > 1 ? W / (n - 1) : W;
  const pts = data.map((v, i) => {
    const x = i * stepX;
    const y = H - padB - (v / max) * (H - padB - padT);
    return [x, y];
  });
  const line = pts
    .map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(" ");
  const area = `${line} L${W},${H - padB} L0,${H - padB} Z`;
  const gridLines = 4;
  const ticks = Array.from({ length: gridLines + 1 }, (_, i) => (max / gridLines) * i);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#FF5A36" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {ticks.map((t, i) => {
        const y = H - padB - (t / max) * (H - padB - padT);
        return (
          <g key={i}>
            <line x1="0" y1={y} x2={W} y2={y} stroke="#0B0B12" strokeOpacity="0.06" />
            <text x="0" y={y - 3} fontSize="10" fill="#0B0B12" fillOpacity="0.35">
              {formatValue(Math.round(t))}
            </text>
          </g>
        );
      })}
      <path d={area} fill="url(#areaFill)" />
      <path d={line} fill="none" stroke="#FF5A36" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p[0]} cy={p[1]} r="3" fill="#FF5A36" />
          {labels[i] && i % Math.ceil(n / 7) === 0 && (
            <text x={p[0]} y={H - 8} fontSize="10" fill="#0B0B12" fillOpacity="0.4" textAnchor="middle">
              {labels[i]}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function Donut({ segments, size = 168 }) {
  const total = segments.reduce((s, x) => s + x.value, 0);
  if (total === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-ink/5 text-xs text-ink/40"
        style={{ width: size, height: size }}
      >
        No data
      </div>
    );
  }
  let acc = 0;
  const stops = segments
    .filter((s) => s.value > 0)
    .map((s) => {
      const start = (acc / total) * 360;
      acc += s.value;
      const end = (acc / total) * 360;
      return `${s.color} ${start}deg ${end}deg`;
    })
    .join(", ");
  return (
    <div
      className="rounded-full"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${stops})`,
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex h-[68%] w-[68%] flex-col items-center justify-center rounded-full bg-cream">
          <span className="font-display text-lg font-700 text-ink">
            {segments.length}
          </span>
          <span className="text-[10px] uppercase tracking-wide text-ink/40">states</span>
        </div>
      </div>
    </div>
  );
}

export function BarRow({ label, value, max, sub, tone = "#6C3CE0", format = (v) => v }) {
  const pct = max ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <span className="truncate font-600 text-ink">{label}</span>
        <span className="ml-2 font-600 text-ink/70">{format(value)}</span>
      </div>
      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/5">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: tone }} />
      </div>
      {sub && <p className="mt-1 text-xs text-ink/40">{sub}</p>}
    </div>
  );
}
