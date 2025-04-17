import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { errorCatch } from "../utils/error/error.Catch";
import { addGroup, updateGroup } from "../controllers/groupController";
import { groupSchema } from "../utils/zodSchema";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post(
  "/group/add",
  verifyToken,
  authorizeRoles("admin"),
  validateData(groupSchema),
  errorCatch(addGroup)
);

router.post(
  "/group/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(groupSchema),
  errorCatch(updateGroup)
);
export default router;
