import { Mailer } from "@acme/mailer";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  let payload: { email?: string };
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }
  if (!payload.email) {
    return NextResponse.json({ error: "No email address" }, { status: 400 });
  }

  const mailer = new Mailer({ apiKey: process.env.RESEND_API_KEY ?? "" });
  // The client in the mailer's field, used from outside it: adds the contact to the audience.
  await mailer.client.contacts.create({
    audienceId: process.env.RESEND_AUDIENCE_ID ?? "",
    email: payload.email,
  });
  await mailer.sendWelcomeEmail({ email: payload.email });

  return NextResponse.json({}, { status: 200 });
}
