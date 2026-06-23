import { PrismaClient } from '@prisma/client';

// Single shared Prisma client used across all route handlers, repo modules,
// and service classes. The prisma plugin dispatches on the `.model.op()`
// receiver/name, so every consumer that imports this `prisma` produces a
// DatabaseInteraction.
export const prisma = new PrismaClient();
