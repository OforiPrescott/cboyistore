import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useUI } from "../context/UIContext.jsx";
import { ShoppingBagIcon } from "../lib/icons.jsx";

const NAV = [
  { to: "/", label: "Home", icon: HomeIcon },
  { to: "/#shop", label: "Catalogue", icon: ShoppingBagIcon },
  { to: "/wishlist", label: "Wishlist", icon: HeartIcon, showBadge: "wishlistCount" },
  { to: "/orders", label: "Orders", icon: OrdersIcon },
  { to: "#cart-drawer", label: "Cart", icon: CartIcon, showBadge: "count", action: "cart" },
];

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function OrdersIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

export default function MobileBottomNav() {
  const { count, wishlistCount, setIsOpen, isOpen, checkoutOpen } = useCart();
  const { modalOpen } = useUI();
  const location = useLocation();

  const hidden = isOpen || checkoutOpen || modalOpen;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  function handleClick(e, item) {
    if (item.action === "cart") {
      e.preventDefault();
      setIsOpen(true);
    }
  }

  return (
    <nav
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-ink/10 bg-white/95 backdrop-blur-lg pb-safe pt-1 md:hidden transition-transform duration-200 ${
        hidden ? "translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex items-center justify-around">
        {NAV.map((item) => {
          const isActive = item.to === "/#shop" && location.hash === "#shop";
          const badge = item.showBadge === "count" ? count : item.showBadge === "wishlistCount" ? wishlistCount : 0;
          return (
            <Link
              key={item.to + item.label}
              to={item.to}
              onClick={(e) => handleClick(e, item)}
              className={`focus-ring relative flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] font-600 ${
                isActive ? "text-signal" : "text-ink/50"
              }`}
            >
              <span className="relative">
                <item.icon />
                {badge > 0 && (
                  <span className="absolute -top-1.5 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-signal text-[10px] font-700 text-white">
                    {badge}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
