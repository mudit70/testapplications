import express from "express";

const app = express();

app.post("/api/resources/*", (_req, res) => res.sendStatus(200));
app.post("/api/tus/*", (_req, res) => res.sendStatus(201));
app.patch("/api/tus/*", (_req, res) => res.sendStatus(204));
app.post("/api/share/*", (_req, res) => res.json({ hash: "abc" }));

app.listen(8080);
