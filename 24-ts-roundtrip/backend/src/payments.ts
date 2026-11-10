import { PaymentDeclinedError } from './errors.js';

// A downstream service: its failure surfaces to the browser as 502 through the error handler.
export async function charge(customer: string, amount: number) {
  const res = await fetch('https://payments.example.com/v1/charges', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ customer, amount }),
  });
  if (!res.ok) throw new PaymentDeclinedError(`charge failed with ${res.status}`);
}
