import { Ratelimit } from "@unkey/ratelimit";

export const ratelimit = {
  search: new Ratelimit({
    rootKey: process.env.UNKEY_ROOT_KEY ?? "",
    namespace: "search",
    limit: 10,
    duration: "10s",
  }),
};

/** A limiter that may be missing: checks it when it is there. */
export function withRatelimit(limiter: Ratelimit | undefined) {
  return async (identifier: string) => {
    if (!limiter) return true;
    const response = await limiter.limit(identifier);
    return response.success;
  };
}
