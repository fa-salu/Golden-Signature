import { Request, Response } from "express";
import prisma from "../config/db";
import { StandardResponse } from "../utils/standardResponse";
import { CustomError } from "../utils/error/customError";

export const createVehicle = async (req: Request, res: Response) => {
  const { vehicleNo, vehicleName, status, asOfDate, assignedRouteId } =
    req.body;

  if (
    !vehicleNo ||
    !vehicleName ||
    typeof status !== "boolean" ||
    !asOfDate ||
    !assignedRouteId
  ) {
    throw new CustomError("All fields are required", 400);
  }

  const existingVehicle = await prisma.vehicle.findUnique({
    where: { vehicleNo },
  });

  if (existingVehicle) {
    throw new CustomError("Vehicle number already exists", 400);
  }

  const route = await prisma.route.findUnique({
    where: { id: assignedRouteId },
  });
  if (!route) throw new CustomError("Assigned route not found", 404);

  const newVehicle = await prisma.vehicle.create({
    data: {
      vehicleNo,
      vehicleName,
      status,
      asOfDate: new Date(asOfDate),
      assignedRouteId,
    },
  });

  res
    .status(201)
    .json(
      new StandardResponse("Vehicle created successfully", newVehicle, 201)
    );
};

export const updateVehicle = async (req: Request, res: Response) => {
  const vehicleId = parseInt(req.params.id);
  const { vehicleNo, vehicleName, status, asOfDate, assignedRouteId } =
    req.body;

  if (isNaN(vehicleId)) {
    throw new CustomError("Invalid vehicle ID", 400);
  }

  const vehicle = await prisma.vehicle.findUnique({
    where: { id: vehicleId },
  });

  if (!vehicle) {
    throw new CustomError("Vehicle not found", 404);
  }

  if (vehicleNo && vehicleNo !== vehicle.vehicleNo) {
    const existing = await prisma.vehicle.findUnique({
      where: { vehicleNo },
    });
    if (existing) {
      throw new CustomError("Vehicle number already exists", 400);
    }
  }

  if (assignedRouteId) {
    const route = await prisma.route.findUnique({
      where: { id: assignedRouteId },
    });
    if (!route) throw new CustomError("Assigned route not found", 404);
  }

  const updatedVehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data: {
      vehicleNo,
      vehicleName,
      status,
      asOfDate: new Date(asOfDate),
      assignedRouteId,
    },
  });

  res
    .status(200)
    .json(
      new StandardResponse("Vehicle updated successfully", updatedVehicle, 200)
    );
};
