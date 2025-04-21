import { Request, Response } from "express";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";
import prisma from "../config/db";

export const addCompanyDetails = async (req: Request, res: Response) => {
  const existing = await prisma.companyDetails.findFirst();

  if (existing) {
    throw new CustomError(
      "Company details already exist. You can only update",
      400
    );
  }

  const { companyName, email, phoneNumber, address, gstNo, openingBal } =
    req.body;

  const newCompany = await prisma.companyDetails.create({
    data: {
      companyName,
      email,
      phoneNumber,
      address,
      gstNo,
      openingBal,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse(
        "Company details added successfully",
        newCompany,
        201
      )
    );
};

export const getCompanyDetails = async (req: Request, res: Response) => {
  const details = await prisma.companyDetails.findFirst();
  if (!details) {
    throw new CustomError("No company details found", 400);
  }

  res
    .status(200)
    .json(new StandardResponse("Company details added successfully", details));
};

export const updateCompanyDetails = async (req: Request, res: Response) => {
  const existing = await prisma.companyDetails.findFirst();

  if (!existing) {
    throw new CustomError("Company details not found", 400);
  }

  const updated = await prisma.companyDetails.update({
    where: { id: existing.id },
    data: req.body,
  });

  res
    .status(200)
    .json(new StandardResponse("Company details updated", updated));
};
