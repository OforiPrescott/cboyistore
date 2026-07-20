import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { resetPassword } from "../lib/api.js";

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("form"); // form | success | error
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
      setStatus("error");
    }
  }, [token]);

  async function submit(e) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await resetPassword({ token, password });
      setStatus("success");
    } catch (err) {
      setError(err.message || "Unable to reset password. The link may have expired.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto min-h-[70vh] max-w-md px-6 py-16">
      <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/5">
        <div className="mb-6">
          <p className="text-sm font-600 uppercase tracking-[0.2em] text-signal">Account</p>
          <h1 className="mt-2 font-display text-3xl font-700 text-ink">Choose a new password</h1>
        </div>

        {status === "success" ? (
          <div className="rounded-2xl bg-gold/10 p-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 text-2xl">✓</div>
            <p className="text-sm font-600 text-ink">Password updated</p>
            <p className="mt-1 text-xs text-ink/60">You can now sign in with your new password.</p>
            <Link to="/" className="mt-4 inline-block rounded-full bg-signal-gradient px-6 py-3 text-sm font-600 text-white shadow-lg shadow-signal/30">Go to shop</Link>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <div>
              <label className="text-xs font-600 text-ink/60">New password</label>
              <input className="focus-ring mt-1.5 w-full rounded-xl border border-ink/10 px-4 py-3 text-sm" type="password" placeholder="Min 8 characters" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} />
              <p className="mt-1 text-[11px] text-ink/40">Use 8+ characters with uppercase, lowercase, number and special character.</p>
            </div>
            <div>
              <label className="text-xs font-600 text-ink/60">Confirm password</label>
              <input className="focus-ring mt-1.5 w-full rounded-xl border border-ink/10 px-4 py-3 text-sm" type="password" placeholder="Repeat password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required minLength={8} />
            </div>

            {error && <p className="text-sm text-signal">{error}</p>}

            <button type="submit" disabled={loading || !token} className="focus-ring w-full rounded-full bg-signal-gradient py-3.5 font-600 text-white shadow-lg shadow-signal/30 disabled:opacity-60">
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
