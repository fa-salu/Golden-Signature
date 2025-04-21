import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { damageStockSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createDamageStock, updateDamageStock } from "../controllers/damageStockController";

const router = express.Router();

router.post(
  "/damagestock/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(damageStockSchema),
  errorCatch(createDamageStock)
);

router.put(
  "/damagestock/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(damageStockSchema),
  errorCatch(updateDamageStock)
);

export default router;
