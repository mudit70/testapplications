// SvelteKit client-side load for the dashboards list.
// Route: /

import { listDashboards } from '$lib/api';

export async function load({ fetch }) {
  const dashboards = await listDashboards(fetch);
  return { dashboards };
}
