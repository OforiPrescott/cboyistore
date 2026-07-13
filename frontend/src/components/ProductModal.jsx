import React, { useState } from "react";
import { formatGHS } from "../lib/format.js";

export default function ProductModal({ product, onClose, onAdd }) {
  const [added, setAdded] = useState(false);
  const specs = product.specs && Object.keys(product.specs).length > 0 ? product.specs : null;

  function handleAdd() {
    onAdd();
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        aria-label="Close"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative flex max-h-[88vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl sm:flex-row">
        <button
          onClick={onClose}
          className="focus-ring absolute right-4 top-4 z-10 rounded-full bg-white/90 p-2 text-ink/60 shadow hover:bg-white hover:text-ink"
          aria-label="Close quick view"
        >
          ✕
        </button>

        <div className="relative aspect-square w-full shrink-0 bg-gradient-to-br from-ink/5 to-ink/10 sm:w-2/5">
          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-signal px-3 py-1 text-[11px] font-700 uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <p className="text-xs font-600 uppercase tracking-wide text-violet">{product.brand}</p>
          <h2 className="mt-1 font-display text-2xl font-700 text-ink">{product.name}</h2>
          <p className="mt-1 text-sm text-ink/50">{product.spec}</p>

          <div className="mt-4 flex items-center gap-3">
            <p className="font-display text-2xl font-700 text-ink">{formatGHS(product.price)}</p>
            {product.oldPrice && (
              <p className="text-sm text-ink/40 line-through">{formatGHS(product.oldPrice)}</p>
            )}
            <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-600 text-ink/60">
              {product.condition}
            </span>
          </div>

          {specs && (
            <div className="mt-6">
              <h3 className="font-display text-sm font-700 uppercase tracking-wide text-ink/70">
                Full specification
              </h3>
              <dl className="mt-3 divide-y divide-ink/5 rounded-2xl bg-cream/60 ring-1 ring-ink/5">
                {Object.entries(specs).map(([label, value]) => (
                  <div key={label} className="flex gap-4 px-4 py-2.5 text-sm">
                    <dt className="w-1/3 shrink-0 font-600 text-ink/60">{label}</dt>
                    <dd className="text-ink">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className={`focus-ring flex-1 rounded-full py-3.5 text-sm font-600 text-white shadow-lg transition-transform hover:scale-[1.02] ${
                product.stock === 0
                  ? "cursor-not-allowed bg-ink/20 shadow-none hover:scale-100"
                  : added
                  ? "bg-emerald-600"
                  : "bg-signal-gradient shadow-signal/30"
              }`}
            >
              {product.stock === 0 ? "Out of stock" : added ? "Added to cart ✓" : "Add to cart"}
            </button>
            <a
              href={`https://wa.me/233541533365?text=${encodeURIComponent(
                `Hi Cboyistore, I'm interested in the ${product.name} (${formatGHS(product.price)}).`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="focus-ring rounded-full border border-ink/10 px-5 py-3.5 text-sm font-600 text-ink hover:bg-ink/5"
            >
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
