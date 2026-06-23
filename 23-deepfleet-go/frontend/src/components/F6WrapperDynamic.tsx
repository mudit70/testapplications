// F6 fe-wrapper-dynamic: handler → generic request(path) wrapper (DYNAMIC URL)
// → fetch(path). The fetch literal is a parameter, not a string constant.
import React, { useState } from 'react';
import { request } from '../api/client';

export default function F6WrapperDynamic() {
  const [data, setData] = useState<unknown>(null);

  const handleLoad = async () => {
    // The path is a literal HERE, but the fetch() inside request() sees a variable.
    const result = await request('/api/f6');
    setData(result);
  };

  return (
    <div>
      <button onClick={handleLoad}>Load F6</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
