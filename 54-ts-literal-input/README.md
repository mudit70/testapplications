# 54-ts-literal-input — a branch on a procedure's input a client gives as a literal

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code
(veoagents #418, from openstatus's notification.sendTest). The procedure sends through the
provider its input names (`if (opts.input.provider === "telegram") … if (… === "whatsapp") …`).

| UI action (`src/components/Forms.tsx`) | Provider it passes | Sends through |
| --- | --- | --- |
| Send WhatsApp test | `form.getValues("provider")`, on a form typed `useForm<z.infer<typeof schema>>` whose schema fixes it (`z.literal("whatsapp")`) | api.twilio.com |
| Send Telegram test | `"telegram"`, a literal | api.telegram.org |
| Send test | a prop, any provider | every branch: api.telegram.org, api.twilio.com, slack.com |
