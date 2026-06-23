import { create } from 'zustand';

export interface Thread {
  id: string;
  title: string;
  body: string;
}

interface ThreadStore {
  threads: Thread[];
  current: Thread | null;
  fetchThreads: () => Promise<void>;
  fetchThread: (id: string) => Promise<void>;
  createThread: (title: string, body: string) => Promise<void>;
  deleteThread: (id: string) => Promise<void>;
  searchThreads: (q: string) => Promise<void>;
}

export const useThreadStore = create<ThreadStore>((set, get) => ({
  threads: [],
  current: null,
  fetchThreads: async () => {
    const res = await fetch('/api/threads');
    const threads = await res.json();
    set({ threads });
  },
  fetchThread: async (id) => {
    const res = await fetch(`/api/threads/${id}`);
    const current = await res.json();
    set({ current });
  },
  createThread: async (title, body) => {
    await fetch('/api/threads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, body, authorId: 1 }),
    });
    await get().fetchThreads();
  },
  deleteThread: async (id) => {
    await fetch(`/api/threads/${id}`, { method: 'DELETE' });
    set({ threads: get().threads.filter((t) => t.id !== id) });
  },
  searchThreads: async (q) => {
    const res = await fetch(`/api/threads/search?q=${q}`);
    const threads = await res.json();
    set({ threads });
  },
}));
