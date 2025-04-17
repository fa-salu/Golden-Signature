import { Response, NextFunction } from "express";
import { CustomError } from "../utils/error/customError";
import { CustomRequest } from "../types/interfaces";

export const authorizeRoles = (...roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError("Authentication required", 401));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new CustomError(
          `Role ${req.user.role} is not allowed to access this resource`,
          403
        )
      );
    }

    next();
  };
};
