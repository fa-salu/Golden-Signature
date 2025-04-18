import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createVehicleStock = async (req: Request, res: Response) => {
  const { stockNo, vehicleId, date, type, stockItems } = req.body;

  if (!stockNo || !vehicleId || !date || !type || !Array.isArray(stockItems)) {
    throw new CustomError(
      "Missing required fields or stockItems must be an array",
      400
    );
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new CustomError("Vehicle not found", 404);
  }

  for (const item of stockItems) {
    if (!item.itemId || !item.quantity) {
      throw new CustomError(
        "Each stock item must include itemId and quantity",
        400
      );
    }

    const itemExists = await prisma.item.findUnique({
      where: { id: item.itemId },
    });

    if (!itemExists) {
      throw new CustomError(`Item not found with ID ${item.itemId}`, 404);
    }
  }

  const newStock = await prisma.vehicleStock.create({
    data: {
      stockNo,
      vehicleId,
      date: new Date(date),
      type,
      stockItems: {
        create: stockItems.map(
          (item: { itemId: number; quantity: number }) => ({
            itemId: item.itemId,
            quantity: item.quantity,
          })
        ),
      },
    },
    include: {
      stockItems: true,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Vehicle stock created successfully", newStock, 201)
    );
};
