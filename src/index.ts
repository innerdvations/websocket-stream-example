import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';

// set up the server
const wss = new WebSocketServer({ port: 8080 });
console.log('started server on http://localhost:8080');

let totalBytes = 0;
wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    const len = Buffer.byteLength(data.toString()); // probably not right
    console.log('received bytes:', len);
    totalBytes += len;
  });

  ws.on('close', () => {
    console.log(`closing after writing ${totalBytes} bytes`);
  });

  ws.send('something');
});

// connect to the server
const ws = new WebSocket('ws://localhost:8080/');

// create the read stream
import { readableNoopStream } from 'noop-stream';
const readStream = readableNoopStream({ size: 100000 });
readStream.on('pause', () => {
  console.log('read stream paused');
});
readStream.on('resume', () => {
  console.log('read stream resumed');
});
readStream.on('end', () => {
  console.log('readstream end');
  wss.close();
});

// create the websocket stream
const wsStream = createWebSocketStream(ws, { encoding: 'utf8' });

// start piping
readStream.pipe(wsStream);
