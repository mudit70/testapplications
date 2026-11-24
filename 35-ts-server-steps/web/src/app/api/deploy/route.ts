import { DeployService } from "@/gen/ctrl/v1/deployment_pb";
import { createCtrlClient } from "@/lib/ctrl-client";

export async function POST(req: Request) {
  const { deploymentId } = (await req.json()) as { deploymentId: string };
  const ctrl = createCtrlClient(DeployService);
  await ctrl.authorizeDeployment({ deploymentId });
  return Response.json({ ok: true });
}
