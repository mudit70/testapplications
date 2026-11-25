export function Dashboard({ slug, monitorId }: { slug: string; monitorId: number }) {
  return (
    <div>
      <button onClick={() => fetch("/api/me")}>Me</button>
      <button onClick={() => fetch(`/api/workspaces/${slug}`)}>Workspace</button>
      <button onClick={() => fetch(`/api/monitors/${monitorId}`)}>Monitor</button>
      <button onClick={() => fetch(`/api/workspaces/${slug}/members?admin=1`)}>Members</button>
    </div>
  );
}
