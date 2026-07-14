import React, { useState } from "react";
import { formatGHS } from "../lib/format.js";
import { useCart } from "../context/CartContext.jsx";
import { whatsAppProductLink } from "../lib/whatsapp.js";
import ProductModal from "./ProductModal.jsx";
import { CartIcon } from "../lib/icons.jsx";

function Stars({ rating = 4.5, count }) {
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
      {count !== undefined && count > 0 && (
        <span className="text-[11px] text-ink/40">({count})</span>
      )}
    </div>
  );
}

export default function ProductCard({ product }) {
  const { addItem, addToWishlist, wishlist } = useCart();
  const [imgError, setImgError] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [added, setAdded] = useState(false);
  const [wishlisted, setWishlisted] = useState(() =>
    wishlist.some((w) => w.productId === product.id)
  );
  const addedTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (addedTimer.current) clearTimeout(addedTimer.current);
    };
  }, []);

  const hasVariants = Array.isArray(product.variants?.storage) && product.variants.storage.length > 0;

  function handleAdd(e) {
    e.stopPropagation();
    if (hasVariants) {
      setQuickView(true);
      return;
    }
    addItem(product);
    setAdded(true);
    if (addedTimer.current) clearTimeout(addedTimer.current);
    addedTimer.current = setTimeout(() => setAdded(false), 1200);
  }

  function handleWishlist(e) {
    e.stopPropagation();
    addToWishlist(product);
    setWishlisted(true);
  }

  function handleWhatsApp(e) {
    e.stopPropagation();
    window.open(whatsAppProductLink(product, {}), "_blank");
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
              src={product.images?.[0] || product.image}
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
          <div className="absolute right-3 top-3 flex flex-col gap-2">
            <button
              onClick={handleWhatsApp}
              aria-label="Share on WhatsApp"
              className="focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-emerald-600 shadow-sm backdrop-blur hover:bg-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </button>
            <button
              onClick={handleWishlist}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              className={`focus-ring flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur hover:bg-white ${
                wishlisted ? "text-signal" : "text-ink/60"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlisted ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          </div>
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
            <Stars rating={product.rating} count={product.ratingCount} />
          </div>
          <h3 className="font-display text-base font-700 text-ink leading-snug">{product.name}</h3>
          <p className="line-clamp-1 text-xs text-ink/50">{product.spec}</p>

          {lowStock && !outOfStock && (
            <p className="text-[11px] font-600 text-signal">Only {product.stock} left in stock</p>
          )}
          {outOfStock && <p className="text-[11px] font-600 text-ink/40">Out of stock</p>}

          <div className="mt-3 flex flex-col gap-1.5">
            <div>
              <p className="font-display text-base font-700 text-ink sm:text-lg">{formatGHS(product.price)}</p>
              {product.oldPrice && (
                <p className="text-xs text-ink/40 line-through">{formatGHS(product.oldPrice)}</p>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-600 text-cream">
                {product.condition}
              </span>
              <button
                onClick={handleAdd}
                disabled={outOfStock}
                aria-label={outOfStock ? "Out of stock" : added ? "Added to cart" : "Add to cart"}
                className={`focus-ring flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors ${
                  outOfStock
                    ? "cursor-not-allowed bg-ink/10 text-ink/30"
                    : added
                    ? "bg-emerald-600 text-white"
                    : "bg-ink text-cream hover:bg-violet"
                }`}
              >
                <CartIcon className="h-5 w-5" />
              </button>
            </div>
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
