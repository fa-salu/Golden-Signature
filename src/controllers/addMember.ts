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
    emergencyNumber,
    password,
    role,
    address,
    image,
    openingBal,
    companyOpeningBal,
    joiningDate,
    salary,
  } = req.body;

  if (
    !username ||
    !email ||
    !phoneNumber ||
    !password ||
    !role ||
    !joiningDate ||
    !salary
  ) {
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
      emergencyNumber: emergencyNumber || null,
      password: hashedPassword,
      role,
      address,
      image,
      status: true,
      openingBal: openingBal || 0,
      companyOpeningBal: companyOpeningBal || 0,
      joiningDate,
      salary,
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
    joiningDate: newUser.joiningDate,
    salary: newUser.salary,
  };

  res
    .status(201)
    .json(new StandardResponse("Member added successfully", userResponse, 201));
};

export const updateMember = async (req: CustomRequest, res: Response) => {
  const id = req.user?.id;
  const {
    username,
    name,
    email,
    phoneNumber,
    emergencyNumber,
    password,
    role,
    address,
    image,
    status,
    openingBal,
    companyOpeningBal,
    joiningDate,
    salary,
  } = req.body;

  const userToUpdate = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!userToUpdate) {
    throw new CustomError("User not found", 404);
  }

  if (username) {
    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    if (existingUsername && existingUsername.id !== id) {
      throw new CustomError("Username already exists", 400);
    }
  }

  if (email) {
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail && existingEmail.id !== id) {
      throw new CustomError("Email already exists", 400);
    }
  }

  if (phoneNumber) {
    const existingPhone = await prisma.user.findUnique({
      where: { phoneNumber },
    });
    if (existingPhone && existingPhone.id !== id) {
      throw new CustomError("Phone number already exists", 400);
    }
  }

  const validRoles = ["admin", "manager", "salesman", "accountant"];
  if (role && !validRoles.includes(role)) {
    throw new CustomError("Invalid role provided", 400);
  }

  if (status !== undefined && typeof status !== "boolean") {
    throw new CustomError("Invalid status provided", 400);
  }

  const updateData: any = {};

  if (username) updateData.username = username;
  if (name) updateData.name = name;
  if (email) updateData.email = email;
  if (phoneNumber) updateData.phoneNumber = phoneNumber;
  if (emergencyNumber !== undefined)
    updateData.emergencyNumber = emergencyNumber;
  if (role) updateData.role = role;
  if (address !== undefined) updateData.address = address;
  if (image !== undefined) updateData.image = image;
  if (status !== undefined) updateData.status = status;
  if (openingBal !== undefined) updateData.openingBal = openingBal;
  if (companyOpeningBal !== undefined)
    updateData.companyOpeningBal = companyOpeningBal;

  if (password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(password, salt);
  }

  if (joiningDate) updateData.joiningDate = joiningDate;
  if (salary) updateData.salary = salary;

  const updatedUser = await prisma.user.update({
    where: { id: id },
    data: updateData,
    select: {
      id: true,
      username: true,
      name: true,
      email: true,
      phoneNumber: true,
      emergencyNumber: true,
      role: true,
      status: true,
      address: true,
      image: true,
      openingBal: true,
      companyOpeningBal: true,
      joiningDate: true,
      salary: true,
    },
  });

  res
    .status(200)
    .json(new StandardResponse("Member updated successfully", updatedUser));
};
