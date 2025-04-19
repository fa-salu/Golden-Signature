import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createJournal = async (req: Request, res: Response) => {
  const { date, groupId, journalPaymentType, particulars } = req.body;

  if (
    !date ||
    !groupId ||
    !journalPaymentType ||
    !Array.isArray(particulars) ||
    particulars.length === 0
  ) {
    throw new CustomError(
      "All fields are required and particulars must be a non-empty array",
      400
    );
  }

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });
  if (!group) throw new CustomError("Group not found", 404);

  for (const p of particulars) {
    if (!p.particular || typeof p.amount !== "number") {
      throw new CustomError(
        "Each particular must include a valid 'particular' and numeric 'amount'",
        400
      );
    }
  }

  const newJournal = await prisma.journal.create({
    data: {
      date: new Date(date),
      groupId,
      journalPaymentType,
      particulars: {
        create: particulars.map((item) => ({
          particular: item.particular,
          amount: item.amount,
        })),
      },
    },
    include: {
      particulars: true,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Journal created successfully", newJournal, 201)
    );
};

export const updateJournal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, groupId, journalPaymentType, particulars } = req.body;

  if (!date || !groupId || !journalPaymentType || !Array.isArray(particulars)) {
    throw new CustomError("All fields are required", 400);
  }

  const journalId = parseInt(id);
  if (isNaN(journalId)) throw new CustomError("Invalid journal ID", 400);

  const journal = await prisma.journal.findUnique({
    where: { id: journalId },
  });
  if (!journal) throw new CustomError("Journal not found", 404);

  const group = await prisma.group.findUnique({
    where: { id: groupId },
  });
  if (!group) throw new CustomError("Group not found", 404);

  const updatedJournal = await prisma.journal.update({
    where: { id: journalId },
    data: {
      date: new Date(date),
      groupId,
      journalPaymentType,
    },
  });

  // Delete existing particulars
  await prisma.journalParticular.deleteMany({
    where: { journalId },
  });

  // Re-create particulars
  await prisma.journalParticular.createMany({
    data: particulars.map((item: any) => ({
      particular: item.particular,
      amount: item.amount,
      journalId,
    })),
  });

  // Fetch and return updated journal with particulars
  const result = await prisma.journal.findUnique({
    where: { id: journalId },
    include: {
      particulars: true,
    },
  });

  res
    .status(200)
    .json(new StandardResponse("Journal updated successfully", result, 200));
};
