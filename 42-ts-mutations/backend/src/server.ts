import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/items', (_req, res) => res.json([]));
app.post('/api/items', (_req, res) => res.status(201).json({ id: 1 }));
app.get('/api/users', (_req, res) => res.json([]));
app.post('/api/audit', (_req, res) => res.status(204).end());
app.post('/api/errors', (_req, res) => res.status(204).end());
app.post('/api/settings', (_req, res) => res.status(204).end());
app.get('/api/notifications', (_req, res) => res.json([]));
app.post('/api/notifications', (_req, res) => res.status(201).json({ id: 1 }));

app.listen(8080);
