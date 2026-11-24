import express from 'express';

const app = express();
app.use(express.json());

// Shared by both frontends: the Vue file manager and the React (TanStack Router) dashboard.
app.post('/api/login', (_req, res) => res.json({ token: 't' }));
app.get('/api/renew', (_req, res) => res.json({ token: 't' }));
app.get('/api/resources', (_req, res) => res.json({ items: [] }));
app.get('/api/users/me', (_req, res) => res.json({ id: 1 }));
app.get('/api/items', (_req, res) => res.json({ data: [] }));
app.get('/api/settings', (_req, res) => res.json({}));

app.listen(8080);
