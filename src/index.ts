import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import mainRoutes from "./routes";

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

app.use("/api", mainRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
