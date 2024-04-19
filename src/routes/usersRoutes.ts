import express from "express";
import {
  FAILED_TO_DELETE_FROM_DB,
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_RETRIEVE_FROM_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import User from "../models/User";
import { handleRequestError } from "../utils";

const usersRouter = express.Router();

usersRouter.post("/signup", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username.trim() });
    if (user) {
      const httpError: HttpError = {
        httpCode: 400,
        message: `User with the username: ${req.body.username} already exists. Please use a different username.`,
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
    const user = new User({
      username: req.body.username,
      password: req.body.password,
    });

    const result = await user.save();
    res.status(201).send({ _id: result._id, username: result.username });
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_INSERT_TO_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

usersRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      username: req.body.username.trim(),
      password: req.body.password,
    });

    if (user) {
      return res
        .status(200)
        .send({ _id: user._id, username: user.username, todosIds: user.todos });
    }

    const httpError: HttpError = {
      httpCode: 404,
      message: "User not found",
    };
    return handleRequestError(res, httpError);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_RETRIEVE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

usersRouter.delete("/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    res.status(200).send(result);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_DELETE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

usersRouter.get("/", async (_req, res) => {
  try {
    const result = await User.find();
    res.status(200).send(result);
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 500,
      message: FAILED_TO_RETRIEVE_FROM_DB,
      error,
    };
    return handleRequestError(res, httpError);
  }
});

export default usersRouter;
