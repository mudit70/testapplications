// F4 fe-classmethod — a class with methods whose bodies call fetch() with a
// static literal URL. The component handler calls a method on an imported
// instance of this class.

export class ApiClient {
  async getF4(): Promise<unknown> {
    const res = await fetch("/api/f4");
    return res.json();
  }

  async createF5(body: { author: string; body: string }): Promise<unknown> {
    const res = await fetch("/api/f5", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  }
}

export const apiClient = new ApiClient();
