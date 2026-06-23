import { Hono } from 'hono';
import type { EntityManager } from '@mikro-orm/core';
import { SearchRepo } from './repo.js';
import { saveSnapshot } from './storage.js';
import { reindex } from './supabase.js';

declare const em: EntityManager;
const repo = new SearchRepo(em);

const app = new Hono();

app.get('/api/search', async (c) => {
  const q = c.req.query('q') ?? '';
  const results = await repo.query(q);
  return c.json(results);
});

app.get('/api/search/all', async (c) => {
  return c.json(await repo.findAll());
});

app.post('/api/search/reindex', async (c) => {
  await saveSnapshot('latest.json', '{}');
  await reindex({ full: true });
  return c.json({ ok: true });
});

export default app;
