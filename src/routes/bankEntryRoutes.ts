import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { BankEntrySchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createBankEntry, updateBankEntry } from "../controllers/bankEntryController";

const router = express.Router();

router.post(
  "/bankentry/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(BankEntrySchema),
  errorCatch(createBankEntry)
);

router.put(
  "/bankentry/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(BankEntrySchema),
  errorCatch(updateBankEntry)
);

export default router;
