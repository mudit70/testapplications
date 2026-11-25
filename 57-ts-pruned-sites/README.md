# 57-ts-pruned-sites — a request a helper makes in a pruned branch

A written fixture for veoagents. Its answers are in `expected.yaml`, written from the code. It comes from veoagents #443, which is based on openstatus's notification.sendTest: its Grafana, webhook and ntfy branches post through helpers to URLs the input gives.

The tRPC procedure `notification.sendTest` (`src/server/root.ts`) branches on `opts.input.provider`. Its `grafana` branch calls `sendGrafanaTest(opts.input.to)`, which posts to that webhook URL. The host isn't known, so the request is an Unknown that belongs to the `grafana` branch only.

| UI action (`src/components/Forms.tsx`) | Provider | Reaches | Unknown |
| --- | --- | --- | --- |
| FormWhatsApp | `z.literal("whatsapp")`, through the form's type | api.twilio.com | none |
| FormTelegram | `"telegram"`, a literal | api.telegram.org | none |
| FormGrafana | `"grafana"`, a literal | none known | the Grafana webhook |
| FormAny | not known: every branch | api.telegram.org, api.twilio.com, slack.com | the Grafana webhook |
