// -- Avoid multiple Prisma Client instances

// When developing a Next.js application, one common issue is accidentally creating multiple instances of the Prisma Client. This often occurs due to Next.js’s hot-reloading feature in development.
// Why this happens
// Next.js’s hot-reloading feature reloads modules frequently to reflect code changes instantly. However, this can lead to multiple instances of Prisma Client being created, which consumes resources and might cause unexpected behavior.

// To avoid this, create a single Prisma Client instance by using a global variable:
import { PrismaClient } from "@prisma/client";
const prismaClientSingleton = ()=>{
    return new PrismaClient();
}
const globalForPrisma = globalThis as unknown as { Prisma : PrismaClient | undefined };
const client = globalForPrisma.Prisma ?? prismaClientSingleton()
if (process.env.NODE_ENV !== "production") globalForPrisma.Prisma = client;
export default client;

// Using this approach ensures that only one instance of Prisma Client exists, even during hot-reloading in development.

