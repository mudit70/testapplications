import { useEffect, useState } from 'react';
import { listProducts, getProduct } from '../lib/api';

// Extra realistic component using the fe-modulefn pattern.
export default function ProductList() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    listProducts().then(setProducts);
  }, []);

  async function handleView(id: number) {
    const product = await getProduct(id);
    console.log(product);
  }

  return (
    <ul>
      {products.map((p) => (
        <li key={p.id} onClick={() => handleView(p.id)}>
          {p.name}
        </li>
      ))}
    </ul>
  );
}
