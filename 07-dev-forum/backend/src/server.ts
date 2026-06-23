import Fastify, { type FastifyRequest, type FastifyReply } from 'fastify';
import {
  listThreads,
  getThread,
  getThreadPosts,
  createThread,
  removeThread,
  search,
} from './threads.service.js';

const fastify = Fastify();

fastify.get('/api/threads', async (_req: FastifyRequest, reply: FastifyReply) => {
  const threads = await listThreads();
  reply.send(threads);
});

fastify.get('/api/threads/search', async (req: FastifyRequest, reply: FastifyReply) => {
  const { q } = req.query as { q: string };
  const results = await search(q);
  reply.send(results);
});

fastify.get('/api/threads/:id', async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const thread = await getThread(id);
  if (!thread) {
    return reply.status(404).send({ error: 'Thread not found' });
  }
  reply.send(thread);
});

fastify.get('/api/threads/:id/posts', async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  const posts = await getThreadPosts(id);
  reply.send(posts);
});

fastify.post('/api/threads', async (req: FastifyRequest, reply: FastifyReply) => {
  const { title, body, authorId } = req.body as { title: string; body: string; authorId: number };
  const thread = await createThread(title, body, authorId);
  reply.status(201).send(thread);
});

fastify.delete('/api/threads/:id', async (req: FastifyRequest, reply: FastifyReply) => {
  const { id } = req.params as { id: string };
  await removeThread(id);
  reply.status(204).send();
});

fastify.listen({ port: 3000 });
