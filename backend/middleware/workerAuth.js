import jwt from "jsonwebtoken";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function loadWorkers() {
  const raw = await readFile(path.join(__dirname, "..", "data", "workers.json"), "utf-8");
  return JSON.parse(raw);
}

export function signWorkerToken(worker) {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
  return jwt.sign(
    { sub: worker.id, role: worker.role, name: worker.name, type: "worker" },
    JWT_SECRET,
    { expiresIn: "8h" }
  );
}

export function decodeWorkerToken(token) {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.type !== "worker") return null;
    return payload;
  } catch {
    return null;
  }
}

export function workerAuthHeader(req) {
  const header = req.header("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export async function getWorkerFromRequest(req) {
  const token = workerAuthHeader(req);
  if (!token) return null;
  const payload = decodeWorkerToken(token);
  if (!payload) return null;
  const workers = await loadWorkers();
  return workers.find((w) => w.id === payload.sub) || null;
}

export function requireWorker(req, res, next) {
  getWorkerFromRequest(req)
    .then((worker) => {
      if (!worker) return res.status(401).json({ error: "Invalid or expired worker session" });
      if (!worker.active) return res.status(403).json({ error: "Worker account is disabled" });
      req.worker = worker;
      next();
    })
    .catch((err) => next(err));
}

export function requireRole(req, res, next, allowedRoles) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  getWorkerFromRequest(req)
    .then((worker) => {
      if (!worker) return res.status(401).json({ error: "Invalid or expired worker session" });
      if (!worker.active) return res.status(403).json({ error: "Worker account is disabled" });
      if (!roles.includes(worker.role)) return res.status(403).json({ error: "Insufficient permissions" });
      req.worker = worker;
      next();
    })
    .catch((err) => next(err));
}
