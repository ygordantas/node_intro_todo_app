import { createServer } from 'node:http';

const server = createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("Uhull COMIT ! Let's goooo!\n");
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Listening on 127.0.0.1:3000');
});

// => request => intercom(convert your speech into an order that's display on screen) => print in printer kitchen 