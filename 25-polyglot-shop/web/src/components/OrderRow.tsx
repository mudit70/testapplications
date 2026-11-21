import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cancelOrder } from '../api/orders';
import type { Order } from '../types';

export default function OrderRow({ order }: { order: Order }) {
  const [status, setStatus] = useState(order.status);
  const [error, setError] = useState('');

  // Cancel: orders releases each item's reservation in inventory, then marks the order cancelled.
  async function onCancel() {
    try {
      await cancelOrder(order.id);
      setStatus('cancelled');
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <tr>
      <td>
        <Link to={`/orders/${order.id}`}>#{order.id}</Link>
      </td>
      <td>{status}</td>
      <td>${(order.total_cents / 100).toFixed(2)}</td>
      <td>
        <button onClick={onCancel} disabled={status !== 'placed'}>
          Cancel
        </button>
        {error && <span className="error">{error}</span>}
      </td>
    </tr>
  );
}
