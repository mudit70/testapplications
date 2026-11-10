// A custom hook whose returned function makes the request.
export function useOrders() {
  return {
    placeOrder: (productId: number, quantity: number) =>
      fetch('/api/orders', {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: localStorage.token ?? '' },
        body: JSON.stringify({ customer: localStorage.customer, productId, quantity }),
      }),
  };
}
