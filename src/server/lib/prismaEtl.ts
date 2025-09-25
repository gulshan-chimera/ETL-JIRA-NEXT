// server/lib/prismaEtl.ts
import { PrismaClient as PrismaClientEtl } from "../../../prisma-client-etl"; // path -> generated client

declare global {
  // avoid creating new clients on HMR / dev reloads
  // eslint-disable-next-line no-var
  var prismaEtl: PrismaClientEtl | undefined;
}

export const prismaEtl =
  global.prismaEtl ||
  new PrismaClientEtl({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") global.prismaEtl = prismaEtl;
