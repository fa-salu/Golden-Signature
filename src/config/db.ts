import { PrismaClient } from "../../generated/prisma/client";

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});

async function testConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log("Database connection established successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  }
}

testConnection().catch((e) => {
  console.error("Failed to connect to the database:", e);
  process.exit(1);
});

export default prisma;
