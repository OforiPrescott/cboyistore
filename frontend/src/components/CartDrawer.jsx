import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatGHS } from "../lib/format.js";
import { whatsAppCartLink } from "../lib/whatsapp.js";
import Checkout from "./Checkout.jsx";
import { CloseIcon } from "../lib/icons.jsx";

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, updateQty, removeItem, total, checkoutOpen, setCheckoutOpen } = useCart();

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
            <CloseIcon className="h-5 w-5" />
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
                    {(item.storage || item.color) && (
                      <p className="text-xs text-ink/50">
                        {item.storage ? `${item.storage}` : ""}
                        {item.storage && item.color ? " · " : ""}
                        {item.color ? item.color.name : ""}
                      </p>
                    )}
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
          <div className="shrink-0 border-t border-ink/10 bg-cream px-6 py-5 shadow-[0_-6px_16px_rgba(0,0,0,0.05)]">
            <div className="flex items-center justify-between text-sm text-ink/60">
              <span>Subtotal</span>
              <span className="font-display text-lg font-700 text-ink">
                {formatGHS(total)}
              </span>
            </div>
            <p className="mt-1 text-xs text-ink/40">Nationwide delivery or pickup — choose at checkout</p>
            <div className="mt-4 flex flex-col gap-2">
              <a
                href={whatsAppCartLink(items, total)}
                target="_blank"
                rel="noreferrer"
                className="focus-ring flex items-center justify-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-50 py-3.5 text-sm font-600 text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                Share cart on WhatsApp
              </a>
              <button
                onClick={() => setCheckoutOpen(true)}
                className="focus-ring w-full rounded-full bg-signal-gradient py-3.5 font-600 text-white shadow-lg shadow-signal/30 transition-transform hover:scale-[1.02]"
              >
                Checkout with Paystack
              </button>
            </div>
          </div>
        )}
      </div>

      {checkoutOpen && <Checkout onClose={() => setCheckoutOpen(false)} />}
    </div>
  );
}
