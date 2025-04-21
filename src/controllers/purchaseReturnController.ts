import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createPurchaseReturn = async (req: Request, res: Response) => {
  const {
    invoiceNo,
    date,
    partyId,
    taxAmount,
    totalAmount,
    grandTotal,
    received,
    paymentType,
    trxnId,
    notes,
    purchaseReturnItems,
  } = req.body;

  if (
    !invoiceNo ||
    !date ||
    !partyId ||
    !taxAmount ||
    !totalAmount ||
    !grandTotal ||
    !received ||
    !paymentType ||
    !purchaseReturnItems ||
    !Array.isArray(purchaseReturnItems) ||
    purchaseReturnItems.length === 0
  ) {
    throw new CustomError(
      "All fields are required including purchase return items",
      400
    );
  }

  const existingInvoice = await prisma.purchaseReturn.findUnique({
    where: { invoiceNo },
  });

  if (existingInvoice) {
    throw new CustomError("Invoice number already exists", 400);
  }

  const party = await prisma.party.findUnique({
    where: { id: partyId },
  });

  if (!party) {
    throw new CustomError("Party not found", 404);
  }

  const newPurchaseReturn = await prisma.purchaseReturn.create({
    data: {
      invoiceNo,
      date: new Date(date),
      partyId,
      taxAmount,
      totalAmount,
      grandTotal,
      received,
      paymentType,
      trxnId,
      notes,
      purchaseReturnItems: {
        create: purchaseReturnItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          purchaseRate: item.purchaseRate,
          tax: item.tax,
          mrp: item.mrp,
          totalAmount: item.totalAmount,
        })),
      },
    },
    include: {
      purchaseReturnItems: true,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse(
        "Purchase return created successfully",
        newPurchaseReturn,
        201
      )
    );
};

export const updatePurchaseReturn = async (req: Request, res: Response) => {
  const { id: purchaseReturnId } = req.params;
  const {
    invoiceNo,
    date,
    partyId,
    taxAmount,
    totalAmount,
    grandTotal,
    received,
    paymentType,
    trxnId,
    notes,
    purchaseReturnItems,
  } = req.body;

  if (
    !invoiceNo ||
    !date ||
    !partyId ||
    !taxAmount ||
    !totalAmount ||
    !grandTotal ||
    !received ||
    !paymentType ||
    !purchaseReturnItems ||
    !Array.isArray(purchaseReturnItems) ||
    purchaseReturnItems.length === 0
  ) {
    throw new CustomError("All fields are required including items", 400);
  }

  const existingPurchaseReturn = await prisma.purchaseReturn.findUnique({
    where: { id: Number(purchaseReturnId) },
  });

  if (!existingPurchaseReturn) {
    throw new CustomError("Purchase Return not found", 404);
  }

  const invoiceExists = await prisma.purchaseReturn.findFirst({
    where: {
      invoiceNo,
      NOT: { id: Number(purchaseReturnId) },
    },
  });

  if (invoiceExists) {
    throw new CustomError("Invoice number already exists", 400);
  }

  const party = await prisma.party.findUnique({
    where: { id: partyId },
  });

  if (!party) {
    throw new CustomError("Party not found", 404);
  }

  await prisma.purchaseReturnItem.deleteMany({
    where: { purchaseReturnId: Number(purchaseReturnId) },
  });

  const updatedPurchaseReturn = await prisma.purchaseReturn.update({
    where: { id: Number(purchaseReturnId) },
    data: {
      invoiceNo,
      date: new Date(date),
      partyId,
      taxAmount,
      totalAmount,
      grandTotal,
      received,
      paymentType,
      trxnId,
      notes,
      purchaseReturnItems: {
        create: purchaseReturnItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          purchaseRate: item.purchaseRate,
          tax: item.tax,
          mrp: item.mrp,
          totalAmount: item.totalAmount,
        })),
      },
    },
    include: {
      purchaseReturnItems: true,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse(
        "Purchase Return updated successfully",
        updatedPurchaseReturn,
        200
      )
    );
};
