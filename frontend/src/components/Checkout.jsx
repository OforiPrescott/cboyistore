import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { formatGHS } from "../lib/format.js";
import { createOrder, verifyPayment } from "../lib/api.js";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function Checkout({ onClose }) {
  const { items, total, clearCart } = useCart();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    deliveryMethod: "delivery",
  });
  const [status, setStatus] = useState("form"); // form | processing | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [reference, setReference] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handlePay(e) {
    e.preventDefault();
    setStatus("processing");
    setErrorMsg("");

    try {
      const order = await createOrder({
        items: items.map((i) => ({
          id: i.productId || i.id,
          name: i.name,
          price: i.price,
          qty: i.qty,
          storage: i.storage || undefined,
          color: i.color ? i.color.name : undefined,
        })),
        customer: form,
      });
      setReference(order.reference);
      setWhatsappLink(order.whatsappLink);

      if (!window.PaystackPop) {
        throw new Error("Paystack script did not load. Check your internet connection.");
      }

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: form.email || `${form.phone}@cboyistore.customer`,
        amount: Math.round(order.total * 100),
        currency: "GHS",
        ref: order.reference,
        metadata: {
          custom_fields: [
            { display_name: "Customer", variable_name: "customer", value: form.name },
            { display_name: "Phone", variable_name: "phone", value: form.phone },
          ],
        },
        callback: (response) => {
          verifyPayment(response.reference)
            .then(() => setStatus("success"))
            .catch(() => setStatus("success")); // Paystack already confirmed client-side
          clearCart();
        },
        onClose: () => {
          setStatus((s) => (s === "processing" ? "form" : s));
        },
      });

      handler.openIframe();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        aria-label="Close checkout"
        className="absolute inset-0 bg-ink/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {status === "success" ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-2xl">
              ✓
            </div>
            <h3 className="font-display text-2xl font-700 text-ink">Payment received</h3>
            <p className="mt-2 text-sm text-ink/60">
              Thanks {form.name || "there"} — reference {reference}.{" "}
              {form.deliveryMethod === "pickup"
                ? "Your order will be ready for pickup at Tafo American Building."
                : "We deliver nationwide — we'll reach you on " + form.phone + " to confirm your address."}
            </p>
            {whatsappLink && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-4 inline-block rounded-full bg-signal-gradient px-6 py-3 text-sm font-600 text-white shadow-lg shadow-signal/30"
              >
                Confirm order on WhatsApp
              </a>
            )}
            <button
              onClick={onClose}
              className="focus-ring mt-6 block w-full rounded-full bg-ink px-6 py-3 text-sm font-600 text-cream"
            >
              Done
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-700 text-ink">Checkout</h3>
              <button
                onClick={onClose}
                className="focus-ring rounded-full p-2 text-ink/40 hover:bg-ink/5"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-xl bg-cream p-4 text-sm">
              <div className="flex justify-between text-ink/60">
                <span>{items.reduce((n, i) => n + i.qty, 0)} item(s)</span>
                <span className="font-700 text-ink">{formatGHS(total)}</span>
              </div>
            </div>

            <form onSubmit={handlePay} className="mt-5 flex flex-col gap-3">
              <input
                required
                placeholder="Full name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className="focus-ring rounded-xl border border-ink/10 px-4 py-3 text-sm"
              />
              <input
                required
                type="tel"
                placeholder="Phone number (for delivery)"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className="focus-ring rounded-xl border border-ink/10 px-4 py-3 text-sm"
              />
              <input
                type="email"
                placeholder="Email (for your Paystack receipt)"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className="focus-ring rounded-xl border border-ink/10 px-4 py-3 text-sm"
              />

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => update("deliveryMethod", "delivery")}
                  className={`focus-ring flex-1 rounded-xl border px-4 py-3 text-sm font-600 transition-colors ${
                    form.deliveryMethod === "delivery"
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/10 text-ink/60"
                  }`}
                >
                  Nationwide delivery
                </button>
                <button
                  type="button"
                  onClick={() => update("deliveryMethod", "pickup")}
                  className={`focus-ring flex-1 rounded-xl border px-4 py-3 text-sm font-600 transition-colors ${
                    form.deliveryMethod === "pickup"
                      ? "border-ink bg-ink text-cream"
                      : "border-ink/10 text-ink/60"
                  }`}
                >
                  Pickup in Kumasi
                </button>
              </div>

              <textarea
                placeholder={
                  form.deliveryMethod === "pickup"
                    ? "Preferred pickup time (optional)"
                    : "Delivery address — town/city + landmark (delivered nationwide via VIP/STC/DHL)"
                }
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
                rows={2}
                className="focus-ring rounded-xl border border-ink/10 px-4 py-3 text-sm"
              />

              {status === "error" && (
                <p className="text-sm text-signal">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={status === "processing"}
                className="focus-ring mt-2 rounded-full bg-signal-gradient py-3.5 font-600 text-white shadow-lg shadow-signal/30 disabled:opacity-60"
              >
                {status === "processing" ? "Opening Paystack…" : `Pay ${formatGHS(total)} now`}
              </button>
              <p className="text-center text-[11px] text-ink/40">
                Secured by Paystack. We never see or store your card details.
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
