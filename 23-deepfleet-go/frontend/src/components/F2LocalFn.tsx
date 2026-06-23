// F2 fe-localfn: handler → same-file function → fetch('/api/f2').
import React, { useState } from 'react';

async function loadF2() {
  const res = await fetch('/api/f2');
  return res.json();
}

export default function F2LocalFn() {
  const [data, setData] = useState<unknown[]>([]);

  const handleLoad = async () => {
    const trips = await loadF2();
    setData(trips);
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F2 Trips</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
