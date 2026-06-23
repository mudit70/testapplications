// F4 fe-classmethod: an imported class with a method that calls fetch.
// F6 fe-wrapper-dynamic: a generic request(path) wrapper with a DYNAMIC URL.

export class ApiClient {
  // F4 target: handler → instance.getF4() → fetch('/api/f4')  (STATIC literal)
  async getF4(): Promise<unknown> {
    const res = await fetch('/api/f4');
    return res.json();
  }

  async getVehicle(id: number): Promise<unknown> {
    const res = await fetch(`/api/vehicles/${id}`);
    return res.json();
  }
}

export const apiClient = new ApiClient();

// F6 target: generic wrapper, URL is a parameter (DYNAMIC — tests degradation).
export async function request(path: string): Promise<unknown> {
  const res = await fetch(path);
  return res.json();
}
