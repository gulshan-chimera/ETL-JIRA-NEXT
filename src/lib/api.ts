// lib/api.ts
export async function fetchWithSession(url: string, options: RequestInit = {}) {
  const res = await fetch(`http://localhost:3000${url}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
