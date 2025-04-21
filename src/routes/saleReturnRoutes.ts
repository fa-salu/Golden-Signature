import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { saleReturnSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createSaleReturn } from "../controllers/saleReturnController";

const router = express.Router();

router.post(
  "/salereturn/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(saleReturnSchema),
  errorCatch(createSaleReturn)
);

export default router;
