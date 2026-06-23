import { listMembers, findMember, createMember } from './db.js';
import { recordAudit } from './audit.model.js';

interface ResolverArgs {
  parent: unknown;
  args: Record<string, unknown>;
  context: unknown;
}

export const resolvers = {
  Query: {
    members: (_p: ResolverArgs) => listMembers(),
    member: (_p: ResolverArgs) => findMember(Number(_p.args.id)),
  },
  Mutation: {
    createMember(_p: ResolverArgs) {
      void recordAudit('create_member', String(_p.args.userId ?? ''), 0);
      return createMember(String(_p.args.email));
    },
  },
  Subscription: {
    memberAdded: (_p: ResolverArgs) => null,
  },
};
