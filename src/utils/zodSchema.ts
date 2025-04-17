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
  emergencyNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits"),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["admin", "manager", "salesman", "accountant"], {
    errorMap: () => ({
      message: "Role must be one of: admin, manager, salesman, accountant",
    }),
  }),
  status: z.boolean(),
  address: z.string().optional(),
  image: z.string().optional(),
  groupId: z.number(),
});

const routeSchema = z.object({
  routeName: z.string().min(1, "Route name is required"),
  asOfDate: z.date(),
  notes: z.string().optional(),
});

const vehicleSchema = z.object({
  vehicleNumber: z.string().min(1, "Vehicle number is required"),
  vehicleName: z.string().min(1, "Vehicle name is required"),
  assignedRoute: z.string().min(1, "Route is required"),
  openingBalance: z.number().optional(),
  balanceType: z.enum(["pay", "receive"]).optional(),
  asOfDate: z.date(),
  status: z.enum(["available", "in-use"]),
});

const partySchema = z.object({
  partyName: z.string().min(1, "Party name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email"),
  assignedRoute: z.string().min(1, "Route is required"),
  address: z.string().min(1, "Address is required"),
  type: z.enum(["sales", "purchase"]),
  asOfDate: z.date(),
  openingBalance: z.number(),
  balanceType: z.enum(["pay", "receive"]),
});

const taxSchema = z.object({
  rateName: z.string().min(1, "Rate name is required"),
  rate: z.number().min(1, "Rate is required"),
});

const bankSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNumber: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  branchCode: z.string().min(1, "Branch code is required"),
  openingBalance: z.number(),
});

const itemSchema = z.object({
  code: z.string().min(1, "Item code is required"),
  itemName: z.string().min(1, "Item name is required"),
  itemType: z.enum(["product", "service"]),
  category: z.string().min(1, "Category is required"),
  purchaseRate: z.number().min(1, "Purchase rate is required"),
  saleRate: z.number().min(1, "Sale rate is required"),
  mrp: z.number().min(1, "MRP is required"),
  openingStock: z.number().min(1, "Opening stock is required"),
  taxRate: z.string().min(1, "Tax rate is required"),
  asOfDate: z.date(),
  notes: z.string().optional(),
});

const categorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
});

const receiptSchema = z
  .object({
    receiptNumber: z.string().min(1, "Receipt number is required"),
    date: z.date(),
    party: z.string().min(1, "Party is required"),
    amount: z.number().min(1, "Amount is required"),
    paymentType: z.enum(["cash", "bank"]),
    trxnId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentType === "bank" && !data.trxnId) {
      ctx.addIssue({
        path: ["trxnId"],
        code: z.ZodIssueCode.custom,
        message: "Transaction ID is required when payment type is bank",
      });
    }
  });

const paymentSchema = z
  .object({
    receiptNumber: z.string().min(1, "Receipt number is required"),
    date: z.date(),
    ledger: z.string().min(1, "Ledger is required"),
    ledgerGroup: z.enum(["User", "Party", "Vehicle"]),
    amount: z.number().min(1, "Amount is required"),
    paymentType: z.enum(["cash", "bank"]),
    trxnId: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentType === "bank" && !data.trxnId) {
      ctx.addIssue({
        path: ["trxnId"],
        code: z.ZodIssueCode.custom,
        message: "Transaction ID is required when payment type is bank",
      });
    }
  });

const groupSchema = z.object({
  groupName: z.string().min(1, "Group name must be at least 1 character long"),
});

export {
  loginSchema,
  userSchema,
  routeSchema,
  vehicleSchema,
  partySchema,
  taxSchema,
  bankSchema,
  itemSchema,
  categorySchema,
  receiptSchema,
  paymentSchema,
  groupSchema,
};
