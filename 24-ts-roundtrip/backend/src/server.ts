import express from 'express';
import { requireAuth } from './auth.js';
import { prisma } from './db.js';
import { errorHandler } from './errors.js';
import { processExports } from './exportWorker.js';
import { ordersRouter } from './orders.js';

const app = express();
app.use(express.json());

app.use('/api/orders', requireAuth, ordersRouter);

// Inline arrow handlers. Invoice generation answers HTTP 200 for both success and failure;
// only the ok field tells them apart.
app.post('/api/invoices/:orderId', async (req, res) => {
  const order = await prisma.order.findUnique({ where: { id: Number(req.params.orderId) } });
  if (!order || order.status === 'cancelled') {
    return res.json({ ok: false, error: 'invoice could not be generated' });
  }
  const invoice = await prisma.invoice.create({
    data: { orderId: order.id, url: `/files/invoice-${order.id}.pdf` },
  });
  res.json({ ok: true, url: invoice.url });
});

// Exports finish later: the request answers 202 and the browser polls the job.
app.post('/api/exports', async (_req, res) => {
  const job = await prisma.exportJob.create({ data: {} });
  res.status(202).json({ jobId: job.id });
});

app.get('/api/exports/:id', async (req, res) => {
  const job = await prisma.exportJob.findUnique({ where: { id: Number(req.params.id) } });
  if (!job) return res.status(404).json({ error: 'no such export' });
  res.json({ status: job.status, url: job.url });
});

app.use(errorHandler);

setInterval(processExports, 2000);
app.listen(3000);
