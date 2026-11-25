import { createBetterstackClient } from "@acme/importers";
import { Vercel } from "@acme/vercel";

export function Integrations({ token, apiKey }: { token: string; apiKey: string }) {
  const vercel = new Vercel({ accessToken: token });
  return (
    <div>
      <button onClick={() => vercel.listProjects()}>Load projects</button>
      <button onClick={() => vercel.upsertEnvironmentVariable("prj_1", "UNKEY_API_ID", "api_1")}>
        Save
      </button>
      <button onClick={() => createBetterstackClient(apiKey).getMonitors()}>Import monitors</button>
    </div>
  );
}
