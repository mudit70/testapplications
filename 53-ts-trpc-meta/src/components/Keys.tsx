"use client";
import { api } from "~/lib/trpc";

export function Keys() {
  const create = api.keys.create.useMutation();
  const rename = api.keys.rename.useMutation();
  return (
    <div>
      <button onClick={() => create.mutate({ name: "ci" })}>Create key</button>
      <button onClick={() => rename.mutate({ id: "key_1", name: "deploy" })}>Rename key</button>
    </div>
  );
}
