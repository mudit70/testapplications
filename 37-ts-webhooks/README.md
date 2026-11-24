# 37-ts-webhooks — webhooks an SDK operation triggers

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code. A
call that changes a service's state makes the service deliver an event later to the app's
webhook route for it (veoagents #381).

| UI action (`src/components/Billing.tsx`) | Operation | Later |
| --- | --- | --- |
| Subscribe | `stripe.subscriptions.create` | `customer.subscription.created` → `POST /api/webhooks/stripe` writes subscriptions |
| Change plan | `stripe.subscriptions.update` | `customer.subscription.updated` → the same route |
| Send invoice | `stripe.invoices.create` | nothing: no route handles invoice events |
| Sign up | `workos.userManagement.createUser` | `user.created` → `POST /api/webhooks/workos` writes signups |

The webhook routes check each delivery with the SDK's own helper (`stripe.webhooks.constructEvent`,
`workos.webhooks.constructEvent`) and pick the work by the event's type.
