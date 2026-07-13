import React from "react";

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0 bg-violet-gradient opacity-30 mix-blend-screen" />
      <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-signal/30 blur-3xl" />
      <div className="absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-violet/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20 pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="font-display text-xs font-600 uppercase tracking-[0.35em] text-gold">
              Tafo American Building · Kumasi
            </p>
            <h1 className="mt-4 font-display text-5xl font-700 leading-[1.05] text-cream sm:text-6xl">
              Original gadgets.
              <br />
              <span className="text-signal">Fair Cedi prices.</span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-cream/70">
              Kumasi's premium reseller for iPhones, MacBooks, smartwatches and
              home appliances — with trade-in, swap and repair services under
              one roof, and delivery nationwide across Ghana.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#shop"
                className="focus-ring rounded-full bg-signal-gradient px-7 py-3.5 font-600 text-white shadow-lg shadow-signal/30 transition-transform hover:scale-105"
              >
                Shop the catalogue
              </a>
              <a
                href="https://wa.me/233541533365"
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded-full border border-cream/20 px-7 py-3.5 font-600 text-cream transition-colors hover:bg-cream/10"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/generated/iph-16-pro-max.svg"
                alt="iPhone display"
                className="col-span-2 h-56 w-full rounded-3xl object-cover shadow-2xl"
              />
              <img
                src="/images/generated/mbp-14-m3.svg"
                alt="MacBook"
                className="h-40 w-full rounded-3xl object-cover shadow-xl"
              />
              <img
                src="/images/generated/apple-watch-s10.svg"
                alt="Apple Watch"
                className="h-40 w-full rounded-3xl object-cover shadow-xl"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 rounded-2xl bg-cream px-5 py-4 shadow-2xl">
              <p className="font-display text-2xl font-700 text-ink">3–30 days</p>
              <p className="text-xs text-ink/60">warranty on every device</p>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-6 border-t border-cream/10 pt-8 sm:grid-cols-4">
          {[
            ["80+", "products in stock"],
            ["7", "categories to explore"],
            ["16", "regions we deliver to"],
            ["4.8★", "average customer rating"],
          ].map(([stat, label]) => (
            <div key={label}>
              <p className="font-display text-2xl font-700 text-cream sm:text-3xl">{stat}</p>
              <p className="mt-1 text-xs text-cream/50">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
