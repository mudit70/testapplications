import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { id } = (await req.json()) as { id: string };
  const sub = await stripe.subscriptions.cancel(id);
  return Response.json({ status: sub.status });
}
