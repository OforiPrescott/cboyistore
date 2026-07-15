import { Router } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { sendWelcomeEmail } from "../services/email.js";
import { logAudit, actorFromReq } from "../services/audit.js";
import { rateLimiter } from "../middleware/rateLimiter.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "data", "customers", "customers.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { users: [] });

async function getDb() {
  await db.read();
  db.data ||= { users: [] };
  return db;
}

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret-change-me";
const JWT_EXPIRES_IN = "7d";
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, reason: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, reason: "Password must include at least one uppercase letter" };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, reason: "Password must include at least one lowercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, reason: "Password must include at least one number" };
  }
  if (!/[^A-Za-z0-9]/.test(password)) {
    return { valid: false, reason: "Password must include at least one special character (!@#$%^&*)" };
  }
  return { valid: true };
}

function sanitizeUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
    role: user.role || "customer",
    location: user.location || null,
  };
}

const ADMIN_KEY_FALLBACK = "CboyIstore@2026";

function authHeader(req) {
  const header = req.header("authorization") || "";
  return header.startsWith("Bearer ") ? header.slice(7) : "";
}

export function decodeToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

export async function getUserFromRequest(req) {
  const token = authHeader(req);
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  const database = await getDb();
  return database.data.users.find((entry) => entry.id === payload.sub) || null;
}

export function isAdminKey(req) {
  const key = req.header("x-admin-key");
  const expected = process.env.ADMIN_KEY || ADMIN_KEY_FALLBACK;
  return key && key === expected;
}

export function requireAuth(req, res, next) {
  const token = authHeader(req);
  if (!token) return res.status(401).json({ error: "Authentication required" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

router.post("/register", rateLimiter(3, 60 * 60 * 1000), async (req, res, next) => {
  try {
    const { name, email, phone, password, location } = req.body;
    if (!name || !password) {
      return res.status(400).json({ error: "Name and password are required" });
    }
    if (!email && !phone) {
      return res.status(400).json({ error: "Email or phone number is required" });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ error: passwordCheck.reason });
    }

    const database = await getDb();

    if (email) {
      const existingEmail = database.data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
      if (existingEmail) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
    }

    if (phone) {
      const existingPhone = database.data.users.find((user) => user.phone === phone);
      if (existingPhone) {
        return res.status(409).json({ error: "An account with this phone number already exists" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = {
      id: nanoid(10),
      name,
      email: email ? email.toLowerCase() : null,
      phone: phone || null,
      passwordHash,
      role: "customer",
      location: location || null,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    };

    database.data.users.push(user);
    await database.write();

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    sendWelcomeEmail(user).catch(() => {});

    res.status(201).json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.post("/login", rateLimiter(5, 15 * 60 * 1000), async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;
    if ((!email && !phone) || !password) {
      return res.status(400).json({ error: "Email or phone and password are required" });
    }

    const database = await getDb();
    const user = database.data.users.find((entry) => {
      if (email) return entry.email.toLowerCase() === email.toLowerCase();
      if (phone) return entry.phone === phone;
      return false;
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Check if account is locked
    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const remaining = Math.ceil((new Date(user.lockedUntil) - new Date()) / 1000 / 60);
      return res.status(423).json({ error: `Account locked due to too many failed attempts. Try again in ${remaining} minutes.` });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
        user.lockedUntil = new Date(Date.now() + LOCKOUT_DURATION).toISOString();
        user.failedLoginAttempts = 0;
        await database.write();
        return res.status(423).json({ error: "Account locked due to too many failed attempts. Try again in 30 minutes." });
      }
      await database.write();
      return res.status(401).json({ error: `Invalid credentials. ${MAX_FAILED_ATTEMPTS - user.failedLoginAttempts} attempts remaining before lockout.` });
    }

    // Reset failed attempts on successful login
    user.failedLoginAttempts = 0;
    user.lockedUntil = null;
    user.lastLoginAt = new Date().toISOString();
    await database.write();

    const token = jwt.sign({ sub: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const database = await getDb();
    const user = database.data.users.find((entry) => entry.id === req.user.sub);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    next(err);
  }
});

router.delete("/me", requireAuth, async (req, res, next) => {
  try {
    const database = await getDb();
    const index = database.data.users.findIndex((u) => u.id === req.user.sub);
    if (index === -1) return res.status(404).json({ error: "User not found" });

    database.data.users.splice(index, 1);
    await database.write();

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.get("/customers", async (req, res, next) => {
  try {
    const authUser = await getUserFromRequest(req);
    const adminAuthorized = authUser?.role === "admin" || isAdminKey(req);
    if (!adminAuthorized) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const database = await getDb();
    const users = database.data.users
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(users.map(sanitizeUser));
  } catch (err) {
    next(err);
  }
});

router.delete("/customers/:id", async (req, res, next) => {
  try {
    const database = await getDb();
    const targetId = req.params.id;

    const authUser = await getUserFromRequest(req);
    const adminAuthorized = authUser?.role === "admin" || isAdminKey(req);
    const isSelf = authUser?.id === targetId;

    if (!adminAuthorized && !isSelf) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const index = database.data.users.findIndex((u) => u.id === targetId);
    if (index === -1) return res.status(404).json({ error: "Customer not found" });

    const removed = database.data.users[index];
    database.data.users.splice(index, 1);
    await database.write();

    const actor = actorFromReq(req);
    logAudit({ ...actor, action: "customer.deleted", target: removed.id, targetType: "customer", details: `Deleted customer ${removed.name} (${removed.email})` }).catch(() => {});

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
