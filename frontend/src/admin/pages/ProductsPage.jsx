import React, { useEffect, useMemo, useState } from "react";
import { Badge, Button, Drawer, EmptyState, Input, Select, Spinner, cx } from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { formatGHS } from "../../lib/format.js";
import {
  apiCreateProduct,
  apiDeleteProduct,
  apiFetchProducts,
  apiUpdateProduct,
} from "../api.js";
import ProductForm from "../ProductForm.jsx";
import { productToForm } from "../productForm.js";
import { categories } from "../../data/categories.js";

const SORTS = {
  "name-asc": { label: "Name A–Z", fn: (a, b) => a.name.localeCompare(b.name) },
  "name-desc": { label: "Name Z–A", fn: (a, b) => b.name.localeCompare(a.name) },
  "price-asc": { label: "Price low → high", fn: (a, b) => a.price - b.price },
  "price-desc": { label: "Price high → low", fn: (a, b) => b.price - a.price },
  "stock-asc": { label: "Stock low → high", fn: (a, b) => (a.stock ?? 1e9) - (b.stock ?? 1e9) },
};

export default function ProductsPage() {
  const { adminKey, notify, logout, confirm } = useAdmin();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("name-asc");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetchProducts();
      setProducts(data);
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Failed to load products", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products
      .filter((p) => (category === "all" ? true : p.category === category))
      .filter((p) =>
        q ? p.name.toLowerCase().includes(q) || (p.brand || "").toLowerCase().includes(q) : true
      )
      .sort(SORTS[sort].fn);
  }, [products, query, category, sort]);

  function openAdd() {
    setEditing(null);
    setDrawerOpen(true);
  }

  function openEdit(p) {
    setEditing(productToForm(p));
    setDrawerOpen(true);
  }

  function openDuplicate(p) {
    const copy = productToForm(p);
    copy.id = "";
    copy.name = `${p.name} (copy)`;
    setEditing(copy);
    setDrawerOpen(true);
  }

  async function handleSave(payload) {
    setSaving(true);
    try {
      if (editing?.id) {
        await apiUpdateProduct(adminKey, editing.id, payload);
        notify(`Updated "${payload.name}".`);
      } else {
        await apiCreateProduct(adminKey, payload);
        notify(`Added "${payload.name}" to the catalogue.`);
      }
      setDrawerOpen(false);
      setEditing(null);
      await load();
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Save failed", "error");
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(p) {
    const ok = await confirm({
      title: "Delete product?",
      message: `"${p.name}" will be removed from the storefront. This cannot be undone.`,
      confirmLabel: "Delete",
    });
    if (!ok) return;
    try {
      await apiDeleteProduct(adminKey, p.id);
      notify(`Removed "${p.name}".`);
      await load();
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Delete failed", "error");
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Products</h1>
          <p className="text-sm text-ink/50">
            {products.length} total &middot; {filtered.length} shown
          </p>
        </div>
        <Button onClick={openAdd}>＋ Add product</Button>
      </header>

      <div className="mt-5 flex flex-wrap gap-3">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search name or brand…"
          className="max-w-xs"
        />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} className="max-w-[180px]">
          <option value="all">All categories</option>
          {categories
            .filter((c) => c.id !== "all")
            .map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="max-w-[200px]">
          {Object.entries(SORTS).map(([key, s]) => (
            <option key={key} value={key}>
              Sort: {s.label}
            </option>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32 text-ink/40">
          <Spinner className="h-7 w-7" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          className="mt-6"
          title="No products match"
          hint="Try a different search or add a new product."
          action={<Button onClick={openAdd}>＋ Add product</Button>}
        />
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={() => openEdit(p)}
              onDuplicate={() => openDuplicate(p)}
              onDelete={() => handleDelete(p)}
            />
          ))}
        </div>
      )}

      <Drawer
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        title={editing?.id ? "Edit product" : "Add product"}
      >
        <ProductForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => {
            setDrawerOpen(false);
            setEditing(null);
          }}
          saving={saving}
        />
      </Drawer>
    </div>
  );
}

function ProductCard({ product, onEdit, onDuplicate, onDelete }) {
  const stockTone =
    product.stock === 0 ? "red" : product.stock != null && product.stock <= 5 ? "gold" : "neutral";
  return (
    <div className="flex flex-col rounded-3xl bg-white p-4 shadow-sm ring-1 ring-ink/5">
      <div className="flex gap-3">
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.style.visibility = "hidden";
            }}
            className="h-16 w-16 flex-shrink-0 rounded-xl object-cover ring-1 ring-ink/10"
          />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="truncate font-600 text-ink" title={product.name}>
              {product.name}
            </p>
            {product.badge && <Badge tone="signal">{product.badge}</Badge>}
          </div>
          <p className="text-xs text-ink/40">{product.brand || "—"} &middot; {product.category}</p>
          <p className="mt-1 font-display text-base font-700 text-ink">{formatGHS(product.price)}</p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <Badge tone={stockTone}>
          {product.stock === 0
            ? "Out of stock"
            : product.stock != null
            ? `${product.stock} in stock`
            : "No stock set"}
        </Badge>
        <span className="text-xs text-ink/40">{product.condition}</span>
      </div>

      <div className="mt-4 flex gap-2 border-t border-ink/5 pt-3">
        <Button variant="outline" className="flex-1 px-2 py-2 text-xs" onClick={onEdit}>
          Edit
        </Button>
        <Button variant="ghost" className="px-2 py-2 text-xs" onClick={onDuplicate}>
          Duplicate
        </Button>
        <Button variant="ghost" className="px-2 py-2 text-xs text-signal" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
}
