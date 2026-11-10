'use client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useAction } from 'next-safe-action/hooks';
import { deletePoll, logAction } from '~/app/polls/actions';
import { api, useTRPC } from '~/lib/trpc';

export function PollCard({ id }: { id: number }) {
  const trpc = useTRPC();
  const poll = useQuery(trpc.polls.byId.queryOptions({ id }));
  const vote = useMutation(trpc.polls.options.vote.mutationOptions());
  const { mutate: close } = api.polls.close.useMutation();
  const { execute: log } = useAction(logAction);

  return (
    <div>
      <h2>{poll.data?.title}</h2>
      {poll.data?.options.map((o) => (
        <button key={o.id} onClick={() => vote.mutate({ id: o.id })}>
          {o.label}
        </button>
      ))}
      <button onClick={() => close({ id })}>Close poll</button>
      <button onClick={() => deletePoll(id)}>Delete poll</button>
      <button onClick={() => log({ what: 'shared' })}>Share</button>
    </div>
  );
}
