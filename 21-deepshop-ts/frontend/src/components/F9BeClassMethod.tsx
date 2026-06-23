import { useState } from 'react';
import { listOrdersF9 } from '../lib/api';

// F9 be-classmethod: frontend held = fe-modulefn (api.ts). Backend route
// callback calls an instantiated service class method that does prisma.
export default function F9BeClassMethod() {
  const [count, setCount] = useState(0);

  async function handleLoad() {
    const orders = await listOrdersF9();
    setCount(orders.length);
  }

  return (
    <div>
      <button onClick={handleLoad}>F9 Load (be-classmethod)</button>
      <span>{count}</span>
    </div>
  );
}
