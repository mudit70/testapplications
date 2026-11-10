import { useState } from 'react';
import { request } from '../lib/http';

// Generate invoice: the server answers 200 either way; the client branches on ok.
export default function InvoicePanel({ orderId }: { orderId: number }) {
  const [link, setLink] = useState('');
  const [error, setError] = useState('');

  return (
    <div>
      <button
        onClick={async () => {
          const res = await request('POST', `/api/invoices/${orderId}`);
          const data = await res.json();
          if (data.ok) setLink(data.url);
          else setError(data.error);
        }}
      >
        Generate invoice
      </button>
      {link && <a href={link}>Download invoice</a>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
