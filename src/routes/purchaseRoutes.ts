import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { purchaseSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createPurchase, updatePurchase } from "../controllers/purchaseController";

const router = express.Router();

router.post(
  "/purchase/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(purchaseSchema),
  errorCatch(createPurchase)
);

router.put(
  "/purchase/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(purchaseSchema),
  errorCatch(updatePurchase)
);

export default router;
