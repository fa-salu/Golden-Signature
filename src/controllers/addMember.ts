import { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import bcrypt from "bcryptjs";
import { CustomRequest } from "../types/interfaces";
import prisma from "../config/db";

export const addMember = async (req: Request, res: Response) => {
  const {
    username,
    name,
    email,
    phoneNumber,
    password,
    role,
    address,
    image,
    groupId,
    emergencyNumber,
  } = req.body;

  if (!username || !email || !phoneNumber || !password || !role || !groupId) {
    throw new CustomError("Please provide all required fields", 400);
  }

  const validRoles = ["admin", "manager", "salesman", "accountant"];
  if (!validRoles.includes(role)) {
    throw new CustomError("Invalid role provided", 400);
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }, { phoneNumber }],
    },
  });

  if (existingUser) {
    if (existingUser.username === username) {
      throw new CustomError("Username already exists", 400);
    }
    if (existingUser.email === email) {
      throw new CustomError("Email already exists", 400);
    }
    if (existingUser.phoneNumber === phoneNumber) {
      throw new CustomError("Phone number already exists", 400);
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

   const newUser = await prisma.user.create({
     data: {
       username,
       name,
       email,
       phoneNumber,
       emergencyNumber,
       password: hashedPassword,
       role,
       address,
       image,
       status: true,
       groupId: Number(groupId),
       openingBal: 0,
     },
   });

   const userResponse = {
     userId: newUser.id,
     username: newUser.username,
     name: newUser.name,
     email: newUser.email,
     phoneNumber: newUser.phoneNumber,
     role: newUser.role,
     status: newUser.status,
     address: newUser.address,
     image: newUser.image,
     groupId: newUser.groupId,
   };

  res
    .status(201)
    .json(new StandardResponse("Member added successfully", userResponse, 201));
};

// export const updateMember = async (req: CustomRequest, res: Response) => {
//   const id = req.user?.id;
//   const {
//     username,
//     name,
//     email,
//     phoneNumber,
//     password,
//     role,
//     address,
//     image,
//     status,
//   } = req.body;

//   const userToUpdate = await User.findById(id);
//   if (!userToUpdate) {
//     throw new CustomError("User not found", 404);
//   }

//   const duplicateUser = await User.findOne({
//     $or: [
//       { username, _id: { $ne: id } },
//       { email, _id: { $ne: id } },
//       { phoneNumber, _id: { $ne: id } },
//     ],
//   });
//   if (duplicateUser) {
//     if (duplicateUser.username === username) {
//       throw new CustomError("Username already exists", 400);
//     }
//     if (duplicateUser.email === email) {
//       throw new CustomError("Email already exists", 400);
//     }
//     if (duplicateUser.phoneNumber === phoneNumber) {
//       throw new CustomError("Phone number already exists", 400);
//     }
//   }
//   const validRoles = ["admin", "manager", "salesman", "accountant"];
//   if (role && !validRoles.includes(role)) {
//     throw new CustomError("Invalid role provided", 400);
//   }
//   const validStatuses = ["active", "inactive"];
//   if (status && !validStatuses.includes(status)) {
//     throw new CustomError("Invalid status provided", 400);
//   }

//   const updateData: any = {};
//   if (username) updateData.username = username;
//   if (name) updateData.name = name;
//   if (email) updateData.email = email;
//   if (phoneNumber) updateData.phoneNumber = phoneNumber;
//   if (role) updateData.role = role;
//   if (address) updateData.address = address;
//   if (image) updateData.image = image;
//   if (status) updateData.status = status;

//   if (password) {
//     const salt = await bcrypt.genSalt(10);
//     updateData.password = await bcrypt.hash(password, salt);
//   }

//   const updatedUser = await User.findByIdAndUpdate(
//     id,
//     { $set: updateData },
//     { new: true, runValidators: true }
//   ).select("-password");

//   if (!updatedUser) {
//     throw new CustomError("Failed to update user", 500);
//   }

//   res
//     .status(200)
//     .json(new StandardResponse("Member updated successfully", updatedUser));
// };
