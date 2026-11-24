import { type Request, type Response, Router } from "express";
import auth from "./auth";

const router = Router();

/** Logs who asked; runs after the token check. */
function audit(req: Request, _res: Response, next: () => void) {
  console.info("feed", req.ip);
  next();
}

router.get("/feed", auth.required, audit, async (_req: Request, res: Response) => {
  res.json({ articles: [] });
});

router.get("/articles", auth.optional, async (_req: Request, res: Response) => {
  res.json({ articles: [] });
});

export default router;
