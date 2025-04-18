import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createItem = async (req: Request, res: Response) => {
  const {
    itemCode,
    itemName,
    itemType,
    categoryId,
    purchaseRate,
    saleRate,
    mrp,
    openingStock,
    minStock,
    taxId,
    asOfDate,
  } = req.body;

  if (
    !itemCode ||
    !itemName ||
    !itemType ||
    !categoryId ||
    !purchaseRate ||
    !saleRate ||
    !mrp ||
    !openingStock ||
    !minStock ||
    !taxId ||
    !asOfDate
  ) {
    throw new CustomError("Missing required fields", 400);
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  if (!categoryExists) {
    throw new CustomError("Category not found", 404);
  }

  const taxExists = await prisma.tax.findUnique({
    where: { id: taxId },
  });
  if (!taxExists) {
    throw new CustomError("Tax not found", 404);
  }

  const itemExists = await prisma.item.findUnique({
    where: { itemCode },
  });
  if (itemExists) {
    throw new CustomError("Item code already exists", 409);
  }

  const newItem = await prisma.item.create({
    data: {
      itemCode,
      itemName,
      itemType,
      categoryId,
      purchaseRate,
      saleRate,
      mrp,
      openingStock,
      minStock,
      taxId,
      asOfDate: new Date(asOfDate),
    },
  });

  res
    .status(201)
    .json(new StandardResponse("Item created successfully", newItem, 201));
};

export const updateItem = async (req: Request, res: Response) => {
  const itemId = parseInt(req.params.id);
  const {
    itemCode,
    itemName,
    itemType,
    categoryId,
    purchaseRate,
    saleRate,
    mrp,
    openingStock,
    minStock,
    taxId,
    asOfDate,
  } = req.body;

  if (
    !itemCode ||
    !itemName ||
    !itemType ||
    !categoryId ||
    !purchaseRate ||
    !saleRate ||
    !mrp ||
    !openingStock ||
    !minStock ||
    !taxId ||
    !asOfDate
  ) {
    throw new CustomError("Missing required fields", 400);
  }

  const existingItem = await prisma.item.findUnique({
    where: { id: itemId },
  });

  if (!existingItem) {
    throw new CustomError("Item not found", 404);
  }

  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });

  if (!category) {
    throw new CustomError("Category not found", 404);
  }

  const tax = await prisma.tax.findUnique({
    where: { id: taxId },
  });

  if (!tax) {
    throw new CustomError("Tax not found", 404);
  }

  const updatedItem = await prisma.item.update({
    where: { id: itemId },
    data: {
      itemCode,
      itemName,
      itemType,
      categoryId,
      purchaseRate,
      saleRate,
      mrp,
      openingStock,
      minStock,
      taxId,
      asOfDate: new Date(asOfDate),
    },
  });

  res
    .status(200)
    .json(new StandardResponse("Item updated successfully", updatedItem, 200));
};
