import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 4050 });

wss.on('connection', ws => {
  const interval = setInterval(() => {
    const price = 1000 + Math.random() * 100;
    ws.send(JSON.stringify({ type: 'price', symbol: 'BTCUSD', mark: price, index: price + 5 }));
  }, 200);

  ws.on('close', () => clearInterval(interval));
});

console.log('Mock Pingu WS running on ws://localhost:4050');
