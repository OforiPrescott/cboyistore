import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchMyOrders, apiDeleteMyAccount } from "../lib/api.js";
import { formatGHS } from "../lib/format.js";

export default function OrdersPage() {
  const { user, token, logout } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  async function load() {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await fetchMyOrders(token);
      setOrders(data);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function handleDeleteAccount() {
    if (confirmText !== "DELETE") return;
    setDeleting(true);
    setError("");
    try {
      await apiDeleteMyAccount(token);
      logout();
    } catch (err) {
      setError(err.message || "Failed to delete account. Please try again.");
      setDeleting(false);
    }
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="font-display text-3xl font-700 text-ink">Your orders</h1>
        <p className="mt-3 text-sm text-ink/60">Sign in to see the orders you’ve placed with Cboyistore.</p>
        <Link to="/" className="mt-6 rounded-full bg-ink px-6 py-3 text-sm font-600 text-cream">
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-10 lg:px-8">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="text-sm font-600 uppercase tracking-[0.25em] text-signal">Account</p>
          <h1 className="mt-1 font-display text-3xl font-700 text-ink">Order history</h1>
          <p className="mt-2 text-sm text-ink/60">Track your recent purchases and payment status.</p>
        </div>
      </div>

      {loading ? (
        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 text-sm text-ink/60">
          Loading your recent orders…
        </div>
      ) : orders.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-ink/10 bg-white p-6 text-sm text-ink/60">
          You have not placed any orders yet.
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-600 text-ink">{order.reference}</p>
                  <p className="text-xs text-ink/40">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="rounded-full bg-cream px-3 py-1 text-xs font-600 uppercase tracking-wide text-ink/60">
                  {order.status}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-ink/60">
                <span>
                  {order.items?.length || 0} item{(order.items?.length || 0) === 1 ? "" : "s"}
                  {order.items?.map((it) => (
                    <span key={it.id}>
                      {it.storage ? ` · ${it.storage}` : ""}
                      {it.color ? ` · ${it.color}` : ""}
                      {it.colorHex ? (
                        <span className="ml-1 inline-flex items-center gap-1">
                          <span className="h-3 w-3 rounded-full border border-ink/10" style={{ backgroundColor: it.colorHex }} />
                        </span>
                      ) : null}
                    </span>
                  ))}
                </span>
                <span className="font-700 text-ink">{formatGHS(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-3xl border border-signal/20 bg-white p-6 shadow-sm">
        <h2 className="font-display text-lg font-700 text-ink">Danger zone</h2>
        <p className="mt-1 text-sm text-ink/50">
          Deleting your account is permanent. All your orders, trade-in requests and personal data will be removed.
        </p>
        {error && <p className="mt-3 text-sm text-signal">{error}</p>}
        <div className="mt-4">
          <label className="block text-xs font-600 text-ink/50">
            Type <span className="font-700 text-ink">DELETE</span> to confirm
          </label>
          <input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="DELETE"
            className="focus-ring mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm"
          />
          <button
            onClick={handleDeleteAccount}
            disabled={deleting || confirmText !== "DELETE"}
            className="focus-ring mt-3 rounded-full bg-signal px-5 py-2.5 text-sm font-600 text-white shadow-lg shadow-signal/30 transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Permanently delete my account"}
          </button>
        </div>
      </div>
    </div>
  );
}
