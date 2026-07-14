import { Router } from "express";
import { nanoid } from "nanoid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import path from "path";
import { fileURLToPath } from "url";
import { buildWhatsappLink, notifyShopBySms } from "../services/notifications.js";
import { requireAdmin } from "../middleware/adminAuth.js";
import { getUserFromRequest } from "./auth.js";

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

    const authUser = await getUserFromRequest(req);
    const buyer = authUser
      ? {
          name: authUser.name,
          email: authUser.email,
          phone: authUser.phone,
          location: authUser.location,
          accountId: authUser.id,
          accountCreatedAt: authUser.createdAt,
        }
      : customer;

    if (!buyer?.name || !buyer?.phone) {
      return res.status(400).json({ error: "Customer name and phone are required" });
    }

    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const order = {
      id: nanoid(10),
      reference: `CBOY-${nanoid(8).toUpperCase()}`,
      items,
      customer: buyer,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
      userId: authUser?.id || null,
      userEmail: authUser?.email || null,
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

// GET /api/orders/me
router.get("/me", async (req, res, next) => {
  try {
    const authUser = await getUserFromRequest(req);
    if (!authUser) return res.status(401).json({ error: "Authentication required" });
    const database = await getDb();
    const orders = database.data.orders
      .filter((o) => o.userId === authUser.id || o.customer?.email === authUser.email)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(orders);
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

// PUT /api/orders/:reference/status  — admin only, update fulfilment state
router.put("/:reference/status", requireAdmin, async (req, res, next) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "paid", "fulfilled", "cancelled"];
    if (!status) return res.status(400).json({ error: "status is required" });
    if (!allowed.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${allowed.join(", ")}` });
    }
    const database = await getDb();
    const order = database.data.orders.find((o) => o.reference === req.params.reference);
    if (!order) return res.status(404).json({ error: "Order not found" });
    order.status = status;
    if (status === "paid" && !order.paidAt) order.paidAt = new Date().toISOString();
    if (status === "fulfilled" && !order.fulfilledAt) order.fulfilledAt = new Date().toISOString();
    await database.write();
    res.json(order);
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
    order.paymentVerified = true;
    await database.write();
  }
  return order;
}

export default router;
