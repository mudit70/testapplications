// F3 fe-modulefn: handler → imported fn from api.ts → fetch('/api/f3').
import React, { useState } from 'react';
import { fetchF3Drivers, Driver } from '../api/api';

export default function F3ModuleFn() {
  const [data, setData] = useState<Driver[]>([]);

  const handleLoad = async () => {
    const drivers = await fetchF3Drivers();
    setData(drivers);
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F3 Drivers</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
