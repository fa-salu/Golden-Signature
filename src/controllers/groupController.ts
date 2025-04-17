import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const addGroup = async (req: Request, res: Response) => {
    const { groupName } = req.body;

    if (!groupName || groupName.trim() === "") {
      throw new CustomError("Group name is required", 400);
    }

     const existingGroup = await prisma.group.findUnique({
       where: { groupName },
     });

     if (existingGroup) {
       throw new CustomError("Group name already exists", 400);
     }

     const newGroup = await prisma.group.create({
       data: {
         groupName,
       },
     });

     res
       .status(201)
       .json(new StandardResponse("Group created successfully", newGroup, 201));
}

export const updateGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { groupName } = req.body;

  if (!groupName || groupName.trim() === "") {
    throw new CustomError("Group name is required", 400);
  }

  const groupId = parseInt(id);
  if (isNaN(groupId)) {
    throw new CustomError("Invalid group ID", 400);
  }

  const groupExists = await prisma.group.findUnique({
    where: { id: groupId },
  });

  if (!groupExists) {
    throw new CustomError("Group not found", 404);
  }

  const duplicateGroup = await prisma.group.findUnique({
    where: { groupName },
  });

  if (duplicateGroup && duplicateGroup.id !== groupId) {
    throw new CustomError("Group name already exists", 400);
  }

  const updatedGroup = await prisma.group.update({
    where: { id: groupId },
    data: { groupName },
  });

  res
    .status(200)
    .json(new StandardResponse("Group updated successfully", updatedGroup));
};