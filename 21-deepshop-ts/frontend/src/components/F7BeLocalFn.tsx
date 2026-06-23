import { useState } from 'react';
import { listProductsF7 } from '../lib/api';

// F7 be-localfn: frontend held = fe-modulefn (api.ts). Backend route callback
// calls a same-file function that does prisma.
export default function F7BeLocalFn() {
  const [count, setCount] = useState(0);

  async function handleLoad() {
    const products = await listProductsF7();
    setCount(products.length);
  }

  return (
    <div>
      <button onClick={handleLoad}>F7 Load (be-localfn)</button>
      <span>{count}</span>
    </div>
  );
}
