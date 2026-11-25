import { QueryClient } from "@tanstack/query-core";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { createCollection } from "@tanstack/vue-db";

export const queryClient = new QueryClient();

export interface Deployment {
  id: string;
  projectId: string;
}

/** The deployments of a project, loaded through TanStack Query (its key starts "deployments"). */
export const deployments = createCollection(
  queryCollectionOptions({
    queryClient,
    queryKey: (opts: { projectId?: string }) =>
      opts.projectId ? ["deployments", opts.projectId] : ["deployments"],
    queryFn: async () => {
      const res = await fetch("/api/deployments");
      return (await res.json()) as Deployment[];
    },
    getKey: (d: Deployment) => d.id,
    id: "deployments",
  }),
);
