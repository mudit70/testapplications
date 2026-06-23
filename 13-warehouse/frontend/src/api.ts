// HTTP client for the warehouse API using plain fetch().

export interface Item {
  id: number;
  name: string;
  sku: string;
  stock: number;
}

export async function fetchItems(): Promise<Item[]> {
  const res = await fetch("/api/items");
  const data = await res.json();
  return data.items;
}

export async function fetchItem(id: number): Promise<Item> {
  const res = await fetch(`/api/items/${id}`);
  return res.json();
}

export async function createItem(input: {
  name: string;
  sku: string;
  stock: number;
}): Promise<Item> {
  const res = await fetch("/api/items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function adjustStock(id: number, stock: number): Promise<unknown> {
  const res = await fetch(`/api/items/${id}/stock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stock }),
  });
  return res.json();
}

export async function searchItems(q: string): Promise<unknown> {
  const res = await fetch(`/api/items/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function uploadPhoto(id: number, data: string): Promise<void> {
  await fetch(`/api/items/${id}/photo`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: data,
  });
}

export async function fetchLocations(): Promise<unknown> {
  const res = await fetch("/api/locations");
  return res.json();
}
