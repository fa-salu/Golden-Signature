import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { errorCatch } from "../utils/error/error.Catch";
import { createPurchaseReturn, updatePurchaseReturn } from "../controllers/purchaseReturnController";
import { purchaseReturnSchema } from "../utils/zodSchema";

const router = express.Router();

router.post(
  "/purchasereturn/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(purchaseReturnSchema),
  errorCatch(createPurchaseReturn)
);

router.put(
  "/purchasereturn/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(purchaseReturnSchema),
  errorCatch(updatePurchaseReturn)
);

export default router;
