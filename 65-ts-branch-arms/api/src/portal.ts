// The old portal: who a user is there, and a session on it.
export async function validatePortal(email: string, password: string) {
  const r = await fetch("https://portal.example.com/validate", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  return (await r.json()) as { name: string; email: string };
}

export async function portalLogin(email: string) {
  await fetch("https://portal.example.com/login", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
}
