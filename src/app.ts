import { createServer } from "node:http";

const PORT = 3000;

const TODO_CATEGORIES: any[] = [
  {
    id: 1,
    name: "Work",
  },
  {
    id: 2,
    name: "Groceries",
  },
  {
    id: 3,
    name: "Finance",
  },
  {
    id: 4,
    name: "Family",
  },
  {
    id: 5,
    name: "Cooking",
  },
  {
    id: 6,
    name: "Gardening",
  },
];

const server = createServer((req, res) => {
  if (req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(TODO_CATEGORIES));
  } else if (req.method === "POST") {
    res.writeHead(201, { "Content-Type": "application/json" });
    let body = "";

    req.on("data", (chunks) => {
      body += chunks.toString();
    });

    req.on("end", () => {
      const newTodo = JSON.parse(body);
      const newTodoId = TODO_CATEGORIES[TODO_CATEGORIES.length - 1].id + 1;

      TODO_CATEGORIES.push({ id: newTodoId, ...newTodo });

      res.end(JSON.stringify(TODO_CATEGORIES[TODO_CATEGORIES.length - 1]));
    });

    
  } else {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end("Method not allowed");
  }
});

server.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
