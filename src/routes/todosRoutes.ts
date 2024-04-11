import express from "express";

import {
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_RETRIEVE_FROM_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import { handleRequestError } from "../utils";
import User from "../models/User";
import Todo from "../models/Todo";
import mongoose from "mongoose";
import TodoPriority from "../models/TodoPriority";
import TodoCategory from "../models/TodoCategory";

const todosRouter = express.Router();

todosRouter.post("/", async (req, res) => {
  let user;
  let priority;
  let category;

  try {
    user = await User.findById(req.body.createdBy);
    priority = await TodoPriority.findById(req.body.priorityId);
    category = await TodoCategory.findById(req.body.categoryId);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_RETRIEVE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }

  if (!user) {
    const httpError: HttpError = {
      httpCode: 404,
      message: "User not found",
    };
    return handleRequestError(res, httpError);
  }

  if (!priority) {
    const httpError: HttpError = {
      httpCode: 404,
      message: "Priority not found",
    };
    return handleRequestError(res, httpError);
  }

  const timestamp = new Date();
  const todo = new Todo({
    text: req.body.text,
    priorityId: req.body.priorityId,
    categoryId: category ? category.id : null,
    createdBy: req.body.createdBy,
    createdAt: timestamp,
    lastUpdatedAt: timestamp,
  });

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    await todo.save({ session });

    user.todos.push(todo);

    await user.save({ session });

    await session.commitTransaction();

    res.status(201).send(todo);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_INSERT_TO_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

export default todosRouter;
