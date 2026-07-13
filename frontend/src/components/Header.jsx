import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { count, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-40 bg-ink/95 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-baseline gap-1 focus-ring rounded">
            <span className="font-display text-xl font-700 tracking-tight text-cream">
              CB<span className="text-signal">O</span>Y
            </span>
            <span className="font-display text-xs font-600 tracking-[0.3em] text-gold uppercase">
              istore
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm text-cream/70">
            <a href="/#shop" className="hover:text-cream transition-colors focus-ring rounded">
              Shop
            </a>
            <Link to="/trade-in" className="hover:text-cream transition-colors focus-ring rounded">
              iSwap trade-in
            </Link>
            <a href="/#visit" className="hover:text-cream transition-colors focus-ring rounded">
              Visit Us
            </a>
          </nav>

          <button
            onClick={() => setIsOpen(true)}
            className="focus-ring relative flex items-center gap-2 rounded-full bg-signal-gradient px-4 py-2 text-sm font-600 text-white shadow-lg shadow-signal/20 transition-transform hover:scale-[1.03] active:scale-95"
            aria-label={`Open cart, ${count} items`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[11px] font-700 text-ink">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
