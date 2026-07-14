# Cboyistore — Web App

Full-stack storefront for **Cboyistore**, "Premium Reseller — Dealers in
phones and gadgets," Tafo American Building, Kumasi. Sells iPhones, Samsung
phones, MacBooks/laptops, smartwatches, accessories, gaming and home
appliances, with iBuy / iSwap / iFix services and Paystack checkout in
Ghana cedis.

## Stack

- **Frontend:** React 18 + Vite + Tailwind CSS + React Router. Paystack
  Inline JS for the payment popup.
- **Backend:** Node.js + Express. `lowdb` (JSON file) for order storage —
  swap for Postgres/MongoDB later without changing the API shape.
- **Payments:** Paystack (initialize / verify / webhook), amounts in GHS.
- **Delivery:** nationwide, or pickup at Tafo American Building — chosen at checkout.
- **Notifications:** a WhatsApp deep-link with the order summary, ready for the
  customer to tap and send; optional SMS alert to the shop via Arkesel.
- **Admin dashboard:** a *separate* staff app (its own build, not part of the
  customer storefront) to add, edit and remove products, and view incoming
  orders — no code or JSON editing needed. It is password-protected by
  `ADMIN_KEY` and is not linked from the shop.
- **iSwap trade-in estimator:** `/trade-in` page gives customers an instant
  ballpark value for their old device before they visit.

```
cboyistore/
├── backend/     Express API — products, orders, Paystack, trade-in, admin
└── frontend/    React storefront — shop, cart, checkout, trade-in, admin
```

## 1. Get Paystack API keys

Sign up at https://paystack.com, then go to
**Settings → API Keys & Webhooks** to copy your **test** keys while you
build (switch to live keys once your business is verified):

- `PAYSTACK_SECRET_KEY` (backend only, never expose in the browser)
- `PAYSTACK_PUBLIC_KEY` (safe to expose in the frontend)

## 2. Run the backend

```bash
cd backend
cp .env.example .env      # then paste your Paystack secret key
npm install
npm run dev                # http://localhost:4000
```

## 3. Run the frontend

```bash
cd frontend
cp .env.example .env      # then paste your Paystack public key
npm install
npm run dev                # http://localhost:5173
```

The Vite dev server proxies `/api/*` to the backend on port 4000
(see `frontend/vite.config.js`), so both must be running.

## 4. Test a payment

Paystack test cards (any future expiry, any CVV):

- Success: `4084084084084081`
- Insufficient funds: `5060666666666666666`

Full list: https://paystack.com/docs/payments/test-payments

## 5. Admin dashboard (separate, staff-only)

The admin is a **separate app** from the customer storefront — it is not part
of the shop's build, has no link on the shop, and customers never see a login
screen. It is protected by `ADMIN_KEY`.

**In development** (frontend dev server running):

```
http://localhost:5173/admin.html
```

**In production** (when the backend serves the built frontend): set
`ADMIN_ROUTE` in `backend/.env` to a non-obvious path (default `/admin`) and
open `https://yourdomain.com<ADMIN_ROUTE>`. Don't link to it from the shop.

Sign in with the `ADMIN_KEY` you set in `backend/.env` (on Render, set it as
an environment variable in the dashboard). If `ADMIN_KEY` is not set on the
server it falls back to the local key so the dashboard still loads — but always
set a custom `ADMIN_KEY` in production for security. From there you get a
full CMS with a sidebar and four sections:

- **Dashboard** — store overview: product count, paid orders, paid revenue,
  low-stock alerts, recent orders and a low-stock watchlist, plus a revenue
  sparkline.
- **Analytics** — sales intelligence: KPIs (paid/pending/gross revenue, avg
  order value, items sold), a 7/14/30-day **sales trend** chart, a **payment
  status** donut, a live **"Payments coming in"** feed (auto-refreshes), and
  **top products** / **revenue by category** breakdowns.
- **Products** — search, filter by category and sort the catalogue; add,
  edit, duplicate or delete products (name, category, brand, condition, price,
  old price, stock, rating, image with live preview, badge, full spec sheet,
  and storage/colour variants). Changes save straight to
  `backend/data/products.json` and appear on the storefront immediately.
- **Orders** — every order with customer contact, delivery method, items,
  total and payment status; open any order for full details and the customer
  WhatsApp link, and move it through `pending → paid → fulfilled → cancelled`.
- **Trade-in** — manage the device list and base values used by the iSwap
  estimator in `backend/data/tradein.json` (no more hand-editing JSON).

Treat the admin key like a password — anyone with it can edit your catalogue.
For a second staff member, just share the same key for now; if you need
separate logins later, that's a good moment to add real user accounts.

## 6. Order notifications

Every order automatically gets a **WhatsApp deep link** with the order
reference, items, and total pre-filled — shown to the customer as "Confirm
order on WhatsApp" right after payment, so it lands in your shop's WhatsApp
with one tap.

For an SMS alert to your own phone the moment an order comes in, sign up at
[arkesel.com](https://arkesel.com) (a Ghana SMS gateway), grab an API key,
and set `ARKESEL_API_KEY` + `SHOP_NOTIFY_PHONE` in `backend/.env`. Leave them
blank to skip SMS entirely — nothing else depends on it.

## 7. iSwap trade-in estimator

`/trade-in` lets a customer pick their old device and its condition and get
an instant ballpark value, pulled from `backend/data/tradein.json`. Edit that
file to update device values as market prices move — each entry has a
`baseValue`, and the estimator applies a condition multiplier (excellent 85%,
good 70%, fair 50%, faulty 25%). The result links to WhatsApp with the quote
pre-filled so the customer can book a visit for a final in-store check.

## 8. Go live

1. Verify your business on Paystack and swap in live keys.
2. Add your production URL as the **Webhook URL** in the Paystack dashboard:
   `https://yourdomain.com/api/paystack/webhook` — this keeps orders in sync
   even if a customer closes the browser before the redirect fires.
3. Deploy the backend (Render, Railway, a VPS, etc.) and the frontend
   (Vercel, Netlify, or the same server behind Nginx).
4. Update `CLIENT_URL` in the backend `.env` and rebuild the frontend
   pointing `/api` at your real backend URL.
5. Change `ADMIN_KEY` to something only you know before going live.

## Editing the catalogue

Products live in `backend/data/products.json` — one object per item
(name, category, brand, spec, condition, price, image, badge). Add, edit
or remove entries and both the API and the storefront pick them up
immediately; no code changes needed. Prices are in Ghana cedis (GHS) and
reflect approximate 2026 market rates for new and UK-used devices —
adjust them to match your actual stock and margins.

## Notes

- Product photos are now **self-hosted** in `frontend/public/images/` and
  referenced in `backend/data/products.json` as `/images/<id>.jpg`, so they
  load reliably without depending on any external image host. To use your own
  photos, drop a file in `frontend/public/images/` and set the product's
  `image` field to `/images/your-file.jpg`.
- Cart state persists in the browser (localStorage) so a customer's cart
  survives a page refresh.
- Orders are stored in `backend/data/orders.json`. For real production use
  with concurrent traffic, migrate this to Postgres or MongoDB.
