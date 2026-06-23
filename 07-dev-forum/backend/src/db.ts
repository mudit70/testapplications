import { drizzle } from 'drizzle-orm/node-postgres';
import { eq } from 'drizzle-orm';
import pg from 'pg';
import { threadsTable, postsTable } from './schema.js';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool);

export async function selectThreads() {
  return db.select().from(threadsTable);
}

export async function selectThreadById(id: number) {
  return db.select().from(threadsTable).where(eq(threadsTable.id, id));
}

export async function insertThread(title: string, body: string, authorId: number) {
  return db.insert(threadsTable).values({ title, body, authorId });
}

export async function deleteThreadById(id: number) {
  return db.delete(threadsTable).where(eq(threadsTable.id, id));
}

export async function selectPostsForThread(threadId: number) {
  return db.select().from(postsTable).where(eq(postsTable.threadId, threadId));
}
