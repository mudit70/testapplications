export function SlackSettings() {
  return (
    <div>
      <button onClick={() => fetch("/slack/install")}>Install</button>
      <button onClick={() => fetch("/slack/events", { method: "POST", body: "{}" })}>Send test event</button>
      <button onClick={() => fetch("/ping")}>Ping</button>
    </div>
  );
}
