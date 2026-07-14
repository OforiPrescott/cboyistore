import React, { useEffect, useRef, useState } from "react";
import { formatGHS } from "../lib/format.js";
import { useCart } from "../context/CartContext.jsx";
import { whatsAppProductLink } from "../lib/whatsapp.js";
import { rateProduct } from "../lib/api.js";
import { HeartIcon, WhatsAppIcon, CartIcon, CloseIcon } from "../lib/icons.jsx";

function StarInput({ productId, currentRating }) {
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleClick(value) {
    if (loading || submitted) return;
    setLoading(true);
    try {
      await rateProduct(productId, value);
      setSubmitted(true);
    } catch {
      // silent — the fallback WhatsApp link still works
    } finally {
      setLoading(false);
    }
  }

  const display = hover || currentRating || 0;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={loading || submitted}
          onClick={() => handleClick(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
          className={`focus-ring disabled:cursor-not-allowed ${submitted ? "cursor-default" : "cursor-pointer"}`}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill={star <= display ? "#F2B705" : "none"}
            stroke="#F2B705"
            strokeWidth="1.5"
          >
            <polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 17 5.5 21 7.5 13.5 2 9 9 9" />
          </svg>
        </button>
      ))}
      {submitted && (
        <span className="ml-1.5 text-xs font-600 text-emerald-600">Thanks for rating!</span>
      )}
    </div>
  );
}

export default function ProductModal({ product, onClose, onAdd }) {
  const { addToWishlist, wishlist } = useCart();
  const [added, setAdded] = useState(false);
  const addedTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const p = product || {};
  const gallery = p.images?.length
    ? p.images
    : p.image
    ? [p.image]
    : [];
  const media = [
    ...gallery.map((src) => ({ type: "image", src })),
    ...(p.video ? [{ type: "video", src: p.video }] : []),
  ];
  const [active, setActive] = useState(0);
  const current = media[Math.min(active, media.length - 1)] || media[0];
  const specs = p.specs && Object.keys(p.specs).length > 0 ? p.specs : null;

  const storageOptions = p.variants?.storage || null;
  const colorOptions = p.variants?.color || null;
  const [storage, setStorage] = useState(storageOptions ? storageOptions[0].value : null);
  const [color, setColor] = useState(colorOptions ? colorOptions[0] : null);
  const isWishlisted = wishlist.some((w) => w.productId === p.id);

  const activeStorage = storageOptions?.find((s) => s.value === storage) || null;
  const effectivePrice = activeStorage ? activeStorage.price : p.price;

  function handleAdd() {
    onAdd({
      storage: storage || undefined,
      color: color || undefined,
      price: effectivePrice,
    });
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1200);
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
          <CloseIcon className="h-5 w-5" />
        </button>

        <div className="relative w-full shrink-0 bg-gradient-to-br from-ink/5 to-ink/10 sm:w-2/5">
          {/* On mobile the image is a square hero. On tablet+ the row
              stretches both columns to the same height, so the image
              should fill the whole column instead of sitting inside a
              small square with a big empty strip beneath it. */}
          <div className="aspect-square w-full sm:aspect-auto sm:h-full">
            {current?.type === "video" ? (
              <video src={current.src} controls className="h-full w-full object-cover" />
            ) : (
              <img
                src={current?.src || p.image}
                alt={p.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {p.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-signal px-3 py-1 text-[11px] font-700 uppercase tracking-wide text-white">
              {p.badge}
            </span>
          )}
          {media.length > 1 && (
            <div className="absolute inset-x-3 bottom-3 flex gap-2 overflow-x-auto rounded-2xl bg-white/90 p-2">
              {media.map((m, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-lg ring-2 ${
                    i === active ? "ring-ink" : "ring-transparent"
                  }`}
                >
                  {m.type === "video" ? (
                    <span className="flex h-full w-full items-center justify-center bg-ink text-sm text-cream">
                      ▶
                    </span>
                  ) : (
                    <img src={m.src} alt="" className="h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <p className="text-xs font-600 uppercase tracking-wide text-violet">{p.brand}</p>
          <h2 className="mt-1 font-display text-2xl font-700 text-ink">{p.name}</h2>
          <p className="mt-1 text-sm text-ink/50">{p.spec}</p>

          <div className="mt-4 flex items-center gap-3">
            <p className="font-display text-2xl font-700 text-ink">{formatGHS(effectivePrice)}</p>
            {p.oldPrice && (
              <p className="text-sm text-ink/40 line-through">{formatGHS(p.oldPrice)}</p>
            )}
            <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-600 text-ink/60">
              {p.condition}
            </span>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <StarInput productId={p.id} currentRating={p.rating} />
            {p.ratingCount > 0 && (
              <span className="text-xs text-ink/50">
                {p.rating} ({p.ratingCount} review{p.ratingCount !== 1 ? "s" : ""})
              </span>
            )}
          </div>

          {storageOptions && (
            <div className="mt-5">
              <p className="text-xs font-700 uppercase tracking-wide text-ink/60">Storage</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {storageOptions.map((opt) => {
                  const selected = opt.value === storage;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => setStorage(opt.value)}
                      className={`focus-ring rounded-xl border px-4 py-2 text-sm font-600 transition-colors ${
                        selected
                          ? "border-ink bg-ink text-cream"
                          : "border-ink/15 text-ink/70 hover:border-ink/40"
                      }`}
                    >
                      {opt.value}
                      {opt.price !== effectivePrice && (
                        <span className={selected ? "ml-1 text-cream/70" : "ml-1 text-ink/40"}>
                          {formatGHS(opt.price)}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {colorOptions && (
            <div className="mt-5">
              <p className="text-xs font-700 uppercase tracking-wide text-ink/60">
                Colour{color ? ` — ${color.name}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {colorOptions.map((opt) => {
                  const selected = color && color.name === opt.name;
                  return (
                    <button
                      key={opt.name}
                      title={opt.name}
                      onClick={() => setColor(opt)}
                      aria-label={opt.name}
                      className={`focus-ring h-9 w-9 rounded-full border-2 transition-transform hover:scale-110 ${
                        selected ? "border-ink ring-2 ring-ink/20" : "border-ink/15"
                      }`}
                      style={{ backgroundColor: opt.hex }}
                    />
                  );
                })}
              </div>
            </div>
          )}

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
              onClick={() => {
                addToWishlist(p, { storage: storage || undefined, color: color || undefined, price: effectivePrice });
              }}
              className={`focus-ring inline-flex items-center gap-2 rounded-full border px-4 py-3.5 text-sm font-600 transition-colors ${
                isWishlisted
                  ? "border-signal text-signal"
                  : "border-ink/10 text-ink hover:bg-ink/5"
              }`}
            >
              <HeartIcon className="h-4 w-4" filled={isWishlisted} />
              {isWishlisted ? "Saved" : "Save"}
            </button>
            <a
              href={whatsAppProductLink(p, { storage: storage || undefined, color: color || undefined, price: effectivePrice })}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink/10 px-5 py-3.5 text-sm font-600 text-ink hover:bg-ink/5"
            >
              <WhatsAppIcon className="h-4 w-4 text-emerald-600" /> Ask on WhatsApp
            </a>
            <button
              onClick={handleAdd}
              disabled={p.stock === 0}
              aria-label={p.stock === 0 ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
              className={`focus-ring flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors ${
                p.stock === 0
                  ? "cursor-not-allowed bg-ink/20 text-ink/30"
                  : added
                  ? "bg-emerald-600 text-white"
                  : "bg-signal-gradient text-white shadow-lg shadow-signal/30"
              }`}
            >
              <CartIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
