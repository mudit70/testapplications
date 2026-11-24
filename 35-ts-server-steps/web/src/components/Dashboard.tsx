"use client";

const post = (path: string, body: unknown) =>
  fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export function Dashboard({ token }: { token: string }) {
  const subscribe = async () => {
    await post("/api/subscribe", { priceId: "price_pro" });
  };
  const invite = async () => {
    await post("/api/invite", { email: "a@example.com", organizationId: "org_1" });
  };
  const search = async () => {
    await post("/api/search", { query: "failed deployments" });
  };
  const authorize = async () => {
    await post("/api/deploy", { deploymentId: "dep_1" });
  };
  const syncEnv = async () => {
    await post("/api/env", { token, projectId: "prj_1", key: "API_KEY", value: "x" });
  };
  const uploadLogo = async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    await fetch("/api/logo", { method: "POST", body: form });
  };
  const loadFeed = async () => {
    await fetch("http://localhost:4000/api/feed", { headers: { Authorization: `Token ${token}` } });
  };
  return (
    <div>
      <button onClick={subscribe}>Subscribe</button>
      <button onClick={invite}>Invite</button>
      <button onClick={search}>Search</button>
      <button onClick={authorize}>Authorize deployment</button>
      <button onClick={syncEnv}>Sync environment</button>
      <input type="file" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
      <button onClick={loadFeed}>Feed</button>
    </div>
  );
}
