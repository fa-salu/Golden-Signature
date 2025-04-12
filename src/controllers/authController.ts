// import { Request, Response } from "express";

import { Request, Response } from "express";
import { User } from "../models/user";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  // username: { value: string, type: 'email' | 'phone' | 'username' }

  let user;
  if (username.type === "email") {
    user = await User.findOne({ email: username.value });
    console.log("email");
  } else if (username.type === "phone") {
    user = await User.findOne({ phoneNumber: username.value });
    console.log("phone");
  } else {
    user = await User.findOne({ username: username.value });
    console.log("username");
  }

  if (!user) {
    throw new CustomError("User not found", 400);
  }

  if (user) {
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      throw new CustomError("Invalid credentials", 400);
    }

    if (!user.isActive) {
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
