import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import AuthModal from "./AuthModal.jsx";
import { useCart } from "../context/CartContext.jsx";

export default function Header() {
  const { count, setIsOpen, wishlistCount } = useCart();
  const { user, logout } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-baseline gap-1 rounded focus-ring">
              <span className="font-display text-xl font-700 tracking-tight text-cream">
                CB<span className="text-signal">O</span>Y
              </span>
              <span className="font-display text-xs font-600 uppercase tracking-[0.3em] text-gold">
                istore
              </span>
            </Link>

            <nav className="hidden items-center gap-8 text-sm text-cream/70 md:flex">
              <a href="/#shop" className="rounded transition-colors hover:text-cream focus-ring">
                Shop
              </a>
              <Link to="/trade-in" className="rounded transition-colors hover:text-cream focus-ring">
                iSwap trade-in
              </Link>
              <a href="/#visit" className="rounded transition-colors hover:text-cream focus-ring">
                Visit Us
              </a>
              <Link to="/wishlist" className="rounded transition-colors hover:text-cream focus-ring">
                Wishlist {wishlistCount > 0 && <span className="ml-1 text-gold">({wishlistCount})</span>}
              </Link>
            </nav>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAuthOpen(true)}
                className="rounded-full border border-white/15 px-3 py-2 text-sm font-medium text-cream transition-colors hover:bg-white/10"
              >
                {user ? `Hi, ${user.name.split(" ")[0]}` : "Sign in"}
              </button>
              {user ? (
                <button
                  onClick={logout}
                  className="rounded-full border border-white/15 px-3 py-2 text-sm font-medium text-cream transition-colors hover:bg-white/10"
                >
                  Logout
                </button>
              ) : null}
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
        </div>
      </header>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </>
  );
}
