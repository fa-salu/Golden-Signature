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

export const updateVehicleStock = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { stockNo, vehicleId, date, type, stockItems } = req.body;

  const vehicleStock = await prisma.vehicleStock.findUnique({
    where: { id: Number(id) },
    include: { stockItems: true },
  });

  if (!vehicleStock) {
    throw new CustomError("Vehicle stock not found", 404);
  }

  if (vehicleId && vehicleId !== vehicleStock.vehicleId) {
    const vehicle = await prisma.vehicle.findUnique({
      where: { id: vehicleId },
    });

    if (!vehicle) {
      throw new CustomError("Vehicle not found", 404);
    }
  }

  if (Array.isArray(stockItems)) {
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

    await prisma.vehicleStockItem.deleteMany({
      where: { vehicleStockId: vehicleStock.id },
    });

    await prisma.vehicleStockItem.createMany({
      data: stockItems.map((item) => ({
        itemId: item.itemId,
        quantity: item.quantity,
        vehicleStockId: vehicleStock.id,
      })),
    });
  }

  const updatedStock = await prisma.vehicleStock.update({
    where: { id: Number(id) },
    data: {
      stockNo,
      vehicleId,
      date: date ? new Date(date) : undefined,
      type,
    },
    include: {
      stockItems: true,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse(
        "Vehicle stock updated successfully",
        updatedStock,
        200
      )
    );
};
