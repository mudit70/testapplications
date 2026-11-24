import { Vercel } from "@/lib/vercel";

export async function POST(req: Request) {
  const { token, projectId, key, value } = (await req.json()) as Record<string, string>;
  const vercel = new Vercel({ accessToken: token });
  return Response.json(await vercel.upsertEnvironmentVariable(projectId, key, value));
}
