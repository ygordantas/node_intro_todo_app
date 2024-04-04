import "dotenv/config";

import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";
import cors from 'cors';
import categoriesRouter from "./routes/categoriesRoute";

const DB_NAME = "intro";
const TODO_PRIORITIES_COLLECTION_NAME = "todo_priorities";

const mongoDbConnectionString = process.env.MONGODB_CONNECTION_STRING!;
const PORT = process.env.PORT || 3000;

const app: Express = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(bodyParser.json());

app.use("/categories", categoriesRouter);

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
  const client = new MongoClient(mongoDbConnectionString);
  try {
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(TODO_PRIORITIES_COLLECTION_NAME);

    const result = await collection.insertOne({
      name: req.body.name,
      sortKey: req.body.sortKey,
    });

    await client.close();

    res.statusCode = 201;
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
