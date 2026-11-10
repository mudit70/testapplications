'use server';
import { createSafeActionClient } from 'next-safe-action';
import { z } from 'zod';
import { db } from '~/server/db';

const action = createSafeActionClient();

// A plain server action, called directly.
export async function deletePoll(id: number) {
  await db.option.deleteMany({ where: { pollId: id } });
  await db.poll.delete({ where: { id } });
}

// A next-safe-action action, run through useAction.
export const logAction = action
  .inputSchema(z.object({ what: z.string() }))
  .action(async ({ parsedInput }) => db.auditLog.create({ data: { action: parsedInput.what } }));
