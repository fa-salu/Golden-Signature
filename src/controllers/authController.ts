import { Request, Response } from "express";
import { User } from "../models/user";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "../utils/zodSchema";

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.parse(req.body);
  console.log("parse", parsed);
  const { username, password } = parsed;
  console.log("body", username, password);
  console.log("type", username.type);
  let user;
  if (username.type === "email") {
    console.log("emm");
    user = await User.findOne({ email: username.value });
  } else if (username.type === "phone") {
    user = await User.findOne({ phoneNumber: username.value });
  } else {
    user = await User.findOne({ username: username.value });
  }

  console.log("user", user);

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new CustomError("Invalid credentials", 400);
    }

    if (user.isDelete) {
      throw new CustomError("User deactivated", 400, "USER_DEACTIVATED");
    }

    const token = jwt.sign(
      {
        id: user._id,
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
      userId: user._id,
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
