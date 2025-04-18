import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { categorySchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import {
  createCategory,
  updateCategory,
} from "../controllers/categoryController";

const router = express.Router();

router.post(
  "/category/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(categorySchema),
  errorCatch(createCategory)
);

router.put(
  "/category/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(categorySchema),
  errorCatch(updateCategory)
);

export default router;
