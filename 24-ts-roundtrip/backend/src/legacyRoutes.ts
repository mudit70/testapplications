import { Router } from 'express';
import { prisma } from './db.js';

// Never mounted: nothing imports this router, so none of its routes are served.
export const legacyRouter = Router();

legacyRouter.get('/api/legacy/orders', async (_req, res) => {
  res.json(await prisma.order.findMany());
});
