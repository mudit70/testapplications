import { z } from 'zod';
import { db } from '../db';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '../trpc';

async function closePoll({ input }: { input: { id: number } }) {
  return db.poll.update({ where: { id: input.id }, data: { closed: true } });
}

// A plain object of procedures, nested into the app router below.
export const optionsRouter = {
  add: protectedProcedure
    .input(z.object({ pollId: z.number(), label: z.string() }))
    .mutation(({ input }) => db.option.create({ data: input })),
  vote: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(({ input }) => db.option.update({ where: { id: input.id }, data: { votes: { increment: 1 } } })),
};

export const pollsRouter = createTRPCRouter({
  list: publicProcedure.query(() => db.poll.findMany()),
  byId: publicProcedure.input(z.object({ id: z.number() })).query(({ input }) =>
    db.poll.findUnique({ where: { id: input.id }, include: { options: true } }),
  ),
  create: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(({ input }) => db.poll.create({ data: input })),
  close: protectedProcedure.input(z.object({ id: z.number() })).mutation(closePoll),
  options: optionsRouter,
});
