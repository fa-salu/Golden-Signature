import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { loginSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { login } from "../controllers/authController";

const router = express.Router();

router.post("/login", validateData(loginSchema), errorCatch(login));

export default router;
