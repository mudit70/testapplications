import { workos } from "@/lib/workos";

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email: string };
  const user = await workos.userManagement.createUser({ email });
  return Response.json({ id: user.id });
}
