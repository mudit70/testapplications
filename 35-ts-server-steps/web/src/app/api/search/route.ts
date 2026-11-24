import { openai, structuredSearch } from "@/lib/llm";
import { ratelimit, withRatelimit } from "@/lib/ratelimit";

const checkLimit = withRatelimit(ratelimit.search);

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
  if (!(await checkLimit(ip))) return Response.json({ error: "slow down" }, { status: 429 });
  const { query } = (await req.json()) as { query: string };
  return Response.json({ filters: await structuredSearch(openai, query) });
}
