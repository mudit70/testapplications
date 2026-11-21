import { PAYMENTS_URL } from '../config';
import type { Payment } from '../types';
import { readJson } from './json';

export async function payOrder(orderId: number, amountCents: number): Promise<Payment> {
  const res = await fetch(`${PAYMENTS_URL}/api/payments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId, amount_cents: amountCents }),
  });
  return readJson<Payment>(res);
}

export async function listPayments(orderId: number): Promise<Payment[]> {
  const res = await fetch(`${PAYMENTS_URL}/api/payments?order_id=${orderId}`);
  return readJson<Payment[]>(res);
}

export async function getPayment(id: number): Promise<Payment> {
  const res = await fetch(`${PAYMENTS_URL}/api/payments/${id}`);
  return readJson<Payment>(res);
}
