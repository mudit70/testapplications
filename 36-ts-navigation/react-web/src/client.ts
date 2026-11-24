// A generated-style service client: one static method per endpoint.
export class UsersService {
  static async readUserMe() {
    const res = await fetch('/api/users/me');
    return res.json();
  }
}

export class ItemsService {
  static async readItems() {
    const res = await fetch('/api/items');
    return res.json();
  }
}

export class LoginService {
  static async loginAccessToken(body: { username: string; password: string }) {
    const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify(body) });
    return res.json();
  }
}
