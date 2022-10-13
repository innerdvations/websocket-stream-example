import { Duplex } from 'stream';
import WebSocket, { createWebSocketStream, WebSocketServer } from 'ws';

// set up the server
const wss = new WebSocketServer({ port: 8080 });
console.log('started server on http://localhost:8080');

wss.on('connection', function connection(ws) {
  ws.on('message', function message(data) {
    console.log('received bytes:', Buffer.byteLength(data.toString()));
  });

  ws.send('something');
});

// connect to the server
const ws = new WebSocket('ws://localhost:8080/');

// create the stream
import { readableNoopStream } from 'noop-stream';
const readStream = readableNoopStream({ size: 1000000 });
readStream.on('pause', () => {
  console.log('read stream paused');
});
readStream.on('resume', () => {
  console.log('read stream resumed');
});

// create the websocket stream
const wsStream = createWebSocketStream(ws, { encoding: 'utf8' });

class Throttle extends Duplex {
  delay: any;

  constructor(time) {
    super();
    this.delay = time;
  }
  _read() {
    // empty
  }

  // Writes the data, push and set the delay/timeout
  _write(chunk, encoding, callback) {
    this.push(chunk);
    setTimeout(callback, this.delay);
  }

  // When all the data is done passing, it stops.
  _final() {
    this.push(null);
  }
}

const throttle = new Throttle(5000);

// const tunnel = new PassThrough();
// let amount = 0;
// tunnel.on('data', (chunk) => {
//   amount += chunk.length;
//   console.log('bytes:', amount);
// });

readStream
  .pipe(throttle)
  //.pipe(tunnel)
  .pipe(wsStream);
