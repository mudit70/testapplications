import type { NextFunction, Request, Response } from 'express';

export class NotFoundError extends Error {}
export class OutOfStockError extends Error {}
export class PaymentDeclinedError extends Error {}

// Exceptions thrown anywhere below a route end here and become a status: each class is one
// outcome of every flow that can throw it.
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof NotFoundError) return res.status(404).json({ error: err.message });
  if (err instanceof OutOfStockError) return res.status(409).json({ error: 'out of stock' });
  if (err instanceof PaymentDeclinedError) return res.status(502).json({ error: 'payment declined' });
  return res.status(500).json({ error: 'internal error' });
}
