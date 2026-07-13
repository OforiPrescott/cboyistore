import React from "react";
import { categories } from "../data/categories.js";

export default function CategoryTabs({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onChange(c.id)}
          className={`focus-ring rounded-full border px-4 py-2 text-sm font-600 transition-colors ${
            active === c.id
              ? "border-ink bg-ink text-cream"
              : "border-ink/10 bg-white text-ink/60 hover:border-ink/30"
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
