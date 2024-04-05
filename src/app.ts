import "dotenv/config";
import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";

import TodoCategory from "./models/TodoCategory";
import TodoPriority from "./models/TodoPriority";
import HttpError from "./models/HttpError";
import { FAIL_TO_INSERT_TO_DB } from "./constants/errorMessages";

const DB_NAME = "intro";
const TODO_CATEGORIES_COLLECTION_NAME = "todo_categories";
const TODO_PRIORITIES_COLLECTION_NAME = "todo_priorities";

const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING!;
const PORT = process.env.PORT || 3000;

const handleRequestError = (res: Response, error: HttpError) => {
  console.warn(error.message);
  res.status(error.httpCode).send(error);
};

const app: Express = express();

app.use(bodyParser.json());

app.get("/categories", async (_req: Request, res: Response) => {
  const client = new MongoClient(mongoDbConnectionString);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(TODO_CATEGORIES_COLLECTION_NAME);

    const result = await collection.find().toArray();
    await client.close();
    res.send(result);
  } catch (error) {
    console.warn("Unable to connect to database.");
    res.statusCode = 500;
    await client.close();
    res.send();
  }
});

app.post("/categories", async (req: Request, res: Response) => {
  try {
    const newTodoCategory = new TodoCategory({
      name: req.body.name,
    });
    
    const result = await newTodoCategory.save();

    res.statusCode = 201;
    res.send(result);
  } catch (error) {
    const s = error;
    const httpError: HttpError = {
      httpCode: 500,
      message: FAIL_TO_INSERT_TO_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

app.get("/priorities", async (_req: Request, res: Response) => {
  const client = new MongoClient(mongoDbConnectionString);

  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(TODO_PRIORITIES_COLLECTION_NAME);
    const result = await collection.find().toArray();

    await client.close();
    res.send(result);
  } catch (error) {
    await client.close();
    console.warn(
      "An error occurred while attempting to save record to the database\n" +
        error
    );
    res.statusCode = 500;
    res.send();
  }
});

app.post("/priorities", async (req: Request, res: Response) => {
  try {
    const newTodoPriority = new TodoPriority({
      name: req.body.name,
      sortKey: req.body.sortKey,
    });

    const result = await newTodoPriority.save();

    res.status(201).send(result);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAIL_TO_INSERT_TO_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

mongoose
  .connect(mongoDbConnectionString)
  .then(() => {
    console.log("Successfully connected to the db.");
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) =>
    console.warn(`Unable to connect to the db with error: ${e.message}`)
  );
