import { useState } from 'react';

// F2 fe-localfn: handler calls a function defined in the SAME file which calls
// fetch('/api/f2').
async function loadSortedProducts() {
  const res = await fetch('/api/f2');
  if (!res.ok) throw new Error('Failed to load F2');
  return res.json();
}

export default function F2LocalFn() {
  const [count, setCount] = useState(0);

  async function handleLoad() {
    const products = await loadSortedProducts();
    setCount(products.length);
  }

  return (
    <div>
      <button onClick={handleLoad}>F2 Load Products (local fn)</button>
      <span>{count}</span>
    </div>
  );
}
