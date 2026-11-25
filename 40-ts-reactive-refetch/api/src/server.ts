import express from "express";

const app = express();
app.use(express.json());

app.get("/api/resources", (_req, res) => res.json([]));
app.post("/api/copy", (_req, res) => res.sendStatus(201));
app.post("/api/cancel", (_req, res) => res.sendStatus(204));
app.get("/api/deployments", (_req, res) => res.json([]));
app.post("/api/deployments/:id/redeploy", (_req, res) => res.sendStatus(202));

app.listen(8080);
