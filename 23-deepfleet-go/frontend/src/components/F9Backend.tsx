// F9 — frontend held = fe-modulefn. Backend = be-structmethod (service struct).
import React, { useState } from 'react';
import { fetchF9, Driver } from '../api/api';

export default function F9Backend() {
  const [data, setData] = useState<Driver[]>([]);

  const handleLoad = async () => {
    setData(await fetchF9());
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F9 (be-structmethod)</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
