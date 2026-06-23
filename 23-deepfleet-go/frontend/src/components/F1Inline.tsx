// F1 fe-inline: event handler calls fetch('/api/f1') directly.
import React, { useState } from 'react';

export default function F1Inline() {
  const [data, setData] = useState<unknown[]>([]);

  const handleLoad = async () => {
    const res = await fetch('/api/f1');
    setData(await res.json());
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F1 Vehicles</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
