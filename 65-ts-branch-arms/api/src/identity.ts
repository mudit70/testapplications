// The identity service: look a user up, create one.
export async function findUser(email: string): Promise<{ id: string } | undefined> {
  const r = await fetch(`https://identity.example.com/users?email=${encodeURIComponent(email)}`);
  return r.ok ? ((await r.json()) as { id: string }) : undefined;
}

export async function createUser(name: string, email: string) {
  const r = await fetch("https://identity.example.com/users", {
    method: "POST",
    body: JSON.stringify({ name, email }),
  });
  return (await r.json()) as { id: string };
}

export function logAttempt(email: string) {
  console.info(`sign-in attempt for ${email}`);
}
