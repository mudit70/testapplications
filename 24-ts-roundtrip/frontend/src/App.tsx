import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CheckoutPage from './pages/CheckoutPage';
import ExportPage from './pages/ExportPage';
import InvoicePanel from './pages/InvoicePanel';
import OrdersPage from './pages/OrdersPage';
import ReceiptButton from './pages/ReceiptButton';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/checkout" element={<CheckoutPage productId={1} />} />
        <Route
          path="/orders/:id"
          element={
            <>
              <InvoicePanel orderId={1} />
              <ReceiptButton orderId={1} />
            </>
          }
        />
        <Route path="/exports" element={<ExportPage />} />
        <Route path="/login" element={<p>Sign in</p>} />
      </Routes>
    </BrowserRouter>
  );
}
