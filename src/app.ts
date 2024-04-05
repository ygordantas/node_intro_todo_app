import "dotenv/config";
import bodyParser from "body-parser";
import express, { Express } from "express";
import mongoose from "mongoose";

import todoCategoriesRouter from "./routes/todoCategoriesRoutes";
import todoPrioritiesRouter from "./routes/todoPrioritiesRoutes";

const app: Express = express();

app.use(bodyParser.json());

app.use("/categories", todoCategoriesRouter);

app.use("/priorities", todoPrioritiesRouter);

mongoose
  .connect(process.env.MONGODB_CONNECTION_STRING!)
  .then(() => {
    console.log("Successfully connected to the db.");
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  })
  .catch((e) =>
    console.warn(`Unable to connect to the db with error: ${e.message}`)
  );
