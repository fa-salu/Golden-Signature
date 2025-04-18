import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createBankEntry = async (req: Request, res: Response) => {
  const { trxnNumber, date, bankId, amount, amountType, trxnId } = req.body;

  if (!trxnNumber || !date || !bankId || !amount || !amountType || !trxnId) {
    throw new CustomError("Missing required fields", 400);
  }

  const existingTrxn = await prisma.bankEntry.findUnique({
    where: { trxnNumber },
  });

  if (existingTrxn) {
    throw new CustomError("Transaction number already exists", 409);
  }

  const bankExists = await prisma.bank.findUnique({
    where: { id: bankId },
  });

  if (!bankExists) {
    throw new CustomError("Bank not found", 404);
  }

  const newEntry = await prisma.bankEntry.create({
    data: {
      trxnNumber,
      date: new Date(date),
      bankId,
      amount,
      amountType,
      trxnId,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Bank entry created successfully", newEntry, 201)
    );
};


export const updateBankEntry = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { trxnNumber, date, bankId, amount, amountType, trxnId } = req.body;

  if (!id) {
    throw new CustomError("Bank entry ID is required", 400);
  }

  if (!trxnNumber || !date || !bankId || !amount || !amountType || !trxnId) {
    throw new CustomError("All fields are required", 400);
  }

  const existingEntry = await prisma.bankEntry.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingEntry) {
    throw new CustomError("Bank entry not found", 404);
  }

  const bankExists = await prisma.bank.findUnique({
    where: { id: bankId },
  });

  if (!bankExists) {
    throw new CustomError("Bank not found", 404);
  }

  const updatedEntry = await prisma.bankEntry.update({
    where: { id: parseInt(id) },
    data: {
      trxnNumber,
      date: new Date(date),
      bankId,
      amount,
      amountType,
      trxnId,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse("Bank entry updated successfully", updatedEntry, 200)
    );
};