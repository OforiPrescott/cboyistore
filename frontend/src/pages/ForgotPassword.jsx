import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../lib/api.js";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("email");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await forgotPassword({ email: method === "email" ? email : undefined, phone: method === "phone" ? phone : undefined });
      setSent(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-[70vh] max-w-md px-6 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/5">
        <div className="mb-6">
          <p className="text-sm font-600 uppercase tracking-[0.2em] text-signal">Account</p>
          <h1 className="mt-2 font-display text-3xl font-700 text-ink">Reset your password</h1>
          <p className="mt-2 text-sm text-ink/60">Enter your email or phone and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="rounded-2xl bg-gold/10 p-4 text-sm text-ink/80">
            If an account exists with that {method}, you'll receive a password reset link shortly. Please check your inbox and spam folder.
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <div className="flex rounded-xl bg-cream p-1">
              <button type="button" onClick={() => setMethod("email")} className={`flex-1 rounded-lg py-2 text-xs font-600 ${method === "email" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}>Email</button>
              <button type="button" onClick={() => setMethod("phone")} className={`flex-1 rounded-lg py-2 text-xs font-600 ${method === "phone" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}>Phone</button>
            </div>

            {method === "email" ? (
              <input className="focus-ring w-full rounded-xl border border-ink/10 px-4 py-3 text-sm" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            ) : (
              <div className="flex gap-2">
                <span className="flex items-center rounded-xl border border-ink/10 bg-cream px-3 py-3 text-xs text-ink/60">+233</span>
                <input className="focus-ring flex-1 rounded-xl border border-ink/10 px-4 py-3 text-sm" type="tel" placeholder="541 533 365" value={phone} onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))} required />
              </div>
            )}

            {error && <p className="text-sm text-signal">{error}</p>}

            <button type="submit" disabled={loading} className="focus-ring w-full rounded-full bg-signal-gradient py-3.5 font-600 text-white shadow-lg shadow-signal/30 disabled:opacity-60">
              {loading ? "Sending..." : "Send reset link"}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-xs text-ink/50">
          Remember your password? <Link to="/" className="font-700 text-signal hover:underline">Back to shop</Link>
        </p>
      </div>
    </div>
  );
}
