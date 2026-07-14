import { categories } from "../data/categories.js";

export const CONDITIONS = ["Brand New", "UK Used", "Refurbished"];

export const emptyProduct = {
  id: "",
  name: "",
  category: "phones",
  brand: "",
  spec: "",
  condition: "Brand New",
  price: "",
  oldPrice: "",
  image: "",
  images: [],
  video: "",
  badge: "",
  stock: "",
  rating: "",
  specsText: "",
  storageText: "",
  colorsText: "",
};

export function productToForm(p = {}) {
  const images =
    Array.isArray(p.images) && p.images.length
      ? p.images
      : p.image
      ? [p.image]
      : [];
  return {
    ...emptyProduct,
    ...p,
    price: p.price ?? "",
    oldPrice: p.oldPrice ?? "",
    stock: p.stock ?? "",
    rating: p.rating ?? "",
    image: p.image ?? images[0] ?? "",
    images,
    video: p.video ?? "",
    specsText: specsToText(p.specs),
    storageText: storageToText(p.variants),
    colorsText: colorsToText(p.variants),
  };
}

export function formToPayload(form) {
  const { specsText, storageText, colorsText, image, ...rest } = form;
  const storage = parseStorageText(storageText);
  const color = parseColorsText(colorsText);
  const images = (rest.images || []).filter(Boolean).slice(0, 7);
  return {
    ...rest,
    images,
    image: images[0] || image || undefined,
    price: Number(form.price),
    oldPrice: form.oldPrice ? Number(form.oldPrice) : undefined,
    stock: form.stock !== "" && form.stock != null ? Number(form.stock) : undefined,
    rating: form.rating !== "" && form.rating != null ? Number(form.rating) : undefined,
    specs: textToSpecs(specsText),
    variants:
      storage || color
        ? { storage: storage || [], color: color || [] }
        : undefined,
  };
}

export function specsToText(specs) {
  if (!specs) return "";
  return Object.entries(specs)
    .map(([k, v]) => `${k}: ${v}`)
    .join("\n");
}

function textToSpecs(text) {
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length === 0) return undefined;
  const specs = {};
  for (const line of lines) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    specs[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return Object.keys(specs).length ? specs : undefined;
}

export function storageToText(variants) {
  if (!variants?.storage?.length) return "";
  return variants.storage.map((s) => `${s.value}: ${s.price}`).join("\n");
}

export function colorsToText(variants) {
  if (!variants?.color?.length) return "";
  return variants.color.map((c) => `${c.name}: ${c.hex}`).join("\n");
}

function parseStorageText(text) {
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
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
  const lines = String(text || "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
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

export function parseColorsPreview(text) {
  return parseColorsText(text) || [];
}

export function categoryLabel(id) {
  return categories.find((c) => c.id === id)?.label || id;
}
