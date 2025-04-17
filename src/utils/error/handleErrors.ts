import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { CustomError } from "./customError";

const prismaNotFoundHandler = (err: PrismaClientKnownRequestError) => {
  const msg = `Record not found!`;
  return new CustomError(msg, 404);
};

const prismaValidationHandler = (err: PrismaClientValidationError) => {
  const msg = `Validation error: ${
    err.message.split("\n").pop() || "Invalid input data"
  }`;
  return new CustomError(msg, 400);
};

const prismaUniqueConstraintHandler = (err: PrismaClientKnownRequestError) => {
  const matches = err.message.match(
    /Unique constraint failed on the fields: \(`([^`]+)`\)/
  );
  const field = matches?.[1] || "field";

  return new CustomError(`A record with this ${field} already exists!`, 400);
};

const prismaForeignKeyHandler = (err: PrismaClientKnownRequestError) => {
  const matches = err.message.match(
    /Foreign key constraint failed on the field: \(`([^`]+)`\)/
  );
  const field = matches?.[1] || "reference";

  return new CustomError(
    `Invalid ${field} reference. The referenced record may not exist.`,
    400
  );
};

export {
  prismaNotFoundHandler,
  prismaValidationHandler,
  prismaUniqueConstraintHandler,
  prismaForeignKeyHandler,
};
