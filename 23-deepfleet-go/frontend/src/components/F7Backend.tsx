// F7 — frontend held = fe-modulefn (imported fn → fetch). Backend = be-localfn.
import React, { useState } from 'react';
import { fetchF7, Vehicle } from '../api/api';

export default function F7Backend() {
  const [data, setData] = useState<Vehicle[]>([]);

  const handleLoad = async () => {
    setData(await fetchF7());
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F7 (be-localfn)</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
