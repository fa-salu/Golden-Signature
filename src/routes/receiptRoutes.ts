import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { receiptSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createReceipt, updateReceipt } from "../controllers/receiptController";

const router = express.Router();

router.post(
  "/receipt/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(receiptSchema),
  errorCatch(createReceipt)
);

router.put(
  "/receipt/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(receiptSchema),
  errorCatch(updateReceipt)
);

export default router;
