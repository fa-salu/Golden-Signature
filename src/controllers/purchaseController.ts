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
    bankId,
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
      "All fields are required including purchase items",
      400
    );
  }

  if (paymentType === "bank" && !bankId) {
    throw new CustomError("Bank ID is required for bank payments", 400);
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

  const result = await prisma.$transaction(async (prismaClient) => {
    const newPurchase = await prismaClient.purchase.create({
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
        bankId,
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

    if (paymentType === "cash") {
      const company = await prismaClient.companyDetails.findFirst();

      if (!company) {
        throw new CustomError("Company record not found", 404);
      }

      await prismaClient.companyDetails.update({
        where: { id: company.id },
        data: {
          openingBal: {
            decrement: received,
          },
        },
      });
    } else if (paymentType === "bank") {
      const bank = await prismaClient.bank.findUnique({
        where: { id: bankId },
      });

      if (!bank) {
        throw new CustomError("Bank not found", 404);
      }

      await prismaClient.bank.update({
        where: { id: bankId },
        data: {
          openingBal: {
            decrement: received,
          },
        },
      });
    }

    return newPurchase;
  });

  res
    .status(201)
    .json(new StandardResponse("Purchase created successfully", result, 201));
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
    bankId,
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

  if (paymentType === "bank" && !bankId) {
    throw new CustomError("Bank ID is required for BANK payment type", 400);
  }

  const trimmedInvoiceNo = invoiceNo.trim();

  if (trimmedInvoiceNo !== existingPurchase.invoiceNo.trim()) {
    const invoiceExists = await prisma.purchase.findFirst({
      where: {
        invoiceNo: trimmedInvoiceNo,
        NOT: { id: purchaseId },
      },
    });

    if (invoiceExists) {
      throw new CustomError("Invoice number already exists", 400);
    }
  }

  const party = await prisma.party.findUnique({
    where: { id: partyId },
  });

  if (!party) {
    throw new CustomError("Party not found", 404);
  }

  const result = await prisma.$transaction(async (tx) => {
    if (existingPurchase.paymentType === "cash") {
      const company = await tx.companyDetails.findFirst();
      if (!company) throw new CustomError("Company not found", 404);
      await tx.companyDetails.update({
        where: { id: company.id },
        data: {
          openingBal: {
            increment: existingPurchase.received,
          },
        },
      });
    } else if (existingPurchase.paymentType === "bank") {
      if (!existingPurchase.bankId)
        throw new CustomError("Previous bankId missing", 400);
      const prevBank = await tx.bank.findUnique({
        where: { id: existingPurchase.bankId },
      });
      if (!prevBank) throw new CustomError("Previous bank not found", 404);
      await tx.bank.update({
        where: { id: prevBank.id },
        data: {
          openingBal: {
            increment: existingPurchase.received,
          },
        },
      });
    }

    await tx.purchaseItem.deleteMany({
      where: { purchaseId },
    });

    const updatedPurchase = await tx.purchase.update({
      where: { id: purchaseId },
      data: {
        invoiceNo: trimmedInvoiceNo,
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
        bankId,
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

    if (paymentType === "cash") {
      const company = await tx.companyDetails.findFirst();
      if (!company) throw new CustomError("Company not found", 404);
      await tx.companyDetails.update({
        where: { id: company.id },
        data: {
          openingBal: {
            decrement: received,
          },
        },
      });
    } else if (paymentType === "bank") {
      const currentBank = await tx.bank.findUnique({
        where: { id: bankId },
      });
      if (!currentBank) throw new CustomError("Bank not found", 404);
      await tx.bank.update({
        where: { id: bankId },
        data: {
          openingBal: {
            decrement: received,
          },
        },
      });
    }

    return updatedPurchase;
  });

  res
    .status(200)
    .json(new StandardResponse("Purchase updated successfully", result, 200));
};
