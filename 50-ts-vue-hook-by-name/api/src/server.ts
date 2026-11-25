import express from "express";

const app = express();
app.use(express.json());

app.get("/api/inbox", (_req, res) => res.json([]));
app.get("/api/drafts", (_req, res) => res.json([]));
app.get("/api/drafts/count", (_req, res) => res.json({ count: 0 }));
app.get("/api/folders", (_req, res) => res.json([]));
app.get("/api/settings", (_req, res) => res.json({}));
app.get("/api/reports", (_req, res) => res.json([]));

app.listen(8080);
