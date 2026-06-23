// Module-level API functions. Used by:
//   F3 fe-modulefn  — component handler imports getF3 and calls it
//   F7/F8/F9        — frontend is fe-modulefn (these reuse the module-fn rung)
// Each function contains a static-literal fetch() whose URL matches the route.

export async function getF3(): Promise<unknown> {
  const res = await fetch("/api/f3");
  return res.json();
}

export async function getF7(): Promise<unknown> {
  const res = await fetch("/api/f7");
  return res.json();
}

export async function getF8(): Promise<unknown> {
  const res = await fetch("/api/f8");
  return res.json();
}

export async function getF9(): Promise<unknown> {
  const res = await fetch("/api/f9");
  return res.json();
}

// ── Realistic ticket/agent/comment client functions ──────────────────

export interface Ticket {
  id: number;
  subject: string;
  body: string;
  status: string;
  priority: string;
  assignee_id: number | null;
}

export async function listTickets(): Promise<Ticket[]> {
  const res = await fetch("/api/tickets/");
  return res.json();
}

export async function createTicket(input: {
  subject: string;
  body: string;
  priority: string;
}): Promise<Ticket> {
  const res = await fetch("/api/tickets/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function updateTicket(
  id: number,
  input: { status?: string; priority?: string; assignee_id?: number }
): Promise<Ticket> {
  const res = await fetch(`/api/tickets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function deleteTicket(id: number): Promise<void> {
  await fetch(`/api/tickets/${id}`, { method: "DELETE" });
}

export async function listAgents(): Promise<unknown> {
  const res = await fetch("/api/agents/");
  return res.json();
}

export async function createAgent(input: {
  name: string;
  email: string;
}): Promise<unknown> {
  const res = await fetch("/api/agents/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function listTicketComments(ticketId: number): Promise<unknown> {
  const res = await fetch(`/api/comments/ticket/${ticketId}`);
  return res.json();
}

export async function openTicketCount(): Promise<unknown> {
  const res = await fetch("/api/comments/stats/open-count");
  return res.json();
}
