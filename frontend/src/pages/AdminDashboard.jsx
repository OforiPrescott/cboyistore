import React, { useEffect, useState } from "react";
import { formatGHS } from "../lib/format.js";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchOrders,
} from "../lib/api.js";
import { categories } from "../data/categories.js";

const STORAGE_KEY = "cboyistore_admin_key";
const emptyForm = {
  id: "",
  name: "",
  category: "phones",
  brand: "",
  spec: "",
  condition: "Brand New",
  price: "",
  oldPrice: "",
  image: "",
  badge: "",
  stock: "",
  specsText: "",
  storageText: "",
  colorsText: "",
};

function specsToText(specs) {
  if (!specs) return "";
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function textToSpecs(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return undefined;
  const specs = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return Object.keys(specs).length ? specs : undefined;
}

// --- Variant helpers (storage options + colour swatches) ---

function storageToText(variants) {
  if (!variants?.storage?.length) return "";
  return variants.storage.map((s) => `${s.value}: ${s.price}`).join("\n");
}

function colorsToText(variants) {
  if (!variants?.color?.length) return "";
  return variants.color.map((c) => `${c.name}: ${c.hex}`).join("\n");
}

function parseStorageText(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return undefined;
  const storage = [];
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const value = line.slice(0, idx).trim();
    const price = Number(line.slice(idx + 1).trim());
    if (!value || Number.isNaN(price)) continue;
    storage.push({ value, price });
  }
  return storage.length ? storage : undefined;
}

function parseColorsText(text) {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  if (!lines.length) return undefined;
  const color = [];
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const name = line.slice(0, idx).trim();
    const hex = line.slice(idx + 1).trim();
    if (!name || !hex) continue;
    color.push({ name, hex });
  }
  return color.length ? color : undefined;
}

export default function AdminDashboard() {
  const [adminKey, setAdminKey] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [keyInput, setKeyInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [tab, setTab] = useState("products");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!adminKey) return;
    loadProducts();
    loadOrders();
  }, [adminKey]);

  async function loadProducts() {
    const data = await fetchProducts();
    setProducts(data);
  }

  async function loadOrders() {
    try {
      const data = await fetchOrders(adminKey);
      setOrders(data);
    } catch {
      handleAuthFailure();
    }
  }

  function handleAuthFailure() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
    setAuthError("That admin key was rejected. Try again.");
  }

  function handleLogin(e) {
    e.preventDefault();
    sessionStorage.setItem(STORAGE_KEY, keyInput);
    setAdminKey(keyInput);
    setAuthError("");
  }

  function logout() {
    sessionStorage.removeItem(STORAGE_KEY);
    setAdminKey("");
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      ...emptyForm,
      ...product,
      price: product.price,
      oldPrice: product.oldPrice || "",
      stock: product.stock ?? "",
      specsText: specsToText(product.specs),
      storageText: storageToText(product.variants),
      colorsText: colorsToText(product.variants),
    });
    setTab("products");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    const { specsText, storageText, colorsText, ...rest } = form;
    const payload = {
      ...rest,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
      stock: form.stock !== "" ? Number(form.stock) : undefined,
      specs: textToSpecs(specsText),
      variants:
        parseStorageText(storageText) || parseColorsText(colorsText)
          ? {
              storage: parseStorageText(storageText) || [],
              color: parseColorsText(colorsText) || [],
            }
          : undefined,
    };

    try {
      if (editingId) {
        await updateProduct(adminKey, editingId, payload);
        setMessage(`Updated "${payload.name}".`);
      } else {
        await createProduct(adminKey, payload);
        setMessage(`Added "${payload.name}" to the catalogue.`);
      }
      resetForm();
      loadProducts();
    } catch (err) {
      if (err.message.includes("admin key")) return handleAuthFailure();
      setMessage(err.message);
    }
  }

  async function handleDelete(id) {
    if (!confirm("Remove this product from the shop?")) return;
    try {
      await deleteProduct(adminKey, id);
      loadProducts();
    } catch (err) {
      if (err.message.includes("admin key")) return handleAuthFailure();
      setMessage(err.message);
    }
  }

  if (!adminKey) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center px-4 py-24">
        <h1 className="font-display text-2xl font-700 text-ink">Admin login</h1>
        <p className="mt-2 text-center text-sm text-ink/60">
          Enter the admin key from your backend's <code>.env</code> file.
        </p>
        <form onSubmit={handleLogin} className="mt-6 w-full">
          <input
            type="password"
            value={keyInput}
            onChange={(e) => setKeyInput(e.target.value)}
            placeholder="Admin key"
            className="focus-ring w-full rounded-xl border border-ink/10 px-4 py-3 text-sm"
          />
          {authError && <p className="mt-2 text-sm text-signal">{authError}</p>}
          <button className="focus-ring mt-4 w-full rounded-full bg-ink py-3 text-sm font-600 text-cream">
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const totalRevenue = orders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);
  const lowStockCount = products.filter((p) => typeof p.stock === "number" && p.stock <= 5).length;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Cboyistore admin</h1>
          <p className="text-sm text-ink/50">Manage the catalogue and track incoming orders.</p>
        </div>
        <button onClick={logout} className="focus-ring text-sm text-ink/50 hover:text-ink">
          Log out
        </button>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Products", products.length],
          ["Orders", orders.length],
          ["Revenue (paid)", `GHS ${totalRevenue.toLocaleString()}`],
          ["Low stock alerts", lowStockCount],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <p className="text-xs font-600 uppercase tracking-wide text-ink/40">{label}</p>
            <p className="mt-1 font-display text-xl font-700 text-ink">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 flex gap-2">
        <button
          onClick={() => setTab("products")}
          className={`focus-ring rounded-full px-4 py-2 text-sm font-600 ${
            tab === "products" ? "bg-ink text-cream" : "bg-white text-ink/60 ring-1 ring-ink/10"
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("orders")}
          className={`focus-ring rounded-full px-4 py-2 text-sm font-600 ${
            tab === "orders" ? "bg-ink text-cream" : "bg-white text-ink/60 ring-1 ring-ink/10"
          }`}
        >
          Orders ({orders.length})
        </button>
      </div>

      {tab === "products" && (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-3 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-ink/5"
          >
            <h2 className="font-display text-lg font-700 text-ink">
              {editingId ? "Edit product" : "Add a product"}
            </h2>
            <input
              required
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="focus-ring rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="focus-ring rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            >
              {categories
                .filter((c) => c.id !== "all")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
            </select>
            <input
              placeholder="Brand (e.g. Apple)"
              value={form.brand}
              onChange={(e) => setForm({ ...form, brand: e.target.value })}
              className="focus-ring rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
            <input
              placeholder="Spec (e.g. 256GB · 8GB RAM)"
              value={form.spec}
              onChange={(e) => setForm({ ...form, spec: e.target.value })}
              className="focus-ring rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
              className="focus-ring rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            >
              <option>Brand New</option>
              <option>UK Used</option>
              <option>Refurbished</option>
            </select>
            <div className="flex gap-3">
              <input
                required
                type="number"
                placeholder="Price (GHS)"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="focus-ring w-1/2 rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
              />
              <input
                type="number"
                placeholder="Old price (optional)"
                value={form.oldPrice}
                onChange={(e) => setForm({ ...form, oldPrice: e.target.value })}
                className="focus-ring w-1/2 rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
              />
            </div>
            <input
              placeholder="Image URL (paste a photo link, or point at /images/generated/your-id.svg)"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              className="focus-ring rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
            />
            <div className="flex gap-3">
              <input
                placeholder="Badge (optional, e.g. New Arrival)"
                value={form.badge}
                onChange={(e) => setForm({ ...form, badge: e.target.value })}
                className="focus-ring w-1/2 rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
              />
              <input
                type="number"
                placeholder="Stock qty (optional)"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="focus-ring w-1/2 rounded-xl border border-ink/10 px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-600 text-ink/50">
                Full specification (one per line, "Label: Value" — shown in the customer quick-view)
              </label>
              <textarea
                rows={5}
                placeholder={'Display: 6.1" OLED\nChip: A18\nBattery: Up to 22 hrs\nStorage: 128GB / 256GB'}
                value={form.specsText}
                onChange={(e) => setForm({ ...form, specsText: e.target.value })}
                className="focus-ring mt-1 w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-mono text-xs"
              />
            </div>

            <div className="rounded-2xl bg-cream/60 p-4 ring-1 ring-ink/5">
              <p className="text-xs font-600 uppercase tracking-wide text-ink/50">
                Variants (optional) — let customers pick storage &amp; colour
              </p>
              <div className="mt-3">
                <label className="text-xs font-600 text-ink/50">
                  Storage options — one per line "Size: Price (GHS)"
                </label>
                <textarea
                  rows={3}
                  placeholder={"128GB: 8500\n256GB: 9200\n512GB: 10200"}
                  value={form.storageText}
                  onChange={(e) => setForm({ ...form, storageText: e.target.value })}
                  className="focus-ring mt-1 w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-mono text-xs"
                />
              </div>
              <div className="mt-3">
                <label className="text-xs font-600 text-ink/50">
                  Colours — one per line "Name: Hex"
                </label>
                <textarea
                  rows={3}
                  placeholder={"Black Titanium: #1c1c1e\nNatural Titanium: #b0a89f"}
                  value={form.colorsText}
                  onChange={(e) => setForm({ ...form, colorsText: e.target.value })}
                  className="focus-ring mt-1 w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-mono text-xs"
                />
              </div>
              {form.colorsText.trim() && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {parseColorsText(form.colorsText)?.map((c) => (
                    <span
                      key={c.name}
                      className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-2 py-1 text-xs text-ink/70"
                    >
                      <span
                        className="h-4 w-4 rounded-full border border-ink/15"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button className="focus-ring flex-1 rounded-full bg-signal-gradient py-3 text-sm font-600 text-white">
                {editingId ? "Save changes" : "Add product"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="focus-ring rounded-full border border-ink/10 px-4 py-3 text-sm text-ink/60"
                >
                  Cancel
                </button>
              )}
            </div>
            {message && <p className="text-sm text-ink/60">{message}</p>}
          </form>

          <div className="max-h-[640px] overflow-y-auto rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
            <ul className="flex flex-col divide-y divide-ink/5">
              {products.map((p) => (
                <li key={p.id} className="flex items-center gap-3 py-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-600 text-ink">{p.name}</p>
                    <p className="text-xs text-ink/50">{formatGHS(p.price)} · {p.category}</p>
                  </div>
                  <button
                    onClick={() => startEdit(p)}
                    className="focus-ring rounded-full px-3 py-1.5 text-xs font-600 text-violet hover:bg-violet/10"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="focus-ring rounded-full px-3 py-1.5 text-xs font-600 text-signal hover:bg-signal/10"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {tab === "orders" && (
        <div className="mt-8 overflow-x-auto rounded-3xl bg-white shadow-sm ring-1 ring-ink/5">
          <table className="w-full text-left text-sm">
            <thead className="bg-cream text-xs uppercase tracking-wide text-ink/50">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Delivery</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/5">
              {orders.map((o) => (
                <tr key={o.id}>
                  <td className="px-4 py-3 font-600">{o.reference}</td>
                  <td className="px-4 py-3">
                    {o.customer.name}
                    <p className="text-xs text-ink/40">{o.customer.phone}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink/60">
                    {o.customer.deliveryMethod === "pickup" ? "Pickup" : "Delivery"}
                    {o.customer.address ? ` — ${o.customer.address}` : ""}
                  </td>
                  <td className="px-4 py-3">{formatGHS(o.total)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-600 ${
                        o.status === "paid"
                          ? "bg-gold/20 text-ink"
                          : "bg-ink/5 text-ink/50"
                      }`}
                    >
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-ink/40">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
