import jwt from "jsonwebtoken";
import { getWorkerFromRequest, decodeWorkerToken } from "./workerAuth.js";

const FALLBACK_KEY = "CboyIstore@2026";

export function requireAdmin(req, res, next) {
  let worker = null;

  if (req.header("authorization")?.startsWith("Bearer ")) {
    const token = req.header("authorization").slice(7);
    const payload = decodeWorkerToken(token);
    if (payload && payload.type === "worker") {
      return getWorkerFromRequest(req)
        .then((w) => {
          if (!w) return res.status(401).json({ error: "Invalid or expired worker session" });
          if (!w.active) return res.status(403).json({ error: "Worker account is disabled" });
          if (w.role !== "admin") return res.status(403).json({ error: "Admin role required" });
          req.worker = w;
          next();
        })
        .catch((err) => next(err));
    }
  }

  const key = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY || FALLBACK_KEY;

  if (!process.env.ADMIN_KEY) {
    console.warn(
      "[admin] ADMIN_KEY env var is not set — using the built-in fallback key. " +
        "Set ADMIN_KEY in your host (e.g. Render) dashboard for a secure, custom key."
    );
  }

  if (!key || key !== expected) {
    return res.status(401).json({ error: "Invalid admin key" });
  }
  next();
}

export function isAdminKey(req) {
  const key = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY || FALLBACK_KEY;
  return key && key === expected;
}
