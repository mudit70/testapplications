import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import OrderDetailPage from './pages/OrderDetailPage';
import OrdersPage from './pages/OrdersPage';
import ShopPage from './pages/ShopPage';

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Shop</Link> <Link to="/orders">Orders</Link>
      </nav>
      <Routes>
        <Route path="/" element={<ShopPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/orders/:id" element={<OrderDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
