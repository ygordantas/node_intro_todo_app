import express, { Request, Response } from "express";
import TodoCategory from "../schemas/todoCategorySchema";

const categoriesRouter = express.Router();

categoriesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const result = await TodoCategory.find();
    res.send(result);
  } catch (error) {
    console.warn(
      "An error occurred while attempting to save record to the database\n" +
        error
    );
    res.statusCode = 500;
    res.send(error);
  }
});

categoriesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newTodoCategory = new TodoCategory({
      name: req.body.name,
    });

    const result = await newTodoCategory.save();

    res.statusCode = 201;
    res.send(result);
  } catch (err) {
    console.warn(
      "An error occurred while attempting to save record to the database\n" +
        err
    );
    res.statusCode = 500;
    res.send();
  }
});

export default categoriesRouter;
