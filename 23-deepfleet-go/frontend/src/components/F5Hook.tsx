// F5 fe-hook: handler → function returned by custom hook → fetch('/api/f5').
import React, { useState } from 'react';
import { useF5Loader } from '../hooks/useFleet';

export default function F5Hook() {
  const [data, setData] = useState<unknown>(null);
  const { loadF5 } = useF5Loader();

  const handleLoad = async () => {
    const result = await loadF5();
    setData(result);
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F5</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
