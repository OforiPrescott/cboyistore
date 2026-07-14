import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiRegister, apiLogin, apiMe } from "../lib/api.js";

const AuthContext = createContext(null);
const STORAGE_KEY = "cboyistore_auth_v1";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEY) || "");
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    localStorage.setItem(STORAGE_KEY, token);
    apiMe(token)
      .then(({ user }) => setUser(user))
      .catch(() => {
        setToken("");
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function register(payload) {
    const data = await apiRegister(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  async function login(payload) {
    const data = await apiLogin(payload);
    setToken(data.token);
    setUser(data.user);
    return data;
  }

  function logout() {
    setToken("");
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(() => ({ user, token, loading, register, login, logout, isAuthed: Boolean(user) }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
