import express from "express";

import mongoose from "mongoose";
import {
  FAILED_TO_DELETE_FROM_DB,
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_RETRIEVE_FROM_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import Todo from "../models/Todo";
import TodoCategory from "../models/TodoCategory";
import TodoPriority from "../models/TodoPriority";
import User from "../models/User";
import { handleRequestError } from "../utils";

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

todosRouter.put("/", async (req, res) => {
  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: req.body._id, createdBy: req.body.createdBy },
      {
        text: req.body.text,
        categoryId: req.body.categoryId,
        priorityId: req.body.priorityId,
        lastUpdatedAt: new Date(),
      },
      { new: true }
    );
    res.send(todo);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_INSERT_TO_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

todosRouter.delete("/", async (req, res) => {
  let user;
  let todo;
  try {
    user = await User.findById(req.body.userId);
    todo = await Todo.findById(req.body.todoId);

    if (!user) {
      const httpError: HttpError = {
        httpCode: 404,
        message: "User not found",
      };
      return handleRequestError(res, httpError);
    }

    if (!todo) {
      const httpError: HttpError = {
        httpCode: 404,
        message: "Todo not found",
      };
      return handleRequestError(res, httpError);
    }
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_RETRIEVE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    const deletedTodo = await Todo.findByIdAndDelete(todo.id).session(session);

    user.todos.pull(deletedTodo);

    await user.save({ session });

    if (!deletedTodo) {
      await session.abortTransaction();
      const httpError: HttpError = {
        httpCode: 400,
        message: "UserId and TodoId have no relationship",
      };
      return handleRequestError(res, httpError);
    }

    await session.commitTransaction();
    res.send(deletedTodo);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_DELETE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

todosRouter.get("/user/:userId", async (req, res) => {
  try {
    const todos = await Todo.find({ createdBy: req.params.userId });
    res.send(todos);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_RETRIEVE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

export default todosRouter;
