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

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  name: z.string().optional(),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["admin", "manager", "salesman", "accountant"], {
    errorMap: () => ({
      message: "Role must be one of: admin, manager, salesman, accountant",
    }),
  }),
  status: z.enum(["active", "inactive"]).optional().default("active"),
  address: z.string().optional(),
  image: z.string().optional(),
});

export { loginSchema, userSchema };
