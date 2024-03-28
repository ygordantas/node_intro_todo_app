import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import { seedDb } from "./mongodb";

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send();
});

seedDb();

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});
