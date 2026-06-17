import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

// 1. Instanciamos el pool de conexión usando la variable de entorno
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

// 2. Creamos el objeto global adaptado para desarrollo en Next.js (Corregido!)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 3. Inicializamos pasándole el adaptador nativo exigido en Prisma 7
export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;