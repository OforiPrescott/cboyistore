import React from "react";

const services = [
  { label: "iBuy", desc: "we buy your used device" },
  { label: "iSwap", desc: "trade up to a newer model" },
  { label: "iFix", desc: "screen, battery & board repair" },
];

function Track() {
  return (
    <>
      {services.concat(services).map((s, idx) => (
        <div key={idx} className="flex items-center gap-3 px-8">
          <span className="font-display text-lg font-700 text-ink">{s.label}</span>
          <span className="text-sm text-ink/60">{s.desc}</span>
          <span className="mx-2 h-1.5 w-1.5 rounded-full bg-ink/30" />
        </div>
      ))}
    </>
  );
}

export default function ServiceRibbon() {
  return (
    <div id="services" className="overflow-hidden bg-gold py-3">
      <div className="marquee-track">
        <Track />
      </div>
    </div>
  );
}
