import { Resend as Client } from "resend";

/** The app's mailer: Resend's client in a field the app also uses directly. */
export class Mailer {
  public readonly client: Client;

  constructor(opts: { apiKey: string }) {
    this.client = new Client(opts.apiKey);
  }

  public async sendWelcomeEmail(req: { email: string }) {
    await this.client.emails.send({
      to: req.email,
      from: "Acme <hello@acme.dev>",
      subject: "Welcome",
      html: "<p>Welcome</p>",
    });
  }
}
