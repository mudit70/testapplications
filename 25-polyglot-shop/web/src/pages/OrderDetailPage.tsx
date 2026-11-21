import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOrder } from '../api/orders';
import { listPayments, payOrder } from '../api/payments';
import PaymentRow from '../components/PaymentRow';
import type { Order, Payment, TrackingStatus } from '../types';

export default function OrderDetailPage() {
  const { id } = useParams();
  const orderId = Number(id);
  const [order, setOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [tracking, setTracking] = useState<TrackingStatus | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(orderId).then(setOrder, (err: Error) => setError(err.message));
  }, [orderId]);

  // Pay: payments records the payment and publishes payment.settled; orders marks the order
  // paid when it consumes the event, so the status changes a moment later.
  async function onPay() {
    if (!order) return;
    try {
      await payOrder(order.id, order.total_cents);
      setPayments(await listPayments(order.id));
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function onShowPayments() {
    setPayments(await listPayments(orderId));
  }

  // The carrier's tracking page: its URL is whatever the carrier gave when the parcel shipped,
  // stored on the order at run time.
  async function onTrack() {
    if (!order?.tracking_url) return;
    const res = await fetch(order.tracking_url, { headers: { Accept: 'application/json' } });
    setTracking((await res.json()) as TrackingStatus);
  }

  if (!order) return <p>{error || 'Loading…'}</p>;

  return (
    <main>
      <h1>Order #{order.id}</h1>
      <p>
        {order.status} · ${(order.total_cents / 100).toFixed(2)}
      </p>
      <button onClick={onPay} disabled={order.status !== 'placed'}>
        Pay
      </button>
      <button onClick={onShowPayments}>Show payments</button>
      {order.tracking_url && <button onClick={onTrack}>Track shipment</button>}
      {tracking && (
        <p>
          {tracking.carrier}: {tracking.status}
        </p>
      )}
      {error && <p className="error">{error}</p>}
      <ul>
        {payments.map((p) => (
          <PaymentRow key={p.id} payment={p} />
        ))}
      </ul>
    </main>
  );
}
