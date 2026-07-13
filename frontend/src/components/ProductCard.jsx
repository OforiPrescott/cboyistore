import React, { useState } from "react";
import { formatGHS } from "../lib/format.js";
import { useCart } from "../context/CartContext.jsx";
import ProductModal from "./ProductModal.jsx";

function Stars({ rating = 4.5 }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <svg
            key={i}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={filled ? "#F2B705" : "none"}
            stroke="#F2B705"
            strokeWidth="1.5"
          >
            <polygon points="12 2 15 9 22 9 16.5 13.5 18.5 21 12 17 5.5 21 7.5 13.5 2 9 9 9" />
          </svg>
        );
      })}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const [imgError, setImgError] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [added, setAdded] = useState(false);

  const hasVariants = Array.isArray(product.variants?.storage) && product.variants.storage.length > 0;

  function handleAdd(e) {
    e.stopPropagation();
    // If the product requires a storage/colour choice, open the quick view
    // so the customer can pick before adding to the cart.
    if (hasVariants) {
      setQuickView(true);
      return;
    }
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock === 0;

  return (
    <>
      <div
        onClick={() => setQuickView(true)}
        className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-ink/5 to-ink/10">
          {imgError ? (
            <div className="flex h-full w-full items-center justify-center p-4 text-center">
              <span className="font-display text-sm font-700 text-ink/70">{product.name}</span>
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}

          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.badge && (
              <span className="w-fit rounded-full bg-signal px-3 py-1 text-[11px] font-700 uppercase tracking-wide text-white shadow-sm">
                {product.badge}
              </span>
            )}
            {product.oldPrice && (
              <span className="w-fit rounded-full bg-gold px-3 py-1 text-[11px] font-700 uppercase tracking-wide text-ink shadow-sm">
                Save {formatGHS(product.oldPrice - product.price)}
              </span>
            )}
          </div>
          <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-600 text-cream backdrop-blur">
            {product.condition}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setQuickView(true);
            }}
            className="focus-ring absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/95 py-2 text-xs font-700 text-ink opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          >
            Quick view &amp; specs
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-600 uppercase tracking-wide text-violet">{product.brand}</p>
            <Stars rating={product.rating} />
          </div>
          <h3 className="font-display text-base font-700 text-ink leading-snug">{product.name}</h3>
          <p className="line-clamp-1 text-xs text-ink/50">{product.spec}</p>

          {lowStock && !outOfStock && (
            <p className="text-[11px] font-600 text-signal">Only {product.stock} left in stock</p>
          )}
          {outOfStock && <p className="text-[11px] font-600 text-ink/40">Out of stock</p>}

          <div className="mt-3 flex items-end justify-between gap-2">
            <div>
              <p className="font-display text-lg font-700 text-ink">{formatGHS(product.price)}</p>
              {product.oldPrice && (
                <p className="text-xs text-ink/40 line-through">{formatGHS(product.oldPrice)}</p>
              )}
            </div>
            <button
              onClick={handleAdd}
              disabled={outOfStock}
              className={`focus-ring rounded-full px-4 py-2 text-xs font-600 transition-colors ${
                outOfStock
                  ? "cursor-not-allowed bg-ink/10 text-ink/30"
                  : added
                  ? "bg-emerald-600 text-white"
                  : "bg-ink text-cream hover:bg-violet"
              }`}
            >
              {outOfStock ? "Notify me" : added ? "Added ✓" : "Add to cart"}
            </button>
          </div>
        </div>
      </div>

      {quickView && (
        <ProductModal
          product={product}
          onClose={() => setQuickView(false)}
          onAdd={(variant) => {
            addItem(product, variant);
          }}
        />
      )}
    </>
  );
}
