import React, { useEffect, useState } from "react";
import { Badge, Button, EmptyState, Input, Modal, Spinner } from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { apiFetchWorkers, apiCreateWorker, apiUpdateWorker, apiDeleteWorker, apiResetWorkerPassword } from "../api.js";

const ROLES = ["admin", "manager", "staff"];

export default function WorkersPage() {
  const { adminKey, workerInfo, notify, confirm } = useAdmin();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "staff" });
  const [saving, setSaving] = useState(false);
  const [resetWorker, setResetWorker] = useState(null);
  const [resetPassword, setResetPassword] = useState("");
  const [resetLoading, setResetLoading] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetchWorkers(adminKey);
      setWorkers(data);
    } catch (err) {
      notify(err.message || "Failed to load workers", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = workers.filter((w) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return w.name.toLowerCase().includes(q) || w.username.toLowerCase().includes(q);
  });

  async function handleCreate(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await apiCreateWorker(adminKey, form);
      setWorkers((prev) => [...prev, created]);
      setShowCreate(false);
      setForm({ name: "", username: "", password: "", role: "staff" });
      notify("Worker created", "success");
    } catch (err) {
      notify(err.message || "Failed to create worker", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(worker) {
    setSaving(true);
    try {
      const updated = await apiUpdateWorker(adminKey, worker.id, editing);
      setWorkers((prev) => prev.map((w) => (w.id === worker.id ? updated : w)));
      setEditing(null);
      notify("Worker updated", "success");
    } catch (err) {
      notify(err.message || "Failed to update worker", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(worker) {
    const ok = await confirm({
      title: "Delete worker?",
      message: `Remove ${worker.name} (${worker.username})? They will no longer be able to sign in.`,
      confirmLabel: "Delete",
      tone: "danger",
    });
    if (!ok) return;
    try {
      await apiDeleteWorker(adminKey, worker.id);
      setWorkers((prev) => prev.filter((w) => w.id !== worker.id));
      notify("Worker removed", "success");
    } catch (err) {
      notify(err.message || "Failed to delete worker", "error");
    }
  }

  async function handleResetPassword(worker) {
    if (!resetPassword || resetPassword.length < 8) {
      notify("Password must be at least 8 characters", "error");
      return;
    }
    setResetLoading(true);
    try {
      await apiResetWorkerPassword(adminKey, worker.id, resetPassword);
      notify(`Password reset for ${worker.name}`, "success");
      setResetWorker(null);
      setResetPassword("");
    } catch (err) {
      notify(err.message || "Failed to reset password", "error");
    } finally {
      setResetLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Workers</h1>
          <p className="text-sm text-ink/50">{workers.length} staff accounts</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>Add worker</Button>
      </header>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or username…"
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
        <EmptyState className="mt-6" title="No workers found" hint="Try a different search or add a new worker." />
      ) : (
        <div className="mt-6 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Last login</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {filtered.map((worker) => (
                <tr key={worker.id} className="hover:bg-cream/80">
                  <td className="px-4 py-3 font-600 text-ink">{worker.name}</td>
                  <td className="px-4 py-3 text-ink/60">{worker.username}</td>
                  <td className="px-4 py-3">
                    <select
                      value={worker.role}
                      onChange={async (e) => {
                        await handleUpdate({ ...worker, role: e.target.value });
                      }}
                      disabled={saving}
                      className="focus-ring rounded-lg border border-ink/10 bg-white px-2 py-1 text-xs font-600"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={async () => {
                        await handleUpdate({ ...worker, active: !worker.active });
                      }}
                      disabled={saving}
                      className={`focus-ring rounded-full px-3 py-1 text-xs font-600 ${
                        worker.active ? "bg-emerald-50 text-emerald-700" : "bg-ink/5 text-ink/40"
                      }`}
                    >
                      {worker.active ? "Active" : "Disabled"}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-ink/60">{new Date(worker.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-ink/60">{worker.lastLoginAt ? new Date(worker.lastLoginAt).toLocaleDateString() : "Never"}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setEditing({ ...worker, password: "" })}
                      disabled={saving}
                      className="focus-ring mr-2 rounded-full border border-ink/10 px-3 py-1.5 text-xs font-600 text-ink hover:bg-ink/5"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => { setResetWorker(worker); setResetPassword(""); }}
                      disabled={saving}
                      className="focus-ring mr-2 rounded-full border border-gold/30 px-3 py-1.5 text-xs font-600 text-gold hover:bg-gold/10"
                    >
                      Reset password
                    </button>
                    <button
                      onClick={() => handleDelete(worker)}
                      disabled={saving || worker.id === workerInfo?.id}
                      className="focus-ring rounded-full border border-signal/20 px-3 py-1.5 text-xs font-600 text-signal transition hover:bg-signal hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create worker modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Add worker">
        <form onSubmit={handleCreate} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-600 text-ink/50">Full name</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" required />
          </div>
          <div>
            <label className="block text-xs font-600 text-ink/50">Username</label>
            <Input value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} className="mt-1.5" required />
          </div>
          <div>
            <label className="block text-xs font-600 text-ink/50">Password</label>
            <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" required minLength={6} />
          </div>
          <div>
            <label className="block text-xs font-600 text-ink/50">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="focus-ring mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm"
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <Button type="submit" className="w-full" disabled={saving}>
            {saving ? "Creating…" : "Create worker"}
          </Button>
        </form>
      </Modal>

      {/* Edit worker modal */}
      <Modal open={Boolean(editing)} onClose={() => setEditing(null)} title="Edit worker">
        {editing && (
          <form onSubmit={(e) => { e.preventDefault(); handleUpdate(editing); }} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-600 text-ink/50">Full name</label>
              <Input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} className="mt-1.5" required />
            </div>
            <div>
              <label className="block text-xs font-600 text-ink/50">Role</label>
              <select
                value={editing.role}
                onChange={(e) => setEditing({ ...editing, role: e.target.value })}
                className="focus-ring mt-1.5 w-full rounded-xl border border-ink/10 bg-white px-4 py-2.5 text-sm"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-600 text-ink/50">New password (leave blank to keep)</label>
              <Input type="password" value={editing.password} onChange={(e) => setEditing({ ...editing, password: e.target.value })} className="mt-1.5" minLength={6} />
            </div>
            <div className="flex items-center gap-2">
              <input
                id="active"
                type="checkbox"
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.target.checked })}
                className="h-4 w-4 rounded border-ink/20"
              />
              <label htmlFor="active" className="text-sm text-ink/70">Active</label>
            </div>
            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        )}
      </Modal>

      {/* Reset password modal */}
      <Modal open={Boolean(resetWorker)} onClose={() => { setResetWorker(null); setResetPassword(""); }} title={`Reset password for ${resetWorker?.name || ""}`}>
        {resetWorker && (
          <form onSubmit={(e) => { e.preventDefault(); handleResetPassword(resetWorker); }} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-600 text-ink/50">New password</label>
              <Input type="password" value={resetPassword} onChange={(e) => setResetPassword(e.target.value)} className="mt-1.5" placeholder="Min 8 characters" minLength={8} required />
              <p className="mt-1 text-[11px] text-ink/40">Worker will be required to change this on next login.</p>
            </div>
            <Button type="submit" className="w-full" disabled={resetLoading}>
              {resetLoading ? "Resetting…" : "Reset password"}
            </Button>
          </form>
        )}
      </Modal>
    </div>
  );
}
