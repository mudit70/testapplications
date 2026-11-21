// Each backend's base URL, set per environment (web/.env locally, build args in deploy/).
export const ORDERS_URL = import.meta.env.VITE_ORDERS_URL;
export const INVENTORY_URL = import.meta.env.VITE_INVENTORY_URL;
export const PAYMENTS_URL = import.meta.env.VITE_PAYMENTS_URL;
