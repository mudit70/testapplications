# 53-ts-trpc-meta — a tRPC middleware's work its procedure's meta decides

A written fixture for veoagents: its answers are in `expected.yaml`, written from the code
(veoagents #417, from openstatus's tRPC middleware). The protected procedures' middleware
(`src/server/trpc.ts`) tracks the procedure in OpenPanel after the response, inside
`after(async () => { const { meta } = opts; if (meta?.track) { … } })`.

| UI action (`src/components/Keys.tsx`) | Procedure | meta | OpenPanel |
| --- | --- | --- | --- |
| Create key | keys.create | `.meta({ track: { name: "create_api_key" } })` | identify and track |
| Rename key | keys.rename | none | none |
