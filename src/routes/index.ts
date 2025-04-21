import { Router } from "express";

import authRoutes from "./authRoutes";
import addMemberRoute from "./addMemberRoute";
import groupRoutes from "./groupRoutes";
import routeRoutes from "./routeRoutes";
import vehicleRoutes from "./vehicleRoutes";
import partyRoutes from "./partyRoutes";
import bankRoutes from "./bankRoutes";
import receiptRoutes from "./receiptRoutes";
import paymentRoutes from "./paymentRoutes";
import bankEntryRoutes from "./bankEntryRoutes";
import taxRoutes from "./taxRoutes";
import categoryRoutes from "./categoryRoutes";
import itemRoutes from "./itemRoutes";
import vehicleStockRoutes from "./vehicleStockRoutes";
import damageStockRoutes from "./damageStockRoutes";
import journalRoutes from "./journalRoutes";
import saleRoutes from "./saleRoutes";
import purchaseRoutes from "./purchaseRoutes";
import saleReturnRoutes from "./saleReturnRoutes";
import companyRoutes from "./companyRoutes";

const router = Router();

router.use("/auth", authRoutes);

const routes = [
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
  damageStockRoutes,
  journalRoutes,
  saleRoutes,
  purchaseRoutes,
  saleReturnRoutes,
  companyRoutes,
];

routes.forEach((r) => router.use("/", r));

export default router;
