import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Spinner } from "./ui.jsx";
import { useAdmin } from "./AdminContext.jsx";
import { apiVerifyAdmin, apiWorkerLogin } from "./api.js";

export default function LoginScreen() {
  const { setAdminKey, setWorkerSession } = useAdmin();
  const [mode, setMode] = useState("admin");
  const [keyInput, setKeyInput] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  async function handleAdminLogin(e) {
    e.preventDefault();
    const trimmed = keyInput.trim();
    if (!trimmed) return setError("Enter the admin key.");
    setChecking(true);
    setError("");
    try {
      await apiVerifyAdmin(trimmed);
      setAdminKey(trimmed);
      navigate("/");
    } catch (err) {
      setError(err.status === 401 ? "That key isn't valid. Try again." : err.message || "Couldn't reach the server.");
    } finally {
      setChecking(false);
    }
  }

  async function handleWorkerLogin(e) {
    e.preventDefault();
    if (!username.trim() || !password) return setError("Enter username and password.");
    setChecking(true);
    setError("");
    try {
      const data = await apiWorkerLogin({ username: username.trim(), password });
      setWorkerSession(data.token, data.worker);
      navigate("/");
    } catch (err) {
      setError(err.status === 401 ? "Invalid username or password." : err.message || "Couldn't reach the server.");
    } finally {
      setChecking(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-sm ring-1 ring-ink/5">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-signal-gradient font-display text-xl font-700 text-white">
            C
          </span>
          <div>
            <p className="font-display text-lg font-700 text-ink">Cboyistore CMS</p>
            <p className="text-xs text-ink/40">Staff admin &middot; sign in</p>
          </div>
        </div>

        <div className="mt-6 flex rounded-full bg-cream p-1">
          <button
            type="button"
            onClick={() => { setMode("admin"); setError(""); }}
            className={`flex-1 rounded-full py-2 text-sm font-600 transition ${mode === "admin" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}
          >
            Admin key
          </button>
          <button
            type="button"
            onClick={() => { setMode("worker"); setError(""); }}
            className={`flex-1 rounded-full py-2 text-sm font-600 transition ${mode === "worker" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}
          >
            Worker
          </button>
        </div>

        {mode === "admin" ? (
          <form onSubmit={handleAdminLogin} className="mt-5">
            <div className="text-xs font-600 uppercase tracking-wide text-ink/50">Admin key</div>
            <Input
              type="password"
              autoFocus
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              placeholder="Enter your admin key"
              disabled={checking}
              className="mt-1.5"
            />
            {error && <p role="alert" className="mt-2 text-sm text-signal">{error}</p>}
            <Button type="submit" className="mt-4 w-full" disabled={checking}>
              {checking ? <><Spinner className="h-4 w-4" /> Checking…</> : "Sign in"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleWorkerLogin} className="mt-5">
            <div className="text-xs font-600 uppercase tracking-wide text-ink/50">Username</div>
            <Input
              type="text"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="worker username"
              disabled={checking}
              className="mt-1.5"
            />
            <div className="mt-3 text-xs font-600 uppercase tracking-wide text-ink/50">Password</div>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              disabled={checking}
              className="mt-1.5"
            />
            {error && <p role="alert" className="mt-2 text-sm text-signal">{error}</p>}
            <Button type="submit" className="mt-4 w-full" disabled={checking}>
              {checking ? <><Spinner className="h-4 w-4" /> Signing in…</> : "Sign in"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
