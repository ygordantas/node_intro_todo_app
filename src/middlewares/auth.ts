import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import HttpError from "../models/HttpError";
import { handleRequestError } from "../utils";

const JWT_SECRET = process.env.JWT_SECRET!;

interface UserData {
  _id: string;
  username: string;
}

interface RequestWithUserData extends Request {
  userData?: UserData;
}

const checkAuth = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    const httpError: HttpError = {
      httpCode: 401,
      message: "Token not found",
    };
    return handleRequestError(res, httpError);
  }

  try {
    const userData = jwt.verify(token, JWT_SECRET) as UserData;
    const req: RequestWithUserData = {} as RequestWithUserData;
    req.userData = { _id: userData._id, username: userData.username };
    next();
  } catch (error) {
    const httpError: HttpError = {
      httpCode: 401,
      message: "Token verification failed",
      error,
    };
    return handleRequestError(res, httpError);
  }
};

export default checkAuth;
