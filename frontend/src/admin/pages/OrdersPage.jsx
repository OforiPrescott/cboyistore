import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Drawer, EmptyState, Input, Spinner, cx } from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { formatGHS } from "../../lib/format.js";
import { apiFetchOrders, apiUpdateOrderStatus } from "../api.js";

const STATUS_TONE = {
  pending: "neutral",
  paid: "gold",
  fulfilled: "green",
  cancelled: "red",
};
const STATUS_ORDER = ["pending", "paid", "fulfilled", "cancelled"];

function statusBadge(status) {
  return <Badge tone={STATUS_TONE[status] || "neutral"}>{status}</Badge>;
}

export default function OrdersPage() {
  const { adminKey, notify, logout } = useAdmin();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetchOrders(adminKey);
      setOrders(data);
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Failed to load orders", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      const matchStatus = statusFilter === "all" ? true : o.status === statusFilter;
      const matchQuery = q
        ? o.reference.toLowerCase().includes(q) ||
          (o.customer?.name || "").toLowerCase().includes(q) ||
          (o.customer?.phone || "").toLowerCase().includes(q)
        : true;
      return matchStatus && matchQuery;
    });
  }, [orders, query, statusFilter]);

  async function changeStatus(order, status) {
    setUpdating(true);
    try {
      await apiUpdateOrderStatus(adminKey, order.reference, status);
      notify(`Order ${order.reference} marked ${status}.`);
      setSelected({ ...order, status });
      await load();
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Update failed", "error");
      }
    } finally {
      setUpdating(false);
    }
  }

  const counts = useMemo(() => {
    const c = { all: orders.length };
    for (const s of STATUS_ORDER) c[s] = orders.filter((o) => o.status === s).length;
    return c;
  }, [orders]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Orders</h1>
          <p className="text-sm text-ink/50">{orders.length} total</p>
        </div>
        <Button variant="outline" onClick={load}>
          ↻ Refresh
        </Button>
      </header>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search reference, name or phone…"
          className="max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {["all", ...STATUS_ORDER].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cx(
                "focus-ring rounded-full px-3 py-1.5 text-xs font-600 capitalize transition",
                statusFilter === s
                  ? "bg-ink text-cream"
                  : "bg-white text-ink/60 ring-1 ring-ink/10 hover:bg-ink/5"
              )}
            >
              {s} ({counts[s]})
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-ink/40">
          <Spinner className="h-7 w-7" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState className="mt-6" title="No orders match" hint="Adjust the filters to see more." />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Placed</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="cursor-pointer hover:bg-cream/60"
                >
                  <td className="px-4 py-3 font-600 text-ink">{o.reference}</td>
                  <td className="px-4 py-3">
                    {o.customer?.name}
                    <p className="text-xs text-ink/40">{o.customer?.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{o.items?.length || 0}</td>
                  <td className="px-4 py-3 font-600">{formatGHS(o.total)}</td>
                  <td className="px-4 py-3 text-xs text-ink/40">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{statusBadge(o.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        title={selected ? selected.reference : "Order"}
        width="max-w-lg"
        footer={
          selected && (
            <div className="flex flex-wrap gap-2">
              {STATUS_ORDER.map((s) => (
                <Button
                  key={s}
                  variant={selected.status === s ? "dark" : "outline"}
                  className="px-3 py-2 text-xs capitalize"
                  disabled={updating}
                  onClick={() => changeStatus(selected, s)}
                >
                  {s}
                </Button>
              ))}
            </div>
          )
        }
      >
        {selected && (
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between">
              {statusBadge(selected.status)}
              <span className="text-xs text-ink/40">
                {new Date(selected.createdAt).toLocaleString()}
              </span>
            </div>

            <section>
              <p className="text-xs font-600 uppercase tracking-wide text-ink/40">Customer</p>
              <div className="mt-2 space-y-1 text-sm">
                <p className="font-600 text-ink">{selected.customer?.name}</p>
                <p className="text-ink/60">{selected.customer?.phone}</p>
                {selected.customer?.email && (
                  <p className="text-ink/60">{selected.customer.email}</p>
                )}
                <p className="text-ink/60">
                  {selected.customer?.deliveryMethod === "pickup"
                    ? "Pickup at Tafo American Building"
                    : `Delivery — ${selected.customer?.address || "nationwide"}`}
                </p>
                {selected.customer?.city && (
                  <p className="text-ink/60">City: {selected.customer.city}</p>
                )}
              </div>
            </section>

            <section>
              <p className="text-xs font-600 uppercase tracking-wide text-ink/40">Items</p>
              <ul className="mt-2 divide-y divide-ink/5 rounded-2xl bg-white ring-1 ring-ink/5">
                {selected.items?.map((it, i) => (
                  <li key={i} className="flex items-center justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-600 text-ink">{it.name}</p>
                      <p className="text-xs text-ink/40">
                        {formatGHS(it.price)} × {it.qty}
                        {it.variant ? ` · ${it.variant}` : ""}
                      </p>
                    </div>
                    <p className="font-600 text-ink">{formatGHS(it.price * it.qty)}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-2 flex justify-between border-t border-ink/10 px-1 pt-2 text-sm font-700">
                <span>Total</span>
                <span className="font-display">{formatGHS(selected.total)}</span>
              </div>
            </section>

            {selected.whatsappLink && (
              <a
                href={selected.whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="focus-ring rounded-full bg-[#25D366] px-4 py-3 text-center text-sm font-600 text-white hover:opacity-90"
              >
                Open customer WhatsApp
              </a>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}
