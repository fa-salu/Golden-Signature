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
  openingBal: z.number().optional(),
  companyOpeningBal: z.number().optional(),
  joiningDate: z.coerce.date().optional(),
  salary: z.number().optional(),
});

const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  email: z.string().email("Invalid email format"),
  phoneNumber: z.string().min(10, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  gstNo: z.string().min(1, "GST number is required"),
  openingBal: z.coerce
    .number()
    .nonnegative("Opening balance must be a number")
    .default(0),
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
  actAs: z.enum(["group", "ledger", "group_and_ledger"]),
  underGroupId: z.number().optional(),
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

const damageStockSchema = z.object({
  damageId: z.string().min(1, "Damage ID is required"),
  date: z.coerce.date(),
  itemId: z.number(),
  quantity: z.number(),
});

const journalSchema = z.object({
  date: z.coerce.date(),
  groupId: z.number(),
  journalPaymentType: z.enum(["credit", "debit"]),
  particulars: z.array(
    z.object({
      particular: z.string(),
      amount: z.number(),
    })
  ),
});

const saleSchema = z.object({
  invoiceNo: z.string().min(1, "Receipt number is required"),
  date: z.coerce.date(),
  partyId: z.number().min(1, "Party is required"),
  paymentType: z.enum(["cash", "bank"]),
  trxnId: z.string().optional(),
  discount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  grandTotal: z.number(),
  received: z.number(),
  notes: z.string().optional(),
  saleItems: z.array(
    z.object({
      itemId: z.number(),
      quantity: z.number(),
      saleRate: z.number(),
      tax: z.number(),
      mrp: z.number(),
      totalAmount: z.number(),
    })
  ),
});

const purchaseSchema = z.object({
  invoiceNo: z.string().min(1, "Receipt number is required"),
  date: z.coerce.date(),
  partyId: z.number().min(1, "Party is required"),
  paymentType: z.enum(["cash", "bank"]),
  trxnId: z.string().optional(),
  discount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  grandTotal: z.number(),
  received: z.number(),
  notes: z.string().optional(),
  purchaseItems: z.array(
    z.object({
      itemId: z.number(),
      quantity: z.number(),
      purchaseRate: z.number(),
      tax: z.number(),
      mrp: z.number(),
      totalAmount: z.number(),
    })
  ),
});

const saleReturnSchema = z.object({
  invoiceNo: z.string().min(1, "Receipt number is required"),
  date: z.coerce.date(),
  partyId: z.number().min(1, "Party is required"),
  paymentType: z.enum(["cash", "bank"]),
  trxnId: z.string().optional(),
  discount: z.number(),
  taxAmount: z.number(),
  totalAmount: z.number(),
  grandTotal: z.number(),
  received: z.number(),
  notes: z.string().optional(),
  saleReturnItems: z.array(
    z.object({
      itemId: z.number(),
      quantity: z.number(),
      saleRate: z.number(),
      tax: z.number(),
      mrp: z.number(),
      totalAmount: z.number(),
    })
  ),
});

export {
  loginSchema,
  userSchema,
  companySchema,
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
  damageStockSchema,
  journalSchema,
  saleSchema,
  purchaseSchema,
  saleReturnSchema,
};
