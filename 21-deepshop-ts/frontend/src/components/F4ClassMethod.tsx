import { useState } from 'react';
import { apiClient } from '../lib/ApiClient';

// F4 fe-classmethod: handler calls a method on an imported class instance whose
// method calls fetch('/api/f4').
export default function F4ClassMethod() {
  const [count, setCount] = useState(0);

  async function handleLoad() {
    const products = await apiClient.f4ListInStock();
    setCount(products.length);
  }

  return (
    <div>
      <button onClick={handleLoad}>F4 Load In-Stock (class method)</button>
      <span>{count}</span>
    </div>
  );
}
