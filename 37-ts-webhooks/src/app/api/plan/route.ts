import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { id, price } = (await req.json()) as { id: string; price: string };
  const sub = await stripe.subscriptions.update(id, { items: [{ price }] });
  return Response.json({ id: sub.id });
}
