import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { errorCatch } from "../utils/error/error.Catch";
import {
  addCompanyDetails,
  getCompanyDetails,
  updateCompanyDetails,
} from "../controllers/companyController";
import { companySchema } from "../utils/zodSchema";

const router = express.Router();

router.post(
  "/company/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(companySchema),
  errorCatch(addCompanyDetails)
);

router.get(
  "/company",
  verifyToken,
  authorizeRoles("admin"),
  errorCatch(getCompanyDetails)
);

router.put(
  "/company/update",
  verifyToken,
  authorizeRoles("admin"),
  validateData(companySchema),
  errorCatch(updateCompanyDetails)
);

export default router;
