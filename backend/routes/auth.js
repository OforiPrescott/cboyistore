import { Router } from "express";
import { nanoid } from "nanoid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { sendWelcomeEmail } from "../services/email.js";

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

export function validatePassword(password) {
  if (!password || password.length < 8) {
    return { valid: false, reason: "Password must be at least 8 characters long" };
  }
  if (!/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
    return { valid: false, reason: "Password must include uppercase letters and numbers" };
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

router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, phone, location } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email and password are required" });
    }

    const passwordCheck = validatePassword(password);
    if (!passwordCheck.valid) {
      return res.status(400).json({ error: passwordCheck.reason });
    }

    const database = await getDb();
    const existing = database.data.users.find((user) => user.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = {
      id: nanoid(10),
      name,
      email: email.toLowerCase(),
      phone: phone || null,
      passwordHash,
      role: "customer",
      location: location || null,
      createdAt: new Date().toISOString(),
      lastLoginAt: null,
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

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const database = await getDb();
    const user = database.data.users.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

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

    database.data.users.splice(index, 1);
    await database.write();

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
