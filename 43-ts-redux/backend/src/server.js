const express = require('express');

const app = express();
app.use(express.json());

app.get('/api/articles', (_req, res) => res.json({ articles: [] }));
app.post('/api/users', (_req, res) => res.status(201).json({ user: {} }));
app.put('/api/user', (_req, res) => res.json({ user: {} }));
app.post('/api/articles/:slug/favorite', (_req, res) => res.json({ article: {} }));

app.listen(3000);
