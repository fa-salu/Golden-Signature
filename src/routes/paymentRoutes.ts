import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { paymentSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createPayment, updatePayment } from "../controllers/paymentController";

const router = express.Router();

router.post(
  "/payment/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(paymentSchema),
  errorCatch(createPayment)
);

router.put(
  "/payment/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(paymentSchema),
  errorCatch(updatePayment)
);

export default router;
