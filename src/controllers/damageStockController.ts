import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createDamageStock = async (req: Request, res: Response) => {
  const { damageId, date, itemId, quantity } = req.body;

  if (!damageId || !date || !itemId || !quantity) {
    throw new CustomError("Missing required fields", 400);
  }

  const itemExists = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!itemExists) {
    throw new CustomError("Item not found", 404);
  }

  const existingDamage = await prisma.damageStock.findUnique({
    where: { damageId },
  });

  if (existingDamage) {
    throw new CustomError("Damage ID already exists", 400);
  }

  const damageStock = await prisma.damageStock.create({
    data: {
      damageId,
      date: new Date(date),
      itemId,
      quantity,
    },
  });

  res
    .status(201)
    .json(new StandardResponse("Damage stock entry created", damageStock, 201));
};

export const updateDamageStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { date, itemId, quantity } = req.body;

  const existingDamage = await prisma.damageStock.findUnique({
    where: { id: Number(id) },
  });

  if (!existingDamage) {
    throw new CustomError("Damage stock not found", 404);
  }

  const itemExists = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!itemExists) {
    throw new CustomError("Item not found", 404);
  }

  const updatedDamageStock = await prisma.damageStock.update({
    where: { id: Number(id) },
    data: {
      date: new Date(date),
      itemId,
      quantity,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse(
        "Damage stock updated successfully",
        updatedDamageStock,
        200
      )
    );
};
