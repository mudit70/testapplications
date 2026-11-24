/** Every request of the app: renews the token, and logs out on a 401, unless told it is anonymous. */
export async function fetchURL(url: string, opts: RequestInit = {}, auth = true): Promise<Response> {
  const res = await fetch(`/api${url}`, opts);
  if (auth && res.headers.get("X-Renew-Token") === "true") await renew();
  if (auth && res.status === 401) logout();
  return res;
}

export async function renew(): Promise<void> {
  await fetch("/api/renew", { method: "POST" });
}

export function logout(): void {
  localStorage.removeItem("jwt");
}
