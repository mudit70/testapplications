/** Vercel's REST API: the base URL defaults to Vercel's own, unless a construction passes one. */
export class Vercel {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(opts: { accessToken: string; baseUrl?: string; teamId?: string }) {
    this.baseUrl = opts.baseUrl ?? "https://api.vercel.com";
    this.token = opts.accessToken;
  }

  private async fetch<T>(req: { method: "GET" | "POST"; path: string[]; body?: unknown }): Promise<T> {
    const url = new URL(req.path.join("/"), this.baseUrl);
    const res = await fetch(url, {
      method: req.method,
      headers: { Authorization: `Bearer ${this.token}` },
      body: req.body ? JSON.stringify(req.body) : undefined,
    });
    return (await res.json()) as T;
  }

  public async listProjects() {
    return this.fetch<{ projects: { id: string }[] }>({ method: "GET", path: ["v9", "projects"] });
  }

  public async upsertEnvironmentVariable(projectId: string, key: string, value: string) {
    return this.fetch({ method: "POST", path: ["v10", "projects", projectId, "env"], body: { key, value } });
  }
}
