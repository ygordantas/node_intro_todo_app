import express from "express";
import {
  FAILED_TO_DELETE_FROM_DB,
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_RETRIEVE_FROM_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import { handleRequestError } from "../utils";
import User from "../models/User";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
    });
    const result = await user.save();
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
