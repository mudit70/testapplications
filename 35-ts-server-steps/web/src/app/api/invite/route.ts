import { WorkOSAuthProvider } from "@/lib/workos";

const provider = new WorkOSAuthProvider({
  apiKey: process.env.WORKOS_API_KEY as string,
  clientId: process.env.WORKOS_CLIENT_ID as string,
});

export async function POST(req: Request) {
  const cookie = req.headers.get("cookie") ?? "";
  const sealed = await provider.refreshSession(cookie);
  if (!sealed) return Response.json({ error: "unauthorized" }, { status: 401 });
  const { email, organizationId } = (await req.json()) as { email: string; organizationId: string };
  const invitation = await provider.invite(email, organizationId);
  return Response.json({ id: invitation.id });
}
