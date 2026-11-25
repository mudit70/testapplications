# 63-ts-sdk-field — an SDK client a class of the code holds in a field

A written fixture for veoagents. Its answers are in `expected.yaml`, written from the code. It comes from veoagents #421, which is based on unkey's WorkOS webhook (`web/apps/dashboard/app/api/webhooks/workos/route.ts`): it calls `resend.client.contacts.create(…)` on the Resend client that `@unkey/resend`'s class holds in its `client` field.

| UI action (`web/src/components/Signup.tsx`) | Route | What it calls | Reaches |
| --- | --- | --- | --- |
| Sign up | POST /api/signup | `req.json()`, then `mailer.client.contacts.create(…)` (the field, from outside the class), then `mailer.sendWelcomeEmail(…)` (`this.client.emails.send`) | api.resend.com |

`req.json()` reads the request's body. It isn't a callback prop of a component, even though the route's handler is named `POST`.
