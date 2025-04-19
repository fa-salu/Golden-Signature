import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { journalSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createJournal, updateJournal } from "../controllers/journalController";

const router = express.Router();

router.post(
  "/journal/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(journalSchema),
  errorCatch(createJournal)
);

router.put(
  "/journal/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(journalSchema),
  errorCatch(updateJournal)
);

export default router;
