import express, { Request, Response } from "express";

import {
  FAILED_TO_RETRIEVE_FROM_DB,
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_DELETE_FROM_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import TodoPriority from "../models/TodoPriority";
import { handleRequestError } from "../utils";

const todoPrioritiesRouter = express.Router();

todoPrioritiesRouter.get("/", async (_req: Request, res: Response) => {
  try {
    const priorities = await TodoPriority.find();
    res.send(priorities);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_RETRIEVE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

todoPrioritiesRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newTodoPriority = new TodoPriority({
      ...req.body
    });

    const result = await newTodoPriority.save();

    res.status(201).send(result);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_INSERT_TO_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

todoPrioritiesRouter.delete('/:id', async (req,res) => {
  try { 
    const response = await TodoPriority.findByIdAndDelete(req.params.id);
    res.status(200).send(response);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_DELETE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
})

export default todoPrioritiesRouter;
