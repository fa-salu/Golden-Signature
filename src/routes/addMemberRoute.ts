import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { verifyToken } from "../middlewares/verifyToken";
import { addMember } from "../controllers/addMember";
import { validateData } from "../middlewares/zodValidation";
import { userSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";

const router = express.Router();

router.post(
  "/members/add",
  validateData(userSchema),
  authorizeRoles("admin"),
  verifyToken,
  errorCatch(addMember)
);

// router.put(
//   "/update",
//   verifyToken,
//   validateData(userSchema),
//   errorCatch(updateMember)
// );

export default router;
