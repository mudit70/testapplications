import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrders } from '../lib/useOrders';

// Place order: every way the request can end has its own end state.
export default function CheckoutPage({ productId }: { productId: number }) {
  const { placeOrder } = useOrders();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  async function handlePlaceOrder() {
    try {
      const res = await placeOrder(productId, quantity);
      if (res.status === 201) {
        const { order } = await res.json();
        navigate(`/orders/${order.id}`);
      } else if (res.status === 400) {
        setError((await res.json()).error);
      } else if (res.status === 401) {
        navigate('/login');
      } else if (res.status === 409) {
        setToast('That product just sold out.');
      } else if (res.status === 502) {
        setToast('Your payment was declined.');
      } else {
        setToast('Something went wrong. Try again.');
      }
    } catch {
      setToast('You are offline.');
    }
  }

  return (
    <div>
      <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      <button onClick={handlePlaceOrder}>Place order</button>
      {error && <p className="error">{error}</p>}
      {toast && <div role="status">{toast}</div>}
    </div>
  );
}
