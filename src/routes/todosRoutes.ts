import express from "express";
import Todo from "../models/Todo";
import User from "../models/User";
import {
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_RETRIEVE_FROM_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import { handleRequestError } from "../utils";
import mongoose from "mongoose";

const todosRouter = express.Router();

todosRouter.post("/", async (req, res) => {
  let user;

  try {
    user = await User.findById(req.body.createdBy);
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

  const now = new Date();
  
  const todo = new Todo({
    ...req.body,
    createdAt: now,
    lastUpdatedAt: now,
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
