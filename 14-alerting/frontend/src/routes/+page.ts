// SvelteKit client-side load for the alerts dashboard.
// Route: /

import { listAlerts, fetchStats } from '$lib/api';

export async function load({ fetch }) {
  const alerts = await listAlerts(fetch);
  const stats = await fetchStats(fetch);
  return { alerts, stats };
}
