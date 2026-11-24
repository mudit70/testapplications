export class Vercel {
  private readonly baseUrl: string;
  private readonly token: string;

  constructor(opts: { accessToken: string; baseUrl?: string }) {
    this.baseUrl = opts.baseUrl ?? "https://api.vercel.com";
    this.token = opts.accessToken;
  }

  private async fetch(req: { method: "GET" | "POST"; path: string[]; body?: unknown }) {
    const url = new URL(req.path.join("/"), this.baseUrl);
    const res = await fetch(url, {
      method: req.method,
      headers: { Authorization: `Bearer ${this.token}`, "Content-Type": "application/json" },
      body: req.body ? JSON.stringify(req.body) : undefined,
    });
    return res.json();
  }

  async upsertEnvironmentVariable(projectId: string, key: string, value: string) {
    return this.fetch({
      method: "POST",
      path: ["v10", "projects", projectId, "env"],
      body: { key, value, target: ["production"] },
    });
  }
}
