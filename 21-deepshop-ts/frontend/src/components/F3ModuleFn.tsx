import { useState } from 'react';
import { createProductF3 } from '../lib/api';

// F3 fe-modulefn: handler calls an imported function from api.ts that calls
// fetch('/api/f3'). This mirrors the app 01 pattern.
export default function F3ModuleFn() {
  const [name, setName] = useState('');

  async function handleCreate() {
    await createProductF3(name, 1000, 5);
    setName('');
  }

  return (
    <div>
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <button onClick={handleCreate}>F3 Create Product (module fn)</button>
    </div>
  );
}
