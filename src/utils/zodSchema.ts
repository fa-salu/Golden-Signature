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
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  emergencyNumber: z.string().min(10).optional(),
  password: z.string().min(4, "Password must be at least 4 characters"),
  role: z.enum(["admin", "manager", "salesman", "accountant"]),
  status: z.boolean().default(true),
  address: z.string().optional(),
  image: z.string().optional(),
  groupId: z.number(),
  openingBal: z.string().optional(),
  companyOpeningBal: z.string().optional(),
});

const routeSchema = z.object({
  routeName: z.string().min(1, "Route name is required"),
  asOfDate: z.coerce.date(),
  location: z.string().min(1, "Location is required"),
});

const vehicleSchema = z.object({
  vehicleNo: z.string().min(1, "Vehicle number is required"),
  vehicleName: z.string().min(1, "Vehicle name is required"),
  assignedRouteId: z.number().min(1, "Route is required"),
  groupId: z.number().min(1, "Group is required"),
  asOfDate: z.coerce.date(),
  status: z.boolean(),
});

const partySchema = z.object({
  partyName: z.string().min(1, "Party name is required"),
  phoneNumber: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email"),
  assignedRouteId: z.number(),
  address: z.string().min(1, "Address is required"),
  latitude: z.number(),
  longitude: z.number(),
  partyType: z.enum(["sale", "purchase", "sale_and_purchase"]),
  routePriority: z.number(),
  asOfDate: z.coerce.date(),
  openingBal: z.number(),
  balanceType: z.enum(["pay", "receive"]),
  status: z.boolean(),
  groupId: z.number(),
});

const taxSchema = z.object({
  taxName: z.string().min(1, "Rate name is required"),
  taxPercentage: z.number().min(1, "Rate is required"),
});

const bankSchema = z.object({
  accountName: z.string().min(1, "Account name is required"),
  accountNo: z.string().min(1, "Account number is required"),
  bankName: z.string().min(1, "Bank name is required"),
  openingBal: z.number(),
});

const itemSchema = z.object({
  itemCode: z.string().min(1, "Item code is required"),
  itemName: z.string().min(1, "Item name is required"),
  itemType: z.enum(["product", "service"]),
  categoryId: z.number().min(1, "Category is required"),
  purchaseRate: z.number().min(1, "Purchase rate is required"),
  saleRate: z.number().min(1, "Sale rate is required"),
  mrp: z.number().min(1, "MRP is required"),
  openingStock: z.number().min(1, "Opening stock is required"),
  minStock: z.number().min(1, "Opening stock is required"),
  taxId: z.number().min(1, "Tax rate is required"),
  asOfDate: z.coerce.date(),
  notes: z.string().optional(),
});

const categorySchema = z.object({
  categoryName: z.string().min(1, "Category name is required"),
});

const receiptSchema = z.object({
  receiptNo: z.string().min(1, "Receipt number is required"),
  date: z.coerce.date(),
  partyId: z.number().min(1, "Party is required"),
  bankId: z.number().optional(),
  amount: z.number().min(1, "Amount is required"),
  paymentType: z.enum(["cash", "bank"]),
  trxnId: z.string().optional(),
});

const paymentSchema = z.object({
  paymentNo: z.string().min(1, "Receipt number is required"),
  date: z.coerce.date(),
  payeeType: z.enum(["staff", "party", "vehicle", "group"]),
  payeeId: z.number().min(1, "Payee is required"),
  amount: z.number().min(1, "Amount is required"),
  paymentType: z.enum(["cash", "bank"]),
  bankId: z.number().optional(),
  trxnId: z.string().optional(),
});

const groupSchema = z.object({
  groupName: z.string().min(1, "Group name must be at least 1 character long"),
});

const BankEntrySchema = z.object({
  trxnNumber: z.string().min(1),
  date: z.coerce.date(),
  bankId: z.number(),
  amount: z.number().min(1, "Amount is required"),
  amountType: z.enum(["deposit", "withdraw"]),
  trxnId: z.string().min(1, "Transaction ID is required"),
});

const vehicleStockSchema = z.object({
  stockNo: z.string().min(1, "Stock number is required"),
  vehicleId: z.number().int().positive("Vehicle ID must be a positive integer"),
  date: z.coerce.date(),
  type: z.enum(["stock_in", "stock_out"]),
  stockItems: z
    .array(
      z.object({
        itemId: z.number(),
        quantity: z.number(),
      })
    )
    .nonempty("At least one stock item is required"),
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
  BankEntrySchema,
  vehicleStockSchema,
};
