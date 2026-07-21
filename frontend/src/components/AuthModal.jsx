import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { nanoid } from "nanoid";

const GHANA_REGIONS = [
  "Ahafo",
  "Ashanti",
  "Bono",
  "Bono East",
  "Central",
  "Eastern",
  "Greater Accra",
  "North East",
  "Northern",
  "Oti",
  "Savannah",
  "Upper East",
  "Upper West",
  "Volta",
  "Western",
  "Western North",
];

export default function AuthModal({ open, onClose }) {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [authMethod, setAuthMethod] = useState("email");
  const [form, setForm] = useState({ name: "", email: "", phone: "", location: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "login") {
        if (authMethod === "email") {
          await login({ email: form.email, password: form.password });
        } else {
          await login({ phone: form.phone, password: form.password });
        }
      } else {
        if (!form.name.trim()) {
          setError("Full name is required");
          setLoading(false);
          return;
        }
        if (!form.email.trim() && !form.phone.trim()) {
          setError("Email or phone number is required");
          setLoading(false);
          return;
        }
        if (!form.location) {
          setError("Please select your region");
          setLoading(false);
          return;
        }
        if (form.password !== form.confirmPassword) {
          setError("Passwords do not match");
          setLoading(false);
          return;
        }
        if (form.password.length < 8) {
          setError("Password must be at least 8 characters");
          setLoading(false);
          return;
        }
        await register({
          name: form.name.trim(),
          email: form.email || undefined,
          phone: form.phone || undefined,
          location: form.location,
          password: form.password,
        });
      }
      onClose();
    } catch (err) {
      setError(err.message || "Unable to complete request");
    } finally {
      setLoading(false);
    }
  }

  function handleSocial(provider) {
    if (provider === "apple") {
      window.open("https://appleid.apple.com/sign-in", "_blank", "noopener,noreferrer");
      setError("Sign in with Apple in the new tab, then confirm your name and region below.");
    } else if (provider === "whatsapp") {
      window.open(`https://wa.me/233541533365?text=${encodeURIComponent("Hi, I'd like to create an account / sign in via WhatsApp.")}`, "_blank");
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setError("");
    try {
      const clientId = "473305122016-sqpmoorhor5s62fct5r6r58cqcfsas4j.apps.googleusercontent.com";
      const redirectUri = `${window.location.origin}/api/auth/google/callback`;
      const scope = "openid profile email";
      const state = nanoid(10);

      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope,
        state,
        access_type: "offline",
        prompt: "consent select_account",
      });

      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      const popup = window.open(
        `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
        "google-oauth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        setError("Popup blocked. Please allow popups for this site.");
        setLoading(false);
        return;
      }

      const messageHandler = async (event) => {
        if (event.origin !== window.location.origin) return;

        if (event.data?.type === "google-oauth-success") {
          window.removeEventListener("message", messageHandler);
          popup.close();

          const { code } = event.data;
          const apiBase = import.meta.env?.VITE_API_URL || "http://localhost:4000";
          const response = await fetch(`${apiBase}/api/auth/google/callback`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Google sign-in failed");
          }

          await login({ email: data.user.email, password: "" }, data.token);
        } else if (event.data?.type === "google-oauth-error") {
          window.removeEventListener("message", messageHandler);
          popup.close();
          setError(event.data.error || "Google sign-in failed");
          setLoading(false);
        }
      };

      window.addEventListener("message", messageHandler);

      const pollInterval = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollInterval);
          window.removeEventListener("message", messageHandler);
          if (loading) {
            setLoading(false);
          }
        }
      }, 500);
    } catch (err) {
      setError(err.message || "Google sign-in failed");
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4" onClick={onClose}>
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-ink">{mode === "login" ? "Welcome back" : "Create your account"}</h3>
            <p className="text-xs text-ink/50 mt-0.5">Sign in to track orders and access exclusive deals</p>
          </div>
          <button onClick={onClose} className="focus-ring rounded-full p-2 text-ink/40 hover:bg-ink/5 hover:text-ink" aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {error && error.includes("Sign in with Google") || error.includes("Sign in with Apple") ? (
          <div className="mb-4 rounded-xl bg-gold/10 p-3 text-sm text-ink/80">{error}</div>
        ) : error ? (
          <div className="mb-4 rounded-xl bg-signal/10 p-3 text-sm text-signal">{error}</div>
        ) : null}

        {mode === "login" && (
          <div className="mb-4">
            <p className="mb-2 text-xs font-600 text-ink/60">Quick sign-in</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={handleGoogle}
                className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white py-2.5 text-sm font-600 text-ink hover:bg-ink/5"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </button>
              <button
                type="button"
                onClick={() => handleSocial("apple")}
                className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white py-2.5 text-sm font-600 text-ink hover:bg-ink/5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.32-2.14 4.32-3.74 4.25z" />
                </svg>
                Apple
              </button>
              <button
                type="button"
                onClick={() => handleSocial("whatsapp")}
                className="focus-ring flex items-center justify-center gap-2 rounded-xl border border-ink/10 bg-white py-2.5 text-sm font-600 text-ink hover:bg-ink/5"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-emerald-600" aria-hidden="true">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                WhatsApp
              </button>
            </div>
            <p className="mt-2 text-[11px] text-ink/50">Tap a provider above, sign in there, then use that same email below.</p>
          </div>
        )}

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-ink/10" />
          <span className="text-xs text-ink/40">or use your email</span>
          <div className="h-px flex-1 bg-ink/10" />
        </div>

        <form onSubmit={submit} className="space-y-3">
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-600 text-ink/60">Full name</label>
              <input
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                required
              />
            </div>
          )}

          {/* Auth method toggle */}
          <div className="flex rounded-xl bg-cream p-1">
            <button
              type="button"
              onClick={() => setAuthMethod("email")}
              className={`flex-1 rounded-lg py-2 text-xs font-600 transition-colors ${authMethod === "email" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => setAuthMethod("phone")}
              className={`flex-1 rounded-lg py-2 text-xs font-600 transition-colors ${authMethod === "phone" ? "bg-white text-ink shadow-sm" : "text-ink/50"}`}
            >
              Phone number
            </button>
          </div>

          {authMethod === "email" ? (
            mode === "login" ? (
              <div>
                <label className="mb-1 block text-xs font-600 text-ink/60">Email</label>
                <input
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                  type="email"
                  list="login-email-suggestions"
                  placeholder="Select or enter your email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
                <datalist id="login-email-suggestions">
                  <option value="gmail.com" />
                  <option value="yahoo.com" />
                  <option value="outlook.com" />
                  <option value="hotmail.com" />
                  <option value="icloud.com" />
                  <option value="protonmail.com" />
                  <option value="yahoo.co.uk" />
                  <option value="live.com" />
                  <option value="edu.gh" />
                  <option value="com.gh" />
                </datalist>
              </div>
            ) : (
              <div>
                <label className="mb-1 block text-xs font-600 text-ink/60">Email address</label>
                <input
                  className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                  type="email"
                  placeholder="Enter your email address"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  required
                />
              </div>
            )
          ) : (
            <div>
              <label className="mb-1 block text-xs font-600 text-ink/60">Phone number</label>
              <div className="flex gap-2">
                <span className="flex items-center rounded-xl border border-ink/10 bg-cream px-3 py-3 text-xs text-ink/60 font-600">+233</span>
                <input
                  className="flex-1 rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                  type="tel"
                  placeholder="541 533 365"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value.replace(/[^\d]/g, ""))}
                  required
                />
              </div>
            </div>
          )}

          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-600 text-ink/60">Region</label>
              <select
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                value={form.location}
                onChange={(e) => set("location", e.target.value)}
                required
              >
                <option value="">Select your region</option>
                {GHANA_REGIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-600 text-ink/60">Password</label>
            <input
              className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              required
              minLength={8}
            />
          </div>
          {mode === "register" && (
            <div>
              <label className="mb-1 block text-xs font-600 text-ink/60">Confirm password</label>
              <input
                className="w-full rounded-xl border border-ink/10 bg-white px-4 py-3 text-sm focus-ring"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => set("confirmPassword", e.target.value)}
                required
                minLength={8}
              />
            </div>
          )}
          {mode === "login" && (
            <p className="text-right">
              <Link to="/forgot-password" onClick={onClose} className="text-xs font-600 text-signal hover:underline">Forgot password?</Link>
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full rounded-full bg-signal-gradient py-3.5 font-600 text-white shadow-lg shadow-signal/30 disabled:opacity-60 transition-opacity"
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-ink/50">
          {mode === "login" ? "New here?" : "Already have an account?"}{" "}
          <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }} className="font-700 text-signal hover:underline">
            {mode === "login" ? "Create an account" : "Sign in"}
          </button>
        </p>

        <p className="mt-2 text-center text-[11px] text-ink/40">
          By continuing, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </div>
  );
}
