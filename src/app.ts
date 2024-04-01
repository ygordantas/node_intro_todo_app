import bodyParser from "body-parser";
import "dotenv/config";
import express, { Request, Response } from "express";
import mongoose from "mongoose";

import TodoCategory from "./schemas/todoCategorySchema";

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_CONNECTION_STRING!)
  .then(() => console.log("Successfully connected to the database."))
  .catch((e) =>
    console.error(`Unable to connect to the database with error: ${e?.message}`)
  );

const app = express();

app.use(bodyParser.json());

app.get("/todoCategories", async (req: Request, res: Response) => {
  const todoCategories = await TodoCategory.find();

  res.send(todoCategories);
});

app.get("/todoCategories/:todoCategoryId", async (req: Request, res: Response) => {
  const todoCategory = await TodoCategory.findById(req.params.todoCategoryId);

  res.send(todoCategory);
});

app.post("/todoCategories", async (req: Request, res: Response) => {
  const newCategory = new TodoCategory({
    name: req.body.name,
  });

  const result = await newCategory.save();

  res.send(result);
});

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
