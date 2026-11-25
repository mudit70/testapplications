import React from 'react';

export default function Topology() {
  const place = async () => {
    await fetch('/api/topologies', {
      method: 'POST',
      body: JSON.stringify([{ DeploymentID: 'd1', RegionID: 'eu', DesiredStatus: 'running' }]),
    });
  };
  const routes = async () => {
    await fetch('/api/routes?environment=prod&sticky=live');
  };

  return (
    <div>
      <button onClick={place}>Place</button>
      <button onClick={routes}>Routes</button>
    </div>
  );
}
