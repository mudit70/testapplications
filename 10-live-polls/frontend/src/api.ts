// HTTP client for the polls API using plain fetch().
// URL literals here mirror the aiohttp route patterns in backend/server.py.

export interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
  created_by: number;
}

export async function fetchPolls(): Promise<Poll[]> {
  const res = await fetch("/api/polls");
  const data = await res.json();
  return data.polls;
}

export async function fetchPoll(id: number): Promise<Poll> {
  const res = await fetch(`/api/polls/${id}`);
  return res.json();
}

export async function createPoll(input: {
  question: string;
  options: string[];
  created_by: number;
}): Promise<Poll> {
  const res = await fetch("/api/polls", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function castVote(pollId: number, optionIndex: number): Promise<Poll> {
  const res = await fetch(`/api/polls/${pollId}/votes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ option_index: optionIndex }),
  });
  return res.json();
}

export async function searchPolls(q: string): Promise<unknown> {
  const res = await fetch(`/api/polls/search?q=${encodeURIComponent(q)}`);
  return res.json();
}
