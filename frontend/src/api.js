const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export const api = {
  signup: (email, password) =>
    request("/auth/signup", { method: "POST", body: { email, password } }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
  listTransactions: (token, month) =>
    request(`/transactions/${month ? `?month=${month}` : ""}`, { token }),
  createTransaction: (token, txn) =>
    request("/transactions/", { method: "POST", body: txn, token }),
  updateTransaction: (token, id, txn) =>
    request(`/transactions/${id}`, { method: "PUT", body: txn, token }),
  deleteTransaction: (token, id) =>
    request(`/transactions/${id}`, { method: "DELETE", token }),
  summary: (token) => request("/transactions/summary", { token }),
};
