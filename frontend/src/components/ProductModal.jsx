import React, { useState } from "react";
import { formatGHS } from "../lib/format.js";
import { useCart } from "../context/CartContext.jsx";
import { whatsAppProductLink } from "../lib/whatsapp.js";
import { HeartIcon, WhatsAppIcon, CartIcon } from "../lib/icons.jsx";

export default function ProductModal({ product, onClose, onAdd }) {
  const { addToWishlist, wishlist } = useCart();
  const [added, setAdded] = useState(false);
  const gallery = product.images?.length
    ? product.images
    : product.image
    ? [product.image]
    : [];
  const media = [
    ...gallery.map((src) => ({ type: "image", src })),
    ...(product.video ? [{ type: "video", src: product.video }] : []),
  ];
  const [active, setActive] = useState(0);
  const current = media[Math.min(active, media.length - 1)] || media[0];
  const specs = product.specs && Object.keys(product.specs).length > 0 ? product.specs : null;

  const storageOptions = product.variants?.storage || null;
  const colorOptions = product.variants?.color || null;
  const [storage, setStorage] = useState(storageOptions ? storageOptions[0].value : null);
  const [color, setColor] = useState(colorOptions ? colorOptions[0] : null);
  const isWishlisted = wishlist.some((w) => w.productId === product.id);

  // Effective price follows the selected storage tier (falls back to base price).
  const activeStorage = storageOptions?.find((s) => s.value === storage) || null;
  const effectivePrice = activeStorage ? activeStorage.price : product.price;

  function handleAdd() {
    onAdd({
      storage: storage || undefined,
      color: color || undefined,
      price: effectivePrice,
    });
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

        <div className="relative w-full shrink-0 bg-gradient-to-br from-ink/5 to-ink/10 sm:w-2/5">
          <div className="aspect-square w-full">
            {current?.type === "video" ? (
              <video src={current.src} controls className="h-full w-full object-cover" />
            ) : (
              <img
                src={current?.src || product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          {product.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-signal px-3 py-1 text-[11px] font-700 uppercase tracking-wide text-white">
              {product.badge}
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
          <p className="text-xs font-600 uppercase tracking-wide text-violet">{product.brand}</p>
          <h2 className="mt-1 font-display text-2xl font-700 text-ink">{product.name}</h2>
          <p className="mt-1 text-sm text-ink/50">{product.spec}</p>

           <div className="mt-4 flex items-center gap-3">
             <p className="font-display text-2xl font-700 text-ink">{formatGHS(effectivePrice)}</p>
             {product.oldPrice && (
               <p className="text-sm text-ink/40 line-through">{formatGHS(product.oldPrice)}</p>
             )}
             <span className="rounded-full bg-ink/5 px-3 py-1 text-xs font-600 text-ink/60">
               {product.condition}
             </span>
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
                addToWishlist(product, { storage: storage || undefined, color: color || undefined, price: effectivePrice });
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
              href={whatsAppProductLink(product, { storage: storage || undefined, color: color || undefined, price: effectivePrice })}
              target="_blank"
              rel="noreferrer"
              className="focus-ring inline-flex items-center gap-2 rounded-full border border-ink/10 px-5 py-3.5 text-sm font-600 text-ink hover:bg-ink/5"
            >
              <WhatsAppIcon className="h-4 w-4 text-emerald-600" /> Ask on WhatsApp
            </a>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              aria-label={product.stock === 0 ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
              className={`focus-ring flex h-12 w-12 items-center justify-center rounded-full transition-colors ${
                product.stock === 0
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
