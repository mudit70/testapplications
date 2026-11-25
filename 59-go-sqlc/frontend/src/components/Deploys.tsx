import React, { useState } from 'react';

export default function Deploys() {
  const [data, setData] = useState<unknown>(null);

  const loadProject = async () => {
    const res = await fetch('/api/projects/p1');
    setData(await res.json());
  };

  const loadDeployments = async () => {
    const res = await fetch('/api/projects/p1/deployments');
    setData(await res.json());
  };

  const deploy = async () => {
    await fetch('/api/projects/p1/deployments', {
      method: 'POST',
      body: new URLSearchParams({ id: 'd1' }),
    });
  };

  return (
    <div>
      <button onClick={loadProject}>Load project</button>
      <button onClick={loadDeployments}>Load deployments</button>
      <button onClick={deploy}>Deploy</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
