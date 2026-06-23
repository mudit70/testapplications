// Realistic ticket list + status update (fe-modulefn via api.ts).
import { useEffect, useState } from "react";
import { listTickets, updateTicket, deleteTicket, Ticket } from "./api";

export function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    listTickets().then(setTickets);
  }, []);

  const handleResolve = async (id: number) => {
    await updateTicket(id, { status: "resolved" });
    setTickets(await listTickets());
  };

  const handleDelete = async (id: number) => {
    await deleteTicket(id);
    setTickets((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ul>
      {tickets.map((t) => (
        <li key={t.id}>
          {t.subject} — {t.status}
          <button onClick={() => handleResolve(t.id)}>Resolve</button>
          <button onClick={() => handleDelete(t.id)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
