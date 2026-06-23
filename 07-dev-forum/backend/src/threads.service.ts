import {
  selectThreads,
  selectThreadById,
  insertThread,
  deleteThreadById,
  selectPostsForThread,
} from './db.js';
import { getThreadCache, setThreadCache, deleteThreadCache, incrThreadViews } from './cache.js';
import { emitThreadCreated, emitThreadDeleted } from './events.js';
import { indexThread, searchThreads, deleteThreadDoc } from './search.js';

export async function listThreads() {
  return selectThreads();
}

export async function getThread(id: string) {
  const cached = await getThreadCache(id);
  if (cached && cached.value) {
    await incrThreadViews();
    return JSON.parse(cached.value.toString());
  }
  const rows = await selectThreadById(Number(id));
  const thread = rows[0];
  if (thread) {
    await setThreadCache(id, JSON.stringify(thread));
  }
  return thread;
}

export async function getThreadPosts(id: string) {
  return selectPostsForThread(Number(id));
}

export async function createThread(title: string, body: string, authorId: number) {
  await insertThread(title, body, authorId);
  const created = { title, body, authorId };
  await indexThread(String(authorId), title, body);
  await emitThreadCreated(authorId);
  return created;
}

export async function removeThread(id: string) {
  await deleteThreadById(Number(id));
  await deleteThreadCache(id);
  await deleteThreadDoc(id);
  await emitThreadDeleted(Number(id));
}

export async function search(query: string) {
  return searchThreads(query);
}
