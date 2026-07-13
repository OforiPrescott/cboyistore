import React, { useEffect, useMemo, useState } from "react";
import CategoryTabs from "./CategoryTabs.jsx";
import ProductCard from "./ProductCard.jsx";
import { fetchProducts } from "../lib/api.js";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name-asc", label: "Name: A–Z" },
];

function SkeletonCard() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-ink/5">
      <div className="aspect-square animate-pulse bg-ink/5" />
      <div className="flex flex-col gap-2 p-4">
        <div className="h-3 w-1/3 animate-pulse rounded bg-ink/10" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-ink/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-ink/10" />
      </div>
    </div>
  );
}

export default function Shop() {
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [brand, setBrand] = useState("all");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchProducts({ category, q: query })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, query]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const visible = useMemo(() => {
    let list = brand === "all" ? products : products.filter((p) => p.brand === brand);
    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "name-asc") list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [products, brand, sort]);

  return (
    <section id="shop" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-xs font-600 uppercase tracking-[0.3em] text-violet">
            The catalogue · {products.length}+ items
          </p>
          <h2 className="mt-2 font-display text-3xl font-700 text-ink">
            Everything for your next upgrade
          </h2>
        </div>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search iPhone, Pixel, MacBook, PS5…"
          className="focus-ring w-full rounded-full border border-ink/10 bg-white px-5 py-3 text-sm shadow-sm sm:w-80"
        />
      </div>

      <div className="mt-6">
        <CategoryTabs active={category} onChange={setCategory} />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="font-600 text-ink/40">Brand</span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setBrand(b)}
              className={`focus-ring rounded-full px-3 py-1.5 font-600 transition-colors ${
                brand === b ? "bg-violet text-white" : "bg-white text-ink/60 ring-1 ring-ink/10 hover:bg-ink/5"
              }`}
            >
              {b === "all" ? "All brands" : b}
            </button>
          ))}
        </div>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="focus-ring w-full rounded-full border border-ink/10 bg-white px-4 py-2 text-xs font-600 text-ink/70 sm:w-auto"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              Sort: {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {loading && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}
        {error && (
          <div className="rounded-2xl bg-white p-8 text-center text-sm text-ink/60 ring-1 ring-ink/5">
            Couldn't reach the shop API ({error}). Make sure the backend server
            is running on port 4000.
          </div>
        )}
        {!loading && !error && visible.length === 0 && (
          <p className="py-16 text-center text-sm text-ink/40">
            Nothing matches that search yet — try another keyword.
          </p>
        )}
        {!loading && !error && visible.length > 0 && (
          <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
