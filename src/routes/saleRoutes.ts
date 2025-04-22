import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { saleSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createSale, deleteSaleById, getAllSales, getSaleById, updateSale } from "../controllers/saleController";

const router = express.Router();

router.get(
  "/sale",
  verifyToken,
  authorizeRoles("admin"),
  errorCatch(getAllSales)
);

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

router.delete(
  "/sale/:id",
  verifyToken,
  authorizeRoles("admin"),
  errorCatch(deleteSaleById)
);

export default router;
