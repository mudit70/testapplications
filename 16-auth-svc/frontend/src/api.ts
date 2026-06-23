// HTTP client for the auth service using plain fetch().

export interface Profile {
  id: number;
  email: string;
  display_name: string;
}

export interface Session {
  token: string;
  user_id: number;
}

export async function register(input: {
  email: string;
  password: string;
  display_name: string;
}): Promise<Profile> {
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function login(input: {
  email: string;
  password: string;
}): Promise<Session> {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function fetchProfile(id: number): Promise<Profile> {
  const res = await fetch(`/api/users/${id}`);
  return res.json();
}

export async function logout(token: string): Promise<void> {
  await fetch("/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
}

export async function uploadAvatar(id: number, data: string): Promise<void> {
  await fetch(`/api/users/${id}/avatar`, {
    method: "POST",
    headers: { "Content-Type": "application/octet-stream" },
    body: data,
  });
}
