import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { vehicleSchema } from "../utils/zodSchema";
import { createVehicle, updateVehicle } from "../controllers/vehicleController";
import { errorCatch } from "../utils/error/error.Catch";


const router = express.Router();

router.post(
  "/vehicle/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(vehicleSchema),
  errorCatch(createVehicle)
);

router.put(
  "/vehicle/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(vehicleSchema),
  errorCatch(updateVehicle)
);

export default router;
