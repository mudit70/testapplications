// Plain fetch() client for the alerting backend (Chi routes).

export interface Alert {
  id: string;
  title: string;
  severity: string;
  status: string;
}

export interface AlertStats {
  open: number;
  acked: number;
}

export async function listAlerts(fetchFn: typeof fetch): Promise<Alert[]> {
  const res = await fetchFn('/api/alerts');
  return res.json();
}

export async function createAlert(
  fetchFn: typeof fetch,
  title: string,
  severity: string,
): Promise<Alert> {
  const res = await fetchFn('/api/alerts', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ title, severity }),
  });
  return res.json();
}

export async function ackAlert(fetchFn: typeof fetch, id: string): Promise<void> {
  await fetchFn(`/api/alerts/${id}/ack`, { method: 'POST' });
}

export async function attachEvidence(
  fetchFn: typeof fetch,
  id: string,
  body: Blob,
): Promise<void> {
  await fetchFn(`/api/alerts/${id}/evidence`, { method: 'POST', body });
}

export async function fetchStats(fetchFn: typeof fetch): Promise<AlertStats> {
  const res = await fetch('/api/stats');
  return res.json();
}
