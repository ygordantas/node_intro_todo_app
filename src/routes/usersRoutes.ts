import express from "express";
import User from "../models/User";
import { handleRequestError } from "../utils";
import HttpError from "../models/HttpError";
import { FAILED_TO_INSERT_TO_DB } from "../constants/errorMessages";

const usersRouter = express.Router();

usersRouter.post("/", async (req, res) => {
  const user = new User({
    username: req.body.username,
  });

  try {
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

export default usersRouter;
