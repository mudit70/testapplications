// Subscribes to live driver locations over the backend websocket
// (mirrors the /ws/drivers route in backend/server.go) and updates the DOM.
const socket = new WebSocket("ws://localhost:8080/ws/drivers");

socket.addEventListener("message", (event: MessageEvent) => {
  const el = document.getElementById("driver-feed");
  if (el) {
    el.textContent = String(event.data);
  }
});

export { socket };
