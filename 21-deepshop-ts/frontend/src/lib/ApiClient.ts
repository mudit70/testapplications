// F4 fe-classmethod rung: a class with methods that call fetch with a STATIC
// URL literal. The component calls a method on an imported instance.
export class ApiClient {
  async f4ListInStock() {
    const res = await fetch('/api/f4');
    if (!res.ok) throw new Error('Failed to load F4');
    return res.json();
  }
}

export const apiClient = new ApiClient();
