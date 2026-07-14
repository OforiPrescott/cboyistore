import React, { useEffect, useState } from "react";
import { Badge, EmptyState, Input, Spinner } from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { formatGHS } from "../../lib/format.js";
import { apiFetchCustomers } from "../api.js";

export default function CustomersPage() {
  const { adminKey, notify, logout } = useAdmin();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetchCustomers(adminKey);
      setCustomers(data);
    } catch (err) {
      if (err.status === 401 || err.status === 403) {
        notify("Admin access denied. Please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Failed to load customers", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = customers.filter((customer) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      customer.name.toLowerCase().includes(q) ||
      customer.email.toLowerCase().includes(q) ||
      (customer.phone || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Customers</h1>
          <p className="text-sm text-ink/50">{customers.length} registered customers</p>
        </div>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name, email, or phone…"
          className="max-w-md"
        />
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
      ) : filtered.length === 0 ? (
        <EmptyState className="mt-6" title="No customers found" hint="Try a different search." />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Last login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-cream/80">
                  <td className="px-4 py-3 font-600 text-ink">{customer.name}</td>
                  <td className="px-4 py-3 text-ink/60">{customer.email}</td>
                  <td className="px-4 py-3 text-ink/60">{customer.phone || "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{customer.location || "—"}</td>
                  <td className="px-4 py-3 text-ink/60">{new Date(customer.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-ink/60">{customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleDateString() : "Never"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
