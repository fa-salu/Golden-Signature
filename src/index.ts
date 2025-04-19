import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/authRoutes";
import addMemberRoute from "./routes/addMemberRoute";
import groupRoutes from "./routes/groupRoutes";
import routeRoutes from "./routes/routeRoutes";
import vehicleRoutes from "./routes/vehicleRoutes";
import partyRoutes from "./routes/partyRoutes";
import bankRoutes from "./routes/bankRoutes";
import receiptRoutes from "./routes/receiptRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import bankEntryRoutes from "./routes/bankEntryRoutes";
import taxRoutes from "./routes/taxRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import itemRoutes from "./routes/itemRoutes";
import vehicleStockRoutes from "./routes/vehicleStockRoutes";
import damageStockRoutes from "./routes/damageStockRoutes";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(globalErrorHandler);
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (_req, res) => {
  res.send("Server is up and running...");
});

app.use("/api/auth", authRoutes);
app.use(
  "/api",
  addMemberRoute,
  groupRoutes,
  routeRoutes,
  vehicleRoutes,
  partyRoutes,
  bankRoutes,
  receiptRoutes,
  paymentRoutes,
  bankEntryRoutes,
  taxRoutes,
  categoryRoutes,
  itemRoutes,
  vehicleStockRoutes,
  damageStockRoutes
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
