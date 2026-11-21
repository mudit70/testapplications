import { useEffect, useState } from 'react';
import { listOrders } from '../api/orders';
import OrderRow from '../components/OrderRow';
import type { Order } from '../types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  async function refresh() {
    setOrders(await listOrders());
  }

  useEffect(() => {
    void refresh();
  }, []);

  return (
    <main>
      <h1>Orders</h1>
      <button onClick={refresh}>Refresh</button>
      <table>
        <tbody>
          {orders.map((o) => (
            <OrderRow key={o.id} order={o} />
          ))}
        </tbody>
      </table>
    </main>
  );
}
