import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createPayment = async (req: Request, res: Response) => {
  const {
    paymentNo,
    date,
    payeeType,
    payeeId,
    amount,
    paymentType,
    bankId,
    trxnId,
  } = req.body;

  if (
    !paymentNo ||
    !date ||
    !payeeType ||
    !payeeId ||
    !amount ||
    !paymentType
  ) {
    throw new CustomError("Missing required fields", 400);
  }

  if (paymentType === "bank" && (!bankId || !trxnId)) {
    throw new CustomError(
      "Bank ID and Transaction ID are required for bank payments",
      400
    );
  }

  let payeeExists = null;

  switch (payeeType) {
    case "party":
      payeeExists = await prisma.party.findUnique({ where: { id: payeeId } });
      break;
    case "vehicle":
      payeeExists = await prisma.vehicle.findUnique({ where: { id: payeeId } });
      break;
    case "staff":
      payeeExists = await prisma.user.findUnique({ where: { id: payeeId } });
      break;
    case "group":
      payeeExists = await prisma.group.findUnique({ where: { id: payeeId } });
      break;
    default:
      throw new CustomError("Invalid payee type", 400);
  }

  if (!payeeExists) {
    throw new CustomError(`${payeeType} not found`, 404);
  }

  if (paymentType === "bank") {
    const bankExists = await prisma.bank.findUnique({ where: { id: bankId } });
    if (!bankExists) {
      throw new CustomError("Bank not found", 404);
    }
  }

  const newPayment = await prisma.payment.create({
    data: {
      paymentNo,
      date: new Date(date),
      payeeType,
      payeeId,
      amount,
      paymentType,
      bankId: paymentType === "bank" ? bankId : null,
      trxnId: paymentType === "bank" ? trxnId : null,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Payment created successfully", newPayment, 201)
    );
};

export const updatePayment = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    paymentNo,
    date,
    payeeType,
    payeeId,
    amount,
    paymentType,
    bankId,
    trxnId,
  } = req.body;

  if (
    !paymentNo ||
    !date ||
    !payeeType ||
    !payeeId ||
    !amount ||
    !paymentType
  ) {
    throw new CustomError("Missing required fields", 400);
  }

  if (paymentType === "bank" && (!bankId || !trxnId)) {
    throw new CustomError(
      "Bank ID and Transaction ID are required for bank payments",
      400
    );
  }

  const existingPayment = await prisma.payment.findUnique({
    where: { id: Number(id) },
  });

  if (!existingPayment) {
    throw new CustomError("Payment not found", 404);
  }

  if (paymentType === "bank") {
    const bankExists = await prisma.bank.findUnique({
      where: { id: bankId },
    });
    if (!bankExists) {
      throw new CustomError("Bank not found", 404);
    }
  }

  if (payeeType === "party") {
    const party = await prisma.party.findUnique({ where: { id: payeeId } });
    if (!party) throw new CustomError("Party not found", 404);
  } else if (payeeType === "staff") {
    const user = await prisma.user.findUnique({ where: { id: payeeId } });
    if (!user) throw new CustomError("Staff not found", 404);
  } else if (payeeType === "vehicle") {
    const vehicle = await prisma.vehicle.findUnique({ where: { id: payeeId } });
    if (!vehicle) throw new CustomError("Vehicle not found", 404);
  } else if (payeeType === "group") {
    const group = await prisma.group.findUnique({ where: { id: payeeId } });
    if (!group) throw new CustomError("Group not found", 404);
  }

  const updatedPayment = await prisma.payment.update({
    where: { id: Number(id) },
    data: {
      paymentNo,
      date: new Date(date),
      payeeType,
      payeeId,
      amount,
      paymentType,
      bankId: paymentType === "bank" ? bankId : null,
      trxnId: paymentType === "bank" ? trxnId : null,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse("Payment updated successfully", updatedPayment, 200)
    );
};
