import React from "react";

const points = [
  {
    title: "Genuine devices",
    desc: "Every iPhone, Samsung and Pixel is checked for IMEI, iCloud/FRP lock and battery health before it reaches the shelf.",
    icon: (
      <path d="M9 12l2 2 4-4m5-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    ),
  },
  {
    title: "iBuy, iSwap, iFix",
    desc: "Trade in your old device, swap up to a newer model, or get your screen and battery fixed same-day.",
    icon: <path d="M4 4v5h5M20 20v-5h-5M4 9a9 9 0 0114.6-4.6M20 15a9 9 0 01-14.6 4.6" />,
  },
  {
    title: "Nationwide delivery",
    desc: "We deliver anywhere in Ghana via VIP/STC/DHL, or you can pick up in person at Tafo Market, Kumasi.",
    icon: <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7zM6 20a2 2 0 100-4 2 2 0 000 4zM17 20a2 2 0 100-4 2 2 0 000 4z" />,
  },
];

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-slateink py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-3">
          {points.map((p) => (
            <div key={p.title}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-signal-gradient">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {p.icon}
                </svg>
              </div>
              <h3 className="mt-4 font-display text-xl font-700 text-cream">{p.title}</h3>
              <p className="mt-2 text-sm text-cream/60">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
