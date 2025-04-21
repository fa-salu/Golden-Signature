import { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "../utils/zodSchema";
import prisma from "../config/db";

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body);
  const { username, password } = parsed;

  let user;
  if (username.type === "email") {
    user = await prisma.user.findUnique({
      where: { email: username.value },
    });
  } else if (username.type === "phone") {
    user = await prisma.user.findUnique({
      where: { phoneNumber: username.value },
    });
  } else {
    user = await prisma.user.findUnique({
      where: { username: username.value },
    });
  }
  if (!user) {
    throw new CustomError("User not found", 400);
  }

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new CustomError("Invalid credentials", 400);
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY!,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const response = {
      userId: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      image: user.image,
      role: user.role,
      status: user.status,
      address: user.address,
      token,
    };
    res.status(200).json(new StandardResponse("Login successful", response));
  }
};
