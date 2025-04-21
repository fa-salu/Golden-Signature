import { Request, Response } from "express";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";

export const createReceipt = async (req: Request, res: Response) => {
  const { receiptNo, date, partyId, amount, paymentType, bankId, trxnId } =
    req.body;

  if (!receiptNo || !date || !partyId || !amount || !paymentType) {
    throw new CustomError("Missing required fields", 400);
  }

  if (paymentType === "bank") {
    if (!bankId || !trxnId) {
      throw new CustomError(
        "Bank ID and Transaction ID are required for bank payments",
        400
      );
    }
  }

  const partyExists = await prisma.party.findUnique({
    where: { id: partyId },
  });

  if (!partyExists) {
    throw new CustomError("Party not found", 404);
  }

  if (paymentType === "bank") {
    const bankExists = await prisma.bank.findUnique({
      where: { id: bankId },
    });
    if (!bankExists) {
      throw new CustomError("Bank not found", 404);
    }
  }

  const newReceipt = await prisma.receipt.create({
    data: {
      receiptNo,
      date: new Date(date),
      partyId,
      amount,
      paymentType,
      bankId: paymentType === "bank" ? bankId : null,
      trxnId: paymentType === "bank" ? trxnId : null,
    },
  });

  if (paymentType === "cash") {
    await prisma.companyDetails.updateMany({
      data: {
        openingBal: {
          increment: parseFloat(amount),
        },
      },
    });
  } else if (paymentType === "bank") {
    await prisma.bank.update({
      where: { id: bankId },
      data: {
        openingBal: {
          increment: parseFloat(amount),
        },
      },
    });
  }

  res
    .status(201)
    .json(
      new StandardResponse("Receipt created successfully", newReceipt, 201)
    );
};

export const updateReceipt = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { receiptNo, date, partyId, amount, paymentType, bankId, trxnId } =
    req.body;

  if (!id || isNaN(parseInt(id))) {
    throw new CustomError("Invalid receipt ID", 400);
  }

  if (!receiptNo || !date || !partyId || !amount || !paymentType) {
    throw new CustomError("Missing required fields", 400);
  }

  if (paymentType === "bank") {
    if (!bankId || !trxnId) {
      throw new CustomError(
        "Bank ID and Transaction ID are required for bank payments",
        400
      );
    }
  }

  const existingReceipt = await prisma.receipt.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingReceipt) {
    throw new CustomError("Receipt not found", 404);
  }

  const partyExists = await prisma.party.findUnique({
    where: { id: partyId },
  });

  if (!partyExists) {
    throw new CustomError("Party not found", 404);
  }

  if (paymentType === "bank") {
    const bankExists = await prisma.bank.findUnique({
      where: { id: bankId },
    });
    if (!bankExists) {
      throw new CustomError("Bank not found", 404);
    }
  }

  if (existingReceipt.paymentType === "cash") {
    await prisma.companyDetails.updateMany({
      data: {
        openingBal: {
          decrement: parseFloat(existingReceipt.amount.toString()),
        },
      },
    });
  } else if (existingReceipt.paymentType === "bank" && existingReceipt.bankId) {
    await prisma.bank.update({
      where: { id: existingReceipt.bankId },
      data: {
        openingBal: {
          decrement: parseFloat(existingReceipt.amount.toString()),
        },
      },
    });
  }

  const updatedReceipt = await prisma.receipt.update({
    where: { id: parseInt(id) },
    data: {
      receiptNo,
      date: new Date(date),
      partyId,
      amount,
      paymentType,
      bankId: paymentType === "bank" ? bankId : null,
      trxnId: paymentType === "bank" ? trxnId : null,
    },
  });

  if (paymentType === "cash") {
    await prisma.companyDetails.updateMany({
      data: {
        openingBal: {
          increment: parseFloat(amount),
        },
      },
    });
  } else if (paymentType === "bank") {
    await prisma.bank.update({
      where: { id: bankId },
      data: {
        openingBal: {
          increment: parseFloat(amount),
        },
      },
    });
  }

  res
    .status(200)
    .json(
      new StandardResponse("Receipt updated successfully", updatedReceipt, 200)
    );
};
