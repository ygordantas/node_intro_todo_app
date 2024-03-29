import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";

const PORT: number = 3000;

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

const app: Express = express();

app.use(bodyParser.json());

app.get("/categories", (_req: Request, res: Response) => {
  res.send(TODO_CATEGORIES);
});

app.post("/categories", (req: Request, res: Response) => {
  const id = TODO_CATEGORIES[TODO_CATEGORIES.length - 1].id + 1;
  const newTodo = { id, ...req.body };

  TODO_CATEGORIES.push(newTodo);

  res.statusCode = 201;
  res.send(newTodo);
});

app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
