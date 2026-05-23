import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // fallback local sqlite file
    url: process.env.DATABASE_URL || "file:./dev.db",
  },
});


