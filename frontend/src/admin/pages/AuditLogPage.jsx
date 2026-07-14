import React, { useEffect, useState } from "react";
import { Badge, EmptyState, Input, Spinner } from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { apiFetchAudit, apiFetchAuditSummary } from "../api.js";

const ACTION_COLORS = {
  "worker.login": "bg-emerald-50 text-emerald-700",
  "worker.logout": "bg-ink/5 text-ink/60",
  "worker.created": "bg-violet/10 text-violet",
  "worker.updated": "bg-blue-50 text-blue-700",
  "worker.deleted": "bg-signal/10 text-signal",
  "product.created": "bg-emerald-50 text-emerald-700",
  "product.updated": "bg-blue-50 text-blue-700",
  "product.deleted": "bg-signal/10 text-signal",
  "order.created": "bg-emerald-50 text-emerald-700",
  "order.status_changed": "bg-gold/20 text-ink",
  "customer.deleted": "bg-signal/10 text-signal",
  "tradein.device_created": "bg-emerald-50 text-emerald-700",
  "tradein.device_updated": "bg-blue-50 text-blue-700",
  "tradein.device_deleted": "bg-signal/10 text-signal",
};

export default function AuditLogPage() {
  const { adminKey, notify } = useAdmin();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  async function load() {
    setLoading(true);
    try {
      const [logs, sum] = await Promise.all([
        apiFetchAudit(adminKey, { q: query, action: actionFilter, page, limit }),
        apiFetchAuditSummary(adminKey).catch(() => null),
      ]);
      setEntries(logs.entries || []);
      setTotal(logs.total || 0);
      setSummary(sum);
    } catch (err) {
      notify(err.message || "Failed to load audit log", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, actionFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Audit log</h1>
          <p className="text-sm text-ink/50">{total} events recorded</p>
        </div>
      </header>

      {summary && (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/5">
            <p className="text-xs font-600 uppercase tracking-wide text-ink/40">Total events</p>
            <p className="mt-1 font-display text-2xl font-700 text-ink">{summary.total}</p>
            <p className="text-xs text-ink/40">{summary.last7Days} in last 7 days</p>
          </div>
          {Object.entries(summary.byAction || {}).slice(0, 3).map(([action, count]) => (
            <div key={action} className="rounded-2xl bg-white p-4 ring-1 ring-ink/5">
              <p className="text-xs font-600 uppercase tracking-wide text-ink/40">{action.replace(/\./g, " ")}</p>
              <p className="mt-1 font-display text-2xl font-700 text-ink">{count}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search worker, action, details…"
          className="max-w-md"
        />
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(1); }}
          className="focus-ring rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-600 text-ink/70"
        >
          <option value="">All actions</option>
          <option value="worker.login">Worker login</option>
          <option value="worker.created">Worker created</option>
          <option value="worker.updated">Worker updated</option>
          <option value="worker.deleted">Worker deleted</option>
          <option value="product.created">Product created</option>
          <option value="product.updated">Product updated</option>
          <option value="product.deleted">Product deleted</option>
          <option value="order.created">Order created</option>
          <option value="order.status_changed">Order status changed</option>
          <option value="customer.deleted">Customer deleted</option>
          <option value="tradein.device_created">Trade-in device created</option>
          <option value="tradein.device_updated">Trade-in device updated</option>
          <option value="tradein.device_deleted">Trade-in device deleted</option>
        </select>
        <button
          onClick={load}
          className="focus-ring rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-600 text-ink transition hover:bg-ink/5"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-ink/40">
          <Spinner className="h-7 w-7" />
        </div>
      ) : entries.length === 0 ? (
        <EmptyState className="mt-6" title="No audit entries" hint="Actions will appear here as they happen." />
      ) : (
        <div className="mt-6 space-y-3">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge tone={ACTION_COLORS[entry.action] ? "neutral" : "neutral"} className={ACTION_COLORS[entry.action] || "bg-ink/5 text-ink/60"}>
                    {entry.action.replace(/\./g, " ")}
                  </Badge>
                  {entry.workerName && <span className="text-sm font-600 text-ink">{entry.workerName}</span>}
                  <span className="text-xs text-ink/40 capitalize">({entry.workerRole || "admin"})</span>
                </div>
                <span className="text-xs text-ink/40">{new Date(entry.timestamp).toLocaleString()}</span>
              </div>
              {entry.details && <p className="mt-2 text-sm text-ink/70">{entry.details}</p>}
              {entry.target && (
                <p className="mt-1 text-xs text-ink/40">Target: {entry.targetType || "unknown"} / {entry.target}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="focus-ring rounded-full border border-ink/10 px-4 py-2 text-sm font-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-ink/60">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="focus-ring rounded-full border border-ink/10 px-4 py-2 text-sm font-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
