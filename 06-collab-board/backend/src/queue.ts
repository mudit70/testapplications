import { Queue } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

export const coverQueue = new Queue('cover-processing', { connection });
export const notifyQueue = new Queue('notifications', { connection });

export async function enqueueCoverResize(boardId: string, key: string) {
  await coverQueue.add('resize-cover', { boardId, key });
}

export async function enqueueBoardNotification(boardId: string) {
  await notifyQueue.add('board-updated', { boardId });
}
