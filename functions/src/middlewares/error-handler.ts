import {NextFunction, Request, Response} from "express";

import {CustomError} from "../errors/custom-error";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction, // eslint-disable-line
): void => {
  if (err instanceof CustomError) {
    res.status(err.statusCode).send({errors: err.serializeErrors()});
    return;
  }

  console.error(err);

  res.status(400).send({
    errors: [{message: "Something went wrong"}],
  });
};
