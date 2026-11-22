import { ORDERS_URL } from '../config';
import type { NewOrder, Order } from '../types';
import { ApiError, readJson } from './json';

export async function listOrders(): Promise<Order[]> {
  const res = await fetch(`${ORDERS_URL}/api/orders`);
  return readJson<Order[]>(res);
}

export async function getOrder(id: number): Promise<Order> {
  const res = await fetch(`${ORDERS_URL}/api/orders/${id}`);
  return readJson<Order>(res);
}

export async function placeOrder(order: NewOrder): Promise<Order> {
  const res = await fetch(`${ORDERS_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  return readJson<Order>(res);
}

export async function cancelOrder(id: number): Promise<void> {
  const res = await fetch(`${ORDERS_URL}/api/orders/${id}`, { method: 'DELETE' });
  if (res.status !== 204) throw new ApiError(res.status, 'Could not cancel the order');
}
