// SvelteKit client-side load for a single alert.
// Route: /alerts/:id

export async function load({ params, fetch }) {
  const res = await fetch(`/api/alerts/${params.id}`);
  return { alert: await res.json() };
}
