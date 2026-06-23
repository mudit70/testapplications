import express, { type Request, type Response } from 'express';
import { prisma } from './db.js';
import {
  listProductsRepo,
  createProductRepo,
  getProductRepo,
  updateStockRepo,
  deleteProductRepo,
} from './productRepo.js';
import { orderService } from './orderService.js';

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// MATRIX FRONTEND RUNGS (F1–F6): BACKEND HELD = be-inline.
// "be-inline" = the prisma call lives directly inside the route's handler
// function (no service/repo indirection). The handler is registered as a
// NAMED function reference so the analyzer can resolve endpoint.handlerFunctionId
// and walk into the prisma call. The frontend rung varies; the backend body is
// intentionally the same shape so any incompleteness is attributable to the FE
// dispatch pattern, not the BE.
// ---------------------------------------------------------------------------

// F1 fe-inline -> be-inline
async function f1Handler(_req: Request, res: Response) {
  const products = await prisma.product.findMany();
  res.json(products);
}
app.get('/api/f1', f1Handler);

// F2 fe-localfn -> be-inline
async function f2Handler(_req: Request, res: Response) {
  const products = await prisma.product.findMany({ orderBy: { name: 'asc' } });
  res.json(products);
}
app.get('/api/f2', f2Handler);

// F3 fe-modulefn -> be-inline
async function f3Handler(req: Request, res: Response) {
  const { name, price, stock } = req.body;
  const product = await prisma.product.create({ data: { name, price, stock } });
  res.status(201).json(product);
}
app.post('/api/f3', f3Handler);

// F4 fe-classmethod -> be-inline
async function f4Handler(_req: Request, res: Response) {
  const products = await prisma.product.findMany({ where: { stock: { gt: 0 } } });
  res.json(products);
}
app.get('/api/f4', f4Handler);

// F5 fe-hook -> be-inline
async function f5Handler(_req: Request, res: Response) {
  const orders = await prisma.order.findMany();
  res.json(orders);
}
app.get('/api/f5', f5Handler);

// F6 fe-wrapper-dynamic -> be-inline
async function f6Handler(req: Request, res: Response) {
  const id = Number(req.query.id);
  await prisma.product.delete({ where: { id } });
  res.status(204).send();
}
app.delete('/api/f6', f6Handler);

// ---------------------------------------------------------------------------
// MATRIX BACKEND RUNGS (F7–F9): FRONTEND HELD = fe-modulefn (api.ts).
// The frontend caller is identical in shape to F3; only the backend dispatch
// path between the route's handler function and prisma varies.
// ---------------------------------------------------------------------------

// F7 be-localfn: handler calls a SAME-FILE function that does prisma.
async function f7ListProducts() {
  return prisma.product.findMany();
}
async function f7Handler(_req: Request, res: Response) {
  const products = await f7ListProducts();
  res.json(products);
}
app.get('/api/f7', f7Handler);

// F8 be-modulefn: handler calls an imported repo-module function.
async function f8Handler(_req: Request, res: Response) {
  const products = await listProductsRepo();
  res.json(products);
}
app.get('/api/f8', f8Handler);

// F9 be-classmethod: handler calls an instantiated service class method.
async function f9Handler(_req: Request, res: Response) {
  const orders = await orderService.listOrders();
  res.json(orders);
}
app.get('/api/f9', f9Handler);

// ---------------------------------------------------------------------------
// EXTRA REALISTIC ENDPOINTS (make the app feel real; named handlers throughout).
// ---------------------------------------------------------------------------

// Products
async function listProductsHandler(_req: Request, res: Response) {
  const products = await prisma.product.findMany();
  res.json(products);
}
app.get('/api/products', listProductsHandler);

async function getProductHandler(req: Request, res: Response) {
  const product = await getProductRepo(Number(req.params.id));
  res.json(product);
}
app.get('/api/products/:id', getProductHandler);

async function createProductHandler(req: Request, res: Response) {
  const { name, price, stock } = req.body;
  const product = await createProductRepo(name, price, stock);
  res.status(201).json(product);
}
app.post('/api/products', createProductHandler);

async function updateStockHandler(req: Request, res: Response) {
  const product = await updateStockRepo(Number(req.params.id), req.body.stock);
  res.json(product);
}
app.patch('/api/products/:id/stock', updateStockHandler);

async function deleteProductHandler(req: Request, res: Response) {
  await deleteProductRepo(Number(req.params.id));
  res.status(204).send();
}
app.delete('/api/products/:id', deleteProductHandler);

// Orders
async function listOrdersHandler(_req: Request, res: Response) {
  const orders = await orderService.listOrders();
  res.json(orders);
}
app.get('/api/orders', listOrdersHandler);

async function createOrderHandler(req: Request, res: Response) {
  const { customer, total } = req.body;
  const order = await orderService.createOrder(customer, total);
  res.status(201).json(order);
}
app.post('/api/orders', createOrderHandler);

async function cancelOrderHandler(req: Request, res: Response) {
  const order = await orderService.cancelOrder(Number(req.params.id));
  res.json(order);
}
app.post('/api/orders/:id/cancel', cancelOrderHandler);

// Cart
async function getCartHandler(req: Request, res: Response) {
  const cart = await prisma.cart.findUnique({
    where: { sessionId: req.params.sessionId },
  });
  res.json(cart);
}
app.get('/api/cart/:sessionId', getCartHandler);

async function addCartItemHandler(req: Request, res: Response) {
  const { productId, quantity } = req.body;
  const cart = await prisma.cart.findUnique({
    where: { sessionId: req.params.sessionId },
  });
  const item = await prisma.cartItem.create({
    data: { cartId: cart!.id, productId, quantity },
  });
  res.status(201).json(item);
}
app.post('/api/cart/:sessionId/items', addCartItemHandler);

async function deleteCartItemHandler(req: Request, res: Response) {
  await prisma.cartItem.delete({ where: { id: Number(req.params.itemId) } });
  res.status(204).send();
}
app.delete('/api/cart/items/:itemId', deleteCartItemHandler);

// Health
function healthHandler(_req: Request, res: Response) {
  res.json({ ok: true });
}
app.get('/api/health', healthHandler);

app.listen(4000, () => {
  console.log('deepshop backend on :4000');
});
