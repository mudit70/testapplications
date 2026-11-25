import express from "express";

const app = express();
app.use(express.json());

app.get("/api/renew", (_req, res) => res.json({ token: "t" }));
app.get("/api/settings", (_req, res) => res.json({}));
app.get("/api/users/:id", (_req, res) => res.json({}));
app.get("/api/resources", (_req, res) => res.json([]));

app.listen(8080);
