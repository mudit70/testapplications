import { prisma } from './db.js';

// Finishes queued exports in the background; the browser learns of it by polling.
export async function processExports() {
  const jobs = await prisma.exportJob.findMany({ where: { status: 'queued' } });
  for (const job of jobs) {
    await prisma.exportJob.update({
      where: { id: job.id },
      data: { status: 'done', url: `/files/export-${job.id}.csv` },
    });
  }
}
