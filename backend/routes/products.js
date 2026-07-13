import { Router } from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import { requireAdmin } from "../middleware/adminAuth.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "..", "data", "products.json");

const router = Router();

async function loadProducts() {
  const raw = await readFile(dataPath, "utf-8");
  return JSON.parse(raw);
}

async function saveProducts(products) {
  await writeFile(dataPath, JSON.stringify(products, null, 2));
}

// GET /api/products?category=phones&q=iphone
router.get("/", async (req, res, next) => {
  try {
    const { category, q } = req.query;
    let products = await loadProducts();

    if (category && category !== "all") {
      products = products.filter((p) => p.category === category);
    }
    if (q) {
      const query = q.toLowerCase();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.brand.toLowerCase().includes(query)
      );
    }
    res.json(products);
  } catch (err) {
    next(err);
  }
});

// GET /api/products/:id
router.get("/:id", async (req, res, next) => {
  try {
    const products = await loadProducts();
    const product = products.find((p) => p.id === req.params.id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

export default router;

// --- Admin-only management endpoints ---
// Mounted on the same router so /api/products stays the one place to look.

// POST /api/products  — create a new product
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const products = await loadProducts();
    const body = req.body;
    if (!body.name || !body.category || !body.price) {
      return res.status(400).json({ error: "name, category and price are required" });
    }
    const product = {
      id: body.id || `${body.category}-${nanoid(6)}`,
      name: body.name,
      category: body.category,
      brand: body.brand || "Generic",
      spec: body.spec || "",
      condition: body.condition || "Brand New",
      price: Number(body.price),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
      image: body.image || "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80",
      badge: body.badge || undefined,
      // Preserve richer catalogue fields configured from the admin dashboard.
      specs: body.specs,
      stock: body.stock !== undefined && body.stock !== "" ? Number(body.stock) : undefined,
      rating: body.rating ? Number(body.rating) : undefined,
      variants: body.variants || undefined,
    };
    products.push(product);
    await saveProducts(products);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

// PUT /api/products/:id  — edit an existing product
router.put("/:id", requireAdmin, async (req, res, next) => {
  try {
    const products = await loadProducts();
    const index = products.findIndex((p) => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Product not found" });

    products[index] = { ...products[index], ...req.body, id: products[index].id };
    await saveProducts(products);
    res.json(products[index]);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/products/:id
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try {
    const products = await loadProducts();
    const next_ = products.filter((p) => p.id !== req.params.id);
    if (next_.length === products.length) {
      return res.status(404).json({ error: "Product not found" });
    }
    await saveProducts(next_);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});
