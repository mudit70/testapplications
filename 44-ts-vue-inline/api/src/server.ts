import express from "express";

const app = express();
app.use(express.json());

app.get("/api/notes", (_req, res) => res.json([]));
app.post("/api/notes/:id/pin", (_req, res) => res.sendStatus(204));
app.delete("/api/notes/:id", (_req, res) => res.sendStatus(204));
app.post("/api/notes/:id/share", (_req, res) => res.json({}));

app.listen(8080);
