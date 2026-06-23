// SvelteKit client-side load for a single dashboard.
// Route: /dashboards/:id

import { getDashboard } from '$lib/api';

export async function load({ params, fetch }) {
  const dashboard = await getDashboard(fetch, Number(params.id));
  return { dashboard };
}
