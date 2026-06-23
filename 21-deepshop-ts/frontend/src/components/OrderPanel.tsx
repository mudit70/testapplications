import { useState } from 'react';
import { listOrders, createOrder } from '../lib/api';

// Extra realistic component (orders) using fe-modulefn.
export default function OrderPanel() {
  const [customer, setCustomer] = useState('');
  const [orders, setOrders] = useState<any[]>([]);

  async function handleRefresh() {
    setOrders(await listOrders());
  }

  async function handleCreate() {
    await createOrder(customer, 2500);
    setCustomer('');
    await handleRefresh();
  }

  return (
    <div>
      <input value={customer} onChange={(e) => setCustomer(e.target.value)} />
      <button onClick={handleCreate}>Create Order</button>
      <button onClick={handleRefresh}>Refresh</button>
      <span>{orders.length}</span>
    </div>
  );
}
