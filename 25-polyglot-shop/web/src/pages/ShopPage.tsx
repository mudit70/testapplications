import { useEffect, useState } from 'react';
import { listProducts } from '../api/inventory';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');
  const customerEmail = localStorage.getItem('customerEmail') ?? 'guest@example.com';

  async function refresh() {
    try {
      setProducts(await listProducts());
      setError('');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main>
      <h1>Shop</h1>
      <button onClick={refresh}>Refresh</button>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} customerEmail={customerEmail} />
        ))}
      </div>
    </main>
  );
}
