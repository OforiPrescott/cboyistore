import { Router } from "express";
import { nanoid } from "nanoid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import { requireAdmin } from "../middleware/adminAuth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "data", "coupons.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { coupons: [] });

async function getDb() {
  await db.read();
  db.data ||= { coupons: [] };
  return db;
}

const router = Router();

router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const database = await getDb();
    res.json(database.data.coupons.slice().reverse());
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { code, discountType, discountValue, minPurchase, maxDiscount, usageLimit, expiresAt, active } = req.body;
    if (!code || discountType === undefined || discountValue === undefined) {
      return res.status(400).json({ error: "Code, discountType and discountValue are required" });
    }

    const database = await getDb();
    const existing = database.data.coupons.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "Coupon code already exists" });
    }

    const coupon = {
      id: nanoid(10),
      code: code.toUpperCase(),
      discountType, // "percentage" | "fixed"
      discountValue: Number(discountValue),
      minPurchase: minPurchase ? Number(minPurchase) : 0,
      maxDiscount: maxDiscount ? Number(maxDiscount) : undefined,
      usageLimit: usageLimit ? Number(usageLimit) : undefined,
      usedCount: 0,
      expiresAt: expiresAt || null,
      active: active !== false,
      createdAt: new Date().toISOString(),
    };

    database.data.coupons.push(coupon);
    await database.write();

    res.status(201).json(coupon);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const database = await getDb();
    const coupon = database.data.coupons.find((c) => c.id === req.params.id);
    if (!coupon) return res.status(404).json({ error: "Coupon not found" });

    const allowed = ["code", "discountType", "discountValue", "minPurchase", "maxDiscount", "usageLimit", "expiresAt", "active"];
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        coupon[key] = key === "code" ? req.body[key].toUpperCase() : req.body[key];
      }
    }

    await database.write();
    res.json(coupon);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const database = await getDb();
    const index = database.data.coupons.findIndex((c) => c.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Coupon not found" });

    database.data.coupons.splice(index, 1);
    await database.write();
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

router.post("/validate", async (req, res, next) => {
  try {
    const { code, orderTotal } = req.body;
    if (!code) {
      return res.status(400).json({ error: "Coupon code is required" });
    }

    const database = await getDb();
    const coupon = database.data.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());

    if (!coupon) {
      return res.status(404).json({ error: "Invalid coupon code" });
    }

    if (!coupon.active) {
      return res.status(400).json({ error: "This coupon is no longer active" });
    }

    if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
      return res.status(400).json({ error: "This coupon has expired" });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ error: "This coupon has reached its usage limit" });
    }

    if (coupon.minPurchase && Number(orderTotal) < coupon.minPurchase) {
      return res.status(400).json({ error: `Minimum purchase of GHS ${coupon.minPurchase.toLocaleString()} required` });
    }

    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (Number(orderTotal) * coupon.discountValue) / 100;
      if (coupon.maxDiscount) {
        discount = Math.min(discount, coupon.maxDiscount);
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      valid: true,
      coupon,
      discount: Math.round(discount * 100) / 100,
      newTotal: Math.round((Number(orderTotal) - discount) * 100) / 100,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
