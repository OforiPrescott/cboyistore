import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { formatGHS } from "../lib/format.js";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart } = useCart();

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="mb-8">
        <p className="font-display text-xs font-600 uppercase tracking-[0.3em] text-violet">Your wishlist</p>
        <h1 className="mt-2 font-display text-3xl font-700 text-ink">Saved for later</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-white p-16 text-center ring-1 ring-ink/5">
          <span className="text-5xl">💖</span>
          <p className="font-display text-xl font-700 text-ink">No saved items yet</p>
          <p className="text-sm text-ink/50">Tap the heart on any product to save it here.</p>
          <Link
            to="/"
            className="focus-ring mt-2 rounded-full bg-signal-gradient px-6 py-3 text-sm font-600 text-white shadow-lg shadow-signal/30"
          >
            Browse catalogue
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-ink/5 to-ink/10">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-600 text-cream backdrop-blur">
                  {item.brand}
                </span>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-4">
                <h3 className="font-display text-sm font-700 text-ink leading-snug">{item.name}</h3>
                {(item.storage || item.color) && (
                  <p className="text-xs text-ink/50">
                    {item.storage ? `${item.storage}` : ""}
                    {item.storage && item.color ? " · " : ""}
                    {item.color ? item.color.name : ""}
                  </p>
                )}
                <p className="font-display text-lg font-700 text-ink">{formatGHS(item.price)}</p>
                <div className="mt-auto flex gap-2">
                  <button
                    onClick={() => moveToCart(item.id)}
                    className="focus-ring flex-1 rounded-full bg-signal-gradient py-2.5 text-xs font-600 text-white shadow-md shadow-signal/20"
                  >
                    Move to cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="focus-ring rounded-full border border-ink/10 px-3 py-2.5 text-xs font-600 text-ink/60 hover:bg-ink/5"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
