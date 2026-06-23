// HTTP client for the search API using plain fetch().
// URL literals mirror the Rocket route patterns in services/api/src/routes.rs.

export interface Document {
  id: number;
  title: string;
  body: string;
}

export interface SearchHit {
  id: number;
  title: string;
  score: number;
}

export async function searchDocs(query: string): Promise<SearchHit[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
  const data = await res.json();
  return data.hits;
}

export async function getDoc(id: number): Promise<Document> {
  const res = await fetch(`/api/docs/${id}`);
  return res.json();
}

export async function indexDoc(input: {
  title: string;
  body: string;
}): Promise<Document> {
  const res = await fetch("/api/docs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function rebuildIndex(): Promise<void> {
  await fetch("/indexer/rebuild", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({}),
  });
}

export async function indexStatus(): Promise<{ docs: number; status: string }> {
  const res = await fetch("/indexer/status");
  return res.json();
}
