import express from "express";

const app = express();

app.get("/api/resources/recursive/*", (_req, res) => res.json([]));
app.get("/api/resources/*", (_req, res) => res.json([]));
app.post("/api/resources/*", (_req, res) => res.sendStatus(201));
app.post("/api/tus/*", (_req, res) => res.sendStatus(201));
app.post("/api/renew", (_req, res) => res.json({ token: "t" }));
app.get("/api/public/share/:hash", (_req, res) => res.json({ items: [] }));

app.listen(8080);
