import React, { useEffect, useMemo, useRef, useState } from "react";
import { AreaChart, BarRow, Donut, Sparkline } from "../charts.jsx";
import { Badge, Button, Card, EmptyState, Skeleton, cx } from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { formatGHS } from "../../lib/format.js";
import { apiFetchOrders, apiFetchProducts } from "../api.js";

const RANGES = [
  { key: 7, label: "7d" },
  { key: 14, label: "14d" },
  { key: 30, label: "30d" },
];

const STATUS_COLORS = {
  paid: "#25D366",
  fulfilled: "#6C3CE0",
  pending: "#F2B705",
  cancelled: "#FF5A36",
};

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function dayKey(d) {
  return new Date(d).toISOString().slice(0, 10);
}

export default function AnalyticsPage() {
  const { adminKey, notify, logout } = useAdmin();
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(14);
  const [auto, setAuto] = useState(true);
  const [updatedAt, setUpdatedAt] = useState(null);
  const loadRef = useRef();

  async function load() {
    try {
      const [p, o] = await Promise.all([apiFetchProducts(), apiFetchOrders(adminKey)]);
      setProducts(p);
      setOrders(o);
      setUpdatedAt(new Date());
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Failed to load analytics", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRef.current = load;
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!auto) return;
    const id = setInterval(() => loadRef.current && loadRef.current(), 30000);
    return () => clearInterval(id);
  }, [auto]);

  const productById = useMemo(() => {
    const m = {};
    for (const p of products) m[p.id] = p;
    return m;
  }, [products]);

  const stats = useMemo(() => {
    const paid = orders.filter((o) => o.status === "paid" || o.status === "fulfilled");
    const pending = orders.filter((o) => o.status === "pending");
    const paidRevenue = paid.reduce((s, o) => s + o.total, 0);
    const pendingRevenue = pending.reduce((s, o) => s + o.total, 0);
    const gross = orders.reduce((s, o) => s + o.total, 0);
    const itemsSold = paid.reduce(
      (s, o) => s + o.items.reduce((n, it) => n + (it.qty || 1), 0),
      0
    );
    const avgPaid = paid.length ? paidRevenue / paid.length : 0;

    const statusValues = {};
    for (const o of orders) statusValues[o.status] = (statusValues[o.status] || 0) + o.total;

    return {
      paid,
      paidRevenue,
      pendingRevenue,
      gross,
      itemsSold,
      avgPaid,
      paidCount: paid.length,
      pendingCount: pending.length,
      orderCount: orders.length,
      statusValues,
    };
  }, [orders]);

  const trend = useMemo(() => {
    const days = [];
    const today = new Date();
    for (let i = range - 1; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(d);
    }
    const revByDay = {};
    const ordByDay = {};
    for (const d of days) revByDay[dayKey(d)] = 0;
    for (const o of stats.paid) {
      const k = dayKey(o.createdAt);
      if (k in revByDay) revByDay[k] += o.total;
    }
    const revenue = days.map((d) => Math.round(revByDay[dayKey(d)]));
    const labels = days.map((d) =>
      d.toLocaleDateString(undefined, { day: "numeric", month: "short" })
    );
    const inRangeRevenue = revenue.reduce((s, v) => s + v, 0);
    const spark = revenue.filter((v) => v > 0);
    return { revenue, labels, inRangeRevenue, spark };
  }, [stats.paid, range]);

  const topProducts = useMemo(() => {
    const rev = {};
    for (const o of stats.paid) {
      for (const it of o.items) {
        const key = it.id || it.name;
        rev[key] = (rev[key] || 0) + it.price * (it.qty || 1);
      }
    }
    return Object.entries(rev)
      .map(([id, value]) => ({
        id,
        name: productById[id]?.name || id,
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  }, [stats.paid, productById]);

  const categoryRev = useMemo(() => {
    const rev = {};
    for (const o of stats.paid) {
      for (const it of o.items) {
        const cat = productById[it.id]?.category || "other";
        rev[cat] = (rev[cat] || 0) + it.price * (it.qty || 1);
      }
    }
    return Object.entries(rev)
      .map(([cat, value]) => ({ cat, value }))
      .sort((a, b) => b.value - a.value);
  }, [stats.paid, productById]);

  const statusSegments = useMemo(
    () =>
      Object.entries(stats.statusValues).map(([status, value]) => ({
        label: status,
        value,
        color: STATUS_COLORS[status] || "#94a3b8",
      })),
    [stats.statusValues]
  );

  const maxTop = topProducts.length ? topProducts[0].value : 1;
  const maxCat = categoryRev.length ? categoryRev[0].value : 1;
  const maxStatus = statusSegments.length ? Math.max(...statusSegments.map((s) => s.value)) : 1;

  if (loading) {
    return <AnalyticsSkeleton />;
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Analytics</h1>
          <p className="text-sm text-ink/50">
            Sales, payments and performance &middot; updated{" "}
            {updatedAt ? updatedAt.toLocaleTimeString() : "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAuto((a) => !a)}
            className={cx(
              "focus-ring rounded-full px-3 py-1.5 text-xs font-600 ring-1 transition",
              auto ? "bg-emerald-100 text-emerald-700 ring-emerald-200" : "bg-white text-ink/50 ring-ink/10"
            )}
          >
            ● Live {auto ? "on" : "off"}
          </button>
          <Button variant="outline" onClick={load}>
            ↻ Refresh
          </Button>
        </div>
      </header>

      {/* KPI row */}
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi
          label="Paid revenue"
          value={formatGHS(stats.paidRevenue)}
          sub={`${stats.paidCount} paid orders`}
          tone="signal"
          spark={trend.spark}
          sparkColor="#FF5A36"
        />
        <Kpi
          label="Pending revenue"
          value={formatGHS(stats.pendingRevenue)}
          sub={`${stats.pendingCount} awaiting payment`}
          tone="gold"
        />
        <Kpi
          label="Avg. paid order"
          value={formatGHS(Math.round(stats.avgPaid))}
          sub={`${stats.itemsSold} items sold`}
          tone="violet"
        />
        <Kpi label="Gross (all orders)" value={formatGHS(stats.gross)} sub={`${stats.orderCount} total`} tone="neutral" />
      </div>

      {/* Sales trend */}
      <Card className="mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-700 text-ink">Sales trend</h2>
            <p className="text-sm text-ink/50">
              {formatGHS(trend.inRangeRevenue)} paid in the last {range} days
            </p>
          </div>
          <div className="flex gap-1 rounded-full bg-ink/5 p-1">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={cx(
                  "focus-ring rounded-full px-3 py-1 text-xs font-600 transition",
                  range === r.key ? "bg-ink text-cream" : "text-ink/50 hover:text-ink"
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <AreaChart data={trend.revenue} labels={trend.labels} formatValue={formatGHS} />
        </div>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Payment status */}
        <Card>
          <h2 className="font-display text-lg font-700 text-ink">Payment status</h2>
          <div className="mt-4 flex items-center gap-6">
            <Donut segments={statusSegments} />
            <div className="flex-1 space-y-2">
              {statusSegments.length === 0 && (
                <p className="text-sm text-ink/40">No orders yet.</p>
              )}
              {statusSegments.map((s) => (
                <div key={s.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 capitalize text-ink/70">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                  <span className="font-600 text-ink">{formatGHS(Math.round(s.value))}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Payments coming in */}
        <Card>
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg font-700 text-ink">Payments coming in</h2>
            <Badge tone="green">{stats.paidCount} paid</Badge>
          </div>
          {stats.paid.length === 0 ? (
            <EmptyState className="mt-4" title="No payments yet" hint="Paid orders will stream in here." />
          ) : (
            <ul className="mt-3 max-h-64 space-y-2 overflow-y-auto">
              {stats.paid.slice(0, 12).map((o) => (
                <li
                  key={o.id}
                  className="flex items-center justify-between rounded-2xl bg-cream/60 px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-600 text-ink">{o.customer?.name}</p>
                    <p className="text-xs text-ink/40">
                      {o.reference} &middot; {timeAgo(o.createdAt)}
                    </p>
                  </div>
                  <span className="font-display text-sm font-700 text-emerald-600">
                    +{formatGHS(o.total)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Breakdowns */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-display text-lg font-700 text-ink">Top products by revenue</h2>
          {topProducts.length === 0 ? (
            <EmptyState className="mt-4" title="No sales yet" />
          ) : (
            <div className="mt-4 space-y-4">
              {topProducts.map((p) => (
                <BarRow
                  key={p.id}
                  label={p.name}
                  value={p.value}
                  max={maxTop}
                  sub={formatGHS(p.value)}
                  tone="#FF5A36"
                  format={formatGHS}
                />
              ))}
            </div>
          )}
        </Card>

        <Card>
          <h2 className="font-display text-lg font-700 text-ink">Revenue by category</h2>
          {categoryRev.length === 0 ? (
            <EmptyState className="mt-4" title="No sales yet" />
          ) : (
            <div className="mt-4 space-y-4">
              {categoryRev.map((c) => (
                <BarRow
                  key={c.cat}
                  label={c.cat}
                  value={c.value}
                  max={maxCat}
                  sub={formatGHS(c.value)}
                  tone="#6C3CE0"
                  format={formatGHS}
                />
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function Kpi({ label, value, sub, tone = "neutral", spark, sparkColor }) {
  const accents = {
    signal: "text-signal",
    gold: "text-gold",
    violet: "text-violet",
    neutral: "text-ink",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-600 uppercase tracking-wide text-ink/40">{label}</p>
          <p className={cx("mt-1 font-display text-2xl font-700", accents[tone])}>{value}</p>
        </div>
        {spark && spark.length > 1 && <Sparkline data={spark} color={sparkColor} />}
      </div>
      {sub && <p className="mt-1 text-xs text-ink/40">{sub}</p>}
    </Card>
  );
}

function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <Skeleton className="h-8 w-40" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-10 w-28 rounded-full" />
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-3xl" />
        ))}
      </div>
      <Skeleton className="mt-6 h-64 rounded-3xl" />
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
