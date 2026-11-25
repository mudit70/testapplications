/** BetterStack's API, through a factory whose base URL defaults to BetterStack's own. */
export function createBetterstackClient(apiKey: string, baseUrl = "https://uptime.betterstack.com") {
  async function request(url: string) {
    const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });
    return (await response.json()) as { data: unknown[]; pagination: { next: string | null } };
  }

  /** Every page: the first from the path under the base URL, the rest from what the API says. */
  async function requestAllPages(path: string) {
    const all: unknown[] = [];
    let url: string | null = `${baseUrl}${path}`;
    while (url) {
      const result = await request(url);
      all.push(...result.data);
      url = result.pagination.next;
    }
    return all;
  }

  return { getMonitors: () => requestAllPages("/api/v2/monitors") };
}
