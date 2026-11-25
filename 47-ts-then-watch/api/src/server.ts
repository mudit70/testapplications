import express from "express";

const app = express();
app.use(express.json());

app.get("/api/resources", (_req, res) => res.json([]));
app.patch("/api/resources", (_req, res) => res.sendStatus(204));
app.get("/api/share", (_req, res) => res.json({}));

app.listen(8080);
