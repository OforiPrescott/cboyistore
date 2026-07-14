# What changed in this update

## Catalogue (backend/data/products.json)
- Expanded from 27 to 83 products across 7 categories: Phones, Laptops, Tablets,
  Smartwatches, Accessories, Gaming, Appliances.
- Phones now cover a full current lineup: iPhone 13 through 16 Pro Max, the whole
  Galaxy S24 range plus S23 Ultra, Z Fold6/Flip6, A-series, and Google Pixel 7-9.
- Every phone, laptop, tablet and smartwatch now has a `specs` object (display,
  chip/processor, camera, battery, storage, etc.) that renders in the new
  "Quick view & specs" modal on the storefront.
- Added `stock` and `rating` fields, used for "only X left" badges and star
  ratings on product cards.

## Product images
- All product photography was replaced with a consistent, generated set of
  on-brand vector cards (frontend/public/images/generated/*.svg) — one per
  product, matched to its exact category (phone / laptop / watch / earbuds /
  console / fridge / etc.) and brand colour palette. This guarantees every
  image is correct for its product and removes the old mismatched stock
  photos, with nothing hotlinked or copyrighted.
- Staff can swap in real photography any time from the admin dashboard — the
  "Image URL" field on each product accepts any image link.

## Storefront (frontend/src)
- New `ProductModal.jsx`: a "Quick view" popup showing the full spec sheet,
  price, condition and a WhatsApp enquiry link.
- `ProductCard.jsx`: star ratings, low-stock/out-of-stock badges, a "Save
  GHS X" badge when there's a discount, and a hover "Quick view" button.
- `Shop.jsx`: brand filter chips and a sort dropdown (price/name), plus
  skeleton loading cards instead of a plain "Loading…" message.
- `Hero.jsx`: added a stats strip (products in stock, categories, delivery
  regions, rating).
- `WhyUs.jsx`: added icons to the three trust points.
- New `tablets` category (previously the iPad was miscategorised under
  Accessories).

## Admin dashboard (frontend/src/admin/*)
Already a separate app (own `admin.html` / `admin-entry.jsx`, its own login
screen, and API calls gated behind `x-admin-key` on the backend) — kept that
separation and rebuilt it as a proper sidebar CMS:
- **Dashboard**: stat cards (products, paid orders, paid revenue, low stock)
  plus recent-orders and low-stock watchlists.
- **Products**: search, category filter and sort; add / edit / duplicate /
  delete in a slide-over drawer; the form edits name, category, brand,
  condition, price, old price, stock, rating, image (with live preview),
  badge, the full spec sheet, and storage/colour variants.
- **Orders**: filter by status, open full details (items, customer, delivery,
  WhatsApp link) and move an order through pending → paid → fulfilled →
  cancelled (new `PUT /api/orders/:reference/status`).
- **Trade-in**: manage the device list and base values straight from the UI
  (new admin CRUD at `/api/tradein/admin`) instead of hand-editing JSON.

## Notes for going live
- Set a real `ADMIN_KEY` in `backend/.env` before deploying (it currently
  contains a placeholder).
- Add your Paystack keys the same way.
- To use real product photography instead of the generated cards, just paste
  an image URL into the product's "Image URL" field in the admin dashboard.
