// fe-modulefn rung: exported functions that call fetch with a STATIC URL
// literal. This is the pattern app 01-task-tracker uses and the one expected
// to reach `complete`. Used by F3 and by the F7/F8/F9 backend-rung features.

export async function createProductF3(name: string, price: number, stock: number) {
  const res = await fetch('/api/f3', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, stock }),
  });
  if (!res.ok) throw new Error('Failed to create product');
  return res.json();
}

// F7 caller (backend rung = be-localfn), frontend held = fe-modulefn.
export async function listProductsF7() {
  const res = await fetch('/api/f7');
  if (!res.ok) throw new Error('Failed to load F7');
  return res.json();
}

// F8 caller (backend rung = be-modulefn), frontend held = fe-modulefn.
export async function listProductsF8() {
  const res = await fetch('/api/f8');
  if (!res.ok) throw new Error('Failed to load F8');
  return res.json();
}

// F9 caller (backend rung = be-classmethod), frontend held = fe-modulefn.
export async function listOrdersF9() {
  const res = await fetch('/api/f9');
  if (!res.ok) throw new Error('Failed to load F9');
  return res.json();
}

// Extra realistic module functions for the non-matrix endpoints.
export async function listProducts() {
  const res = await fetch('/api/products');
  return res.json();
}

export async function getProduct(id: number) {
  const res = await fetch(`/api/products/${id}`);
  return res.json();
}

export async function createProduct(name: string, price: number, stock: number) {
  const res = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, price, stock }),
  });
  return res.json();
}

export async function listOrders() {
  const res = await fetch('/api/orders');
  return res.json();
}

export async function createOrder(customer: string, total: number) {
  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customer, total }),
  });
  return res.json();
}
