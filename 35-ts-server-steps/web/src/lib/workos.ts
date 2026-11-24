import { WorkOS } from "@workos-inc/node";

export class WorkOSAuthProvider {
  private readonly provider: WorkOS;
  private readonly cookiePassword: string;

  constructor(config: { apiKey: string; clientId: string }) {
    this.cookiePassword = process.env.WORKOS_COOKIE_PASSWORD as string;
    this.provider = new WorkOS(config.apiKey, { clientId: config.clientId });
  }

  /** Unseals the cookie locally, then refreshes the session with WorkOS. */
  async refreshSession(sessionToken: string): Promise<string | undefined> {
    const session = this.provider.userManagement.loadSealedSession({
      sessionData: sessionToken,
      cookiePassword: this.cookiePassword,
    });
    const result = await session.refresh({ cookiePassword: this.cookiePassword });
    return result.authenticated ? result.sealedSession : undefined;
  }

  async invite(email: string, organizationId: string) {
    return this.provider.userManagement.sendInvitation({ email, organizationId });
  }
}
