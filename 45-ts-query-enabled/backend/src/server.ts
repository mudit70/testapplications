import express from 'express';

const app = express();
app.use(express.json());

app.post('/api/login', (_req, res) => res.json({ access_token: 't' }));
app.get('/api/users/me', (_req, res) => res.json({ id: 1 }));
app.post('/api/items', (_req, res) => res.status(201).json({ id: 1 }));

app.listen(8000);
