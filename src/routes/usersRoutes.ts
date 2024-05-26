import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import {
  FAILED_TO_DELETE_FROM_DB,
  FAILED_TO_INSERT_TO_DB,
  FAILED_TO_RETRIEVE_FROM_DB,
} from "../constants/errorMessages";
import HttpError from "../models/HttpError";
import User from "../models/User";
import { handleRequestError } from "../utils";
import checkAuth from "../middlewares/auth";

const usersRouter = express.Router();

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN!;

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
    const hashedPassword = await bcrypt.hash(req.body.password, 12);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    const result = await user.save();

    const token = jwt.sign(
      { _id: result.id, username: result.username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(201).send({ _id: result.id, username: result.username, token });
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
    });

    if (user) {
      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user.password as string
      );

      if (isValidPassword) {
        const token = jwt.sign(
          { _id: user.id, username: user.username },
          JWT_SECRET,
          { expiresIn: JWT_EXPIRES_IN }
        );

        return res
          .status(200)
          .send({ _id: user._id, username: user.username, token });
      }

      const httpError: HttpError = {
        httpCode: 400,
        message: "Invalid credentials",
      };
      return handleRequestError(res, httpError);
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

usersRouter.use(checkAuth);

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
