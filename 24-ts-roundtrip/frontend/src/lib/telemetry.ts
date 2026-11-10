import { config } from './config';

// Fire and forget: nothing waits for the answer, so this flow never completes for the user.
export function track(event: string) {
  void fetch(config.telemetryUrl, { method: 'POST', body: JSON.stringify({ event }) });
}
