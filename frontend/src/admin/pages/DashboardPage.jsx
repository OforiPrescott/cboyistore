import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge, Card, EmptyState, Skeleton, cx } from "../ui.jsx";
import { Sparkline, BarRow, Donut } from "../charts.jsx";
import { categories } from "../../data/categories.js";
import { useAdmin } from "../AdminContext.jsx";
import { formatGHS } from "../../lib/format.js";
import {
  apiFetchProducts,
  apiFetchOrders,
  apiFetchTradein,
} from "../api.js";

function dayKey(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function DashboardPage() {
  const { adminKey, notify, logout } = useAdmin();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tradein, setTradein] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const [p, o, t] = await Promise.all([
        apiFetchProducts(),
        apiFetchOrders(adminKey),
        apiFetchTradein(adminKey),
      ]);
      setProducts(p);
      setOrders(o);
      setTradein(t);
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Failed to load dashboard", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // All hooks must run in the same order on every render — keep every
  // useMemo above any early return, otherwise React throws
  // "Rendered more hooks than during the previous render" the moment
  // `loading` flips false.
  const revenueSpark = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    const byDay = {};
    for (const d of days) byDay[dayKey(d)] = 0;
    const paid = orders.filter((o) => o.status === "paid" || o.status === "fulfilled");
    for (const o of paid) {
      const k = dayKey(o.createdAt);
      if (k in byDay) byDay[k] += o.total;
    }
    return days.map((d) => Math.round(byDay[dayKey(d)]));
  }, [orders]);

  const paidOrders = orders.filter((o) => o.status === "paid" || o.status === "fulfilled");
  const revenue = paidOrders.reduce((s, o) => s + o.total, 0);
  const linkedOrders = orders.filter((o) => Boolean(o.userId));
  const linkedRevenue = linkedOrders
    .filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, o) => sum + o.total, 0);
  const linkedAccounts = useMemo(
    () => new Set(linkedOrders.map((o) => o.userId)).size,
    [linkedOrders]
  );
  const orderRate = orders.length ? Math.round((linkedOrders.length / orders.length) * 100) : 0;
  const activeCustomers = linkedAccounts;
  const pending = orders.filter((o) => o.status === "pending").length;
  const lowStock = products.filter((p) => typeof p.stock === "number" && p.stock <= 5);
  const outOfStock = products.filter((p) => p.stock === 0);

  const categoryCounts = useMemo(() => {
    const counts = {};
    for (const p of products) counts[p.category] = (counts[p.category] || 0) + 1;
    return categories
      .filter((c) => c.id !== "all")
      .map((c) => ({ label: c.label, value: counts[c.id] || 0 }));
  }, [products]);

  const stockHealth = useMemo(() => {
    let inStock = 0;
    let low = 0;
    let out = 0;
    for (const p of products) {
      if (p.stock === 0) out += 1;
      else if (typeof p.stock === "number" && p.stock <= 5) low += 1;
      else inStock += 1;
    }
    return [
      { label: "Healthy", value: inStock, color: "#25D366" },
      { label: "Low (≤5)", value: low, color: "#F2B705" },
      { label: "Out", value: out, color: "#FF5A36" },
    ];
  }, [products]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/5 px-3 py-1 text-xs font-600 text-ink/50">
            <span className="h-2 w-2 rounded-full bg-emerald-500" /> Store live
          </span>
          <h1 className="mt-2 font-display text-2xl font-700 text-ink">Dashboard</h1>
          <p className="text-sm text-ink/50">
            {products.length} products &middot; {orders.length} orders &middot; Tafo, Kumasi
          </p>
        </div>
        <Link
          to="/analytics"
          className="focus-ring rounded-full bg-signal-gradient px-4 py-2.5 text-sm font-600 text-white shadow-sm"
        >
          View analytics →
        </Link>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-5">
        <ModernStat
          label="Paid revenue"
          value={formatGHS(revenue)}
          sub={`${paidOrders.length} paid orders`}
          tone="signal"
          spark={revenueSpark}
        />
        <ModernStat
          label="Account-linked orders"
          value={linkedOrders.length}
          sub={`${linkedAccounts} linked accounts`}
          tone="violet"
        />
        <ModernStat
          label="Customer order rate"
          value={`${orderRate}%`}
          sub="Signed-in order share"
          tone="gold"
        />
        <ModernStat label="Pending orders" value={pending} sub="awaiting payment" tone="gold" />
        <ModernStat label="Low stock" value={lowStock.length} sub="≤ 5 units left" tone="neutral" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-700 text-ink">Customer order report</h2>
            <Link to="/customers" className="text-xs font-600 text-violet hover:underline">
              View customers
            </Link>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-ink/10 bg-cream p-5">
              <p className="text-xs font-600 uppercase tracking-wide text-ink/40">Linked revenue</p>
              <p className="mt-2 text-2xl font-700 text-ink">{formatGHS(linkedRevenue)}</p>
              <p className="mt-1 text-xs text-ink/50">Paid revenue from account-linked orders</p>
            </div>
            <div className="rounded-3xl border border-ink/10 bg-cream p-5">
              <p className="text-xs font-600 uppercase tracking-wide text-ink/40">Active customers</p>
              <p className="mt-2 text-2xl font-700 text-ink">{activeCustomers}</p>
              <p className="mt-1 text-xs text-ink/50">Customers who placed at least one order</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-700 text-ink">Recent orders</h2>
            <Link to="/orders" className="text-xs font-600 text-violet hover:underline">
              View all
            </Link>
          </div>
          {orders.length === 0 ? (
            <EmptyState className="mt-4" title="No orders yet" hint="New orders appear here in real time." />
          ) : (
            <ul className="mt-3 divide-y divide-ink/5">
              {orders.slice(0, 5).map((o) => (
                <li key={o.id} className="flex items-center justify-between py-3">
                  <button onClick={() => navigate("/orders")} className="text-left">
                    <p className="text-sm font-600 text-ink">{o.reference}</p>
                    <p className="text-xs text-ink/40">
                      {(o.customer?.name || "Guest")} &middot; {formatGHS(o.total)}
                    </p>
                  </button>
                  <Badge tone={o.status === "paid" || o.status === "fulfilled" ? "gold" : o.status === "pending" ? "neutral" : "violet"}>
                    {o.status}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-700 text-ink">Low stock watch</h2>
            <Link to="/products" className="text-xs font-600 text-violet hover:underline">
              Manage
            </Link>
          </div>
          {lowStock.length === 0 ? (
            <EmptyState className="mt-4" title="All stocked up" hint="No products at or below 5 units." />
          ) : (
            <ul className="mt-3 divide-y divide-ink/5">
              {lowStock.slice(0, 5).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-3">
                  <p className="text-sm font-600 text-ink">{p.name}</p>
                  <Badge tone={p.stock === 0 ? "red" : "gold"}>
                    {p.stock === 0 ? "Out of stock" : `${p.stock} left`}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-700 text-ink">Catalogue by category</h2>
          {categoryCounts.every((c) => c.value === 0) ? (
            <EmptyState className="mt-4" title="No products yet" />
          ) : (
            <div className="mt-4 space-y-4">
              {categoryCounts.map((c) => (
                <BarRow
                  key={c.label}
                  label={c.label}
                  value={c.value}
                  max={Math.max(...categoryCounts.map((x) => x.value))}
                  sub={`${c.value} item${c.value === 1 ? "" : "s"}`}
                  tone="#6C3CE0"
                />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-lg font-700 text-ink">Stock health</h2>
          <div className="mt-4 flex items-center gap-6">
            <Donut segments={stockHealth} />
            <div className="flex-1 space-y-2">
              {stockHealth.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-ink/70">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-600 text-ink">{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-700 text-ink">Catalogue &amp; tools</h2>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            <QuickLink to="/products" title="Products" desc="Add, edit or remove items" />
            <QuickLink to="/orders" title="Orders" desc="Track & fulfil orders" />
            <QuickLink to="/analytics" title="Analytics" desc="Sales & payments" />
            <QuickLink to="/trade-in" title="Trade-in" desc={`${tradein.length} device values`} />
          </div>
        </Card>
      </div>
    </div>
  );
}

function ModernStat({ label, value, sub, tone = "neutral", spark }) {
  const accents = {
    signal: "text-signal",
    gold: "text-gold",
    violet: "text-violet",
    neutral: "text-ink",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-600 uppercase tracking-wide text-ink/40">{label}</p>
          <p className={cx("mt-1 font-display text-2xl font-700", accents[tone])}>{value}</p>
          {sub && <p className="mt-1 text-xs text-ink/40">{sub}</p>}
        </div>
        {spark && spark.some((v) => v > 0) && (
          <Sparkline data={spark} color={tone === "signal" ? "#FF5A36" : "#6C3CE0"} />
        )}
      </div>
    </Card>
  );
}

function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Skeleton className="h-6 w-24" />
          <Skeleton className="mt-2 h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-36 rounded-full" />
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-3xl" />
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Skeleton className="h-64 rounded-3xl" />
        <Skeleton className="h-64 rounded-3xl" />
      </div>
    </div>
  );
}

function QuickLink({ to, title, desc }) {
  return (
    <Link
      to={to}
      className={cx(
        "focus-ring rounded-2xl border border-ink/10 bg-cream/60 p-4 transition hover:border-violet/40 hover:bg-violet/5"
      )}
    >
      <p className="font-display text-base font-700 text-ink">{title}</p>
      <p className="mt-0.5 text-xs text-ink/50">{desc}</p>
    </Link>
  );
}
