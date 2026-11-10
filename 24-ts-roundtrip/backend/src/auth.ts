import type { NextFunction, Request, Response } from 'express';

// Answers 401 before any handler runs: the outcome starts in the middleware, not the route.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.headers.authorization) return res.status(401).json({ error: 'sign in first' });
  next();
}
