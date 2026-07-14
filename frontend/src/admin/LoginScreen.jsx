import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, cx, Input } from "./ui.jsx";
import { useAdmin } from "./AdminContext.jsx";

export default function LoginScreen() {
  const { setAdminKey, adminKey } = useAdmin();
  const [keyInput, setKeyInput] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleLogin(e) {
    e.preventDefault();
    if (!keyInput.trim()) {
      setError("Enter the admin key.");
      return;
    }
    setAdminKey(keyInput.trim());
    setError("");
    navigate("/");
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
            <p className="text-xs text-ink/40">Staff admin &middot; {adminKey ? "signed in" : "sign in"}</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="mt-6">
          <div className="text-xs font-600 uppercase tracking-wide text-ink/50">Admin key</div>
          <Input
            type="password"
            autoFocus
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Enter your admin key"
            className="mt-1.5"
          />
          {error && <p className="mt-2 text-sm text-signal">{error}</p>}
          <Button type="submit" className="mt-4 w-full">
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}
