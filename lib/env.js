export const API_BASE = (() => {
  const host = window.location.hostname;
  if (host.includes("github.io")) return "https://kellerkinderclan.de/Dienstplan/api";
  if (host === "localhost" || host.startsWith("127.")) return "http://localhost/Dienstplan/api";
  return "https://kellerkinderclan.de/Dienstplan/api";
})();

export const API_KEY = "12345";

export async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}/${endpoint}${endpoint.includes("?") ? "&" : "?"}key=${API_KEY}`;
  const opts = { headers: { "Content-Type": "application/json" }, ...options };
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const ct = (res.headers.get("content-type") || "").toLowerCase();
  return ct.includes("application/json") ? res.json() : res.text();
}
