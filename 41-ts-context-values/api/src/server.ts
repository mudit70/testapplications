import express from "express";

// Served at https://api.shelf.example (the address the web app calls).
const app = express();
app.use(express.json());

app.get("/api/items", (_req, res) => res.json([]));
app.post("/api/items", (_req, res) => res.sendStatus(201));
app.delete("/api/items/:id", (_req, res) => res.sendStatus(204));
app.get("/api/me", (_req, res) => res.json({}));

app.listen(8080);
