import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createTax = async (req: Request, res: Response) => {
  const { taxName, taxPercentage } = req.body;

  if (!taxName || !taxPercentage) {
    throw new CustomError("Tax name and tax percentage are required", 400);
  }

  const taxExists = await prisma.tax.findUnique({
    where: { taxName },
  });

  if (taxExists) {
    throw new CustomError("Tax with this name already exists", 400);
  }

  const newTax = await prisma.tax.create({
    data: {
      taxName,
      taxPercentage,
    },
  });

  res
    .status(201)
    .json(new StandardResponse("Tax created successfully", newTax, 201));
};

export const updateTax = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { taxName, taxPercentage } = req.body;

  if (!taxName || !taxPercentage) {
    throw new CustomError("Missing required fields", 400);
  }

  const tax = await prisma.tax.findUnique({
    where: { id: Number(id) },
  });

  if (!tax) {
    throw new CustomError("Tax record not found", 404);
  }

  const updatedTax = await prisma.tax.update({
    where: { id: Number(id) },
    data: {
      taxName,
      taxPercentage,
    },
  });

  res
    .status(200)
    .json(new StandardResponse("Tax updated successfully", updatedTax, 200));
};
