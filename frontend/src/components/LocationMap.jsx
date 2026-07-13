import React from "react";

const LAT = 6.7360811;
const LNG = -1.6120292;
const PLACE_ID = "ChIJj9QYYgCX2w8RqtxlDU6UkxY";
const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${LAT},${LNG}&destination_place_id=${PLACE_ID}`;
const EMBED_URL = `https://www.google.com/maps?q=Cboyistore,+P9PQ%2BC5Q,+Mampong+Rd,+Kumasi&z=16&output=embed`;

export default function LocationMap() {
  return (
    <section id="visit" className="bg-cream py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="font-display text-xs font-600 uppercase tracking-[0.3em] text-violet">
          Find the shop
        </p>
        <h2 className="mt-2 font-display text-3xl font-700 text-ink">
          Cboyistore, Mampong Rd, Kumasi
        </h2>

        <div className="mt-8 grid gap-6 lg:grid-cols-5">
          <div className="overflow-hidden rounded-3xl ring-1 ring-ink/10 lg:col-span-3">
            <iframe
              title="Cboyistore location map"
              src={EMBED_URL}
              width="100%"
              height="360"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-ink p-8 text-cream lg:col-span-2">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-cream/50">Address</p>
                <p className="mt-1 font-display text-lg font-700">Tafo American Building</p>
                <p className="text-sm text-cream/70">P9PQ+C5Q, Mampong Rd, Kumasi, Ghana</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-cream/50">Hours</p>
                <p className="text-sm text-cream/70">Every day, 7:00 AM – 9:00 PM</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-cream/50">Phone / WhatsApp</p>
                <p className="text-sm text-cream/70">0541 533 365</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-cream/50">Delivery</p>
                <p className="text-sm text-cream/70">
                  Nationwide delivery across Ghana, or pick up in person at Tafo.
                </p>
              </div>
            </div>

            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-signal-gradient px-6 py-3 text-sm font-600 text-white shadow-lg shadow-signal/30 transition-transform hover:scale-[1.02]"
            >
              Get directions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
