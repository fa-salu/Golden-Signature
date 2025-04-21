import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { itemSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createItem, updateItem } from "../controllers/itemController";

const router = express.Router();

router.post(
  "/item/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(itemSchema),
  errorCatch(createItem)
);

router.put(
  "/item/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(itemSchema),
  errorCatch(updateItem)
);

export default router;
