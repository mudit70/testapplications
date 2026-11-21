export interface Product {
  id: number;
  sku: string;
  name: string;
  price_cents: number;
  stock: number;
}

export interface OrderItem {
  product_id: number;
  quantity: number;
  reservation_id: number;
}

export interface Order {
  id: number;
  customer_email: string;
  status: 'placed' | 'paid' | 'cancelled';
  total_cents: number;
  tracking_url: string | null;
  created_at: string;
  items: OrderItem[];
}

export interface NewOrder {
  customer_email: string;
  items: { product_id: number; quantity: number }[];
}

export interface Payment {
  id: number;
  order_id: number;
  amount_cents: number;
  status: string;
  created_at: string;
}

export interface TrackingStatus {
  carrier: string;
  status: string;
  eta: string | null;
}
