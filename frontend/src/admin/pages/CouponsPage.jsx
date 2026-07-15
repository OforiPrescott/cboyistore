import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Badge,
  Button,
  Drawer,
  EmptyState,
  Input,
  Select,
  Skeleton,
  cx,
  useSearchHotkey,
} from "../ui.jsx";
import { useAdmin } from "../AdminContext.jsx";
import { formatGHS } from "../../lib/format.js";
import {
  apiFetchCoupons,
  apiCreateCoupon,
  apiUpdateCoupon,
  apiDeleteCoupon,
} from "../api.js";

const DISCOUNT_TYPES = [
  { value: "percentage", label: "Percentage (%)" },
  { value: "fixed", label: "Fixed amount (GHS)" },
];

export default function CouponsPage() {
  const { adminKey, notify, logout } = useAdmin();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const searchRef = useRef(null);

  useSearchHotkey(searchRef);

  async function load() {
    setLoading(true);
    try {
      const data = await apiFetchCoupons(adminKey);
      setCoupons(data);
    } catch (err) {
      if (err.status === 401) {
        notify("Admin key rejected — please sign in again.", "error");
        logout();
      } else {
        notify(err.message || "Failed to load coupons", "error");
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
    return coupons.filter((c) =>
      q ? c.code.toLowerCase().includes(q) : true
    );
  }, [coupons, query]);

  function openAdd() {
    setEditing({
      code: "",
      discountType: "percentage",
      discountValue: "",
      minPurchase: "",
      maxDiscount: "",
      usageLimit: "",
      expiresAt: "",
      active: true,
    });
    setDrawerOpen(true);
  }

  function openEdit(coupon) {
    setEditing({
      id: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minPurchase: coupon.minPurchase || "",
      maxDiscount: coupon.maxDiscount || "",
      usageLimit: coupon.usageLimit || "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      active: coupon.active,
    });
    setDrawerOpen(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        code: editing.code,
        discountType: editing.discountType,
        discountValue: Number(editing.discountValue),
        minPurchase: editing.minPurchase ? Number(editing.minPurchase) : 0,
        maxDiscount: editing.maxDiscount ? Number(editing.maxDiscount) : undefined,
        usageLimit: editing.usageLimit ? Number(editing.usageLimit) : undefined,
        expiresAt: editing.expiresAt || null,
        active: editing.active,
      };

      if (editing.id) {
        await apiUpdateCoupon(adminKey, editing.id, payload);
        notify(`Coupon ${payload.code} updated`);
      } else {
        await apiCreateCoupon(adminKey, payload);
        notify(`Coupon ${payload.code} created`);
      }
      setDrawerOpen(false);
      load();
    } catch (err) {
      notify(err.message || "Save failed", "error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(coupon) {
    if (!confirm(`Delete coupon ${coupon.code}?`)) return;
    setDeleting(true);
    try {
      await apiDeleteCoupon(adminKey, coupon.id);
      notify(`Coupon ${coupon.code} deleted`);
      load();
    } catch (err) {
      notify(err.message || "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-700 text-ink">Coupons & discounts</h1>
          <p className="text-sm text-ink/50">{coupons.length} total</p>
        </div>
        <Button variant="primary" onClick={openAdd}>
          + New coupon
        </Button>
      </header>

      <div className="mt-5">
        <div className="relative max-w-xs">
          <Input
            ref={searchRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coupon code…"
            aria-label="Search coupons"
          />
          <kbd
            aria-hidden="true"
            className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded border border-ink/15 bg-cream px-1.5 py-0.5 text-[10px] font-600 text-ink/40 sm:block"
          >
            /
          </kbd>
        </div>
      </div>

      {loading ? (
        <div className="mt-6 space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState className="mt-6" title="No coupons" hint="Create your first coupon to offer discounts." />
      ) : (
        <div className="mt-6 space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-white p-4 shadow-sm"
            >
              <div>
                <p className="font-600 text-ink">{c.code}</p>
                <p className="text-xs text-ink/50">
                  {c.discountType === "percentage" ? `${c.discountValue}% off` : `${formatGHS(c.discountValue)} off`}
                  {c.minPurchase ? ` · min GHS ${c.minPurchase.toLocaleString()}` : ""}
                  {c.maxDiscount ? ` · max ${formatGHS(c.maxDiscount)}` : ""}
                  {c.usageLimit ? ` · ${c.usedCount}/${c.usageLimit} used` : " · unlimited"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge tone={c.active ? "green" : "neutral"}>{c.active ? "Active" : "Inactive"}</Badge>
                <Button variant="outline" onClick={() => openEdit(c)}>Edit</Button>
                <Button variant="outline" onClick={() => handleDelete(c)} disabled={deleting}>Delete</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer
        open={Boolean(editing)}
        onClose={() => {
          setDrawerOpen(false);
          setEditing(null);
        }}
        title={editing?.id ? "Edit coupon" : "New coupon"}
        width="max-w-lg"
        footer={
          <div className="flex gap-2">
            <Button type="submit" variant="primary" className="flex-1" disabled={saving} form="coupon-form">
              {saving ? "Saving…" : editing?.id ? "Save changes" : "Create coupon"}
            </Button>
            <Button type="button" variant="outline" onClick={() => { setDrawerOpen(false); setEditing(null); }} disabled={saving}>
              Cancel
            </Button>
          </div>
        }
      >
        {editing && (
          <form id="coupon-form" onSubmit={handleSave} className="flex flex-col gap-4">
            <Field label="Coupon code" hint="Will be converted to uppercase">
              <Input
                required
                value={editing.code}
                onChange={(e) => setEditing({ ...editing, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER25"
              />
            </Field>

            <Field label="Discount type">
              <Select
                value={editing.discountType}
                onChange={(e) => setEditing({ ...editing, discountType: e.target.value })}
              >
                {DISCOUNT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </Select>
            </Field>

            <Field label="Discount value">
              <Input
                required
                type="number"
                min="0"
                value={editing.discountValue}
                onChange={(e) => setEditing({ ...editing, discountValue: e.target.value })}
                placeholder={editing.discountType === "percentage" ? "25" : "500"}
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Min purchase (GHS)" hint="0 = no minimum">
                <Input
                  type="number"
                  min="0"
                  value={editing.minPurchase}
                  onChange={(e) => setEditing({ ...editing, minPurchase: e.target.value })}
                  placeholder="0"
                />
              </Field>
              <Field label="Max discount (GHS)" hint="Leave empty for no cap">
                <Input
                  type="number"
                  min="0"
                  value={editing.maxDiscount}
                  onChange={(e) => setEditing({ ...editing, maxDiscount: e.target.value })}
                  placeholder="No cap"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Usage limit" hint="Leave empty for unlimited">
                <Input
                  type="number"
                  min="1"
                  value={editing.usageLimit}
                  onChange={(e) => setEditing({ ...editing, usageLimit: e.target.value })}
                  placeholder="Unlimited"
                />
              </Field>
              <Field label="Expires at">
                <Input
                  type="date"
                  value={editing.expiresAt}
                  onChange={(e) => setEditing({ ...editing, expiresAt: e.target.value })}
                />
              </Field>
            </div>

            <Field label="Status">
              <Select
                value={editing.active ? "true" : "false"}
                onChange={(e) => setEditing({ ...editing, active: e.target.value === "true" })}
              >
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Select>
            </Field>
          </form>
        )}
      </Drawer>
    </div>
  );
}

function Field({ label, hint, children, className }) {
  return (
    <div className={cx("flex flex-col gap-1", className)}>
      <label className="text-xs font-600 text-ink/60">
        {label}
        {hint && <span className="ml-1 text-ink/40">({hint})</span>}
      </label>
      {children}
    </div>
  );
}
