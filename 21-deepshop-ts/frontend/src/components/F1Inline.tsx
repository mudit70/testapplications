import { useState } from 'react';

// F1 fe-inline: handler body calls fetch('/api/f1') directly.
export default function F1Inline() {
  const [count, setCount] = useState(0);

  async function handleLoadProducts() {
    const res = await fetch('/api/f1');
    const products = await res.json();
    setCount(products.length);
  }

  return (
    <div>
      <button onClick={handleLoadProducts}>F1 Load Products (inline)</button>
      <span>{count}</span>
    </div>
  );
}
