import { useState } from 'react';
import { useApi } from '../lib/useApi';

// F5 fe-hook: handler calls a function returned by a custom hook that calls
// fetch('/api/f5').
export default function F5Hook() {
  const { run } = useApi();
  const [count, setCount] = useState(0);

  async function handleLoad() {
    const orders = await run();
    setCount(orders.length);
  }

  return (
    <div>
      <button onClick={handleLoad}>F5 Load Orders (hook)</button>
      <span>{count}</span>
    </div>
  );
}
