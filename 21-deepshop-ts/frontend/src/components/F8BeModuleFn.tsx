import { useState } from 'react';
import { listProductsF8 } from '../lib/api';

// F8 be-modulefn: frontend held = fe-modulefn (api.ts). Backend route callback
// calls an imported repo-module function that does prisma.
export default function F8BeModuleFn() {
  const [count, setCount] = useState(0);

  async function handleLoad() {
    const products = await listProductsF8();
    setCount(products.length);
  }

  return (
    <div>
      <button onClick={handleLoad}>F8 Load (be-modulefn)</button>
      <span>{count}</span>
    </div>
  );
}
