import express from "express";
import { validateData } from "../middlewares/zodValidation";
import { loginSchema } from "../utils/zodSchema";
import { errorCatch } from "../utils/error/error.Catch";
import { login } from "../controllers/authController";

const router = express.Router();

//Register user
// router.post("/register", validateData(registerSchema), errorCatch(register));
router.post("/login", validateData(loginSchema), errorCatch(login));

export default router;
