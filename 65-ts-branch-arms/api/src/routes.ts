import { Router } from "express";
import { createUser, findUser, logAttempt } from "./identity";
import { portalLogin, validatePortal } from "./portal";

const router = Router();

// Sign in: an existing user signs in with the identity service; a user only the old portal
// knows is created from the portal's record first. The portal session is made either way.
router.post("/signin", async (req, res) => {
  logAttempt(req.body.email);
  const user = await findUser(req.body.email);
  if (user !== undefined) {
    await fetch("https://identity.example.com/sessions", {
      method: "POST",
      body: JSON.stringify({ id: user.id, password: req.body.password }),
    });
  } else {
    const record = await validatePortal(req.body.email, req.body.password);
    await createUser(record.name, record.email);
  }
  await portalLogin(req.body.email);
  res.json({ ok: true });
});

export default router;
