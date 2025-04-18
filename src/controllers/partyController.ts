import { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";

export const createParty = async (req: Request, res: Response) => {
  const {
    partyName,
    phoneNumber,
    email,
    assignedRouteId,
    address,
    latitude,
    longitude,
    partyType,
    routePriority,
    asOfDate,
    openingBal,
    balanceType,
    status,
    groupId,
  } = req.body;

  const existingPhone = await prisma.party.findUnique({
    where: { phoneNumber },
  });

  if (existingPhone) {
    throw new CustomError("Phone number already exists", 400);
  }

  const existingEmail = await prisma.party.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new CustomError("Email already exists", 400);
  }

  const newParty = await prisma.party.create({
    data: {
      partyName,
      phoneNumber,
      email,
      assignedRouteId,
      address,
      latitude,
      longitude,
      partyType,
      routePriority,
      asOfDate: new Date(asOfDate),
      openingBal,
      balanceType,
      status,
      groupId,
    },
  });

  res
    .status(201)
    .json(new StandardResponse("Party created successfully", newParty, 201));
};

export const updateParty = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    partyName,
    phoneNumber,
    email,
    assignedRouteId,
    address,
    latitude,
    longitude,
    partyType,
    routePriority,
    asOfDate,
    openingBal,
    balanceType,
    status,
    groupId,
  } = req.body;

  const existingParty = await prisma.party.findUnique({
    where: { id: Number(id) },
  });

  if (!existingParty) {
    throw new CustomError("Party not found", 404);
  }

  const updatedParty = await prisma.party.update({
    where: { id: Number(id) },
    data: {
      partyName,
      phoneNumber,
      email,
      assignedRouteId,
      address,
      latitude,
      longitude,
      partyType,
      routePriority,
      asOfDate: new Date(asOfDate),
      openingBal,
      balanceType,
      status,
      groupId,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse("Party updated successfully", updatedParty, 200)
    );
};
