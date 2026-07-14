import React, { useEffect, useState } from "react";
import { Badge, Button, Drawer, EmptyState, Field, Input, Spinner } from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { formatGHS } from "../../lib/format.js";
import {
  apiCreateTradein,
  apiDeleteTradein,
  apiFetchTradein,
  apiUpdateTradein,
} from "../api.js";

const CONDITIONS = [
  ["Excellent", 0.85],
  ["Good", 0.7],
  ["Fair", 0.5],
  ["Faulty", 0.25],
];

export default function TradeInPage() {
  const { adminKey, notify, logout, confirm } = useAdmin();
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", baseValue: "" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetchTradein(adminKey);
      setDevices(data);
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Failed to load trade-in devices", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAdd() {
    setEditing(null);
    setForm({ name: "", baseValue: "" });
    setDrawerOpen(true);
  }

  function openEdit(d) {
    setEditing(d);
    setForm({ name: d.name, baseValue: String(d.baseValue) });
    setDrawerOpen(true);
  }

  async function handleSave() {
    if (!form.name.trim() || form.baseValue === "") {
      notify("Name and base value are required.", "error");
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        await apiUpdateTradein(adminKey, editing.id, {
          name: form.name.trim(),
          baseValue: Number(form.baseValue),
        });
        notify(`Updated "${form.name.trim()}".`);
      } else {
        await apiCreateTradein(adminKey, {
          name: form.name.trim(),
          baseValue: Number(form.baseValue),
        });
        notify(`Added "${form.name.trim()}".`);
      }
      setDrawerOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Save failed", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(d) {
    const ok = await confirm({
      title: "Remove device?",
      message: `"${d.name}" will no longer appear in the trade-in estimator.`,
      confirmLabel: "Remove",
    });
    if (!ok) return;
    try {
      await apiDeleteTradein(adminKey, d.id);
      notify(`Removed "${d.name}".`);
      await load();
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Delete failed", "error");
      }
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Trade-in values</h1>
          <p className="text-sm text-ink/50">
            Base values used by the iSwap estimator. Final offer is confirmed in-store.
          </p>
        </div>
        <Button onClick={openAdd}>＋ Add device</Button>
      </header>

      <div className="mt-5 flex flex-wrap gap-2 rounded-2xl bg-white p-4 ring-1 ring-ink/5">
        <span className="text-xs font-600 uppercase tracking-wide text-ink/40">Condition multipliers</span>
        {CONDITIONS.map(([label, mult]) => (
          <Badge key={label} tone="violet">
            {label}: {Math.round(mult * 100)}%
          </Badge>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-ink/40">
          <Spinner className="h-7 w-7" />
        </div>
      ) : devices.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No devices yet"
          hint="Add a device so customers can get trade-in quotes."
          action={<Button onClick={openAdd}>＋ Add device</Button>}
        />
      ) : (
        <div className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Device</th>
                <th className="px-4 py-3">Base value</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {devices.map((d) => (
                <tr key={d.id} className="hover:bg-cream/60">
                  <td className="px-4 py-3 font-600 text-ink">{d.name}</td>
                  <td className="px-4 py-3 font-display font-700 text-ink">{formatGHS(d.baseValue)}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => openEdit(d)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        className="px-3 py-1.5 text-xs text-signal"
                        onClick={() => handleDelete(d)}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        title={editing ? "Edit device" : "Add device"}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col gap-4"
        >
          <Field label="Device name">
            <Input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="iPhone 16 Pro Max"
            />
          </Field>
          <Field label="Base value (GHS)" hint="Top value before condition multiplier">
            <Input
              required
              type="number"
              min="0"
              value={form.baseValue}
              onChange={(e) => setForm((f) => ({ ...f, baseValue: e.target.value }))}
              placeholder="9500"
            />
          </Field>

          <div className="sticky bottom-0 -mx-6 -mb-5 border-t border-ink/10 bg-cream px-6 py-4">
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : editing ? "Save changes" : "Add device"}
            </Button>
          </div>
        </form>
      </Drawer>
    </div>
  );
}
