import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createPurchase = async (req: Request, res: Response) => {
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
    purchaseItems,
  } = req.body;

  if (
    !invoiceNo ||
    !date ||
    !partyId ||
    !discount  ||
    !taxAmount ||
    !totalAmount ||
    !grandTotal  ||
    !received  ||
    !paymentType ||
    !trxnId ||
    !purchaseItems ||
    !Array.isArray(purchaseItems) ||
    purchaseItems.length === 0
  ) {
    throw new CustomError(
      "All fields are required including purchase items",
      400
    );
  }

  const existingInvoice = await prisma.purchase.findUnique({
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

  // Create purchase and nested items
  const newPurchase = await prisma.purchase.create({
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
      purchaseItems: {
        create: purchaseItems.map((item) => ({
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
      purchaseItems: true,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Purchase created successfully", newPurchase, 201)
    );
};

export const updatePurchase = async (req: Request, res: Response) => {
  const purchaseId = parseInt(req.params.id);
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
    purchaseItems,
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
    !purchaseItems ||
    !Array.isArray(purchaseItems) ||
    purchaseItems.length === 0
  ) {
    throw new CustomError(
      "All fields including purchase items are required",
      400
    );
  }

  const existingPurchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });

  if (!existingPurchase) {
    throw new CustomError("Purchase not found", 404);
  }

  const invoiceExists = await prisma.purchase.findFirst({
    where: {
      invoiceNo,
      NOT: { id: purchaseId },
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

  await prisma.purchaseItem.deleteMany({
    where: { purchaseId },
  });

  const updatedPurchase = await prisma.purchase.update({
    where: { id: purchaseId },
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
      purchaseItems: {
        create: purchaseItems.map((item) => ({
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
      purchaseItems: true,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse(
        "Purchase updated successfully",
        updatedPurchase,
        200
      )
    );
};
