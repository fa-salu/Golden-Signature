import type { NextFunction, Request, Response } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { CustomError } from "../utils/error/customError";
import {
  prismaNotFoundHandler,
  prismaValidationHandler,
  prismaUniqueConstraintHandler,
  prismaForeignKeyHandler,
} from "../utils/error/handleErrors";

const errorResponse = (error: CustomError, res: Response) => {
  res.status(error.statusCode).json({
    status: error.status,
    statusCode: error.statusCode,
    message: error.message,
    errorCode: error.errorCode,
  });
};

export const globalErrorHandler = (
  error: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(error);

  if (error instanceof CustomError) {
    errorResponse(error, res);
    return;
  }

  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      const notFoundError = prismaNotFoundHandler(error);
      errorResponse(notFoundError, res);
      return;
    }

    if (error.code === "P2002") {
      const uniqueConstraintError = prismaUniqueConstraintHandler(error);
      errorResponse(uniqueConstraintError, res);
      return;
    }

    if (error.code === "P2003") {
      const foreignKeyError = prismaForeignKeyHandler(error);
      errorResponse(foreignKeyError, res);
      return;
    }
  }

  if (error instanceof PrismaClientValidationError) {
    const validationError = prismaValidationHandler(error);
    errorResponse(validationError, res);
    return;
  }

  res.status(500).json({
    status: "fail",
    statusCode: 500,
    message: error?.message || "Something went wrong",
  });
};
