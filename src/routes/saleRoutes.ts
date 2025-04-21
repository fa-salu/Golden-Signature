import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { saleSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createSale, getSaleById, updateSale } from "../controllers/saleController";

const router = express.Router();

router.get(
  "/sale/:id",
  verifyToken,
  authorizeRoles("admin"),
  errorCatch(getSaleById)
);

router.post(
  "/sale/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(saleSchema),
  errorCatch(createSale)
);

router.put(
  "/sale/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(saleSchema),
  errorCatch(updateSale)
);

export default router;
