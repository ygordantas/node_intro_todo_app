import bodyParser from "body-parser";
import express, { Request, Response } from "express";

const MOCK_DATA = [
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

const PORT = 3000;
const app = express();

app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => {
  res.send(MOCK_DATA);
})

app.listen(PORT, () => {
  console.log(`Server is listening on port http://localhost:${PORT}`);
});