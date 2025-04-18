import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { createTax, updateTax } from "../controllers/taxController";
import { errorCatch } from "../utils/error/error.Catch";
import { taxSchema } from "../utils/zodSchema";

const router = express.Router();

router.post(
  "/tax/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(taxSchema),
  errorCatch(createTax)
);

router.put(
  "/tax/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(taxSchema),
  errorCatch(updateTax)
);

export default router;
