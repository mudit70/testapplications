// F4 fe-classmethod: handler → method on imported class instance → fetch('/api/f4').
import React, { useState } from 'react';
import { apiClient } from '../api/client';

export default function F4ClassMethod() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    const result = await apiClient.getF4();
    setData(result);
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F4</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
