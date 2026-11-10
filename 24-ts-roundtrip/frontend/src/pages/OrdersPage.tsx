import { useState } from 'react';
import { request } from '../lib/http';
import { searchOrders } from '../lib/orders';
import { track } from '../lib/telemetry';

interface Order {
  id: number;
  customer: string;
  status: string;
}

export default function OrdersPage() {
  const [customer, setCustomer] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState('');

  // Search: a form submit through a module function.
  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    try {
      setOrders(await searchOrders(customer));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  // Cancel: 204 removes the row; the server's NotFoundError becomes a 404 shown inline.
  async function cancel(id: number) {
    const res = await request('DELETE', `/api/orders/${id}`);
    if (res.status === 204) setOrders(orders.filter((o) => o.id !== id));
    else if (res.status === 404) setError('That order no longer exists.');
    else setError(`Cancel failed with ${res.status}`);
  }

  return (
    <div>
      <form onSubmit={onSearch}>
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} />
        <button type="submit">Search</button>
      </form>
      {error && <p className="error">{error}</p>}
      <ul>
        {orders.map((o) => (
          <li key={o.id}>
            {o.customer} {o.status}
            <button onClick={() => cancel(o.id)}>Cancel</button>
          </li>
        ))}
      </ul>
      <button onClick={() => track('orders_viewed')}>Share feedback</button>
    </div>
  );
}
