import { Worker } from 'bullmq';

const connection = { host: 'localhost', port: 6379 };

new Worker(
  'cover-processing',
  async (job) => {
    console.log('resizing cover for', job.data.boardId);
  },
  { connection },
);

new Worker(
  'notifications',
  async (job) => {
    console.log('notifying board', job.data.boardId);
  },
  { connection },
);
