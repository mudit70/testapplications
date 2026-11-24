import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const { customer, price } = (await req.json()) as { customer: string; price: string };
  const sub = await stripe.subscriptions.create({ customer, items: [{ price }] });
  return Response.json({ id: sub.id });
}
