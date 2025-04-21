import express from "express";
import { verifyToken } from "../middlewares/verifyToken";
import { authorizeRoles } from "../middlewares/roleMiddleware";
import { validateData } from "../middlewares/zodValidation";
import { routeSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { createRoute, updateRoute } from "../controllers/routeController";

const router = express.Router();

router.post(
  "/route/create",
  verifyToken,
  authorizeRoles("admin"),
  validateData(routeSchema),
  errorCatch(createRoute)
);

router.put(
  "/route/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  validateData(routeSchema),
  errorCatch(updateRoute)
);

export default router;
