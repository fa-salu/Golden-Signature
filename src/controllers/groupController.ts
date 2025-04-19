import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";

export const createGroup = async (req: Request, res: Response) => {
  const { groupName, actAs, underGroupId } = req.body;

  if (!groupName || !actAs) {
    throw new CustomError("Name and actAs are required", 400);
  }

  if ((actAs === "ledger" || actAs === "group_and_ledger") && !underGroupId) {
    throw new CustomError(
      "underGroupId is required when actAs is 'ledger' or 'group_and_ledger'",
      400
    );
  }

  if (underGroupId) {
    const underGroup = await prisma.group.findUnique({
      where: { id: underGroupId },
    });
    if (!underGroup) throw new CustomError("Under group not found", 404);
  }

  const newGroup = await prisma.group.create({
    data: {
      groupName,
      actAs,
      underGroupId: underGroupId || null,
    },
  });

  res
    .status(201)
    .json(new StandardResponse("Group created successfully", newGroup, 201));
};

export const updateGroup = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { groupName, actAs, underGroupId } = req.body;

  if (!id || !groupName || !actAs) {
    throw new CustomError("ID, name, and actAs are required", 400);
  }

  const validActAs = ["group", "ledger", "group_and_ledger"];
  if (!validActAs.includes(actAs)) {
    throw new CustomError(
      `actAs must be one of: ${validActAs.join(", ")}`,
      400
    );
  }

  const existingGroup = await prisma.group.findUnique({
    where: { id: Number(id) },
  });

  if (!existingGroup) {
    throw new CustomError("Group not found", 404);
  }

  if ((actAs === "ledger" || actAs === "group_and_ledger") && !underGroupId) {
    throw new CustomError(
      "underGroupId is required for selected actAs type",
      400
    );
  }

  if (underGroupId) {
    const underGroup = await prisma.group.findUnique({
      where: { id: underGroupId },
    });
    if (!underGroup) throw new CustomError("Under group not found", 404);
  }

  const updatedGroup = await prisma.group.update({
    where: { id: Number(id) },
    data: {
      groupName,
      actAs,
      underGroupId: underGroupId || null,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse("Group updated successfully", updatedGroup, 200)
    );
};
