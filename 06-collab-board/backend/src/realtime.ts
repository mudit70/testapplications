import { WebSocketServer } from 'ws';

// Realtime board updates pushed to connected clients.
export function startRealtime() {
  const wss = new WebSocketServer({ port: 8080, path: '/api/realtime' });
  wss.on('connection', (ws) => {
    ws.on('message', (data) => {
      console.log('client message', data.toString());
    });
  });
  return wss;
}
