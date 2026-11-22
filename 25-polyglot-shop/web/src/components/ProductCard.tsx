import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProduct, restockProduct } from '../api/inventory';
import { ApiError } from '../api/json';
import { placeOrder } from '../api/orders';
import type { Product } from '../types';

interface Props {
  product: Product;
  customerEmail: string;
}

export default function ProductCard({ product, customerEmail }: Props) {
  const navigate = useNavigate();
  const [stock, setStock] = useState(product.stock);
  const [message, setMessage] = useState('');

  // Order one: orders reserves the stock in inventory, then publishes order.placed.
  async function onOrder() {
    try {
      const order = await placeOrder({
        customer_email: customerEmail,
        items: [{ product_id: product.id, quantity: 1 }],
      });
      navigate(`/orders/${order.id}`);
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) setMessage('Out of stock');
      else setMessage((err as Error).message);
    }
  }

  async function onCheckStock() {
    const fresh = await getProduct(product.id);
    setStock(fresh.stock);
  }

  async function onRestock() {
    const updated = await restockProduct(product.id, 10);
    setStock(updated.stock);
  }

  return (
    <article>
      <h2>{product.name}</h2>
      <p>
        ${(product.price_cents / 100).toFixed(2)} · {stock} in stock
      </p>
      <button onClick={onOrder} disabled={stock === 0}>
        Order
      </button>
      <button onClick={onCheckStock}>Check stock</button>
      <button onClick={onRestock}>Restock 10</button>
      {message && <p className="error">{message}</p>}
    </article>
  );
}
