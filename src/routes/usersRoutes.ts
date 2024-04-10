import express from "express";
import { FAILED_TO_INSERT_TO_DB } from "../constants/errorMessages";
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


export default usersRouter;