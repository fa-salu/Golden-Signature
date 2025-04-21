import express from "express";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { errorCatch } from "../utils/error/error.Catch";
import { partySchema } from "../utils/zodSchema";
import { createParty, updateParty } from "../controllers/partyController";
import { verifyToken } from "../middlewares/verifyToken";

const router = express.Router();

router.post(
  "/party/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(partySchema),
  errorCatch(createParty)
);

router.put(
  "/party/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(partySchema),
  errorCatch(updateParty)
);

export default router;
