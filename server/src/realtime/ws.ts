import { WebSocketServer, WebSocket } from 'ws';

let wssRef: WebSocketServer | null = null;

export function registerWss(wss: WebSocketServer) {
  wssRef = wss;
  wss.on('connection', (ws: WebSocket) => {
    ws.send(JSON.stringify({ type: 'welcome', message: 'Connected to QEADS notifications' }));
    ws.on('message', (msg) => {
      // basic echo for now
      try {
        const data = JSON.parse(msg.toString());
        if (data?.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', time: Date.now() }));
        }
      } catch (e) {
        // ignore
      }
    });
  });
}

export function wssBroadcast(payload: any) {
  if (!wssRef) return;
  wssRef.clients.forEach((client) => {
    if ((client as WebSocket).readyState === WebSocket.OPEN) {
      (client as WebSocket).send(JSON.stringify(payload));
    }
  });
}
