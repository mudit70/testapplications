// Plain fetch() client. URL literals mirror backend route patterns.

export async function listArticles() {
  const res = await fetch('/api/articles');
  return res.json();
}

export async function getArticle(id: string) {
  const res = await fetch(`/api/articles/${id}`);
  return res.json();
}

export async function createArticle(body: { title: string; spaceId: string }) {
  const res = await fetch('/api/articles', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function listSpaces() {
  const res = await fetch('/api/spaces');
  return res.json();
}

export async function searchArticles(q: string) {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  return res.json();
}

export async function graphqlQuery(query: string) {
  const res = await fetch('/graphql', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  return res.json();
}
