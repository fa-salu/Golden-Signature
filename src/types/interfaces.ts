import type { Request } from "express";
import type { JwtPayload } from "jsonwebtoken";

export type UserRole = "admin" | "manager" | "salesman" | "accountant";

export interface CustomRequest extends Request {
  user?: {
    id: number;
    role: UserRole;
  } & JwtPayload;
}

export type JwtDecoded = {
  id: number;
  role: UserRole;
};
