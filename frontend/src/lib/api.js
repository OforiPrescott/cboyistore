const BASE = "/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with ${res.status}`);
  }
  return res.json();
}

export async function fetchProducts({ category, q } = {}) {
  const params = new URLSearchParams();
  if (category && category !== "all") params.set("category", category);
  if (q) params.set("q", q);
  const res = await fetch(`${BASE}/products?${params.toString()}`);
  return handle(res);
}

export async function createOrder({ items, customer, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE}/orders`, {
    method: "POST",
    headers,
    body: JSON.stringify({ items, customer }),
  });
  return handle(res);
}

export async function fetchMyOrders(token) {
  const res = await fetch(`${BASE}/orders/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function initializePayment({ email, amount, reference, metadata }) {
  const res = await fetch(`${BASE}/paystack/initialize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount, reference, metadata }),
  });
  return handle(res);
}

export async function verifyPayment(reference) {
  const res = await fetch(`${BASE}/paystack/verify/${reference}`);
  return handle(res);
}

export async function fetchTradeinDevices() {
  const res = await fetch(`${BASE}/tradein/devices`);
  return handle(res);
}

export async function apiRegister(payload) {
  const res = await fetch(`${BASE}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function apiLogin(payload) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return handle(res);
}

export async function apiMe(token) {
  const res = await fetch(`${BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function apiDeleteMyAccount(token) {
  const res = await fetch(`${BASE}/auth/me`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  return handle(res);
}

export async function estimateTradein({ deviceId, condition }) {
  const res = await fetch(`${BASE}/tradein/estimate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ deviceId, condition }),
  });
  return handle(res);
}

// --- Admin (requires the shop's admin key) ---

export async function fetchOrders(adminKey) {
  const res = await fetch(`${BASE}/orders`, {
    headers: { "x-admin-key": adminKey },
  });
  return handle(res);
}

export async function createProduct(adminKey, product) {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
    body: JSON.stringify(product),
  });
  return handle(res);
}

export async function updateProduct(adminKey, id, product) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
    body: JSON.stringify(product),
  });
  return handle(res);
}

export async function deleteProduct(adminKey, id) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "DELETE",
    headers: { "x-admin-key": adminKey },
  });
  if (!res.ok && res.status !== 204) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || "Failed to delete product");
  }
}

export async function rateProduct(productId, rating) {
  const res = await fetch(`${BASE}/products/${productId}/rate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rating }),
  });
  return handle(res);
}
