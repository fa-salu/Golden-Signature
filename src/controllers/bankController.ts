import { Request, Response } from "express";
import prisma from "../config/db";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";

export const createBank = async (req: Request, res: Response) => {
  const { accountName, bankName, accountNo, openingBal } = req.body;

  const existingAccount = await prisma.bank.findUnique({
    where: { accountNo },
  });

  if (existingAccount) {
    throw new CustomError("Account number already exists", 400);
  }

  const newBank = await prisma.bank.create({
    data: {
      accountName,
      bankName,
      accountNo,
      openingBal,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Bank account created successfully", newBank, 201)
    );
};


export const updateBank = async (req: Request, res: Response) => {
  const bankId = Number(req.params.id);
  const { accountName, bankName, accountNo, openingBal } = req.body;

  const existingBank = await prisma.bank.findUnique({
    where: { id: bankId },
  });

  if (!existingBank) {
    throw new CustomError("Bank not found", 404);
  }

  // If accountNo is being changed, check if it's already taken
  if (accountNo && accountNo !== existingBank.accountNo) {
    const accountExists = await prisma.bank.findUnique({
      where: { accountNo },
    });

    if (accountExists) {
      throw new CustomError("Account number already exists", 400);
    }
  }

  const updatedBank = await prisma.bank.update({
    where: { id: bankId },
    data: {
      accountName,
      bankName,
      accountNo,
      openingBal,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse(
        "Bank account updated successfully",
        updatedBank,
        200
      )
    );
};
