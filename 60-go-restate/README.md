# 60-go-restate — a Restate Send to a service of the repository (React + net/http + GORM + Restate)

A written fixture for veoagents (#422): its answers are in `expected.yaml`, written from the code.
`backend/gen/deploy_restate.pb.go` is protoc-gen-go-restate's output, as in unkey's
`gen/proto/hydra/v1`. The API's `POST /api/deployments/{id}` creates the deployment and Sends a
Deploy request through the generated ingress client; the worker's `Workflow.Deploy`, registered
with `NewDeployServiceServer`, handles it and updates the deployment.

| UI action | Requests | Data |
| --- | --- | --- |
| Deploy | POST /api/deployments/{id}, then the Restate service's POST /deploy.v1.DeployService/Deploy | writes deployments |
