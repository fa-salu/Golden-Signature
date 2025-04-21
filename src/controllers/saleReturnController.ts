import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createSaleReturn = async (req: Request, res: Response) => {
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
    saleReturnItems,
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
    !saleReturnItems ||
    !Array.isArray(saleReturnItems) ||
    saleReturnItems.length === 0
  ) {
    throw new CustomError(
      "All fields are required including sale return items",
      400
    );
  }

  const existingInvoice = await prisma.saleReturn.findUnique({
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

  const newSaleReturn = await prisma.saleReturn.create({
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
      saleReturnItems: {
        create: saleReturnItems.map((item) => ({
          itemId: item.itemId,
          quantity: item.quantity,
          saleRate: item.saleRate,
          tax: item.tax,
          mrp: item.mrp,
          totalAmount: item.totalAmount,
        })),
      },
    },
    include: {
      saleReturnItems: true,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse(
        "Sale Return created successfully",
        newSaleReturn,
        201
      )
    );
};
