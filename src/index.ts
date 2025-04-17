import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import authRoutes from "./routes/authRoutes";
import addMemberRoute from "./routes/addMemberRoute";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(globalErrorHandler);

app.use(
  cors({
    origin: "*",
  })
);

connectDB();

app.get("/", (_req, res) => {
  res.send("Server is up and running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/members", addMemberRoute);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
