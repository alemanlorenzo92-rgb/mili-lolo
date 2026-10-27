import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

function resolveDatabaseUrl(): string | undefined {
  if (process.env.NODE_ENV === "production") {
    return process.env.DATABASE_URL;
  }
  try {
    const cwd = process.cwd();
    for (const envFile of [".env.local", ".env"]) {
      const fullPath = path.resolve(/*turbopackIgnore: true*/ cwd, envFile);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, "utf-8");
        const match = content.match(/^DATABASE_URL=["']?([^"'\r\n]+)["']?/m);
        if (match && match[1]) {
          return match[1].trim();
        }
      }
    }
  } catch {
    // fallback
  }
  return process.env.DATABASE_URL;
}

const resolvedUrl = resolveDatabaseUrl();
if (resolvedUrl) {
  process.env.DATABASE_URL = resolvedUrl;
}

const databaseUrl = resolvedUrl || process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: databaseUrl
      ? {
          db: {
            url: databaseUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
