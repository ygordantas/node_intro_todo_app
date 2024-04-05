import { Response } from "express";
import HttpError from "./models/HttpError";

export const handleRequestError = (res: Response, error: HttpError) => {
  console.warn(error.message);
  res.status(error.httpCode).send(error);
};
