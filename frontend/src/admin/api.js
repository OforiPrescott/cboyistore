const BASE = "/api";

// --- Auth ---

// Confirm a typed admin key actually works before we stash it in
// sessionStorage. Prevents the "logged in but every request 401s" trap.
export async function apiVerifyAdmin(adminKey) {
  const res = await fetch(`${BASE}/admin/verify`, {
    headers: { "x-admin-key": adminKey },
  });
  return handle(res);
}

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.error || `Request failed with ${res.status}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

function authHeaders(adminKey, json = true) {
  const headers = { "x-admin-key": adminKey };
  if (json) headers["Content-Type"] = "application/json";
  return headers;
}

// --- Products ---

export async function apiFetchProducts() {
  const res = await fetch(`${BASE}/products`);
  return handle(res);
}

export async function apiCreateProduct(adminKey, product) {
  const res = await fetch(`${BASE}/products`, {
    method: "POST",
    headers: authHeaders(adminKey),
    body: JSON.stringify(product),
  });
  return handle(res);
}

export async function apiUpdateProduct(adminKey, id, product) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "PUT",
    headers: authHeaders(adminKey),
    body: JSON.stringify(product),
  });
  return handle(res);
}

export async function apiDeleteProduct(adminKey, id) {
  const res = await fetch(`${BASE}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(adminKey, false),
  });
  return handle(res);
}

// --- Media uploads (admin) ---

export async function apiUploadFiles(adminKey, files) {
  const fd = new FormData();
  for (const f of files) fd.append("files", f);
  const res = await fetch(`${BASE}/upload`, {
    method: "POST",
    headers: { "x-admin-key": adminKey },
    body: fd,
  });
  return handle(res);
}

// --- Orders ---

export async function apiFetchOrders(adminKey) {
  const res = await fetch(`${BASE}/orders`, { headers: authHeaders(adminKey, false) });
  return handle(res);
}

export async function apiFetchCustomers(adminKey) {
  const res = await fetch(`${BASE}/auth/customers`, { headers: authHeaders(adminKey, false) });
  return handle(res);
}

export async function apiDeleteCustomer(adminKey, id) {
  const res = await fetch(`${BASE}/auth/customers/${id}`, {
    method: "DELETE",
    headers: authHeaders(adminKey, false),
  });
  return handle(res);
}

export async function apiUpdateOrderStatus(adminKey, reference, status) {
  const res = await fetch(`${BASE}/orders/${reference}/status`, {
    method: "PUT",
    headers: authHeaders(adminKey),
    body: JSON.stringify({ status }),
  });
  return handle(res);
}

// --- Trade-in (admin) ---

export async function apiFetchTradein(adminKey) {
  const res = await fetch(`${BASE}/tradein/admin`, { headers: authHeaders(adminKey, false) });
  return handle(res);
}

export async function apiCreateTradein(adminKey, device) {
  const res = await fetch(`${BASE}/tradein/admin`, {
    method: "POST",
    headers: authHeaders(adminKey),
    body: JSON.stringify(device),
  });
  return handle(res);
}

export async function apiUpdateTradein(adminKey, id, patch) {
  const res = await fetch(`${BASE}/tradein/admin/${id}`, {
    method: "PUT",
    headers: authHeaders(adminKey),
    body: JSON.stringify(patch),
  });
  return handle(res);
}

export async function apiDeleteTradein(adminKey, id) {
  const res = await fetch(`${BASE}/tradein/admin/${id}`, {
    method: "DELETE",
    headers: authHeaders(adminKey, false),
  });
  return handle(res);
}
