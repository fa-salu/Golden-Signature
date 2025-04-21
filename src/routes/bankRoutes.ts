import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { bankSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createBank, updateBank } from "../controllers/bankController";

const router = express.Router();

router.post(
  "/bank/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(bankSchema),
  errorCatch(createBank)
);

router.put(
  "/bank/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(bankSchema),
  errorCatch(updateBank)
);

export default router;
