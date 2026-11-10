import { prisma } from './db.js';
import { NotFoundError, OutOfStockError } from './errors.js';
import { charge } from './payments.js';

export async function placeOrder(customer: string, productId: number, quantity: number) {
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) throw new NotFoundError('no such product');
  if (product.stock < quantity) throw new OutOfStockError();
  await charge(customer, product.price * quantity);
  return prisma.order.create({ data: { customer, productId, quantity } });
}

export async function cancelOrder(id: number) {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new NotFoundError('no such order');
  await prisma.order.update({ where: { id }, data: { status: 'cancelled' } });
}

export function searchOrders(customer: string) {
  return prisma.order.findMany({ where: { customer } });
}
