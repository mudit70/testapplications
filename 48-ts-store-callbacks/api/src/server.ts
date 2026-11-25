import express from "express";

const app = express();
app.use(express.json());

app.delete("/api/share/:hash", (_req, res) => res.sendStatus(204));
app.delete("/api/users/:id", (_req, res) => res.sendStatus(204));
app.put("/api/users/:id", (_req, res) => res.sendStatus(204));

app.listen(8080);
