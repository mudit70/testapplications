import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const threadsTable = pgTable('threads', {
  id: serial('id').primaryKey(),
  title: text('title'),
  body: text('body'),
  authorId: integer('author_id'),
  createdAt: timestamp('created_at'),
});

export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  threadId: integer('thread_id'),
  body: text('body'),
  authorId: integer('author_id'),
  createdAt: timestamp('created_at'),
});
