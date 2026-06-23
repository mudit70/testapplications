// Plain fetch() client for the metrics-dash backend (Actix routes).

export interface Dashboard {
  id: number;
  name: string;
  owner: string;
}

export interface Metric {
  name: string;
  value: number;
}

export async function listDashboards(fetchFn: typeof fetch): Promise<Dashboard[]> {
  const res = await fetchFn('/api/dashboards');
  return res.json();
}

export async function getDashboard(
  fetchFn: typeof fetch,
  id: number,
): Promise<Dashboard> {
  const res = await fetchFn(`/api/dashboards/${id}`);
  return res.json();
}

export async function createDashboard(
  fetchFn: typeof fetch,
  name: string,
  owner: string,
): Promise<Dashboard> {
  const res = await fetchFn('/api/dashboards', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ name, owner }),
  });
  return res.json();
}

export async function recordMetric(
  fetchFn: typeof fetch,
  id: number,
  metric: Metric,
): Promise<void> {
  await fetchFn(`/api/dashboards/${id}/metrics`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(metric),
  });
}

export async function exportSnapshot(fetchFn: typeof fetch, id: number): Promise<void> {
  await fetch(`/api/dashboards/${id}/export`, { method: 'POST' });
}
