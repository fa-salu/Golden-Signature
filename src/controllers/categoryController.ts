import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createCategory = async (req: Request, res: Response) => {
  const { categoryName } = req.body;

  if (!categoryName) {
    throw new CustomError("Category name is required", 400);
  }

  const existingCategory = await prisma.category.findUnique({
    where: { categoryName },
  });

  if (existingCategory) {
    throw new CustomError("Category already exists", 409);
  }

  const newCategory = await prisma.category.create({
    data: {
      categoryName,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Category created successfully", newCategory, 201)
    );
};

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params; 
  const { categoryName } = req.body; 

  if (!categoryName) {
    throw new CustomError("Category name is required", 400);
  }

  const categoryExists = await prisma.category.findUnique({
    where: { id: parseInt(id) },
  });

  if (!categoryExists) {
    throw new CustomError("Category not found", 404);
  }

  const updatedCategory = await prisma.category.update({
    where: { id: parseInt(id) },
    data: {
      categoryName, 
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse(
        "Category updated successfully",
        updatedCategory,
        200
      )
    );
};