import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatGHS } from "../lib/format.js";
import Checkout from "./Checkout.jsx";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, total } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        aria-label="Close cart"
        className="absolute inset-0 bg-ink/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative flex h-full w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-xl font-700 text-ink">Your cart</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="focus-ring rounded-full p-2 text-ink/50 hover:bg-ink/5"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink/40">
              Your cart is empty — go find something nice.
            </p>
          ) : (
            <ul className="flex flex-col gap-4">
              {items.map((item) => (
                <li key={item.id} className="flex gap-3 rounded-xl bg-white p-3 ring-1 ring-ink/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <p className="text-sm font-600 text-ink leading-snug">{item.name}</p>
                    <p className="text-xs text-ink/50">{formatGHS(item.price)}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="focus-ring h-6 w-6 rounded-full border border-ink/15 text-ink/60 hover:bg-ink/5"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="focus-ring h-6 w-6 rounded-full border border-ink/15 text-ink/60 hover:bg-ink/5"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="focus-ring ml-auto text-xs text-signal hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-5">
            <div className="flex items-center justify-between text-sm text-ink/60">
              <span>Subtotal</span>
              <span className="font-display text-lg font-700 text-ink">
                {formatGHS(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/40">Nationwide delivery or pickup — choose at checkout</p>
            <button
              onClick={() => setCheckoutOpen(true)}
              className="focus-ring mt-4 w-full rounded-full bg-signal-gradient py-3.5 font-600 text-white shadow-lg shadow-signal/30 transition-transform hover:scale-[1.02]"
            >
              Checkout with Paystack
            </button>
          </div>
        )}
      </div>

      {checkoutOpen && <Checkout onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}
