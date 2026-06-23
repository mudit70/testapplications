// F8 — frontend held = fe-modulefn. Backend = be-modulefn (internal/repo).
import React, { useState } from 'react';
import { fetchF8, Trip } from '../api/api';

export default function F8Backend() {
  const [data, setData] = useState<Trip[]>([]);

  const handleLoad = async () => {
    setData(await fetchF8());
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F8 (be-modulefn)</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
