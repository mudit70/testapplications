import { Router, type NextFunction, type Request, type Response } from 'express';
import { prisma } from './db.js';
import { cancelOrder, placeOrder, searchOrders } from './orderService.js';

export const ordersRouter = Router();

// Named controller functions on a router mounted under /api/orders.
async function create(req: Request, res: Response, next: NextFunction) {
  const { customer, productId, quantity } = req.body;
  if (!customer || !quantity) return res.status(400).json({ error: 'customer and quantity are required' });
  try {
    const order = await placeOrder(customer, productId, quantity);
    res.status(201).json({ ok: true, order });
  } catch (err) {
    next(err);
  }
}

async function list(req: Request, res: Response) {
  res.json(await searchOrders(String(req.query.customer ?? '')));
}

async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await cancelOrder(Number(req.params.id));
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

async function receipt(req: Request, res: Response) {
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.id) } });
  if (!order) return res.status(404).json({ error: 'no such order' });
  res.type('text/plain').send(`Order ${order.id}: ${order.quantity} x ${order.productId}`);
}

ordersRouter.post('/', create);
ordersRouter.get('/', list);
ordersRouter.delete('/:id', remove);
ordersRouter.get('/:id/receipt', receipt);
