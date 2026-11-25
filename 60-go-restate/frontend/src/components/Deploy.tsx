import React from 'react';

export default function Deploy() {
  const deploy = async () => {
    await fetch('/api/deployments/d1', { method: 'POST' });
  };

  return (
    <div>
      <button onClick={deploy}>Deploy</button>
    </div>
  );
}
