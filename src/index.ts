import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/authRoutes";
import addMemberRoute from "./routes/addMemberRoute";
import groupRoutes from './routes/groupRoutes'

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
app.use("/api", addMemberRoute,groupRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
