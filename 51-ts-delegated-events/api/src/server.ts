import express from "express";

const app = express();
app.use(express.json());

app.post("/api/signin", (_req, res) => res.sendStatus(204));
app.put("/api/drafts", (_req, res) => res.sendStatus(204));
app.post("/api/events", (_req, res) => res.sendStatus(202));
app.delete("/api/drafts", (_req, res) => res.sendStatus(204));
app.post("/api/password/reset", (_req, res) => res.sendStatus(202));
app.get("/api/help", (_req, res) => res.json({}));
app.get("/api/recent", (_req, res) => res.json([]));

app.listen(8080);
