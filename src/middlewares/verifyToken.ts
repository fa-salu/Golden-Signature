import type { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import type { CustomRequest, JwtDecoded } from "../types/interfaces";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";

export const verifyToken = async (
  req: CustomRequest,
  _res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      throw new CustomError("Not authenticated", 401);
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.user = verified as JwtDecoded;

    const userExists = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!userExists || userExists.status === false) {
      throw new CustomError("User not found or blocked", 404);
    }

    next();
  } catch (error) {
    next(error);
  }
};
