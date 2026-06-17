import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // 🔥 ¡Aquí es donde Prisma 7 quiere el comando obligatoriamente!
    seed: "tsx prisma/seed.ts", 
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});