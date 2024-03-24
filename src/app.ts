import { createServer } from "node:http";

const server = createServer((_req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("Uhull COMIT ! Let's goooo!\n");
});

const port = 3000;
server.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

// => request => intercom(convert your speech into an order that's display on screen) => print in printer kitchen
