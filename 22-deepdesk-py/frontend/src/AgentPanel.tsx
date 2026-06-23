// Realistic agent list + create (fe-modulefn via api.ts).
import { useEffect, useState } from "react";
import { listAgents, createAgent, openTicketCount } from "./api";

export function AgentPanel() {
  const [agents, setAgents] = useState<unknown>(null);
  const [stats, setStats] = useState<unknown>(null);

  useEffect(() => {
    listAgents().then(setAgents);
    openTicketCount().then(setStats);
  }, []);

  const handleAdd = async () => {
    await createAgent({ name: "New Agent", email: "agent@example.com" });
    setAgents(await listAgents());
  };

  return (
    <div>
      <button onClick={handleAdd}>Add Agent</button>
      <pre>{JSON.stringify(agents)}</pre>
      <pre>{JSON.stringify(stats)}</pre>
    </div>
  );
}
