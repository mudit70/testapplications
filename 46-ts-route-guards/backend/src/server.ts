import express from 'express';

const app = express();
app.use(express.json());

app.get('/api/session', (_req, res) => res.json({ ok: true }));
app.get('/api/items', (_req, res) => res.json([]));
app.get('/api/users/me', (_req, res) => res.json({ id: 1 }));
app.post('/api/signup', (_req, res) => res.status(201).json({ id: 1 }));
app.post('/api/copy', (_req, res) => res.status(204).end());
app.get('/api/renew', (_req, res) => res.json({ token: 't' }));

app.listen(8000);
