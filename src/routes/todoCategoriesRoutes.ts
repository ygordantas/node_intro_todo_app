import express, { Request, Response } from "express";

import {
  FAILED_TO_DELETE_FROM_DB,
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_RETRIEVE_FROM_DB,
} from "../constants/errorMessages";
import checkAuth from "../middlewares/auth";
import HttpError from "../models/HttpError";
import TodoCategory from "../models/TodoCategory";
import { handleRequestError } from "../utils";

const todoCategoriesRouter = express.Router();

todoCategoriesRouter.use(checkAuth);

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
      iconOptionName: req.body.iconOptionName,
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

todoCategoriesRouter.delete("/:id", async (req, res) => {
  try {
    const result = await TodoCategory.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).send();
    res.send(result);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_DELETE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

export default todoCategoriesRouter;
