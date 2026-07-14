import React, { useState } from "react";
import {
  Badge,
  Button,
  Field,
  Input,
  Select,
  Textarea,
  cx,
} from "./ui.jsx";
import { categories, brands } from "../data/categories.js";
import { useAdmin } from "./AdminContext.jsx";
import { apiUploadFiles } from "./api.js";
import {
  CONDITIONS,
  emptyProduct,
  formToPayload,
  parseColorsPreview,
} from "./productForm.js";

const MAX_IMAGES = 7;

export default function ProductForm({ initial, onSave, onCancel, saving }) {
  const { adminKey, notify } = useAdmin();
  const [form, setForm] = useState(initial || emptyProduct);
  const [uploading, setUploading] = useState(false);
  const [urlText, setUrlText] = useState("");

  function set(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSave(formToPayload(form));
      }}
      className="flex flex-col gap-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <Field label="Name" className="col-span-2">
          <Input
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="iPhone 16 Pro Max"
          />
        </Field>

        <Field label="Category">
          <Select value={form.category} onChange={(e) => set("category", e.target.value)}>
            {categories
              .filter((c) => c.id !== "all")
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
          </Select>
        </Field>

        <Field label="Brand">
          <Select
            value={form.brand}
            onChange={(e) => set("brand", e.target.value)}
            className="appearance-none"
          >
            <option value="">—</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Condition">
          <Select value={form.condition} onChange={(e) => set("condition", e.target.value)}>
            {CONDITIONS.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </Field>

        <Field label="Badge">
          <Input
            value={form.badge}
            onChange={(e) => set("badge", e.target.value)}
            placeholder="New Arrival (optional)"
          />
        </Field>

        <Field label="Price (GHS)" hint="Selling price">
          <Input
            required
            type="number"
            min="0"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            placeholder="14500"
          />
        </Field>

        <Field label="Old price (GHS)" hint="For a strike-through discount">
          <Input
            type="number"
            min="0"
            value={form.oldPrice}
            onChange={(e) => set("oldPrice", e.target.value)}
            placeholder="15900"
          />
        </Field>

        <Field label="Stock qty">
          <Input
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => set("stock", e.target.value)}
            placeholder="12"
          />
        </Field>

        <Field label="Rating (1–5)">
          <Input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={form.rating}
            onChange={(e) => set("rating", e.target.value)}
            placeholder="4.5"
          />
        </Field>
      </div>

      <Field label="Short spec" hint="Shown on the product card, e.g. 256GB · 8GB RAM">
        <Input
          value={form.spec}
          onChange={(e) => set("spec", e.target.value)}
          placeholder="256GB · Titanium"
        />
      </Field>

      <MediaUploader form={form} set={set} uploading={uploading} setUploading={setUploading} />

      <Field label="Or paste image URLs" hint="One per line (e.g. Unsplash / /images/generated/...svg) — adds to the gallery">
        <Textarea
          rows={2}
          value={urlText}
          onChange={(e) => setUrlText(e.target.value)}
          placeholder={"https://images.unsplash.com/photo-...\n/images/generated/iph-16-pro-max.svg"}
          className="font-mono text-xs"
        />
      </Field>
      {urlText.trim() && (
        <Button
          type="button"
          variant="outline"
          className="self-start"
          onClick={() => {
            const links = urlText
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean);
            set("images", [...form.images, ...links].slice(0, 7));
            setUrlText("");
          }}
        >
          Add {urlText.split("\n").filter(Boolean).length} URL(s) to gallery
        </Button>
      )}

      <Field
        label="Full specification"
        hint={'One per line as "Label: Value" — shown in the customer quick-view'}
      >
        <Textarea
          rows={5}
          value={form.specsText}
          onChange={(e) => set("specsText", e.target.value)}
          placeholder={'Display: 6.9" OLED\nChip: A18 Pro\nBattery: Up to 33 hrs'}
          className="font-mono text-xs"
        />
      </Field>

      <div className="rounded-2xl bg-white p-4 ring-1 ring-ink/5">
        <p className="text-xs font-600 uppercase tracking-wide text-ink/50">
          Variants (optional)
        </p>
        <div className="mt-3 grid gap-3">
          <Field label="Storage options" hint='One per line "Size: Price (GHS)"'>
            <Textarea
              rows={3}
              value={form.storageText}
              onChange={(e) => set("storageText", e.target.value)}
              placeholder={"128GB: 8500\n256GB: 9200"}
              className="font-mono text-xs"
            />
          </Field>
          <Field label="Colours" hint='One per line "Name: Hex"'>
            <Textarea
              rows={3}
              value={form.colorsText}
              onChange={(e) => set("colorsText", e.target.value)}
              placeholder={"Black Titanium: #1c1c1e"}
              className="font-mono text-xs"
            />
          </Field>
        </div>
        {form.colorsText.trim() && (
          <div className="mt-3 flex flex-wrap gap-2">
            {parseColorsPreview(form.colorsText).map((c) => (
              <span
                key={c.name}
                className="flex items-center gap-1.5 rounded-full border border-ink/10 bg-cream px-2 py-1 text-xs text-ink/70"
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

      <div className="sticky bottom-0 -mx-6 -mb-5 flex gap-2 border-t border-ink/10 bg-cream px-6 py-4">
        <Button type="submit" variant="primary" className="flex-1" disabled={saving}>
          {saving ? "Saving…" : initial?.id ? "Save changes" : "Add product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

function MediaUploader({ form, set, uploading, setUploading }) {
  const { adminKey, notify } = useAdmin();

  function makePrimary(i) {
    if (i === 0) return;
    const next = [...form.images];
    const [item] = next.splice(i, 1);
    next.unshift(item);
    set("images", next);
  }

  function removeImage(i) {
    set(
      "images",
      form.images.filter((_, idx) => idx !== i)
    );
  }

  async function handleFiles(e, kind) {
    const fileList = Array.from(e.target.files || []);
    if (!fileList.length) return;
    const remaining = kind === "image" ? MAX_IMAGES - form.images.length : form.video ? 0 : 1;
    const toUpload = fileList.slice(0, remaining);
    if (toUpload.length === 0) {
      notify(kind === "image" ? `Max ${MAX_IMAGES} images.` : "Only one video allowed.", "error");
      e.target.value = "";
      return;
    }
    setUploading(true);
    try {
      const res = await apiUploadFiles(adminKey, toUpload);
      if (kind === "image") {
        set("images", [...form.images, ...res.images].slice(0, MAX_IMAGES));
      } else if (res.videos[0]) {
        set("video", res.videos[0]);
      }
      notify(`Uploaded ${toUpload.length} ${kind === "image" ? "image(s)" : "video"}.`);
    } catch (err) {
      notify(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  return (
    <div>
      <Field label="Product images" hint={`Upload 1–${MAX_IMAGES} photos. The first is the cover shown on the store.`}>
        <div className="grid grid-cols-4 gap-2">
          {form.images.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden rounded-xl bg-ink/5 ring-1 ring-ink/10"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded-full bg-ink/80 px-2 py-0.5 text-[10px] font-600 text-cream">
                  Cover
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink/55 opacity-0 transition group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(i)}
                    className="rounded-md bg-white/90 px-2 py-1 text-[11px] font-600 text-ink"
                  >
                    Cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="rounded-md bg-signal px-2 py-1 text-[11px] font-600 text-white"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <label
          className={cx(
            "focus-ring mt-2 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 px-4 py-3 text-sm text-ink/50 transition hover:bg-ink/5",
            (form.images.length >= MAX_IMAGES || uploading) && "cursor-not-allowed opacity-50"
          )}
        >
          {uploading ? "Uploading…" : `＋ Upload images (${form.images.length}/${MAX_IMAGES})`}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={form.images.length >= MAX_IMAGES || uploading}
            onChange={(e) => handleFiles(e, "image")}
          />
        </label>
      </Field>

      <Field label="Promo video (optional)" hint="One short clip (mp4 / webm / mov), up to 40MB.">
        {form.video ? (
          <div className="flex items-center gap-3 rounded-2xl bg-white p-3 ring-1 ring-ink/5">
            <video src={form.video} controls className="h-16 w-28 rounded-lg object-cover ring-1 ring-ink/10" />
            <div className="flex-1 truncate text-xs text-ink/40">{form.video}</div>
            <button
              type="button"
              onClick={() => set("video", "")}
              className="rounded-md bg-signal px-2 py-1 text-[11px] font-600 text-white"
            >
              Remove
            </button>
          </div>
        ) : (
          <label
            className={cx(
              "focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 px-4 py-3 text-sm text-ink/50 transition hover:bg-ink/5",
              uploading && "cursor-not-allowed opacity-50"
            )}
          >
            {uploading ? "Uploading…" : "＋ Upload video"}
            <input
              type="file"
              accept="video/*"
              hidden
              disabled={uploading}
              onChange={(e) => handleFiles(e, "video")}
            />
          </label>
        )}
      </Field>
    </div>
  );
}
