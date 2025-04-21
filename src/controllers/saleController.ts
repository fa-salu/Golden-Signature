import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createSale = async (req: Request, res: Response) => {
  const {
    invoiceNo,
    date,
    partyId,
    discount,
    taxAmount,
    totalAmount,
    grandTotal,
    received,
    paymentType,
    trxnId,
    notes,
    saleItems,
    approvedBy,
  } = req.body;

  if (
    !invoiceNo ||
    !date ||
    !partyId ||
    !discount ||
    !taxAmount ||
    !totalAmount ||
    !grandTotal ||
    !received ||
    !paymentType ||
    !trxnId ||
    !saleItems ||
    !Array.isArray(saleItems) ||
    saleItems.length === 0
  ) {
    throw new CustomError("All fields are required including sale items", 400);
  }

  const existingInvoice = await prisma.sale.findUnique({
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

  const newSale = await prisma.sale.create({
    data: {
      invoiceNo,
      date: new Date(date),
      partyId,
      discount,
      taxAmount,
      totalAmount,
      grandTotal,
      received,
      paymentType,
      trxnId,
      notes,
      approvedBy,
      saleItems: {
        create: saleItems.map((item) => ({
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
      saleItems: true,
    },
  });

  res
    .status(201)
    .json(new StandardResponse("Sale created successfully", newSale, 201));
};

export const updateSale = async (req: Request, res: Response) => {
  const saleId = parseInt(req.params.id);
  const {
    invoiceNo,
    date,
    partyId,
    discount,
    taxAmount,
    totalAmount,
    grandTotal,
    received,
    paymentType,
    trxnId,
    notes,
    saleItems,
  } = req.body;

  if (
    !invoiceNo ||
    !date ||
    !partyId ||
    !discount ||
    !taxAmount ||
    !totalAmount ||
    !grandTotal ||
    !received ||
    !paymentType ||
    !trxnId ||
    !saleItems ||
    !Array.isArray(saleItems) ||
    saleItems.length === 0
  ) {
    throw new CustomError("All fields are required including sale items", 400);
  }

  const existingSale = await prisma.sale.findUnique({
    where: { id: saleId },
  });

  if (!existingSale) {
    throw new CustomError("Sale not found", 404);
  }

  const invoiceExists = await prisma.sale.findFirst({
    where: {
      invoiceNo,
      id: {
        not: saleId,
      },
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

  await prisma.saleItem.deleteMany({
    where: { saleId },
  });

  const updatedSale = await prisma.sale.update({
    where: { id: saleId },
    data: {
      invoiceNo,
      date: new Date(date),
      partyId,
      discount,
      taxAmount,
      totalAmount,
      grandTotal,
      received,
      paymentType,
      trxnId,
      notes,
      saleItems: {
        create: saleItems.map((item) => ({
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
      saleItems: true,
    },
  });

  res
    .status(200)
    .json(new StandardResponse("Sale updated successfully", updatedSale, 200));
};
