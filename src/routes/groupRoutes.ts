import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { errorCatch } from "../utils/error/error.Catch";
import { createGroup, updateGroup } from "../controllers/groupController";
import { groupSchema } from "../utils/zodSchema";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post(
  "/group/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(groupSchema),
  errorCatch(createGroup)
);

router.put(
  "/group/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(groupSchema),
  errorCatch(updateGroup)
);
export default router;
