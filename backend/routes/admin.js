import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { requireAdmin } from "../middleware/adminAuth.js";
import { requireWorker, signWorkerToken, loadWorkers } from "../middleware/workerAuth.js";
import { logAudit } from "../services/audit.js";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKERS_PATH = path.join(__dirname, "..", "data", "workers.json");
const AUDIT_PATH = path.join(__dirname, "..", "data", "audit.json");

async function readWorkers() {
  const raw = await readFile(WORKERS_PATH, "utf-8");
  return JSON.parse(raw);
}

async function writeWorkers(workers) {
  await writeFile(WORKERS_PATH, JSON.stringify(workers, null, 2));
}

async function readAudit() {
  try {
    const raw = await readFile(AUDIT_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

router.get("/verify", requireAdmin, (req, res) => {
  res.json({ ok: true });
});

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const workers = await readWorkers();
    const worker = workers.find((w) => w.username.toLowerCase() === username.toLowerCase());
    if (!worker) return res.status(401).json({ error: "Invalid username or password" });

    const valid = await bcrypt.compare(password, worker.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid username or password" });

    worker.lastLoginAt = new Date().toISOString();
    await writeWorkers(workers);

    const token = signWorkerToken(worker);
    await logAudit({
      workerId: worker.id,
      workerName: worker.name,
      workerRole: worker.role,
      action: "worker.login",
      target: worker.id,
      targetType: "worker",
      details: `Worker ${worker.name} logged in`,
    });

    res.json({
      token,
      worker: {
        id: worker.id,
        name: worker.name,
        username: worker.username,
        role: worker.role,
        active: worker.active,
        createdAt: worker.createdAt,
        lastLoginAt: worker.lastLoginAt,
      },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireWorker, async (req, res) => {
  const workers = await readWorkers();
  const worker = workers.find((w) => w.id === req.worker.id);
  if (!worker) return res.status(404).json({ error: "Worker not found" });
  const { passwordHash, ...safe } = worker;
  res.json(safe);
});

router.post("/logout", requireWorker, async (req, res) => {
  await logAudit({
    workerId: req.worker.id,
    workerName: req.worker.name,
    workerRole: req.worker.role,
    action: "worker.logout",
    target: req.worker.id,
    targetType: "worker",
  });
  res.json({ ok: true });
});

router.get("/workers", requireAdmin, async (req, res, next) => {
  try {
    const workers = await readWorkers();
    const safe = workers.map(({ passwordHash, ...w }) => w);
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

router.post("/workers", requireAdmin, async (req, res, next) => {
  try {
    const { name, username, password, role = "staff" } = req.body;
    if (!name || !username || !password) {
      return res.status(400).json({ error: "Name, username and password are required" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }
    const workers = await readWorkers();
    const exists = workers.some((w) => w.username.toLowerCase() === username.toLowerCase());
    if (exists) return res.status(409).json({ error: "Username already taken" });

    const passwordHash = await bcrypt.hash(password, 10);
    const worker = {
      id: nanoid(10),
      name,
      username: username.toLowerCase(),
      passwordHash,
      role,
      active: true,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
    };

    workers.push(worker);
    await writeWorkers(workers);

    await logAudit({
      workerId: req.worker.id,
      workerName: req.worker.name,
      workerRole: req.worker.role,
      action: "worker.created",
      target: worker.id,
      targetType: "worker",
      details: `Created worker ${name} with role ${role}`,
    });

    const { passwordHash: _, ...safe } = worker;
    res.status(201).json(safe);
  } catch (err) {
    next(err);
  }
});

router.put("/workers/:id", requireAdmin, async (req, res, next) => {
  try {
    const workers = await readWorkers();
    const index = workers.findIndex((w) => w.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Worker not found" });

    const updated = { ...workers[index] };
    if (req.body.name !== undefined) updated.name = req.body.name;
    if (req.body.role !== undefined) updated.role = req.body.role;
    if (req.body.active !== undefined) updated.active = Boolean(req.body.active);
    if (req.body.password) {
      if (req.body.password.length < 6) {
        return res.status(400).json({ error: "Password must be at least 6 characters" });
      }
      updated.passwordHash = await bcrypt.hash(req.body.password, 10);
    }

    workers[index] = updated;
    await writeWorkers(workers);

    await logAudit({
      workerId: req.worker.id,
      workerName: req.worker.name,
      workerRole: req.worker.role,
      action: "worker.updated",
      target: updated.id,
      targetType: "worker",
      details: `Updated worker ${updated.name}`,
    });

    const { passwordHash: _, ...safe } = updated;
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

router.delete("/workers/:id", requireAdmin, async (req, res, next) => {
  try {
    const workers = await readWorkers();
    const index = workers.findIndex((w) => w.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Worker not found" });

    const removed = workers.splice(index, 1)[0];
    await writeWorkers(workers);

    await logAudit({
      workerId: req.worker.id,
      workerName: req.worker.name,
      workerRole: req.worker.role,
      action: "worker.deleted",
      target: removed.id,
      targetType: "worker",
      details: `Deleted worker ${removed.name}`,
    });

    const { passwordHash: _, ...safe } = removed;
    res.json(safe);
  } catch (err) {
    next(err);
  }
});

router.get("/audit", requireAdmin, async (req, res, next) => {
  try {
    const entries = await readAudit();

    const { action, workerId, target, q, page = "1", limit = "50" } = req.query;
    let filtered = entries;
    if (action) filtered = filtered.filter((e) => e.action === action);
    if (workerId) filtered = filtered.filter((e) => e.workerId === workerId);
    if (target) filtered = filtered.filter((e) => e.target === target || e.targetType === target);
    if (q) {
      const lower = q.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          (e.workerName || "").toLowerCase().includes(lower) ||
          (e.details || "").toLowerCase().includes(lower) ||
          (e.action || "").toLowerCase().includes(lower)
      );
    }

    filtered.reverse();
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10) || 50));
    const start = (pageNum - 1) * limitNum;

    res.json({
      entries: filtered.slice(start, start + limitNum),
      total: filtered.length,
      page: pageNum,
      limit: limitNum,
    });
  } catch (err) {
    next(err);
  }
});

router.get("/audit/summary", requireAdmin, async (req, res, next) => {
  try {
    const entries = await readAudit();

    const last7 = entries.filter((e) => {
      const d = new Date(e.timestamp);
      const now = new Date();
      return now - d < 7 * 24 * 60 * 60 * 1000;
    });

    const byAction = {};
    const byWorker = {};
    for (const e of last7) {
      byAction[e.action] = (byAction[e.action] || 0) + 1;
      if (e.workerName) byWorker[e.workerName] = (byWorker[e.workerName] || 0) + 1;
    }

    res.json({ total: entries.length, last7Days: last7.length, byAction, byWorker });
  } catch (err) {
    next(err);
  }
});

router.post("/workers/:id/reset-password", requireAdmin, async (req, res, next) => {
  try {
    const workers = await readWorkers();
    const worker = workers.find((w) => w.id === req.params.id);
    if (!worker) return res.status(404).json({ error: "Worker not found" });

    const { password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    worker.passwordHash = await bcrypt.hash(password, 12);
    await writeWorkers(workers);

    res.json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
});

export default router;
