import { z } from "zod";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?[0-9]{10,15}$/;
const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .transform((val, ctx) => {
      if (emailRegex.test(val)) {
        return { value: val, type: "email" as const };
      }
      if (phoneRegex.test(val)) {
        return { value: val, type: "phone" as const };
      }
      if (usernameRegex.test(val)) {
        return { value: val, type: "username" as const };
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Username must be a valid email, phone number, or username",
      });
      return z.NEVER;
    }),
  password: z
    .string()
    .min(4, "Password is required and must be at least 4 characters"),
});

export { loginSchema };
