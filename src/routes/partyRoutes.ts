import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { errorCatch } from "../utils/error/error.Catch";
import { partySchema } from "../utils/zodSchema";
import { createParty } from "../controllers/partyController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post(
  "/party/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(partySchema),
  errorCatch(createParty)
);

export default router;
