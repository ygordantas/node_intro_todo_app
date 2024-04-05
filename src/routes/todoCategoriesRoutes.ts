import express, { Request, Response } from "express";

import TodoCategory from "../models/TodoCategory";
import {
  FAILED_TO_RETRIEVE_FROM_DB,
  FAILED_TO_INSERT_TO_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import { handleRequestError } from "../utils";

const todoCategoriesRouter = express.Router();

todoCategoriesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const categories = await TodoCategory.find();
    res.send(categories);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_RETRIEVE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

todoCategoriesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newTodoCategory = new TodoCategory({
      name: req.body.name,
    });

    const result = await newTodoCategory.save();

    res.statusCode = 201;
    res.send(result);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_INSERT_TO_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

export default todoCategoriesRouter;
