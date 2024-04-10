import "dotenv/config";
import bodyParser from "body-parser";
import express, { Express } from "express";
import mongoose from "mongoose";
import cors from "cors";

import todoCategoriesRouter from "./routes/todoCategoriesRoutes";
import todoPrioritiesRouter from "./routes/todoPrioritiesRoutes";
import usersRouter from "./routes/usersRoutes";

const app: Express = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(bodyParser.json());

app.use("/categories", todoCategoriesRouter);

app.use("/priorities", todoPrioritiesRouter);

app.use('/users', usersRouter);

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
