import { prisma } from './db.js';

// F9 be-classmethod target: a service CLASS whose methods do prisma. The route
// callback calls a method on an instantiated service.
export class OrderService {
  async listOrders() {
    return prisma.order.findMany();
  }

  async createOrder(customer: string, total: number) {
    return prisma.order.create({ data: { customer, total } });
  }

  async cancelOrder(id: number) {
    return prisma.order.update({ where: { id }, data: { status: 'cancelled' } });
  }
}

export const orderService = new OrderService();
