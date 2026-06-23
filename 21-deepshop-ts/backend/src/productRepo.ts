import { prisma } from './db.js';

// F8 be-modulefn target: imported repo-module functions that do prisma directly.
export async function listProductsRepo() {
  return prisma.product.findMany();
}

export async function createProductRepo(name: string, price: number, stock: number) {
  return prisma.product.create({ data: { name, price, stock } });
}

// Extra realistic repo helpers (used by extra endpoints).
export async function getProductRepo(id: number) {
  return prisma.product.findUnique({ where: { id } });
}

export async function updateStockRepo(id: number, stock: number) {
  return prisma.product.update({ where: { id }, data: { stock } });
}

export async function deleteProductRepo(id: number) {
  return prisma.product.delete({ where: { id } });
}
