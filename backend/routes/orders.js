import { Router } from "express";
import { nanoid } from "nanoid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import { buildWhatsappLink, notifyShopBySms } from "../services/notifications.js";
import { requireAdmin } from "../middleware/adminAuth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const file = path.join(__dirname, "..", "data", "orders.json");
const adapter = new JSONFile(file);
const db = new Low(adapter, { orders: [] });

async function getDb() {
  await db.read();
  db.data ||= { orders: [] };
  return db;
}

const router = Router();

// POST /api/orders  — create a pending order before payment
router.post("/", async (req, res, next) => {
  try {
    const { items, customer } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ error: "Cart is empty" });
    }
    if (!customer?.name || !customer?.phone) {
      return res.status(400).json({ error: "Customer name and phone are required" });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: nanoid(10),
      reference: `CBOY-${nanoid(8).toUpperCase()}`,
      items,
      customer, // { name, phone, email, address, deliveryMethod, city }
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    const database = await getDb();
    database.data.orders.push(order);
    await database.write();

    // Fire-and-forget: don't hold up checkout if SMS fails or isn't configured
    notifyShopBySms(order).catch(() => {});

    res.status(201).json({ ...order, whatsappLink: buildWhatsappLink(order) });
  } catch (err) {
    next(err);
  }
});

// GET /api/orders/:reference
router.get("/:reference", async (req, res, next) => {
  try {
    const database = await getDb();
    const order = database.data.orders.find(
      (o) => o.reference === req.params.reference
    );
    if (!order) return res.status(404).json({ error: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// GET /api/orders  — admin only, most recent first
router.get("/", requireAdmin, async (req, res, next) => {
  try {
    const database = await getDb();
    const orders = [...database.data.orders].reverse();
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Used internally by the Paystack route to mark an order paid
export async function markOrderPaid(reference) {
  const database = await getDb();
  const order = database.data.orders.find((o) => o.reference === reference);
  if (order) {
    order.status = "paid";
    order.paidAt = new Date().toISOString();
    await database.write();
  }
  return order;
}

export default router;
