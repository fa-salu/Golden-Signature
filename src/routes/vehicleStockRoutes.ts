import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { vehicleStockSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createVehicleStock, updateVehicleStock } from "../controllers/vehicleStockController";

const router = express.Router();

router.post(
  "/vehiclestock/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(vehicleStockSchema),
  errorCatch(createVehicleStock)
);

router.put(
  "/vehiclestock/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(vehicleStockSchema),
  errorCatch(updateVehicleStock)
);

export default router;
