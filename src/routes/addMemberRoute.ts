import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { verifyToken } from "../middlewares/verifyToken";
import { addMember, updateMember } from "../controllers/addMember";
import { validateData } from "../middlewares/zodValidation";
import { userSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";

const router = express.Router();

router.post(
  "/add",
  verifyToken,
  validateData(userSchema),
  authorizeRoles("admin"),
  errorCatch(addMember)
);

router.put(
  "/update",
  verifyToken,
  validateData(userSchema),
  errorCatch(updateMember)
);

export default router;
