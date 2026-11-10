import { request } from './http';

export async function searchOrders(customer: string) {
  const res = await request('GET', `/api/orders?customer=${encodeURIComponent(customer)}`);
  if (!res.ok) throw new Error(`search failed with ${res.status}`);
  return res.json();
}
