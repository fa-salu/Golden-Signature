import { Request, Response } from "express";
import { CustomError } from "../utils/error/customError";
import { StandardResponse } from "../utils/standardResponse";
import prisma from "../config/db";

export const createRoute = async (req: Request, res: Response) => {
  const { routeName, location, asOfDate } = req.body;

  if (!routeName || !location || !asOfDate) {
    throw new CustomError(
      "All fields (routeName, location, asOfDate) are required",
      400
    );
  }

  const newRoute = await prisma.route.create({
    data: {
      routeName,
      location,
      asOfDate: new Date(asOfDate),
    },
  });

  res
    .status(201)
    .json(new StandardResponse("Route created successfully", newRoute, 201));
};


export const updateRoute = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { routeName, location, asOfDate } = req.body;

  const routeId = parseInt(id);
  if (isNaN(routeId)) {
    throw new CustomError("Invalid route ID", 400);
  }

  const existingRoute = await prisma.route.findUnique({
    where: { id: routeId },
  });

  if (!existingRoute) {
    throw new CustomError("Route not found", 404);
  }

  const updatedRoute = await prisma.route.update({
    where: { id: routeId },
    data: {
      routeName,
      location,
      asOfDate: new Date(asOfDate),
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse("Route updated successfully", updatedRoute, 200)
    );
};