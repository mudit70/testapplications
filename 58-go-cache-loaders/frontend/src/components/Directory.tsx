import React, { useState } from 'react';

export default function Directory() {
  const [data, setData] = useState<unknown>(null);

  const loadUser = async () => {
    const res = await fetch('/api/users/u1');
    setData(await res.json());
  };

  const loadTeam = async () => {
    const res = await fetch('/api/teams/t1');
    setData(await res.json());
  };

  const loadPlan = async () => {
    const res = await fetch('/api/plan');
    setData(await res.json());
  };

  return (
    <div>
      <button onClick={loadUser}>Load user</button>
      <button onClick={loadTeam}>Load team</button>
      <button onClick={loadPlan}>Load plan</button>
      <pre>{JSON.stringify(data)}</pre>
    </div>
  );
}
