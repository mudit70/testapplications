import { INVENTORY_URL } from '../config';
import type { Product } from '../types';
import { readJson } from './json';

export async function listProducts(): Promise<Product[]> {
  const res = await fetch(`${INVENTORY_URL}/api/products`);
  return readJson<Product[]>(res);
}

export async function getProduct(id: number): Promise<Product> {
  const res = await fetch(`${INVENTORY_URL}/api/products/${id}`);
  return readJson<Product>(res);
}

export async function restockProduct(id: number, quantity: number): Promise<Product> {
  const res = await fetch(`${INVENTORY_URL}/api/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ add: quantity }),
  });
  return readJson<Product>(res);
}
