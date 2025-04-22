import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { receiptSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createReceipt, getAllReceipts, getReceiptById, updateReceipt } from "../controllers/receiptController";

const router = express.Router();

router.get(
  "/receipt",
  verifyToken,
  authorizeRoles("admin"),
  errorCatch(getAllReceipts)
);

router.get(
  "/receipt/:id",
  verifyToken,
  authorizeRoles("admin"),
  errorCatch(getReceiptById)
);

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

router.delete(
  "/receipt/:id",
  verifyToken,
  authorizeRoles("admin"),
  errorCatch(getReceiptById)
);

export default router;
