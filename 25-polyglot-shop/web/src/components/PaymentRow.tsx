import { useState } from 'react';
import { getPayment } from '../api/payments';
import type { Payment } from '../types';

export default function PaymentRow({ payment }: { payment: Payment }) {
  const [receipt, setReceipt] = useState<Payment | null>(null);

  async function onReceipt() {
    setReceipt(await getPayment(payment.id));
  }

  return (
    <li>
      #{payment.id} ${(payment.amount_cents / 100).toFixed(2)} {payment.status}
      <button onClick={onReceipt}>Receipt</button>
      {receipt && (
        <pre>
          Payment {receipt.id} for order {receipt.order_id}, {receipt.status} at {receipt.created_at}
        </pre>
      )}
    </li>
  );
}
