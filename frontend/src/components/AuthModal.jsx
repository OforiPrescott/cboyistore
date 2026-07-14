import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = mode === "login"
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, phone: form.phone, location: form.location, password: form.password };
      if (mode === "login") {
        await login(payload);
      } else {
        await register(payload);
      }
      onClose();
    } catch (err) {
      setError(err.message || "Unable to complete request");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-xl font-semibold text-slate-900">{mode === "login" ? "Welcome back" : "Create your account"}</h3>
          <button onClick={onClose} className="text-sm text-slate-500">Close</button>
        </div>
        {error ? <p className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">{error}</p> : null}
        <form onSubmit={submit} className="space-y-3">
          {mode === "register" ? (
            <>
              <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <input className="w-full rounded border border-slate-300 px-3 py-2" placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
            </>
          ) : null}
          <input className="w-full rounded border border-slate-300 px-3 py-2" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full rounded border border-slate-300 px-3 py-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <button type="submit" disabled={loading} className="w-full rounded bg-slate-900 px-4 py-2 font-medium text-white disabled:opacity-70">
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-3 text-center text-sm text-slate-600">
          {mode === "login" ? "New here?" : "Already have an account?"} {" "}
          <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="font-semibold text-slate-900">
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}
