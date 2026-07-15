import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { formatGHS } from "../lib/format.js";
import { createOrder, verifyPayment } from "../lib/api.js";
import AuthModal from "./AuthModal.jsx";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || "";

export default function Checkout({ onClose }) {
  const { items, total, clearCart } = useCart();
  const { user, token, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    address: "",
    deliveryMethod: "delivery",
  });
  const [couponCode, setCouponCode] = useState("");
  const [coupon, setCoupon] = useState(null);
  const [couponError, setCouponError] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [status, setStatus] = useState("form"); // form | processing | success | error
  const [errorMsg, setErrorMsg] = useState("");
  const [whatsappLink, setWhatsappLink] = useState(null);
  const [reference, setReference] = useState(null);

  useEffect(() => {
    if (user) {
      setForm((f) => ({
        ...f,
        name: user.name || f.name,
        phone: user.phone || f.phone,
        email: user.email || f.email,
      }));
    }
  }, [user]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function applyCoupon() {
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode.trim(), orderTotal: total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid coupon");
      setCoupon(data);
    } catch (err) {
      setCouponError(err.message);
      setCoupon(null);
    } finally {
      setCouponLoading(false);
    }
  }

  async function handlePay(e) {
    if (!user) {
      setShowAuth(true);
      return;
    }
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
          colorHex: i.color ? i.color.hex : undefined,
        })),
        customer: form,
        token,
        couponCode: coupon?.coupon?.code || couponCode.trim() || undefined,
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
            .then((data) => {
              if (data?.status === "success") {
                setStatus("success");
              } else {
                setStatus("error");
                setErrorMsg("Payment could not be confirmed yet. Please contact us if this persists.");
              }
            })
            .catch(() => {
              setStatus("error");
              setErrorMsg("Payment confirmation hit an issue. Please contact us with your reference.");
            });
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
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        {!user && !loading && status !== "success" && (
          <div className="mb-4 rounded-xl bg-gold/10 p-3 text-sm text-ink/80">
            Please sign in or create an account to complete your order. This helps us track your purchases and send you updates.
          </div>
        )}
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

            {user ? (
              <div className="rounded-3xl border border-ink/10 bg-cream p-4 text-sm text-ink/80">
                Signed in as <span className="font-semibold text-ink">{user.email}</span>
                {user.phone ? ` · ${user.phone}` : ""}
              </div>
            ) : null}
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

              {/* Coupon */}
              <div className="space-y-2">
                {!coupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      className="focus-ring flex-1 rounded-xl border border-ink/10 px-4 py-3 text-sm uppercase"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={couponLoading || !couponCode.trim()}
                      className="focus-ring rounded-xl bg-ink px-4 py-3 text-sm font-600 text-cream disabled:opacity-50"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between rounded-xl bg-gold/10 px-4 py-2.5">
                    <div>
                      <p className="text-sm font-700 text-ink">{coupon.coupon.code}</p>
                      <p className="text-xs text-ink/60">-{formatGHS(coupon.discount)} off</p>
                    </div>
                    <button type="button" onClick={() => { setCoupon(null); setCouponCode(""); }} className="text-xs text-signal hover:underline">Remove</button>
                  </div>
                )}
                {couponError && <p className="text-xs text-signal">{couponError}</p>}
              </div>

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
              {!user && (
                <button
                  type="button"
                  onClick={() => setShowAuth(true)}
                  className="focus-ring mt-3 w-full rounded-full border border-ink/10 bg-ink/5 py-3 text-sm font-600 text-ink hover:bg-ink/10"
                >
                  Sign in or create account to checkout
                </button>
              )}
            </form>
          </>
        )}
        {showAuth && (
          <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        )}
      </div>
    </div>
  );
}
